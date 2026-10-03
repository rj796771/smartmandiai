export type Language = 'en' | 'mr' | 'hi';

export interface CropItem {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  category: 'Vegetable' | 'Grain' | 'Cash Crop' | 'Fruit' | 'Spice';
  icon: string;
  defaultPricePerQuintal: number; // in INR
  unit: string;
}

export interface MandiMarket {
  id: string;
  name: string;
  district: string;
  state: string;
  distanceKm: number; // calculated relative to selected farmer location
  pricePerQuintal: number;
  minPrice: number;
  maxPrice: number;
  dailyArrivalTonnes: number;
  transportRatePerKmPerTon: number; // INR per km per tonne
  buyerCount: number;
  commissionPercent: number;
  rating: number; // 0 - 5
  lastUpdated: string;
  operatingDays: string;
  contactNumber?: string;
  facilities: string[];
}

export interface VerifiedBuyer {
  id: string;
  name: string;
  businessName: string;
  district: string;
  state: string;
  rating: number;
  trustScore: number; // 0-100
  phone: string;
  whatsapp: string;
  verified: boolean;
  productsPurchased: string[];
  paymentTerms: string;
  completedDealsCount: number;
  distanceKm?: number;
}

export interface RecommendationInput {
  cropId: string;
  cropName: string;
  quantityQuintals: number;
  farmerDistrict: string;
  harvestDate: string;
  vehicleType: 'Tractor' | 'Small Truck (Pickup)' | 'Medium Truck (10-Ton)' | 'Heavy Freight Truck';
}

export interface RecommendationResult {
  recommendedMandi: MandiMarket;
  alternateMandis: MandiMarket[];
  sellingScore: number; // 0-100
  sellAdvice: 'SELL_TODAY' | 'WAIT_2_DAYS' | 'WAIT_5_DAYS';
  sellAdviceReason: string;
  sellAdviceConfidence: number; // 0-100
  breakdown: {
    grossRevenue: number;
    transportCost: number;
    mandiCommission: number;
    netProfit: number;
    profitMarginPercent: number;
  };
  recommendedBuyers: VerifiedBuyer[];
  pricePredictionTrend: { date: string; price: number; projected?: boolean }[];
  weatherRiskAlert: {
    status: 'OPTIMAL' | 'MODERATE_RISK' | 'HIGH_RISK' | 'WARNING' | 'ALERT';
    summary: string;
    temperatureC: number;
    rainProbability: number;
    humidityPercent: number;
    isLive?: boolean;
    sourceLabel?: string;
  };
  dataSources?: {
    priceSource: string;
    distanceSource: string;
    isLive: boolean;
  };
  aiReasoningText: string;
  calculatedAt: string;
}

export interface SavedRecommendation {
  id: string;
  createdAt: string;
  input: RecommendationInput;
  result: RecommendationResult;
  note?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
  givenName?: string;
  familyName?: string;
  provider: 'google';
  loginAt: string;
}

export interface AuthSession {
  user: UserProfile | null;
  token?: string;
  isAuthenticated: boolean;
}

export interface PriceHistoryItem {
  date: string;
  price: number;
  projected?: boolean;
}
