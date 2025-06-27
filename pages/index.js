import Messages from "components/messages";
import PromptForm from "components/prompt-form";
import Head from "next/head";
import { useEffect, useState } from "react";
import Image from "next/image";

import Footer from "components/footer";

import prepareImageFileForUpload from "lib/prepare-image-file-for-upload";
import { getRandomSeed } from "lib/seeds";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const appName = "AI图像编辑器";
export const appSubtitle = "通过文字描述，让AI为你智能编辑图片";
export const appMetaDescription = "使用AI技术，通过简单的文字描述即可智能编辑图片。支持添加物体、改变颜色、修改背景等多种编辑功能，让图片编辑变得简单有趣。";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [seed] = useState(getRandomSeed());
  const [initialPrompt, setInitialPrompt] = useState(seed.prompt);

  // set the initial image from a random seed
  useEffect(() => {
    setEvents([{ image: seed.image }]);
  }, [seed.image]);

  const handleImageDropped = async (image) => {
    try {
      image = await prepareImageFileForUpload(image);
    } catch (error) {
      setError(error.message);
      return;
    }
    setEvents(events.concat([{ image }]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prompt = e.target.prompt.value;
    const lastImage = events.findLast((ev) => ev.image)?.image;

    setError(null);
    setIsProcessing(true);
    setInitialPrompt("");

    // make a copy so that the second call to setEvents here doesn't blow away the first. Why?
    const myEvents = [...events, { prompt }];
    setEvents(myEvents);

    const body = {
      prompt,
      input_image: lastImage,
    };

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    let prediction = await response.json();
    
    console.log("API Response status:", response.status);
    console.log("API Response data:", prediction);

    if (response.status !== 201) {
      console.error("API Error:", prediction);
      setError(prediction.detail || "API调用失败，请检查网络连接或稍后重试");
      setIsProcessing(false);
      return;
    }

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(500);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }

      // just for bookkeeping
      setPredictions(predictions.concat([prediction]));

      if (prediction.status === "succeeded") {
        setEvents(
          myEvents.concat([
            { image: prediction.output },
          ])
        );
      }
    }

    setIsProcessing(false);
  };

  const startOver = async (e) => {
    e.preventDefault();
    setEvents(events.slice(0, 1));
    setError(null);
    setIsProcessing(false);
    setInitialPrompt(seed.prompt);
  };

  return (
    <div>
      <Head>
        <title>{appName} - AI智能图片编辑工具</title>
        <meta name="description" content={appMetaDescription} />
        <meta name="keywords" content="AI图片编辑,智能修图,文字编辑图片,AI修图工具,在线图片编辑器" />
        <meta name="author" content="AI Image Editor" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://paintbytext.chat/" />
        <meta property="og:title" content={`${appName} - AI智能图片编辑工具`} />
        <meta property="og:description" content={appMetaDescription} />
        <meta property="og:image" content="https://paintbytext.chat/opengraph.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://paintbytext.chat/" />
        <meta property="twitter:title" content={`${appName} - AI智能图片编辑工具`} />
        <meta property="twitter:description" content={appMetaDescription} />
        <meta property="twitter:image" content="https://paintbytext.chat/opengraph.jpg" />
        
        {/* Additional SEO */}
        <link rel="canonical" href="https://paintbytext.chat/" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="zh-CN" />
      </Head>

      <main className="container max-w-[1400px] mx-auto p-6">
        {/* 页面标题 */}
        <div className="apple-card mb-8 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {appName}
          </h1>
          <p className="text-xl opacity-70 mb-6 leading-relaxed">
            {appSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm opacity-60">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full">AI智能识别</span>
            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full">文字编辑</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full">实时预览</span>
            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full">高质量输出</span>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左侧：聊天交互区域 */}
          <div className="lg:col-span-2">
            <div className="apple-card">
              <Messages
                events={events}
                isProcessing={isProcessing}
                onUndo={(index) => {
                  setInitialPrompt(events[index - 1].prompt);
                  setEvents(
                    events.slice(0, index - 1).concat(events.slice(index + 1))
                  );
                }}
              />

              <PromptForm
                initialPrompt={initialPrompt}
                isFirstPrompt={events.length === 1}
                onSubmit={handleSubmit}
                disabled={isProcessing}
              />

              <div className="mx-auto w-full">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 mb-6">
                    <b>错误:</b> {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：使用说明 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 功能说明1：图片编辑 */}
            <div className="apple-card">
              <h3 className="text-xl font-bold mb-4 text-center">🎨 图片智能编辑</h3>
              <div className="mb-4">
                <Image
                  src="/what can InstructPix2Pix do.jpg"
                  alt="AI图片编辑示例"
                  width={300}
                  height={200}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <p>上传你想要编辑的图片</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <p>描述你想要的修改：如&ldquo;把天空变成紫色&rdquo;、&ldquo;添加一只小猫&rdquo;</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <p>AI会自动为你生成修改后的图片</p>
                </div>
              </div>
            </div>

            {/* 功能说明2：图片生成 */}
            <div className="apple-card">
              <h3 className="text-xl font-bold mb-4 text-center">✨ AI图片生成</h3>
              <div className="space-y-3 text-sm">
                <p className="text-center text-gray-600 mb-4">
                  直接描述你想要的图片，AI为你创造
                </p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-medium mb-2">示例提示词：</p>
                  <ul className="space-y-1 text-xs">
                    <li>• &ldquo;一只可爱的小猫坐在阳光下&rdquo;</li>
                    <li>• &ldquo;未来城市的科幻建筑&rdquo;</li>
                    <li>• &ldquo;油画风格的山水风景&rdquo;</li>
                    <li>• &ldquo;卡通风格的动物插画&rdquo;</li>
                  </ul>
                </div>
                <div className="text-center mt-4">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-medium">
                    💡 描述越详细，效果越精准
                  </span>
                </div>
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="apple-card">
              <h3 className="text-lg font-bold mb-3 text-center">⚡ 快捷操作</h3>
              <div className="space-y-2">
                <button className="w-full modern-button text-left" onClick={() => {
                  const input = document.querySelector('input[name="prompt"]');
                  if (input) input.value = "把这张图片变成油画风格";
                }}>
                  🎨 转换为油画风格
                </button>
                <button className="w-full modern-button text-left" onClick={() => {
                  const input = document.querySelector('input[name="prompt"]');
                  if (input) input.value = "添加美丽的日落背景";
                }}>
                  🌅 添加日落背景
                </button>
                <button className="w-full modern-button text-left" onClick={() => {
                  const input = document.querySelector('input[name="prompt"]');
                  if (input) input.value = "让图片变得更加明亮和鲜艳";
                }}>
                  ✨ 增强色彩
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer
          events={events}
          startOver={startOver}
          handleImageDropped={handleImageDropped}
        />
      </main>
    </div>
  );
}
