import dotenv from 'dotenv';
dotenv.config();

export interface ApiDataSourceInfo {
  isLive: boolean;
  sourceLabel: string;
  lastUpdated: string;
}

export interface LiveWeatherData {
  isLive: boolean;
  sourceLabel: string;
  location: string;
  temperatureC: number;
  condition: string;
  humidityPercent: number;
  rainfallProbability: number;
  agriculturalAlert: {
    status: 'OPTIMAL' | 'MODERATE_RISK' | 'HIGH_RISK';
    alertTitle: string;
    alertMessage: string;
  };
}

/**
 * Fetch real weather from OpenWeather API if OPENWEATHER_API_KEY is available.
 */
export async function fetchLiveWeather(location: string): Promise<LiveWeatherData> {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (apiKey && apiKey !== 'MY_OPENWEATHER_API_KEY' && apiKey.trim() !== '') {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)},Maharashtra,IN&appid=${apiKey}&units=metric`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const data = await res.json();
        const temp = Math.round(data.main?.temp ?? 28);
        const humidity = Math.round(data.main?.humidity ?? 60);
        const condition = data.weather?.[0]?.main ?? 'Clear';
        const rainProb = data.rain ? 85 : (humidity > 75 ? 45 : 10);

        return {
          isLive: true,
          sourceLabel: 'OpenWeather Live API',
          location: data.name || location,
          temperatureC: temp,
          condition,
          humidityPercent: humidity,
          rainfallProbability: rainProb,
          agriculturalAlert: {
            status: rainProb > 50 ? 'MODERATE_RISK' : 'OPTIMAL',
            alertTitle: rainProb > 50 ? 'Precipitation Risk in Transit Corridor' : 'Optimal Transit Conditions',
            alertMessage: rainProb > 50 
              ? `Moderate rainfall (${rainProb}%) detected in ${location}. Cover produce with waterproof tarpaulin.`
              : `Optimal road and weather conditions across ${location} routes for produce transport.`
          }
        };
      }
    } catch (e) {
      console.warn('OpenWeather API fetch failed, using labelled demo fallback:', e);
    }
  }

  // Clearly Labelled Demo Fallback
  return {
    isLive: false,
    sourceLabel: 'Demo Weather Data (API Key Not Configured)',
    location,
    temperatureC: 28,
    condition: 'Partly Cloudy',
    humidityPercent: 62,
    rainfallProbability: 15,
    agriculturalAlert: {
      status: 'OPTIMAL',
      alertTitle: 'Optimal Transit Window (Demo Mode)',
      alertMessage: 'Favorable road conditions across Nashik, Pune & Vashi routes. (Demo Data)'
    }
  };
}

/**
 * Fetch real distance from Google Maps Distance Matrix API if GOOGLE_MAPS_API_KEY is available.
 */
export async function fetchGoogleMapsDistanceKm(
  originDistrict: string, 
  destinationMandi: string, 
  fallbackKm: number
): Promise<{ distanceKm: number; isLive: boolean; sourceLabel: string }> {
  const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

  if (apiKey && apiKey !== 'MY_GOOGLE_MAPS_API_KEY' && apiKey.trim() !== '') {
    try {
      const origin = `${originDistrict}, Maharashtra, India`;
      const destination = `${destinationMandi}, Maharashtra, India`;
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const data = await res.json();
        const element = data.rows?.[0]?.elements?.[0];
        if (element && element.status === 'OK' && element.distance?.value) {
          const distKm = Math.round(element.distance.value / 1000);
          return {
            distanceKm: Math.max(5, distKm),
            isLive: true,
            sourceLabel: 'Google Maps Distance Matrix API'
          };
        }
      }
    } catch (e) {
      console.warn('Google Maps Distance Matrix API call failed:', e);
    }
  }

  return {
    distanceKm: fallbackKm,
    isLive: false,
    sourceLabel: 'Estimated Road Distance (Demo Data)'
  };
}

/**
 * Fetch AgmarkNet live crop price if AGMARKNET_API_KEY is available.
 */
export async function fetchAgmarkNetPrice(
  cropName: string, 
  mandiName: string, 
  defaultPricePerQuintal: number
): Promise<{ pricePerQuintal: number; isLive: boolean; sourceLabel: string; timestamp: string }> {
  const apiKey = process.env.AGMARKNET_API_KEY;

  if (apiKey && apiKey !== 'MY_AGMARKNET_API_KEY' && apiKey.trim() !== '') {
    try {
      const url = `https://api.data.gov.in/resource/9ef0be3f-0834-4313-a2a5-735b9cfbba91?api-key=${apiKey}&format=json&filters[state]=Maharashtra&filters[commodity]=${encodeURIComponent(cropName)}&limit=10`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const data = await res.json();
        const records = data.records || [];
        const match = records.find((r: any) => 
          r.market?.toLowerCase().includes(mandiName.toLowerCase()) || 
          mandiName.toLowerCase().includes(r.market?.toLowerCase() || '')
        ) || records[0];

        if (match && match.modal_price) {
          const livePrice = parseInt(match.modal_price, 10);
          if (!isNaN(livePrice) && livePrice > 0) {
            return {
              pricePerQuintal: livePrice,
              isLive: true,
              sourceLabel: 'AgmarkNet Govt. Live API',
              timestamp: match.arrival_date || new Date().toLocaleDateString('en-IN')
            };
          }
        }
      }
    } catch (e) {
      console.warn('AgmarkNet API fetch failed:', e);
    }
  }

  return {
    pricePerQuintal: defaultPricePerQuintal,
    isLive: false,
    sourceLabel: 'AgmarkNet APMC Feed (Demo Mode)',
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ', Today'
  };
}
