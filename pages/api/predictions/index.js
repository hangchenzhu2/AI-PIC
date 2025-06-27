import Replicate from "replicate";
import packageData from "../../../package.json";

export default async function handler(req, res) {
  console.log("=== API Request Started ===");
  console.log("Method:", req.method);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  
  // 详细的环境变量检查
  const apiToken = process.env.REPLICATE_API_TOKEN;
  console.log("Environment check:");
  console.log("- NODE_ENV:", process.env.NODE_ENV);
  console.log("- NETLIFY:", process.env.NETLIFY);
  console.log("- API Token exists:", !!apiToken);
  console.log("- API Token length:", apiToken ? apiToken.length : 0);
  
  if (!apiToken) {
    console.error("REPLICATE_API_TOKEN not found");
    return res.status(500).json({ 
      error: "REPLICATE_API_TOKEN environment variable is not set",
      debug: {
        nodeEnv: process.env.NODE_ENV,
        netlify: !!process.env.NETLIFY,
        availableEnvVars: Object.keys(process.env).filter(key => key.includes('REPLICATE'))
      }
    });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const replicate = new Replicate({
      auth: apiToken,
      userAgent: `${packageData.name}/${packageData.version}`
    });

    // remove null and undefined values
    req.body = Object.entries(req.body).reduce(
      (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
      {}
    );

    console.log("Processed request body:", req.body);

    const model = "black-forest-labs/flux-kontext-pro";
    console.log("Using model:", model);
    
    const prediction = await replicate.predictions.create({
      model,
      input: req.body
    });
    
    console.log("Prediction created successfully:", prediction.id);

    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ 
      error: error.message || "Internal server error",
      detail: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
