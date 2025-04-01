import React, { useMemo, useState } from 'react';
import { useStockVisualization } from '@/services/visualizationService';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Import recharts components
import {
  Treemap,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

// Type definitions
type GroupingMode = 'sector' | 'none';
type SortingMode = 'marketCap' | 'change';

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-background p-3 border rounded-md shadow-md">
        <p className="font-medium mb-1">{data.name} ({data.ticker})</p>
        <div className="grid grid-cols-2 gap-1 text-sm">
          <div className="font-medium">Market Cap:</div>
          <div>${data.marketCap.toFixed(1)}B</div>
          
          <div className="font-medium">Sector:</div>
          <div>{data.sector}</div>
          
          <div className="font-medium">Change:</div>
          <div className={data.change >= 0 ? 'text-green-600' : 'text-red-600'}>
            {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

// Main component
const MarketCapTreemap: React.FC = () => {
  const { marketCapData } = useStockVisualization();
  const [grouping, setGrouping] = useState<GroupingMode>('sector');
  const [colorBy, setColorBy] = useState<'sector' | 'performance'>('performance');
  const [sortBy, setSortBy] = useState<SortingMode>('marketCap');
  
  // Prepare data for treemap
  const treemapData = useMemo(() => {
    if (grouping === 'none') {
      // No grouping, just return sorted data
      return {
        name: 'Market Cap',
        children: [...marketCapData]
          .sort((a, b) => (sortBy === 'marketCap' ? b.marketCap - a.marketCap : b.change - a.change))
      };
    } else {
      // Group by sector
      const sectors = {} as Record<string, any[]>;
      
      // Group stocks by sector
      marketCapData.forEach(stock => {
        if (!sectors[stock.sector]) {
          sectors[stock.sector] = [];
        }
        sectors[stock.sector].push(stock);
      });
      
      // Create hierarchical structure
      return {
        name: 'Market Cap',
        children: Object.entries(sectors).map(([sector, stocks]) => ({
          name: sector,
          children: [...stocks]
            .sort((a, b) => (sortBy === 'marketCap' ? b.marketCap - a.marketCap : b.change - a.change))
        }))
      };
    }
  }, [marketCapData, grouping, sortBy]);
  
  // Get color based on performance or sector
  const getStockColor = (stock: any) => {
    if (colorBy === 'performance') {
      // Color by performance
      if (stock.change > 5) return '#15803d'; // green-700
      if (stock.change > 3) return '#16a34a'; // green-600
      if (stock.change > 1) return '#22c55e'; // green-500
      if (stock.change > 0) return '#4ade80'; // green-400
      if (stock.change > -1) return '#f87171'; // red-400
      if (stock.change > -3) return '#ef4444'; // red-500
      if (stock.change > -5) return '#dc2626'; // red-600
      return '#b91c1c'; // red-700
    } else {
      // Color by sector
      const sectorColors: Record<string, string> = {
        'Technology': '#3b82f6', // blue-500
        'Healthcare': '#10b981', // emerald-500
        'Financial Services': '#a855f7', // purple-500
        'Communication Services': '#ec4899', // pink-500
        'Consumer Cyclical': '#f97316', // orange-500
        'Industrials': '#6366f1', // indigo-500
        'Consumer Defensive': '#14b8a6', // teal-500
        'Energy': '#f59e0b', // amber-500
        'Utilities': '#06b6d4', // cyan-500
        'Real Estate': '#8b5cf6', // violet-500
        'Basic Materials': '#84cc16', // lime-500
        'Automotive': '#d946ef' // fuchsia-500
      };
      
      return sectorColors[stock.sector] || '#94a3b8'; // slate-400 as fallback
    }
  };
  
  // Format market cap value
  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000) {
      return `$${(marketCap / 1000).toFixed(2)}T`;
    }
    return `$${marketCap.toFixed(2)}B`;
  };
  
  // Custom content for treemap
  const CustomizedContent = (props: any) => {
    const { root, depth, x, y, width, height, index, name, ticker, marketCap, sector, change } = props;
    
    // Only render if we have enough space
    if (width < 30 || height < 30) {
      return null;
    }
    
    // For sector groups
    if (!ticker) {
      return (
        <g>
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            style={{
              fill: colorBy === 'sector' ? getStockColor({ sector }) : '#6b7280',
              stroke: '#fff',
              strokeWidth: 2,
              opacity: 0.8
            }}
          />
          {width > 50 && height > 20 && (
            <text
              x={x + width / 2}
              y={y + height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-medium fill-white"
            >
              {name}
            </text>
          )}
        </g>
      );
    }
    
    // For individual stocks
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: getStockColor(props),
            stroke: '#fff',
            strokeWidth: 1,
            opacity: 0.9
          }}
        />
        {width > 40 && height > 40 ? (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 7}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-medium fill-white"
            >
              {ticker}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 7}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] fill-white"
            >
              {formatMarketCap(marketCap)}
            </text>
          </>
        ) : width > 30 && height > 30 ? (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-medium fill-white"
          >
            {ticker}
          </text>
        ) : null}
      </g>
    );
  };
  
  return (
    <Card>
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold">Market Capitalization Treemap</h3>
        
        <div className="flex flex-wrap gap-2">
          <Select
            value={grouping}
            onValueChange={(value) => setGrouping(value as GroupingMode)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Grouping" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sector">By Sector</SelectItem>
              <SelectItem value="none">No Grouping</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortingMode)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="marketCap">Market Cap</SelectItem>
              <SelectItem value="change">Performance</SelectItem>
            </SelectContent>
          </Select>
          
          <Tabs value={colorBy} onValueChange={(value) => setColorBy(value as 'sector' | 'performance')}>
            <TabsList>
              <TabsTrigger value="performance">Color by Performance</TabsTrigger>
              <TabsTrigger value="sector">Color by Sector</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <CardContent>
        <div className="h-[500px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treemapData}
              dataKey="marketCap"
              nameKey="name"
              aspectRatio={4/3}
              stroke="#fff"
              animationDuration={500}
              content={<CustomizedContent />}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 justify-center">
          {colorBy === 'performance' ? (
            <>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-700 mr-1"></div>
                <span className="text-xs">&gt; +5%</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-600 mr-1"></div>
                <span className="text-xs">+3% to +5%</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 mr-1"></div>
                <span className="text-xs">+1% to +3%</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-400 mr-1"></div>
                <span className="text-xs">0% to +1%</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-400 mr-1"></div>
                <span className="text-xs">-1% to 0%</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 mr-1"></div>
                <span className="text-xs">-3% to -1%</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-600 mr-1"></div>
                <span className="text-xs">-5% to -3%</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-700 mr-1"></div>
                <span className="text-xs">&lt; -5%</span>
              </div>
            </>
          ) : (
            // Sector colors
            [...new Set(marketCapData.map(item => item.sector))].sort().map(sector => (
              <div key={sector} className="flex items-center">
                <div 
                  className="w-4 h-4 mr-1" 
                  style={{ backgroundColor: getStockColor({ sector }) }}
                ></div>
                <span className="text-xs">{sector}</span>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4 text-xs text-center text-muted-foreground">
          <p>Rectangle size represents market capitalization (in billions USD)</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketCapTreemap; 