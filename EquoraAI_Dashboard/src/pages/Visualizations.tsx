import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStockVisualization } from '@/services/visualizationService';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/lib/accessibility';

// Import chart components
import PriceChart from '@/components/visualizations/PriceChart';
import CandlestickChart from '@/components/visualizations/CandlestickChart';
import SectorHeatmap from '@/components/visualizations/SectorHeatmap';
import CorrelationMatrix from '@/components/visualizations/CorrelationMatrix';
import MarketCapTreemap from '@/components/visualizations/MarketCapTreemap';
import StockComparison from '@/components/visualizations/StockComparison';

// Icons
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  RefreshCw, 
  Calendar, 
  Grid, 
  Layers,
  Settings,
  Search
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from '@/components/ui/scroll-area';

const Visualizations: React.FC = () => {
  const { 
    selectedStock,
    setSelectedStock,
    timeRange,
    setTimeRange,
    comparisonStock,
    setComparisonStock,
    stockList,
  } = useStockVisualization();

  const { speakText } = useAccessibility();
  const [activeTab, setActiveTab] = useState('price');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle stock selection
  const handleStockSelect = (ticker: string) => {
    setSelectedStock(ticker);
    speakText(`Selected ${ticker}`);
  };

  // Handle time range change
  const handleTimeRangeChange = (range: string) => {
    const days = parseInt(range);
    setTimeRange(days);
    speakText(`Changed time range to ${days} days`);
  };

  // Handle comparison stock selection
  const handleComparisonSelect = (ticker: string | null) => {
    setComparisonStock(ticker);
    if (ticker) {
      speakText(`Comparing with ${ticker}`);
    } else {
      speakText('Removed comparison');
    }
  };

  // Filter stocks based on search query
  const filteredStocks = stockList.filter(stock => 
    stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) || 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Interactive Stock Visualizations</h1>
            <p className="text-muted-foreground">
              Advanced charts, heatmaps, and performance metrics
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={timeRange.toString()}
              onValueChange={handleTimeRangeChange}
            >
              <SelectTrigger className="w-[130px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
                <SelectItem value="180">180 Days</SelectItem>
                <SelectItem value="365">1 Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={() => window.location.reload()}>
              <RefreshCw size={16} />
            </Button>
          </div>
        </div>

        {/* Stock Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stock Selector */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">
                Select Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ticker or company name..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center">
                      {selectedStock}
                      <TrendingUp size={16} className="ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <ScrollArea className="h-80">
                      {filteredStocks.map(stock => (
                        <DropdownMenuItem
                          key={stock.ticker}
                          onClick={() => handleStockSelect(stock.ticker)}
                          className={cn(
                            "flex justify-between",
                            selectedStock === stock.ticker && "bg-primary/10"
                          )}
                        >
                          <span className="font-medium">{stock.ticker}</span>
                          <span className="text-xs text-muted-foreground truncate ml-2">
                            {stock.name}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {comparisonStock ? (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 text-orange-600"
                    onClick={() => handleComparisonSelect(null)}
                  >
                    <span>{comparisonStock}</span>
                    <span className="text-xs">✕</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Pick a random stock that's not the currently selected one
                      const availableStocks = stockList.filter(s => s.ticker !== selectedStock);
                      const randomStock = availableStocks[Math.floor(Math.random() * availableStocks.length)];
                      handleComparisonSelect(randomStock.ticker);
                    }}
                  >
                    + Compare
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Key Metrics */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">
                {comparisonStock ? 'Comparing' : 'Selected Stock'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="text-2xl font-bold flex items-center">
                  {selectedStock}
                  {comparisonStock && (
                    <span className="text-sm ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full">
                      vs {comparisonStock}
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Last {timeRange} days of data
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visualization Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
            <TabsTrigger value="price" className="flex items-center justify-center">
              <LineChart size={16} className="mr-2" />
              Price Chart
            </TabsTrigger>
            <TabsTrigger value="candlestick" className="flex items-center justify-center">
              <BarChart size={16} className="mr-2" />
              Candlestick
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="flex items-center justify-center">
              <Grid size={16} className="mr-2" />
              Sector Heatmap
            </TabsTrigger>
            <TabsTrigger value="correlation" className="flex items-center justify-center">
              <Layers size={16} className="mr-2" />
              Correlation
            </TabsTrigger>
            <TabsTrigger value="treemap" className="flex items-center justify-center">
              <PieChart size={16} className="mr-2" />
              Market Cap
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="price">
            <PriceChart />
          </TabsContent>
          
          <TabsContent value="candlestick">
            <CandlestickChart />
          </TabsContent>
          
          <TabsContent value="heatmap">
            <SectorHeatmap />
          </TabsContent>
          
          <TabsContent value="correlation">
            <CorrelationMatrix />
          </TabsContent>
          
          <TabsContent value="treemap">
            <MarketCapTreemap />
          </TabsContent>
        </Tabs>

        {/* Stock Comparison */}
        {comparisonStock && (
          <Card>
            <CardHeader>
              <CardTitle>Stock Comparison</CardTitle>
              <CardDescription>
                Comparing key metrics between {selectedStock} and {comparisonStock}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StockComparison />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Visualizations; 