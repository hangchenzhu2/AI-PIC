import Head from "next/head";
import Link from "next/link";
import { ArrowLeft as ArrowLeftIcon } from "lucide-react";

const appName = "AI图像编辑器";
const appMetaDescription = "使用AI技术，通过简单的文字描述即可智能编辑图片。支持添加物体、改变颜色、修改背景等多种编辑功能，让图片编辑变得简单有趣。";

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

            <h2 className="text-2xl font-bold mb-4">核心功能</h2>
            <ul className="space-y-2 mb-6">
              <li>🎨 <strong>智能识别</strong> - AI理解你的文字描述，精确识别修改需求</li>
              <li>🖼️ <strong>精确编辑</strong> - 保持原图质量，只修改你指定的部分</li>
              <li>⚡ <strong>快速生成</strong> - 几秒钟内完成图片处理，即时查看结果</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">如何使用？</h2>
            <ol className="space-y-3 mb-8">
              <li><strong>1. 上传图片</strong> - 选择你想要编辑的图片，支持常见的图片格式</li>
              <li><strong>2. 描述修改</strong> - 用简单的中文描述你想要的修改，比如&ldquo;把天空变成紫色&rdquo;</li>
              <li><strong>3. 获得结果</strong> - AI会自动处理并生成修改后的图片，可以继续修改或下载</li>
            </ol>

            <p className="text-lg leading-relaxed">
              本工具基于先进的AI技术开发，使用简洁的Next.js框架构建，为用户提供流畅的使用体验。
              我们致力于让AI技术更贴近普通用户，让每个人都能轻松编辑出理想的图片。
            </p>
          </div>

        <div className="text-center mt-10">
          <Link
            href="/"
              className="modern-button primary text-lg px-8 py-4">
              <ArrowLeftIcon className="w-5 h-5 mr-2" />开始编辑图片
          </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
