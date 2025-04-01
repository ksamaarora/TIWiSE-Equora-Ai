import React, { useEffect, useState } from 'react';
import { sentimentService, SentimentData } from '@/services/sentimentService';
import { AlertCircle, Bell, Menu, X, Accessibility, Briefcase, Bitcoin, FileText, BarChart, DollarSign, MessagesSquare, CalendarClock, MailPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAccessibility } from '@/lib/accessibility';
import NewsletterDialog from './NewsletterDialog';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [data, setData] = useState<SentimentData | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNewsletterDialog, setShowNewsletterDialog] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, speakText } = useAccessibility();
  
  useEffect(() => {
    // Subscribe to sentiment data updates
    const unsubscribe = sentimentService.subscribe(newData => {
      setData(newData);
    });
    
    // Start real-time updates
    const stopUpdates = sentimentService.startRealTimeUpdates();
    
    // Clean up on component unmount
    return () => {
      unsubscribe();
      stopUpdates();
    };
  }, []);

  // Get sentiment color class for header
  const getSentimentHeaderClass = () => {
    if (!data) return 'bg-gradient-to-r from-blue-600/90 to-blue-500/90';
    
    if (data.overallSentiment > 0.2) {
      return 'bg-gradient-to-r from-green-600/90 to-green-500/90';
    }
    
    if (data.overallSentiment < -0.2) {
      return 'bg-gradient-to-r from-red-600/90 to-red-500/90';
    }
    
    return 'bg-gradient-to-r from-blue-600/90 to-blue-500/90';
  };

  // Navigation items with their routes
  const navItems = [
    { name: 'Market Overview', path: '/' },
    { name: 'OHLC View', path: '/sector-analysis' },
    { name: 'Stock Sentiment', path: '/stock-sentiment' },
    { name: 'News Impact', path: '/news-impact' },
    { name: 'Portfolio', path: '/portfolio', icon: <Briefcase size={16} /> },
    { name: 'Cryptocurrency', path: '/cryptocurrency', icon: <Bitcoin size={16} /> },
    { name: 'Regulatory', path: '/regulatory', icon: <FileText size={16} /> },
    { name: 'Visualizations', path: '/visualizations', icon: <BarChart size={16} /> },
    { name: 'Financial Planning', path: '/financial-planning', icon: <DollarSign size={16} /> },
    { name: 'Discussions', path: '/discussions', icon: <MessagesSquare size={16} /> },
    { name: 'Calendar', path: '/calendar', icon: <CalendarClock size={16} /> },
    { name: 'Predictions', path: '/predictions' },
  ];

  // Handle navigation item click
  const handleNavClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMenuOpen(false);
    }
  };
  
  // Handle text-to-speech for navigation items
  const handleSpeakNavItem = (navName: string) => {
    speakText(`Navigating to ${navName}`);
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className={cn(
        "w-full py-4 px-4 md:px-6 text-white backdrop-blur-md z-10 transition-all duration-500",
        getSentimentHeaderClass()
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
            <h1 className="text-xl font-medium">Equora.AI</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {data && (
              <div className="hidden md:flex items-center space-x-2 mr-4">
                <span>Market:</span>
                <span className="font-medium">{data.marketIndex}</span>
                <span className={cn(
                  "font-medium",
                  data.percentChange > 0 ? "text-green-300" : "text-red-300"
                )}
                aria-label={`${data.percentChange > 0 ? 'Up' : 'Down'} ${Math.abs(data.percentChange).toFixed(2)} percent`}
                >
                  {data.percentChange > 0 ? '↑' : '↓'} {Math.abs(data.percentChange).toFixed(2)}%
                </span>
              </div>
            )}
            
            {/* Accessibility Button */}
            <button 
              className="header-accessibility-button p-2 rounded-full hover:bg-white/10 transition-colors relative"
              onClick={() => document.dispatchEvent(new CustomEvent('toggle-accessibility'))}
              aria-label="Accessibility Options"
            >
              <Accessibility size={20} />
            </button>
            
            <button 
              className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex overflow-hidden" id="main-content">
        {/* Sidebar for navigation on larger screens */}
        <aside className={cn(
          "w-64 bg-white/50 dark:bg-black/50 backdrop-blur-md border-r border-border z-10 transition-all duration-300 ease-in-out",
          isMobile ? "fixed inset-y-0 left-0 transform" : "relative",
          isMobile && !menuOpen ? "-translate-x-full" : "translate-x-0"
        )}
        aria-label="Navigation sidebar"
        aria-hidden={isMobile && !menuOpen}
        >
          <div className="h-full flex flex-col p-4">
            <div className="py-6">
              <h2 className="text-lg font-medium text-primary">Dashboard</h2>
            </div>
            
            <nav className="space-y-1 flex-1" aria-label="Main navigation">
              {navItems.map((item) => (
                <button 
                  key={item.name}
                  onClick={() => {
                    handleNavClick(item.path);
                    handleSpeakNavItem(item.name);
                  }}
                  className={cn(
                    "w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
                    location.pathname === item.path 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-secondary"
                  )}
                  aria-current={location.pathname === item.path ? "page" : undefined}
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  <span>{item.name}</span>
                  {location.pathname === item.path && (
                    <span className="sr-only">(current page)</span>
                  )}
                </button>
              ))}
            </nav>
            
            {/* Newsletter subscription */}
            <div className="mt-6 pt-6 border-t border-border">
              <button
                onClick={() => setShowNewsletterDialog(true)}
                className="w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md transition-colors hover:bg-secondary bg-primary/5"
              >
                <span className="flex-shrink-0"><MailPlus size={16} /></span>
                <span>Subscribe to Newsletter</span>
              </button>
            </div>
          </div>
        </aside>
        
        {/* Main dashboard content with improved background */}
        <div className={cn(
          "flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-br",
          theme === 'dark' 
            ? "from-gray-900 to-blue-950" 
            : "from-blue-50 to-indigo-50"
        )}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
      
      {/* Backdrop for mobile menu */}
      {isMobile && menuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-0"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Newsletter Dialog */}
      <NewsletterDialog 
        open={showNewsletterDialog} 
        onOpenChange={setShowNewsletterDialog} 
      />
    </div>
  );
};

export default DashboardLayout;
