import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";

import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import SectorAnalysis from '@/pages/MarketOverview';
import StockSentiment from '@/pages/StockSentiment';
import NewsImpact from '@/pages/NewsImpact';
import NewsSentimentPage from '@/pages/NewsSentiment';
import Predictions from '@/pages/Predictions';

import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sector-analysis" element={<SectorAnalysis />} />
            <Route path="/stock-sentiment" element={<StockSentiment />} />
            <Route path="/news-impact" element={<NewsImpact />} />
            <Route path="/news-sentiment" element={<NewsSentimentPage />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
