import { useEffect, useState } from "react";
import Message from "./message";

export default function PromptForm({
  initialPrompt,
  isFirstPrompt,
  onSubmit,
  disabled = false,
}) {
  const [prompt, setPrompt] = useState(initialPrompt);

  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPrompt("");
    onSubmit(e);
  };

  if (disabled) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm">
          🎨 AI正在为你生成图片...
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="animate-in fade-in duration-700">
      <Message sender="replicate" isSameSender>
        <label htmlFor="prompt-input" className="text-lg font-medium">
          {isFirstPrompt
            ? "✨ 描述一下你想要的修改："
            : "🎨 继续描述你的想法："}
        </label>
      </Message>

      <div className="flex gap-3 mt-6">
        <input
          id="prompt-input"
          type="text"
          name="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="例如：把天空变成粉色、添加一只可爱的小猫..."
          className="flex-1 px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg"
          disabled={disabled}
          required
        />

          <button
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          disabled={!prompt.trim()}
          >
          ✨ 生成
          </button>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          💡 提示：描述越详细，AI生成的效果越精准
        </p>
      </div>
    </form>
  );
}
