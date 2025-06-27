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
export const appMetaDescription = "基于InstructPix2Pix技术的强大AI图像编辑工具。支持文字描述编辑图片、智能修图、背景替换、风格转换等功能。免费在线使用，无需注册，一键生成高质量图片。";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [seed] = useState(getRandomSeed());
  const [initialPrompt, setInitialPrompt] = useState(seed.prompt);
  const [showImageModal, setShowImageModal] = useState(false);

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

  // 快捷操作函数
  const setPromptValue = (prompt) => {
    const input = document.querySelector('input[name="prompt"]');
    if (input) {
      input.value = prompt;
      input.focus();
    }
  };

  return (
    <div>
      <Head>
        <title>{appName} - 基于InstructPix2Pix的AI智能图片编辑工具</title>
        <meta name="description" content={appMetaDescription} />
        <meta name="keywords" content="AI图片编辑,InstructPix2Pix,智能修图,文字编辑图片,AI修图工具,在线图片编辑器,免费AI工具,图片生成,背景替换,风格转换" />
        <meta name="author" content="AI Image Editor" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://paintbytext.chat/" />
        <meta property="og:title" content={`${appName} - 基于InstructPix2Pix的AI智能图片编辑工具`} />
        <meta property="og:description" content={appMetaDescription} />
        <meta property="og:image" content="https://paintbytext.chat/opengraph.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://paintbytext.chat/" />
        <meta property="twitter:title" content={`${appName} - 基于InstructPix2Pix的AI智能图片编辑工具`} />
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
          <p className="text-lg opacity-60 mb-6 leading-relaxed">
            基于最先进的InstructPix2Pix技术，实现前所未有的AI图像编辑体验
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm opacity-60">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full">InstructPix2Pix技术</span>
            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full">文字编辑</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full">实时预览</span>
            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full">高质量输出</span>
            <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full">免费使用</span>
            <span className="px-3 py-1 bg-teal-100 text-teal-600 rounded-full">无需注册</span>
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
              <div className="mb-4 cursor-pointer" onClick={() => setShowImageModal(true)}>
                <Image
                  src="/what can InstructPix2Pix do.webp"
                  alt="InstructPix2Pix AI图片编辑示例"
                  width={300}
                  height={200}
                  className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                />
                <p className="text-xs text-center text-gray-500 mt-2">点击查看大图</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <p>上传你想要编辑的图片</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <p>描述你想要的修改：如"把天空变成紫色"、"添加一只小猫"</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <p>InstructPix2Pix AI会自动为你生成修改后的图片</p>
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
                    <li 
                      className="cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => setPromptValue("一只可爱的小猫坐在阳光下")}
                    >
                      • "一只可爱的小猫坐在阳光下"
                    </li>
                    <li 
                      className="cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => setPromptValue("未来城市的科幻建筑")}
                    >
                      • "未来城市的科幻建筑"
                    </li>
                    <li 
                      className="cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => setPromptValue("油画风格的山水风景")}
                    >
                      • "油画风格的山水风景"
                    </li>
                    <li 
                      className="cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => setPromptValue("卡通风格的动物插画")}
                    >
                      • "卡通风格的动物插画"
                    </li>
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
                <button 
                  className="w-full modern-button text-left" 
                  onClick={() => setPromptValue("把这张图片变成油画风格")}
                >
                  🎨 转换为油画风格
                </button>
                <button 
                  className="w-full modern-button text-left" 
                  onClick={() => setPromptValue("添加美丽的日落背景")}
                >
                  🌅 添加日落背景
                </button>
                <button 
                  className="w-full modern-button text-left" 
                  onClick={() => setPromptValue("让图片变得更加明亮和鲜艳")}
                >
                  ✨ 增强色彩
                </button>
                <button 
                  className="w-full modern-button text-left" 
                  onClick={() => setPromptValue("将图片转换为黑白风格")}
                >
                  ⚫ 黑白滤镜
                </button>
                <button 
                  className="w-full modern-button text-left" 
                  onClick={() => setPromptValue("添加雪花飘落的效果")}
                >
                  ❄️ 添加雪花
                </button>
                <button 
                  className="w-full modern-button text-left" 
                  onClick={() => setPromptValue("让背景变得模糊，突出主体")}
                >
                  📷 背景虚化
                </button>
                <button 
                  className="w-full modern-button text-left" 
                  onClick={() => setPromptValue("添加彩虹在天空中")}
                >
                  🌈 添加彩虹
                </button>
                <button 
                  className="w-full modern-button text-left" 
                  onClick={() => setPromptValue("将场景改为夜晚，添加月亮和星星")}
                >
                  🌙 夜晚场景
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SEO内容区域 - 仿照Raphael网站 */}
        <div className="mt-16 space-y-16">
          {/* 产品特色 */}
          <section className="apple-card">
            <h2 className="text-3xl font-bold text-center mb-8">为什么选择我们的AI图像编辑器？</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold mb-3">基于InstructPix2Pix技术</h3>
                <p className="text-gray-600">采用最先进的InstructPix2Pix模型，提供业界领先的图像编辑质量和精确度，让文字描述完美转化为视觉效果。</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-xl font-bold mb-3">智能文字理解</h3>
                <p className="text-gray-600">强大的自然语言处理能力，能够准确理解复杂的编辑指令，支持中文和英文描述，让AI编辑变得简单直观。</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold mb-3">快速生成</h3>
                <p className="text-gray-600">优化的推理pipeline确保快速图像生成，通常在几秒钟内完成编辑，大大提高工作效率。</p>
              </div>
            </div>
          </section>

          {/* 核心功能 */}
          <section className="apple-card">
            <h2 className="text-3xl font-bold text-center mb-8">强大的AI图像编辑功能</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-blue-600">🎨 智能图像修改</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 背景替换和场景变换</li>
                  <li>• 物体添加、删除和移动</li>
                  <li>• 颜色调整和风格转换</li>
                  <li>• 光线和氛围调节</li>
                  <li>• 细节增强和质量提升</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-green-600">✨ 风格化处理</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 艺术风格转换（油画、水彩、素描）</li>
                  <li>• 卡通和动漫风格化</li>
                  <li>• 复古和电影滤镜效果</li>
                  <li>• 季节和天气效果添加</li>
                  <li>• 专业摄影效果模拟</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 使用场景 */}
          <section className="apple-card">
            <h2 className="text-3xl font-bold text-center mb-8">适用场景</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">📸</span>
                </div>
                <h4 className="font-bold mb-2">摄影后期</h4>
                <p className="text-sm text-gray-600">专业摄影师和摄影爱好者的理想工具</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🎯</span>
                </div>
                <h4 className="font-bold mb-2">营销设计</h4>
                <p className="text-sm text-gray-600">快速制作营销素材和广告图片</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">📱</span>
                </div>
                <h4 className="font-bold mb-2">社交媒体</h4>
                <p className="text-sm text-gray-600">制作引人注目的社交媒体内容</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🎨</span>
                </div>
                <h4 className="font-bold mb-2">创意设计</h4>
                <p className="text-sm text-gray-600">艺术创作和概念设计的得力助手</p>
              </div>
            </div>
          </section>

          {/* 技术优势 */}
          <section className="apple-card bg-gradient-to-r from-blue-50 to-purple-50">
            <h2 className="text-3xl font-bold text-center mb-8">InstructPix2Pix技术优势</h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-purple-600">🔬 先进的AI模型</h3>
                  <p className="text-gray-700 mb-4">
                    InstructPix2Pix是基于扩散模型的革命性AI技术，能够根据自然语言指令对图像进行精确编辑。
                    与传统的图像编辑方法相比，它能够理解复杂的语义信息，实现更智能、更自然的编辑效果。
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 无需专业的图像编辑技能</li>
                    <li>• 支持复杂的编辑指令</li>
                    <li>• 保持图像的原始质量和细节</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 text-blue-600">⚡ 卓越的性能表现</h3>
                  <p className="text-gray-700 mb-4">
                    我们的平台经过深度优化，确保InstructPix2Pix模型能够快速响应用户需求。
                    通过先进的推理优化技术，将处理时间缩短至秒级，让AI图像编辑变得即时可用。
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 平均处理时间：3-8秒</li>
                    <li>• 支持高分辨率图像处理</li>
                    <li>• 99.9%的服务可用性保证</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 图片放大模态框 */}
        {showImageModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImageModal(false)}
          >
            <div className="max-w-4xl max-h-full">
              <Image
                src="/what can InstructPix2Pix do.webp"
                alt="InstructPix2Pix AI图片编辑功能详解"
                width={800}
                height={600}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <p className="text-white text-center mt-4">点击任意位置关闭</p>
            </div>
          </div>
        )}

        <Footer
          events={events}
          startOver={startOver}
          handleImageDropped={handleImageDropped}
        />
      </main>
    </div>
  );
}
