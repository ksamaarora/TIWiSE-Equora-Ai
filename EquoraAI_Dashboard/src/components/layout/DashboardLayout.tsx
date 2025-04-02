import React, { useEffect, useState } from 'react';
import { sentimentService, SentimentData } from '@/services/sentimentService';
import { 
  AlertCircle, 
  Bell, 
  Menu, 
  X, 
  Accessibility, 
  Briefcase, 
  Bitcoin, 
  FileText, 
  BarChart, 
  DollarSign, 
  MessagesSquare, 
  CalendarClock, 
  MailPlus,
  Home,
  LineChart,
  TrendingUp,
  Newspaper,
  Landmark,
  Lightbulb,
  Settings,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAccessibility } from '@/lib/accessibility';
import NewsletterDialog from './NewsletterDialog';
import LiveDataTicker from './LiveDataTicker';

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
  const { theme, speakText, navigationVoice } = useAccessibility();
  
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

  // Organized navigation items with sections
  const navSections = [
    {
      title: "Overview",
      items: [
        { name: 'Market Overview', path: '/', icon: <Home size={16} /> },
        { name: 'OHLC View', path: '/sector-analysis', icon: <LineChart size={16} /> },
        { name: 'Stock Sentiment', path: '/stock-sentiment', icon: <TrendingUp size={16} /> },
        { name: 'News Impact', path: '/news-impact', icon: <Newspaper size={16} /> },
      ]
    },
    {
      title: "Markets",
      items: [
        { name: 'Portfolio', path: '/portfolio', icon: <Briefcase size={16} /> },
        { name: 'Cryptocurrency', path: '/cryptocurrency', icon: <Bitcoin size={16} /> },
        { name: 'Regulatory', path: '/regulatory', icon: <Landmark size={16} /> },
        { name: 'Financial Planning', path: '/financial-planning', icon: <DollarSign size={16} /> },
      ]
    },
    {
      title: "Insights",
      items: [
        { name: 'Visualizations', path: '/visualizations', icon: <BarChart size={16} /> },
        { name: 'Predictions', path: '/predictions', icon: <Lightbulb size={16} /> },
        { name: 'Calendar', path: '/calendar', icon: <CalendarClock size={16} /> },
        { name: 'Discussions', path: '/discussions', icon: <MessagesSquare size={16} /> },
      ]
    },
    {
      title: "Account",
      items: [
        { name: 'Profile', path: '/profile', icon: <User size={16} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={16} /> },
      ]
    }
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
    if (navigationVoice) {
      speakText(`Navigating to ${navName}`);
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className={cn(
        "w-full py-4 px-4 md:px-6 text-white backdrop-blur-md z-10 transition-all duration-500 sticky top-0",
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
              <div className="hidden md:flex items-center space-x-2 mr-4 bg-black/10 px-3 py-1 rounded-full">
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
      
      {/* Live Data Ticker */}
      <LiveDataTicker />
      
      {/* Main content */}
      <main className="flex-1 flex overflow-hidden" id="main-content">
        {/* Sidebar for navigation on larger screens */}
        <aside className={cn(
          "w-64 bg-white/80 dark:bg-gray-900/90 backdrop-blur-md border-r border-border z-10 transition-all duration-300 ease-in-out overflow-y-auto",
          isMobile ? "fixed inset-y-0 left-0 transform" : "relative",
          isMobile && !menuOpen ? "-translate-x-full" : "translate-x-0"
        )}
        aria-label="Navigation sidebar"
        aria-hidden={isMobile && !menuOpen}
        >
          <div className="h-full flex flex-col p-4">
            <div className="py-4">
              <h2 className="text-lg font-medium text-primary">Dashboard</h2>
            </div>
            
            <nav className="flex-1" aria-label="Main navigation">
              {navSections.map((section, idx) => (
                <div key={section.title} className={idx > 0 ? "mt-6" : ""}>
                  <h3 className="text-xs uppercase font-semibold text-muted-foreground mb-2 px-3">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <button 
                        key={item.name}
                        onClick={() => {
                          handleNavClick(item.path);
                          handleSpeakNavItem(item.name);
                        }}
                        className={cn(
                          "w-full text-left flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                          location.pathname === item.path 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "hover:bg-secondary text-foreground/80 hover:text-foreground"
                        )}
                        aria-current={location.pathname === item.path ? "page" : undefined}
                      >
                        <span className="flex-shrink-0 text-foreground/70">{item.icon}</span>
                        <span>{item.name}</span>
                        {location.pathname === item.path && (
                          <span className="sr-only">(current page)</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
            
            {/* Newsletter subscription */}
            <div className="mt-6 pt-6 border-t border-border">
              <button
                onClick={() => setShowNewsletterDialog(true)}
                className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-md transition-colors hover:bg-secondary bg-primary/5"
              >
                <span className="flex-shrink-0 text-primary/70"><MailPlus size={16} /></span>
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-0"
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
