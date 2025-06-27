import Replicate from "replicate";
import packageData from "../../../package.json";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: `${packageData.name}/${packageData.version}`
});

const API_HOST = process.env.REPLICATE_API_HOST || "https://api.replicate.com";

export default async function handler(req, res) {
  console.log("=== API Request Started ===");
  console.log("Method:", req.method);
  console.log("Body:", req.body);
  console.log("REPLICATE_API_TOKEN exists:", !!process.env.REPLICATE_API_TOKEN);
  
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error("REPLICATE_API_TOKEN not found");
    return res.status(500).json({ 
      error: "REPLICATE_API_TOKEN environment variable is not set" 
    });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
    
    console.log("Prediction created:", prediction);

    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ 
      error: error.message || "Internal server error",
      detail: error.toString()
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
