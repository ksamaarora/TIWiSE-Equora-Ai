import React, { useState } from 'react';
import { useStockVisualization } from '@/services/visualizationService';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

// Advanced chart components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Line,
  Brush
} from 'recharts';

// Custom candlestick component
const CustomCandlestick = (props: any) => {
  const { x, y, width, height, low, high, open, close } = props;
  
  // Determine color based on whether the stock went up or down
  const color = open > close ? '#ef4444' : '#22c55e';
  const halfWidth = width / 2;
  
  return (
    <g>
      {/* Wick line (high to low) */}
      <line
        x1={x + halfWidth}
        y1={y + (high * height)}
        x2={x + halfWidth}
        y2={y + (low * height)}
        stroke={color}
        strokeWidth={1}
      />
      
      {/* Body rectangle (open to close) */}
      <rect
        x={x}
        y={y + (Math.min(open, close) * height)}
        width={width}
        height={Math.abs(open - close) * height}
        fill={color}
        stroke={color}
      />
    </g>
  );
};

// Custom tooltip component
const CandlestickTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background p-3 border rounded-md shadow-md">
        <p className="font-medium mb-1">{`Date: ${new Date(data.date).toLocaleDateString()}`}</p>
        <div className="grid grid-cols-2 gap-1 text-sm">
          <div className="font-medium text-green-600">Open:</div>
          <div>${data.open.toFixed(2)}</div>
          
          <div className="font-medium text-blue-600">High:</div>
          <div>${data.high.toFixed(2)}</div>
          
          <div className="font-medium text-red-600">Low:</div>
          <div>${data.low.toFixed(2)}</div>
          
          <div className="font-medium text-purple-600">Close:</div>
          <div>${data.close.toFixed(2)}</div>
          
          <div className="font-medium">Volume:</div>
          <div>{(data.volume / 1000000).toFixed(2)}M</div>
        </div>
      </div>
    );
  }
  return null;
};

// Format volume with appropriate suffix
const formatVolume = (volume: number) => {
  if (volume >= 1000000000) {
    return `${(volume / 1000000000).toFixed(1)}B`;
  }
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  return volume.toString();
};

const CandlestickChart: React.FC = () => {
  const { selectedStock, candlestickData, timeRange } = useStockVisualization();
  const [showVolume, setShowVolume] = useState(true);
  
  // Prepare data for candlestick chart
  const chartData = candlestickData.map(item => {
    // Normalize values for canvas scale (0-1 range)
    const min = Math.min(item.open, item.close, item.low);
    const max = Math.max(item.open, item.close, item.high);
    const range = max - min || 1; // Avoid division by zero
    
    return {
      ...item,
      open: (item.open - min) / range,
      close: (item.close - min) / range,
      high: (item.high - min) / range,
      low: (item.low - min) / range,
      actualOpen: item.open,
      actualClose: item.close,
      actualHigh: item.high,
      actualLow: item.low
    };
  });
  
  // Calculate min and max prices for y-axis domain
  const actualPrices = candlestickData.flatMap(item => [item.high, item.low, item.open, item.close]);
  const minPrice = Math.min(...actualPrices) * 0.98;
  const maxPrice = Math.max(...actualPrices) * 1.02;
  
  // Calculate min and max volumes for volume y-axis domain
  const volumes = candlestickData.map(item => item.volume);
  const maxVolume = Math.max(...volumes) * 1.1;
  
  // Format date for x-axis
  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr);
    if (timeRange <= 7) {
      return format(date, 'EEE');
    } else if (timeRange <= 30) {
      return format(date, 'dd MMM');
    } else {
      return format(date, 'MMM yy');
    }
  };
  
  // Calculate simple moving averages
  const calculateSMA = (period: number) => {
    const prices = candlestickData.map(item => item.close);
    const result = [];
    
    for (let i = 0; i < prices.length; i++) {
      if (i < period - 1) {
        result.push(null); // Not enough data points yet
      } else {
        const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        result.push(sum / period);
      }
    }
    
    return candlestickData.map((item, index) => ({
      date: item.date,
      sma: result[index]
    }));
  };
  
  const sma20Data = calculateSMA(20);
  const sma50Data = calculateSMA(50);
  
  // Combine SMA data with candlestick data
  const combinedData = candlestickData.map((item, index) => ({
    ...item,
    sma20: sma20Data[index]?.sma,
    sma50: sma50Data[index]?.sma,
    // Color volume bars based on price change
    volumeColor: item.close >= item.open ? '#22c55e' : '#ef4444'
  }));
  
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold flex justify-between items-center">
          <span>
            {selectedStock} Candlestick Chart
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {timeRange} days
            </span>
          </span>
          <button 
            className="text-sm px-2 py-1 bg-secondary rounded-md"
            onClick={() => setShowVolume(!showVolume)}
          >
            {showVolume ? 'Hide Volume' : 'Show Volume'}
          </button>
        </h3>
        <div className="flex items-center gap-4 mt-2 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
            <span>SMA (20)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
            <span>SMA (50)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span>Bullish</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span>Bearish</span>
          </div>
        </div>
      </div>
      <CardContent className="p-0">
        <div className={`h-[500px] p-4 ${showVolume ? 'pb-2' : ''}`}>
          <ResponsiveContainer width="100%" height={showVolume ? '80%' : '100%'}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis} 
                minTickGap={30}
                tick={{ fontSize: 12 }} 
              />
              <YAxis 
                domain={[minPrice, maxPrice]} 
                tickFormatter={(value) => `$${value.toFixed(2)}`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CandlestickTooltip />} />
              <Legend />
              
              {/* Candlesticks */}
              {chartData.map((entry, index) => (
                <CustomCandlestick
                  key={`candle-${index}`}
                  x={index * (chartData.length / timeRange)}
                  width={0.8 * (chartData.length / timeRange)}
                  open={entry.open}
                  close={entry.close}
                  high={entry.high}
                  low={entry.low}
                />
              ))}
              
              {/* Moving Averages */}
              <Line 
                type="monotone" 
                dataKey="sma20" 
                name="SMA (20)" 
                stroke="#3b82f6" 
                dot={false} 
                connectNulls={true}
                isAnimationActive={false}
              />
              <Line 
                type="monotone" 
                dataKey="sma50" 
                name="SMA (50)" 
                stroke="#8b5cf6" 
                dot={false} 
                connectNulls={true}
                isAnimationActive={false}
              />
              
              <Brush 
                dataKey="date" 
                height={30} 
                stroke="#8884d8"
                tickFormatter={formatXAxis}
              />
            </ComposedChart>
          </ResponsiveContainer>
          
          {/* Volume Chart */}
          {showVolume && (
            <div style={{ height: '20%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={combinedData} barCategoryGap={1}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatXAxis} 
                    hide={true}
                  />
                  <YAxis 
                    domain={[0, maxVolume]} 
                    tickFormatter={formatVolume}
                    tick={{ fontSize: 10 }}
                    orientation="right"
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${formatVolume(value)}`, 'Volume']}
                    labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                  />
                  <Bar 
                    dataKey="volume" 
                    fill={(data) => data.volumeColor}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CandlestickChart; 