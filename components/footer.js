import Dropzone from "components/dropzone";
import {
  Code as CodeIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  XCircle as StartOverIcon,
} from "lucide-react";
import Link from "next/link";

export default function Footer({ events, startOver, handleImageDropped }) {
  return (
    <footer className="w-full my-12">
      <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
        <Link href="/about" className="modern-button">
          <InfoIcon className="icon" />关于
        </Link>

        {events.length > 1 && (
          <button className="modern-button" onClick={startOver}>
            <StartOverIcon className="icon" />
            重新开始
          </button>
        )}

        <Dropzone onImageDropped={handleImageDropped} />

        {events.length > 2 && (
          (<Link
            href={events.findLast((ev) => ev.image).image}
            className="modern-button primary"
            target="_blank"
            rel="noopener noreferrer">

            <DownloadIcon className="icon" />下载图片
          </Link>)
        )}

        <Link
          href="https://github.com/replicate/paint-by-text"
          className="modern-button secondary"
          target="_blank"
          rel="noopener noreferrer">

          <CodeIcon className="icon" />查看源码
        </Link>
      </div>

      <div className="text-center lil-text mt-8">
      <div className="inline-block py-2 px-4 border border-yellow-200 rounded-lg bg-[#fef6aa]">
      🤔 Are you a developer and want to learn how to build this? Check out the{" "}
        <Link
          href="https://github.com/replicate/paint-with-words#readme"
          target="_blank">
          README
        </Link>.
      </div>
      </div>

      <div className="text-center lil-text mt-8">
        Powered by{" "}
        <Link href="https://replicate.com/black-forest-labs" target="_blank">
          Black Forest Labs
        </Link>
        ,{" "}
        <Link
          href="https://replicate.com/blog/flux-kontext?utm_source=project&utm_campaign=paintbytext"
          target="_blank">
          Replicate
        </Link>
        ,{" "}
        <Link href="https://vercel.com/templates/ai" target="_blank">
          Vercel
        </Link>
        , and{" "}
        <Link href="https://github.com/replicate/paint-by-text" target="_blank">
          GitHub
        </Link>
      </div>
    </footer>
  );
}
