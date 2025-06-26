import Messages from "components/messages";
import PromptForm from "components/prompt-form";
import Head from "next/head";
import { useEffect, useState } from "react";

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

    if (response.status !== 201) {
      setError(prediction.detail);
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

      <main className="container max-w-[800px] mx-auto p-6">
        <div className="apple-card mb-8">
          <hgroup className="text-center">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
          </hgroup>
        </div>

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

        <Footer
          events={events}
          startOver={startOver}
          handleImageDropped={handleImageDropped}
        />
      </main>
    </div>
  );
}
