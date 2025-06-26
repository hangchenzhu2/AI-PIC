import Head from "next/head";
import Link from "next/link";
import { ArrowLeft as ArrowLeftIcon, Zap, Image as ImageIcon, Sparkles } from "lucide-react";

import { appName, appMetaDescription } from "./index";

export default function About() {
  return (
    <div>
      <Head>
        <title>关于 {appName} - AI智能图片编辑工具</title>
        <meta name="description" content={appMetaDescription} />
      </Head>

      <main className="container max-w-[800px] mx-auto p-6">
        <div className="apple-card">
          <h1 className="text-center text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            关于 {appName}
          </h1>

          <div className="prose max-w-none">
            <p className="text-xl leading-relaxed mb-6">
              这是一个创新的AI图片编辑工具，让你能够通过简单的文字描述来修改图片。无需复杂的操作，只需用自然语言描述你的想法，AI就能为你实现。
            </p>

            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="text-center p-6 bg-blue-50 rounded-2xl">
                <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">智能识别</h3>
                <p className="text-sm opacity-70">AI理解你的文字描述，精确识别修改需求</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-2xl">
                <ImageIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">精确编辑</h3>
                <p className="text-sm opacity-70">保持原图质量，只修改你指定的部分</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-2xl">
                <Zap className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">快速生成</h3>
                <p className="text-sm opacity-70">几秒钟内完成图片处理，即时查看结果</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">如何使用？</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h3 className="font-semibold">上传图片</h3>
                  <p className="text-sm opacity-70">选择你想要编辑的图片，支持常见的图片格式</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h3 className="font-semibold">描述修改</h3>
                  <p className="text-sm opacity-70">用简单的中文描述你想要的修改，比如"把天空变成紫色"</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h3 className="font-semibold">获得结果</h3>
                  <p className="text-sm opacity-70">AI会自动处理并生成修改后的图片，可以继续修改或下载</p>
                </div>
              </div>
            </div>

            <p className="text-lg leading-relaxed">
              本工具基于先进的AI技术开发，使用简洁的Next.js框架构建，为用户提供流畅的使用体验。
              我们致力于让AI技术更贴近普通用户，让每个人都能轻松编辑出理想的图片。
            </p>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/"
              className="modern-button primary text-lg px-8 py-4">
              <ArrowLeftIcon className="icon" />开始编辑图片
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
