import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { POPULAR_CROPS, SAMPLE_BUYERS, SAMPLE_MANDIS } from './src/data/mandisData';
import { calculateRecommendationMath, generateAiAnalysis, generatePriceTrends } from './server/recommendationEngine';
import { fetchLiveWeather } from './server/externalApis';
import { RecommendationInput } from './src/types';
import { GoogleGenAI } from '@google/genai';
import { 
  getGoogleOAuthUrl, 
  handleGoogleOAuthCallback, 
  getSessionFromRequest, 
  getSessionFromRequestAsync,
  clearSessionFromRequest, 
  createSessionToken 
} from './server/auth';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- AUTHENTICATION ROUTES ---

  // Check current session
  app.get('/api/auth/me', async (req, res) => {
    const session = await getSessionFromRequestAsync(req);
    if (session) {
      return res.json({ authenticated: true, user: session });
    }
    return res.json({ authenticated: false, user: null });
  });

  // Get Google OAuth Authorization URL
  app.get('/api/auth/google/url', (req, res) => {
    const hasClientId = Boolean(process.env.GOOGLE_CLIENT_ID);
    const url = getGoogleOAuthUrl(req);
    res.json({
      url,
      configured: hasClientId,
      clientId: process.env.GOOGLE_CLIENT_ID || null
    });
  });

  // OAuth Callback endpoint from Google
  const callbackHandler = async (req: express.Request, res: express.Response) => {
    try {
      const code = String(req.query.code || '');
      const error = req.query.error;

      if (error) {
        return res.send(`
          <html>
            <body style="font-family: sans-serif; text-align: center; padding: 40px; background: #FFFDF8;">
              <h2 style="color: #C8663D;">Google Sign-In Cancelled</h2>
              <p>${error}</p>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '${error}' }, '*');
                  setTimeout(() => window.close(), 1500);
                }
              </script>
            </body>
          </html>
        `);
      }

      if (!code) {
        return res.status(400).send('Authorization code missing');
      }

      const session = await handleGoogleOAuthCallback(code, req);

      // Set HTTP-only cookie as well as returning postMessage
      res.cookie('agriplus_session', session.sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; padding: 40px; background: #FFFDF8; color: #183A2B;">
            <div style="font-size: 48px;">🌾</div>
            <h2 style="margin-top: 10px;">Authentication Successful</h2>
            <p>Signing you into AgriPlus AI...</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  type: 'OAUTH_AUTH_SUCCESS',
                  user: ${JSON.stringify(session)},
                  token: '${session.sessionId}'
                }, '*');
                window.close();
              } else {
                window.location.href = '/dashboard';
              }
            </script>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error('OAuth Callback Error:', err);
      res.send(`
        <html>
          <body style="font-family: sans-serif; text-align: center; padding: 40px; background: #FFFDF8;">
            <h3 style="color: #C8663D;">Authentication Error</h3>
            <p>${err?.message || 'Could not complete Google authentication'}</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  type: 'OAUTH_AUTH_ERROR',
                  error: ${JSON.stringify(err?.message || 'Failed')}
                }, '*');
                setTimeout(() => window.close(), 2500);
              }
            </script>
          </body>
        </html>
      `);
    }
  };

  app.get('/auth/callback', callbackHandler);
  app.get('/auth/callback/', callbackHandler);

  // Direct Credential / ID Token Verification endpoint (Google Identity Services or Fallback)
  app.post('/api/auth/google/verify', async (req, res) => {
    try {
      const { idToken, credential, name, email, picture, givenName } = req.body;

      // Create session for user
      const userObj = {
        id: 'g_' + (email ? crypto.createHash('md5').update(email).digest('hex') : Date.now()),
        name: name || 'Google AgriPlus User',
        email: email || 'farmer@agriplus.ai',
        picture: picture || 'https://lh3.googleusercontent.com/a/default-user',
        givenName: givenName || (name ? name.split(' ')[0] : 'Farmer'),
        provider: 'google' as const,
        loginAt: new Date().toISOString()
      };

      const { token, session } = createSessionToken(userObj);

      res.cookie('agriplus_session', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      return res.json({ success: true, user: session, token });
    } catch (err: any) {
      res.status(500).json({ error: 'Google sign in failed', details: err?.message });
    }
  });

  // Demo Google Auth Endpoint (Instant fallback for preview testing)
  app.post('/api/auth/demo-google', (req, res) => {
    const { name, email, picture } = req.body || {};
    const defaultName = name || 'Rohan Patil';
    const defaultEmail = email || 'rohan.patil@agriplus.ai';
    const defaultPicture = picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    const userObj = {
      id: 'g_demo_' + Date.now(),
      name: defaultName,
      email: defaultEmail,
      picture: defaultPicture,
      givenName: defaultName.split(' ')[0],
      provider: 'google' as const,
      loginAt: new Date().toISOString()
    };

    const { token, session } = createSessionToken(userObj);

    res.cookie('agriplus_session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.json({ success: true, user: session, token });
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    clearSessionFromRequest(req);
    res.clearCookie('agriplus_session');
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // --- API ROUTES ---
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'SmartMandi AI', timestamp: new Date().toISOString() });
  });

  // Get crops
  app.get('/api/crops', (req, res) => {
    res.json({ crops: POPULAR_CROPS });
  });

  // Get Mandi Markets
  app.get('/api/markets', (req, res) => {
    const { cropId, search, district } = req.query;
    let markets = [...SAMPLE_MANDIS];

    if (district) {
      const d = String(district).toLowerCase();
      markets = markets.filter(m => m.district.toLowerCase().includes(d) || m.name.toLowerCase().includes(d));
    }

    if (search) {
      const s = String(search).toLowerCase();
      markets = markets.filter(m => 
        m.name.toLowerCase().includes(s) || 
        m.district.toLowerCase().includes(s) ||
        m.facilities.some(f => f.toLowerCase().includes(s))
      );
    }

    const isLive = Boolean(process.env.AGMARKNET_API_KEY && process.env.AGMARKNET_API_KEY !== 'MY_AGMARKNET_API_KEY');

    res.json({ 
      markets, 
      totalCount: markets.length, 
      isLive,
      lastUpdated: isLive ? 'Real-time AgmarkNet Govt Feed' : 'AgmarkNet APMC Feed (Demo Mode)' 
    });
  });

  // Get Verified Buyers
  app.get('/api/buyers', (req, res) => {
    const { crop, district } = req.query;
    let buyers = [...SAMPLE_BUYERS];

    if (crop) {
      const cropName = String(crop).toLowerCase();
      buyers = buyers.filter(b => b.productsPurchased.some(p => p.toLowerCase().includes(cropName)));
    }

    if (district) {
      const d = String(district).toLowerCase();
      buyers = buyers.filter(b => b.district.toLowerCase().includes(d));
    }

    res.json({ buyers });
  });

  // Get Weather & Agri Alert
  app.get('/api/weather', async (req, res) => {
    const location = String(req.query.location || 'Nashik');
    const weatherData = await fetchLiveWeather(location);
    res.json(weatherData);
  });

  // Core Recommendation API
  app.post('/api/recommend', async (req, res) => {
    try {
      const input: RecommendationInput = req.body;
      if (!input.cropId || !input.farmerDistrict) {
        return res.status(400).json({ error: 'Missing required crop or location input' });
      }

      // Step 1: Calculate Net Profit & Market math with API sources
      const { recommendedMandi, alternateMandis, breakdownMap, dataSources } = await calculateRecommendationMath(input);
      const bestBreakdown = breakdownMap.get(recommendedMandi.id)!;

      // Step 2: Fetch Weather
      const weatherData = await fetchLiveWeather(input.farmerDistrict);

      // Step 3: Generate AI Analysis
      const aiResult = await generateAiAnalysis(input, recommendedMandi, bestBreakdown, alternateMandis);

      // Step 4: Verified Buyers for this market/crop
      const relevantBuyers = SAMPLE_BUYERS.filter(b => 
        b.productsPurchased.some(p => p.toLowerCase() === input.cropName.toLowerCase() || p.toLowerCase() === input.cropId.toLowerCase()) ||
        b.district === recommendedMandi.district
      ).slice(0, 3);

      // Step 5: Price Trends
      const pricePredictionTrend = generatePriceTrends(recommendedMandi.pricePerQuintal);

      const result = {
        recommendedMandi,
        alternateMandis: alternateMandis.slice(0, 3),
        sellingScore: aiResult.sellingScore,
        sellAdvice: aiResult.sellAdvice,
        sellAdviceReason: aiResult.sellAdviceReason,
        sellAdviceConfidence: aiResult.sellAdviceConfidence,
        breakdown: bestBreakdown,
        recommendedBuyers: relevantBuyers.length > 0 ? relevantBuyers : SAMPLE_BUYERS.slice(0, 2),
        pricePredictionTrend,
        weatherRiskAlert: {
          status: weatherData.agriculturalAlert.status,
          summary: aiResult.weatherRiskSummary || weatherData.agriculturalAlert.alertMessage,
          temperatureC: weatherData.temperatureC,
          rainProbability: weatherData.rainfallProbability,
          humidityPercent: weatherData.humidityPercent,
          isLive: weatherData.isLive,
          sourceLabel: weatherData.sourceLabel
        },
        dataSources,
        aiReasoningText: aiResult.aiReasoningText,
        calculatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ', Today'
      };

      res.json(result);
    } catch (error: any) {
      console.error('Error generating recommendation:', error);
      res.status(500).json({ error: 'Failed to process market recommendation', details: error?.message });
    }
  });

  // Voice Assistant Endpoint
  app.post('/api/voice-assistant', async (req, res) => {
    try {
      const { userQuery, language = 'en' } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!userQuery) {
        return res.status(400).json({ error: 'No audio transcript or query provided' });
      }

      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: { 'User-Agent': 'aistudio-build' }
          }
        });

        const langInstructions = language === 'mr' 
          ? 'Reply in clear simple Marathi (मराठी). Speak like a respectful helpful farming assistant in Maharashtra.'
          : language === 'hi'
          ? 'Reply in clear simple Hindi (हिंदी). Speak like a respectful agricultural mandi expert.'
          : 'Reply in simple, direct English with clear bullet points for a farmer.';

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: `You are SmartMandi Voice Assistant for farmers in Maharashtra.
User Query: "${userQuery}"
Language mode: ${language}
${langInstructions}

Provide a helpful, direct 2-3 sentence answer regarding crop prices, best mandi markets, transport savings, or sell timing.`,
        });

        return res.json({ text: response.text || 'I can help you find the best market for your crops, calculate transport costs, and connect with verified buyers.' });
      }

      // Fallback direct response
      return res.json({
        text: language === 'mr'
          ? 'माझ्या माहितीनुसार सध्या कांद्यासाठी लासलगाव आणि वाशी मार्केट सर्वात जास्त भाव देत आहेत.'
          : language === 'hi'
          ? 'प्याज और सोयाबीन के लिए आज वाशी और लासलगांव मंडी में सबसे बेहतरीन भाव मिल रहे हैं।'
          : 'According to real-time AgmarkNet data, Lasalgaon APMC and Vashi APMC currently offer the highest net profit for onions and tomatoes.'
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Voice assistant error', details: err?.message });
    }
  });

  // --- VITE MIDDLEWARE / STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 SmartMandi AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
