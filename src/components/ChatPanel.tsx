import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '你想要做什么？\n\n通过自然语言直接操作广告账户，查看报告或管理资产',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // 模拟AI响应
    setTimeout(() => {
      const responses: Record<string, string> = {
        '开通广告账户': '好的，我来帮你开通广告账户。请选择要开通的平台：\n\n1. TikTok\n2. Meta\n3. Google Ads\n\n请告诉我你想选择哪个平台？',
        '账户查询': '当前共有23个广告账户：\n\n• TikTok：20个账户\n  - 钛动账户：10个\n  - 授权账户：5个\n  - 自定义：5个\n\n• Meta：3个账户\n  - 钛动账户：3个\n\n需要查看具体哪个账户的详情？',
        '余额': '正在查询所有账户余额...\n\n总余额：$156,842.50\n• TikTok账户总余额：$98,234.20\n• Meta账户总余额：$58,608.30',
      };

      const response = Object.keys(responses).find(key => input.includes(key));
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response
          ? responses[response]
          : '我理解你想要：' + input + '\n\n我可以帮你完成以下操作：\n• 开通广告账户\n• 查询账户信息\n• 查看账户余额\n• 修改账户配置\n\n请告诉我具体需要哪项服务？',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    '开通广告账户',
    '查询账户余额',
    '账户状态查询',
  ];

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg">LUI 对话</h2>
        <p className="text-sm text-gray-500 mt-1">通过自然语言管理您的资产</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-4">
          <p className="text-gray-500 text-xs mb-2">快速操作</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action}
                onClick={() => {
                  setInput(action);
                  setTimeout(() => handleSend(), 100);
                }}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="请输入指令，例如：查看广告账户状态"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 rounded-lg px-4 py-2 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}