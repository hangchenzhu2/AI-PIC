import Replicate from "replicate";
import packageData from "../../../package.json";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: `${packageData.name}/${packageData.version}`
});

export default async function handler(req, res) {
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error("REPLICATE_API_TOKEN is not set");
    res.status(500).json({ detail: "The REPLICATE_API_TOKEN environment variable is not set." });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ detail: "Method not allowed" });
    return;
  }

  try {
    console.log("Request body:", req.body);
    
    // remove null and undefined values
    const cleanBody = Object.entries(req.body).reduce(
      (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
      {}
    );

    console.log("Cleaned body:", cleanBody);

    // 根据Replicate的flux-kontext-pro模型要求构建输入参数
    const input = {
      prompt: cleanBody.prompt || "",
      image: cleanBody.input_image || "",
      // 添加其他可能需要的参数
      num_inference_steps: 20,
      guidance_scale: 7.5,
      width: 512,
      height: 512,
    };

    console.log("API input:", input);

    const model = "black-forest-labs/flux-kontext-pro";
    
    const prediction = await replicate.predictions.create({
      model,
      input: input
    });

    console.log("Prediction created:", prediction);

    res.status(201).json(prediction);

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ 
      detail: `API Error: ${error.message}`,
      error: error.toString()
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
