import { RotateCcw as UndoIcon } from "lucide-react";
import Image from "next/image";
import { Fragment, useEffect, useRef } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import Message from "./message";

export default function Messages({ events, isProcessing, onUndo }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (events.length > 2) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [events.length]);

  return (
    <section className="w-full">
      {events.map((ev, index) => {
        if (ev.image) {
          return (
            <Fragment key={"image-" + index}>
              <Message sender="replicate" shouldFillWidth>
                <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white p-2">
                <Image
                  alt={
                    ev.prompt
                        ? `对提示词"${ev.prompt}"处理后的图片结果`
                        : "原始图片"
                  }
                  width="512"
                  height="512"
                  priority={true}
                    className="w-full h-auto rounded-xl"
                  src={ev.image}
                />
                </div>

                {onUndo && index > 0 && index === events.length - 1 && (
                  <div className="mt-4 text-center">
                    <button
                      className="modern-button secondary"
                      onClick={() => {
                        onUndo(index);
                      }}
                    >
                      <UndoIcon className="icon" /> 撤销并尝试其他修改
                    </button>
                  </div>
                )}
              </Message>

              {(isProcessing || index < events.length - 1) && (
                <Message sender="replicate" isSameSender>
                  {index === 0
                    ? "你想要修改什么？"
                    : "接下来想要做什么修改？"}
                </Message>
              )}
            </Fragment>
          );
        }

        if (ev.prompt) {
          return (
            <Message key={"prompt-" + index} sender="user">
              {ev.prompt}
            </Message>
          );
        }
      })}

      {isProcessing && (
        <Message sender="replicate">
          <div className="flex items-center gap-3">
            <PulseLoader color="var(--apple-blue)" size={8} />
            <span className="text-sm opacity-70">AI正在处理中...</span>
          </div>
        </Message>
      )}

      <div ref={messagesEndRef} />
    </section>
  );
}
