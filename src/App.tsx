import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import FeaturedProducts from './components/FeaturedProducts';
import IframeChat from './components/IframeChat';
import ChatbotIframe from './components/ChatbotIframe';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header 
          onToggleAI={() => setShowAIAssistant(!showAIAssistant)}
          onToggleChatbot={() => setShowChatbot(!showChatbot)}
          onCategoryClick={handleCategoryClick}
        />
        <Hero />
        <CategoryGrid />
        <FeaturedProducts selectedCategory={selectedCategory} />
        <Footer />
        
        {showAIAssistant && (
          <IframeChat onClose={() => setShowAIAssistant(false)} />
        )}
        
        {showChatbot && (
          <ChatbotIframe onClose={() => setShowChatbot(false)} />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;