const API_HOST = process.env.REPLICATE_API_HOST || "https://api.replicate.com";

export default async function handler(req, res) {
  console.log("=== Prediction Status Check ===");
  console.log("Prediction ID:", req.query.id);
  console.log("REPLICATE_API_TOKEN exists:", !!process.env.REPLICATE_API_TOKEN);
  
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error("REPLICATE_API_TOKEN not found in status check");
    return res.status(500).json({ 
      error: "REPLICATE_API_TOKEN environment variable is not set" 
    });
  }

  try {
    const response = await fetch(`${API_HOST}/v1/predictions/${req.query.id}`, {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    
    console.log("Replicate API response status:", response.status);
    
    if (response.status !== 200) {
      let error = await response.json();
      console.error("Replicate API Error:", error);
      res.statusCode = 500;
      res.end(JSON.stringify({ detail: error.detail }));
      return;
    }

    const prediction = await response.json();
    console.log("Prediction status:", prediction.status);
    res.end(JSON.stringify(prediction));
  } catch (error) {
    console.error("Prediction status check error:", error);
    res.status(500).json({ 
      error: error.message || "Failed to check prediction status",
      detail: error.toString()
    });
  }
}
