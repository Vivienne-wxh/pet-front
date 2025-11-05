import React, { useState, useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const quickQuestions = [
  '狗狗可以吃西瓜吗？',
  '猫咪呕吐是什么原因？',
  '如何选择优质猫粮？',
  '宠物营养搭配建议',
];

const rawEndpoint = (
  ((import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_BACKEND_URL) ??
  (globalThis as { VITE_BACKEND_URL?: string }).VITE_BACKEND_URL ??
  'http://localhost:3000'
);

const API_ENDPOINT = rawEndpoint.replace(/\/$/, '');
const createMessageId = () => Date.now() + Math.random();

interface Pet {
  id?: number;
  name: string;
  type: '狗' | '猫' | '其他';
  breed: string;
  age: string;
  weight: string;
  avatar: string;
  allergies?: string[];
}

interface AIChatPageProps {
  pets?: Pet[];
  selectedPetId?: number;
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
}

export function AIChatPage({ pets = [], selectedPetId, messages, setMessages }: AIChatPageProps) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 根据问题中的宠物名字自动匹配宠物档案
  const findPetFromQuestion = (question: string): Pet | null => {
    if (!pets || pets.length === 0) return null;
    
    // 在问题中查找宠物名字
    for (const pet of pets) {
      if (question.includes(pet.name)) {
        return pet;
      }
    }
    
    return null;
  };

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (questionOverride?: string) => {
    const question = (questionOverride ?? inputValue).trim();

    if (!question || isLoading) return;

    const userMessage: Message = {
      id: createMessageId(),
      type: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!questionOverride) {
      setInputValue('');
    }

    setIsLoading(true);

    // 创建AI消息占位符，用于实时更新
    const aiMessageId = createMessageId();
    const aiMessage: Message = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      // 构建请求体，包含问题和宠物档案信息
      const requestBody: any = { question };
      
      // 根据问题中的宠物名字自动匹配宠物档案
      const matchedPet = findPetFromQuestion(question);
      
      if (matchedPet) {
        // 如果问题中提到了宠物名字，使用该宠物的档案
        requestBody.pet_profile = {
          name: matchedPet.name,
          type: matchedPet.type,
          breed: matchedPet.breed,
          allergies: matchedPet.allergies || [],
        };
        console.log(`🐕 检测到问题中提到宠物：${matchedPet.name}，使用其档案信息`);
      }
      
      const response = await fetch(`${API_ENDPOINT}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // 处理流式响应 (Server-Sent Events)
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('无法读取响应流');
      }

      let buffer = '';
      let fullContent = '';
      let firstByteTime: number | null = null;
      const requestStartTime = Date.now();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        // 解码数据块
        buffer += decoder.decode(value, { stream: true });

        // 处理SSE格式的数据 (data: {...}\n\n)
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // 保留最后一个不完整的行

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              // 记录首字节时间（第一次收到数据）
              if (firstByteTime === null && (data.status || data.content || data.error)) {
                firstByteTime = Date.now();
                const ttfbt = firstByteTime - requestStartTime;
                console.log(`⚡ 首字节时间 (TTFB): ${ttfbt}ms`);
              }

              if (data.error) {
                // 处理错误
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId
                      ? { ...msg, content: `抱歉，${data.error}` }
                      : msg
                  )
                );
                return;
              }

              if (data.status === 'thinking') {
                // 收到"思考中"状态，可以显示加载动画或提示
                // 这里不更新内容，保持空内容但显示加载状态
                continue;
              }

              if (data.formatted) {
                // 接收到格式化后的完整文本，替换当前内容
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId ? { ...msg, content: data.formatted } : msg
                  )
                );
                fullContent = data.formatted; // 更新本地缓存
                setIsLoading(false); // 格式化完成后可以停止加载状态
                continue;
              }

              if (data.done) {
                // 流式传输完成
                setIsLoading(false);
                return;
              }

              if (data.content) {
                // 累积内容并立即更新UI（实时流式显示）
                fullContent += data.content;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === aiMessageId ? { ...msg, content: fullContent } : msg
                  )
                );
              }
            } catch (parseError) {
              console.error('解析SSE数据失败：', parseError);
            }
          }
        }
      }

      // 确保最终状态正确
      if (fullContent) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId ? { ...msg, content: fullContent } : msg
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: '抱歉，暂时没有得到有效回答，请稍后再试。' }
              : msg
          )
        );
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, content: '抱歉，AI 服务暂时不可用，请稍后再试。' }
            : msg
        )
      );
      console.error('调用 AI 接口失败：', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue('');
    void handleSendMessage(question);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      void handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="pt-12 pb-4 px-6 bg-white border-b border-emerald-100 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-emerald-900">AI智能问答</h1>
            <p className="text-xs text-emerald-600/70">24小时在线营养顾问</p>
          </div>
        </div>
      </header>

      {/* Quick Questions */}
      {messages.length <= 1 && (
        <div className="px-6 py-4 flex-shrink-0">
          <p className="text-xs text-gray-500 mb-3">快速提问：</p>
          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                disabled={isLoading}
                className="bg-white border border-emerald-100 rounded-xl px-3 py-2 text-xs text-left text-gray-700 hover:border-emerald-300 hover:bg-emerald-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-6 py-4 overflow-y-auto">
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                {message.type === 'ai' && (
                  <div className="flex items-center gap-1 mb-1">
                    <Sparkles size={12} className="text-violet-500" />
                    <span className="text-xs text-violet-600">AI助手</span>
                  </div>
                )}
                <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content.split('\n').map((line, idx, arr) => (
                    <span key={idx}>
                      {line}
                      {idx < arr.length - 1 && <br />}
                    </span>
                  ))}
                </div>
                <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-emerald-100' : 'text-gray-400'}`}>
                  {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area - Fixed at bottom above nav */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-t border-gray-200 shadow-lg mb-16">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="输入您的问题..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 h-11 rounded-xl border-2 border-emerald-100 focus:border-emerald-400 bg-white"
          />
          <Button
            onClick={() => void handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="h-11 w-11 p-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send size={18} />
          </Button>
        </div>
        <p className="text-xs text-center text-gray-400 mt-1.5">
          AI建议仅供参考，重大问题请咨询专业兽医
        </p>
      </div>
    </div>
  );
}
