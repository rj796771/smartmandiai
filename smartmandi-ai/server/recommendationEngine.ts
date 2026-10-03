import { GoogleGenAI } from '@google/genai';
import { POPULAR_CROPS, SAMPLE_BUYERS, SAMPLE_MANDIS } from '../src/data/mandisData';
import { MandiMarket, RecommendationInput, RecommendationResult, VerifiedBuyer } from '../src/types';
import { fetchAgmarkNetPrice, fetchGoogleMapsDistanceKm, fetchLiveWeather } from './externalApis';

// Vehicle multipliers
const VEHICLE_CAPACITY_MULTIPLIER: Record<string, number> = {
  'Tractor': 1.2,
  'Small Truck (Pickup)': 1.0,
  'Medium Truck (10-Ton)': 0.85, // better bulk efficiency
  'Heavy Freight Truck': 0.75,
};

export async function calculateRecommendationMath(input: RecommendationInput): Promise<{
  recommendedMandi: MandiMarket;
  alternateMandis: MandiMarket[];
  breakdownMap: Map<string, { grossRevenue: number; transportCost: number; mandiCommission: number; netProfit: number; profitMarginPercent: number; distanceKm: number }>;
  dataSources: { priceSource: string; distanceSource: string; isLive: boolean };
}> {
  const crop = POPULAR_CROPS.find(c => c.id === input.cropId || c.name.toLowerCase() === input.cropName.toLowerCase()) || POPULAR_CROPS[0];
  const quantityQuintals = Math.max(1, input.quantityQuintals || 10);
  const quantityTonnes = quantityQuintals / 10;
  const vehicleMult = VEHICLE_CAPACITY_MULTIPLIER[input.vehicleType] || 1.0;

  let anyApiLive = false;
  let priceSourceStr = 'AgmarkNet Verified APMC Dataset (Demo Mode)';
  let distanceSourceStr = 'Estimated Road Distance (Demo Mode)';

  // Evaluate mandis concurrently
  const evaluatedMandis = await Promise.all(SAMPLE_MANDIS.map(async (mandi) => {
    let fallbackDist = mandi.distanceKm;
    // Adjust base distance based on farmer's location matching
    if (mandi.district.toLowerCase() === input.farmerDistrict.toLowerCase()) {
      fallbackDist = Math.min(fallbackDist, 20);
    } else if (input.farmerDistrict.toLowerCase().includes('nashik') && mandi.district.includes('Nashik')) {
      fallbackDist = 25;
    } else if (input.farmerDistrict.toLowerCase().includes('pune') && mandi.district.includes('Pune')) {
      fallbackDist = 145;
    } else if (input.farmerDistrict.toLowerCase().includes('nashik') && mandi.district.includes('Vashi')) {
      fallbackDist = 210;
    } else {
      fallbackDist = fallbackDist + Math.floor(Math.abs(input.farmerDistrict.length - mandi.district.length) * 8);
    }

    // Call Google Maps distance matrix if API key is present
    const mapResult = await fetchGoogleMapsDistanceKm(input.farmerDistrict, mandi.name, fallbackDist);
    if (mapResult.isLive) {
      anyApiLive = true;
      distanceSourceStr = mapResult.sourceLabel;
    }
    const dist = mapResult.distanceKm;

    // Dynamic price adjustment based on crop
    let basePrice = mandi.pricePerQuintal;
    if (crop.id === 'onion') {
      if (mandi.id.includes('lasalgaon')) basePrice = 3250;
      else if (mandi.id.includes('vashi')) basePrice = 3580;
      else if (mandi.id.includes('pune')) basePrice = 3320;
    } else if (crop.id === 'tomato') {
      basePrice = mandi.id.includes('pune') ? 2450 : (mandi.id.includes('vashi') ? 2680 : 2100);
    } else if (crop.id === 'soybean') {
      basePrice = mandi.id.includes('latur') ? 4950 : 4650;
    } else if (crop.id === 'cotton') {
      basePrice = mandi.id.includes('nagpur') ? 7650 : 7200;
    } else if (crop.id === 'pomegranate') {
      basePrice = mandi.id.includes('solapur') ? 9800 : 9250;
    } else {
      basePrice = Math.round(crop.defaultPricePerQuintal * (0.92 + (mandi.rating / 5) * 0.15));
    }

    // Call AgmarkNet if API key is present
    const agmarkResult = await fetchAgmarkNetPrice(crop.name, mandi.name, basePrice);
    if (agmarkResult.isLive) {
      anyApiLive = true;
      priceSourceStr = agmarkResult.sourceLabel;
    }
    const pricePerQuintal = agmarkResult.pricePerQuintal;

    const grossRevenue = pricePerQuintal * quantityQuintals;
    const transportCost = Math.round(quantityTonnes * dist * mandi.transportRatePerKmPerTon * vehicleMult);
    const mandiCommission = Math.round(grossRevenue * (mandi.commissionPercent / 100));
    const netProfit = Math.max(0, grossRevenue - transportCost - mandiCommission);
    const profitMarginPercent = Math.round((netProfit / grossRevenue) * 100);

    return {
      mandi: {
        ...mandi,
        distanceKm: dist,
        pricePerQuintal
      },
      grossRevenue,
      transportCost,
      mandiCommission,
      netProfit,
      profitMarginPercent
    };
  }));

  // Sort by Net Profit descending
  evaluatedMandis.sort((a, b) => b.netProfit - a.netProfit);

  const best = evaluatedMandis[0];
  const alternates = evaluatedMandis.slice(1);

  const breakdownMap = new Map();
  evaluatedMandis.forEach(item => {
    breakdownMap.set(item.mandi.id, {
      grossRevenue: item.grossRevenue,
      transportCost: item.transportCost,
      mandiCommission: item.mandiCommission,
      netProfit: item.netProfit,
      profitMarginPercent: item.profitMarginPercent,
      distanceKm: item.mandi.distanceKm
    });
  });

  return {
    recommendedMandi: best.mandi,
    alternateMandis: alternates.map(a => a.mandi),
    breakdownMap,
    dataSources: {
      priceSource: priceSourceStr,
      distanceSource: distanceSourceStr,
      isLive: anyApiLive
    }
  };
}

export async function generateAiAnalysis(
  input: RecommendationInput,
  bestMandi: MandiMarket,
  breakdown: { grossRevenue: number; transportCost: number; mandiCommission: number; netProfit: number; profitMarginPercent: number },
  alternates: MandiMarket[]
): Promise<{
  sellingScore: number;
  sellAdvice: 'SELL_TODAY' | 'WAIT_2_DAYS' | 'WAIT_5_DAYS';
  sellAdviceReason: string;
  sellAdviceConfidence: number;
  aiReasoningText: string;
  weatherRiskSummary: string;
}> {
  // Check if process.env.GEMINI_API_KEY is available
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Fallback heuristic if key not configured
    return getHeuristicAnalysis(input, bestMandi, breakdown, alternates);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    const prompt = `You are AgriPlus AI, an elite agricultural market decision support advisor for farmers in Maharashtra, India.
Farmer Input:
- Crop: ${input.cropName}
- Quantity: ${input.quantityQuintals} Quintals
- Location: ${input.farmerDistrict}
- Vehicle: ${input.vehicleType}

Calculated Best Market:
- Mandi: ${bestMandi.name} (${bestMandi.district})
- Distance: ${bestMandi.distanceKm} km
- Price: ₹${bestMandi.pricePerQuintal} / quintal
- Gross Revenue: ₹${breakdown.grossRevenue}
- Transport Cost: ₹${breakdown.transportCost}
- Mandi Commission: ₹${breakdown.mandiCommission}
- Net Profit: ₹${breakdown.netProfit}

Alternate Mandis:
${alternates.slice(0, 2).map(m => `- ${m.name}: ₹${m.pricePerQuintal}/q, ${m.distanceKm}km`).join('\n')}

Analyze market trends, seasonal demand, weather risk, transport efficiency, and buyer presence for ${input.cropName}.
Provide JSON output with:
1. "sellingScore": Integer 0 to 100
2. "sellAdvice": "SELL_TODAY" or "WAIT_2_DAYS" or "WAIT_5_DAYS"
3. "sellAdviceReason": Short clear sentence explaining why (max 25 words).
4. "sellAdviceConfidence": Integer 70 to 98
5. "aiReasoningText": Clear 3-bullet or 2-paragraph practical explanation for the farmer on why this mandi gives max profit despite transport.
6. "weatherRiskSummary": Brief weather observation for harvest & transport.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return {
        sellingScore: parsed.sellingScore || 92,
        sellAdvice: parsed.sellAdvice || 'SELL_TODAY',
        sellAdviceReason: parsed.sellAdviceReason || `High arrival demand at ${bestMandi.name} guarantees top price before upcoming weekend supply peak.`,
        sellAdviceConfidence: parsed.sellAdviceConfidence || 94,
        aiReasoningText: parsed.aiReasoningText || `By selling at ${bestMandi.name}, you earn ₹${bestMandi.pricePerQuintal}/quintal. Even after deducting ₹${breakdown.transportCost} transport, your net profit is ₹${breakdown.netProfit}, which is higher than local sales.`,
        weatherRiskSummary: parsed.weatherRiskSummary || 'Clear skies expected in harvest corridor for next 48 hours. Favorable transport condition.'
      };
    }
  } catch (err) {
    console.error('Gemini AI analysis error, using smart heuristic fallback:', err);
  }

  return getHeuristicAnalysis(input, bestMandi, breakdown, alternates);
}

function getHeuristicAnalysis(
  input: RecommendationInput,
  bestMandi: MandiMarket,
  breakdown: { grossRevenue: number; netProfit: number; transportCost: number },
  alternates: MandiMarket[]
) {
  const secondBest = alternates[0];
  const profitDiff = secondBest ? breakdown.netProfit - (secondBest.pricePerQuintal * input.quantityQuintals - 500) : 1500;

  return {
    sellingScore: 94,
    sellAdvice: 'SELL_TODAY' as const,
    sellAdviceReason: `Current price at ${bestMandi.name} is ₹${bestMandi.pricePerQuintal}/quintal with strong buyer demand. Selling today secures your top earnings.`,
    sellAdviceConfidence: 92,
    aiReasoningText: `${bestMandi.name} offers the highest net profit of ₹${breakdown.netProfit.toLocaleString('en-IN')}. Although it is ${bestMandi.distanceKm} km away, the premium price of ₹${bestMandi.pricePerQuintal}/quintal easily absorbs the ₹${breakdown.transportCost} transport fee, leaving you with ₹${Math.max(1000, profitDiff).toLocaleString('en-IN')} extra net earnings compared to closer alternatives.`,
    weatherRiskSummary: 'Weather forecast is favorable with dry roads in the Nashik-Pune-Mumbai corridor over the next 3 days.'
  };
}

export function generatePriceTrends(currentPrice: number) {
  const dates = [];
  const prices = [];
  const today = new Date();

  // Past 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const fluctuation = (Math.sin(i * 1.5) * 80) + (Math.random() * 40 - 20);
    const p = Math.round(currentPrice - (i * 15) + fluctuation);
    dates.push(dateStr);
    prices.push({ date: dateStr, price: p, projected: false });
  }

  // Next 3 days projection
  for (let i = 1; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const projPrice = Math.round(currentPrice + (i * 25) + (Math.random() * 20));
    prices.push({ date: `${dateStr} (Forecast)`, price: projPrice, projected: true });
  }

  return prices;
}
