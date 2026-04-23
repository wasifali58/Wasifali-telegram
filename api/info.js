import axios from 'axios';

// Cache responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getTelegramInfo(username) {
  const cleanUsername = username.replace('@', '');
  
  // Check cache
  const cached = cache.get(cleanUsername);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  try {
    const response = await axios.get(`https://akashhacker.gt.tc/telegram.php?username=${cleanUsername}`, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const result = {
      success: true,
      username: `@${cleanUsername}`,
      developer: "WASIF ALI",
      telegram: "@FREEHACKS95",
      timestamp: Math.floor(Date.now() / 1000),
      data: response.data.data || response.data,
      processing_time: response.data.processing_time || "N/A"
    };
    
    cache.set(cleanUsername, {
      data: result,
      timestamp: Date.now()
    });
    
    return result;
    
  } catch (error) {
    return {
      success: false,
      username: `@${cleanUsername}`,
      developer: "WASIF ALI",
      telegram: "@FREEHACKS95",
      timestamp: Math.floor(Date.now() / 1000),
      error: "Failed to fetch user info",
      message: error.message
    };
  }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  const pretty = req.query.pretty === 'true';
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Home route
  if (req.url === '/' || req.url === '') {
    const homeResponse = {
      status: "ok",
      message: "Telegram User Info API",
      developer: "WASIF ALI",
      telegram: "@FREEHACKS95",
      endpoints: {
        info: "/api/info?username=FREEHACKS95",
        pretty: "/api/info?username=FREEHACKS95&pretty=true"
      },
      example: "https://your-api.vercel.app/api/info?username=FREEHACKS95"
    };
    
    return res.status(200).json(homeResponse);
  }
  
  // Get username
  let { username } = req.query;
  
  if (!username) {
    const error = {
      success: false,
      developer: "WASIF ALI",
      telegram: "@FREEHACKS95",
      error: "Username is required",
      usage: "/api/info?username=FREEHACKS95"
    };
    
    return res.status(400).json(error);
  }
  
  const data = await getTelegramInfo(username);
  
  if (pretty) {
    return res.status(200).send(JSON.stringify(data, null, 2));
  }
  
  return res.status(200).json(data);
}
