import React, { Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { AccessibilityProvider } from '@/lib/accessibility';
import AccessibilityPanel from '@/components/ui/accessibility-panel';

import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import SectorAnalysis from '@/pages/MarketOverview';
import StockSentiment from '@/pages/StockSentiment';
import NewsImpact from '@/pages/NewsImpact';
import NewsSentimentPage from '@/pages/NewsSentiment';
import Predictions from '@/pages/Predictions';
import Portfolio from '@/pages/Portfolio';
import Cryptocurrency from '@/pages/Cryptocurrency';
import Regulatory from '@/pages/Regulatory';
import Visualizations from '@/pages/Visualizations';
import FinancialPlanning from '@/pages/FinancialPlanning';
import Discussions from '@/pages/Discussions';
import TestPage from '@/pages/TestPage';
import SimpleIndex from '@/pages/SimpleIndex';
import Calendar from '@/pages/Calendar';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';

import './App.css';
// Import our accessibility styles
import '@/lib/accessibility.css';

// Create a client
const queryClient = new QueryClient();

// Add error boundary
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
          <div className="w-full max-w-md p-8 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Something went wrong</h1>
            <p className="text-gray-700 dark:text-gray-300">
              The application encountered an error. Here are the details:
            </p>
            <div className="p-4 mt-4 overflow-auto bg-gray-100 dark:bg-gray-900 rounded-md">
              <pre className="text-sm text-gray-800 dark:text-gray-200">
                {this.state.error?.toString() || "Unknown error"}
              </pre>
            </div>
            <button
              className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <TooltipProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/simple" element={<SimpleIndex />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/sector-analysis" element={<SectorAnalysis />} />
                <Route path="/stock-sentiment" element={<StockSentiment />} />
                <Route path="/news-impact" element={<NewsImpact />} />
                <Route path="/news-sentiment" element={<NewsSentimentPage />} />
                <Route path="/predictions" element={<Predictions />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/cryptocurrency" element={<Cryptocurrency />} />
                <Route path="/regulatory" element={<Regulatory />} />
                <Route path="/visualizations" element={<Visualizations />} />
                <Route path="/financial-planning" element={<FinancialPlanning />} />
                <Route path="/discussions" element={<Discussions />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <AccessibilityPanel />
            </BrowserRouter>
          </ErrorBoundary>
          <Toaster />
        </TooltipProvider>
      </AccessibilityProvider>
    </QueryClientProvider>
  );
}

export default App;
