"use client";

import { generateTextAction } from "@/app/actions/aiAction";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendPrompt = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    const output = await generateTextAction(userMessage);
    setMessages((prev) => [...prev, { role: "ai", content: output }]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendPrompt();
  };

  return (
    <main className="flex flex-col h-screen w-screen bg-[#0d0d0d] text-white">
      {/* Header */}
      <header className="flex items-center px-8 py-4 border-b border-white/10 bg-[#111]">
      
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 opacity-50">
            
            <p className="text-xl font-medium">How can I help you today?</p>
            <p className="text-sm text-white/50">Ask me anything...</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "ai" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold mr-3 mt-1 shrink-0">G</div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-[#1e1e1e] text-white/90 rounded-bl-sm border border-white/10"
              }`}
            >
              {msg.role === "ai" ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {/* Loading bubble */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold mr-3 mt-1 shrink-0">G</div>
            <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0ms]"></span>
              <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:150ms]"></span>
              <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:300ms]"></span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-[#111] px-6 py-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Press Enter to send)"
            className="flex-1 bg-[#1e1e1e] border border-white/10 text-white placeholder-white/30 text-sm px-5 py-3.5 rounded-xl outline-none focus:border-blue-500 transition-colors"
            type="text"
            disabled={isLoading}
          />
          <button
            onClick={handleSendPrompt}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95 transition-all duration-200 px-6 py-3.5 text-sm rounded-xl font-medium"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </main>
  );
}
