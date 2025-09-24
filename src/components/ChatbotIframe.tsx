import React from 'react';
import { X } from 'lucide-react';

interface ChatbotIframeProps {
  onClose: () => void;
}

const ChatbotIframe: React.FC<ChatbotIframeProps> = ({ onClose }) => {
  return (
    <div className="fixed top-20 right-4 z-50 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-slideIn">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">AI助手</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="关闭聊天窗口"
        >
          <X size={18} />
        </button>
      </div>
      
      <iframe
        src={import.meta.env.VITE_CHATBOT_URL || "https://teach.excelmaster.ai/chatbot/kX2Mcc2xV30qNjqB"}
        style={{ width: '400px', height: '600px' }}
        frameBorder="0"
        allow="microphone; camera; clipboard-write"
        sandbox="allow-same-origin allow-scripts allow-forms allow-modals allow-popups allow-top-navigation"
        title="AI Chatbot"
        className="bg-white"
        loading="lazy"
        onError={() => {
          console.error('Iframe加载失败，可能是CORS或网络问题');
        }}
      />
    </div>
  );
};

export default ChatbotIframe;