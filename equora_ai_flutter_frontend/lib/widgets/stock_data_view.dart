
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class StockDataView extends StatelessWidget {
  final Map<String, dynamic> stockData;
  final List<FlSpot> chartData;
  final double minY;
  final double maxY;
  final List<String> dates;

  const StockDataView({
    Key? key, 
    required this.stockData,
    required this.chartData,
    required this.minY,
    required this.maxY,
    required this.dates,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final metaData = stockData['Meta Data'] ?? {};
    final timeSeriesData = stockData['Time Series (Daily)'] as Map<String, dynamic>? ?? {};
    
    // Get the latest date
    final latestDate = timeSeriesData.keys.toList()..sort((a, b) => b.compareTo(a));
    final latestStockInfo = latestDate.isNotEmpty ? timeSeriesData[latestDate.first] as Map<String, dynamic>? : null;

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Stock Info Card
            Card(
              elevation: 4,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          metaData['2. Symbol'] ?? 'IBM',
                          style: Theme.of(context).textTheme.headlineMedium,
                        ),
                        latestStockInfo != null ? _buildPriceChangeIndicator(latestStockInfo, context) : Container(),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Last Updated: ${metaData['3. Last Refreshed'] ?? 'N/A'}',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
                    const SizedBox(height: 16),
                    latestStockInfo != null ? _buildLatestPriceInfo(latestStockInfo, context) : Container(),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Check if we have chart data before building the chart
            if (chartData.isNotEmpty) 
              _buildStockChart(context)
            else
              Center(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      const Icon(Icons.bar_chart, size: 48, color: Colors.grey),
                      const SizedBox(height: 16),
                      Text(
                        'No chart data available',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    ],
                  ),
                ),
              ),
            
            const SizedBox(height: 24),
            
            // Recent History
            Text(
              'Recent History',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            _buildHistoryList(timeSeriesData, context),
          ],
        ),
      ),
    );
  }

  Widget _buildPriceChangeIndicator(Map<String, dynamic> latestData, BuildContext context) {
    final close = double.parse(latestData['4. close']);
    final open = double.parse(latestData['1. open']);
    final change = close - open;
    final percentChange = (change / open) * 100;
    
    final isPositive = change >= 0;
    final color = isPositive ? Colors.green : Colors.red;
    final icon = isPositive ? Icons.arrow_upward : Icons.arrow_downward;
    
    return Row(
      children: [
        Icon(icon, color: color, size: 16),
        const SizedBox(width: 4),
        Text(
          '${change.toStringAsFixed(2)} (${percentChange.toStringAsFixed(2)}%)',
          style: TextStyle(
            color: color,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildLatestPriceInfo(Map<String, dynamic> latestData, BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _buildPriceItem(context, 'Open', latestData['1. open']),
        _buildPriceItem(context, 'High', latestData['2. high']),
        _buildPriceItem(context, 'Low', latestData['3. low']),
        _buildPriceItem(context, 'Close', latestData['4. close']),
      ],
    );
  }

  Widget _buildPriceItem(BuildContext context, String label, String? value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: Theme.of(context).textTheme.bodySmall,
        ),
        const SizedBox(height: 4),
        Text(
          value != null ? '\$${double.parse(value).toStringAsFixed(2)}' : 'N/A',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildStockChart(BuildContext context) {
    return Container(
      height: 300,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Price History (Last ${chartData.length} days)',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          const SizedBox(height: 16),
          Expanded(
            child: LineChart(
              LineChartData(
                gridData: FlGridData(
                  show: true,
                  drawHorizontalLine: true,
                  drawVerticalLine: true,
                  horizontalInterval: (maxY - minY) / 5,
                ),
                titlesData: FlTitlesData(
                  leftTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 40,
                      getTitlesWidget: (value, meta) {
                        return Text('\$${value.toStringAsFixed(0)}');
                      },
                    ),
                  ),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 30,
                      getTitlesWidget: (value, meta) {
                        // Show some labels, but not all to avoid crowding
                        final int index = value.toInt();
                        if (index >= 0 && index < dates.length && index % 5 == 0) {
                          try {
                            final date = DateTime.parse(dates[index]);
                            return Padding(
                              padding: const EdgeInsets.only(top: 8.0),
                              child: Text(
                                DateFormat('MM/dd').format(date),
                                style: const TextStyle(fontSize: 10),
                              ),
                            );
                          } catch (e) {
                            return const Text('');
                          }
                        }
                        return const Text('');
                      },
                    ),
                  ),
                  rightTitles: AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  topTitles: AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                ),
                borderData: FlBorderData(
                  show: true,
                  border: Border.all(color: const Color(0xff37434d), width: 1),
                ),
                minX: 0,
                maxX: chartData.isEmpty ? 0 : chartData.length - 1.0,
                minY: minY,
                maxY: maxY,
                lineBarsData: [
                  LineChartBarData(
                    spots: chartData,
                    isCurved: true,
                    color: Theme.of(context).primaryColor,
                    barWidth: 3,
                    isStrokeCapRound: true,
                    dotData: FlDotData(
                      show: true,
                      getDotPainter: (spot, percent, barData, index) {
                        return FlDotCirclePainter(
                          radius: 3,
                          color: Theme.of(context).primaryColor,
                          strokeWidth: 1,
                          strokeColor: Colors.white,
                        );
                      },
                    ),
                    belowBarData: BarAreaData(
                      show: true,
                      color: Theme.of(context).primaryColor.withOpacity(0.2),
                    ),
                  ),
                ],
                lineTouchData: LineTouchData(
                  touchTooltipData: LineTouchTooltipData(
                    // tooltipBgColor: Colors.blueAccent,
                    getTooltipItems: (List<LineBarSpot> touchedSpots) {
                      return touchedSpots.map((spot) {
                        final int index = spot.x.toInt();
                        String date = index >= 0 && index < dates.length ? dates[index] : '';
                        return LineTooltipItem(
                          '${date != '' ? DateFormat('MM/dd').format(DateTime.parse(date)) : 'N/A'}\n\$${spot.y.toStringAsFixed(2)}',
                          const TextStyle(color: Colors.white),
                        );
                      }).toList();
                    },
                  ),
                  handleBuiltInTouches: true,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHistoryList(Map<String, dynamic> timeSeriesData, BuildContext context) {
    final dateFormat = DateFormat('yyyy-MM-dd');
    final displayFormat = DateFormat('EEE, MMM d, yyyy');
    
    final dates = timeSeriesData.keys.toList()
      ..sort((a, b) => b.compareTo(a));
    
    // Take only last 10 days for the list
    final recentDates = dates.take(10).toList();

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: recentDates.length,
      itemBuilder: (context, index) {
        final date = recentDates[index];
        final data = timeSeriesData[date];
        final parsedDate = dateFormat.parse(date);
        final displayDate = displayFormat.format(parsedDate);
        
        final closePrice = double.parse(data['4. close']);
        final openPrice = double.parse(data['1. open']);
        final change = closePrice - openPrice;
        final isPositive = change >= 0;
        
        return Card(
          margin: const EdgeInsets.symmetric(vertical: 4),
          child: ListTile(
            title: Text(displayDate),
            subtitle: Text(
              'Open: \$${openPrice.toStringAsFixed(2)} • Close: \$${closePrice.toStringAsFixed(2)}',
            ),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  isPositive ? Icons.arrow_upward : Icons.arrow_downward,
                  color: isPositive ? Colors.green : Colors.red,
                  size: 16,
                ),
                const SizedBox(width: 4),
                Text(
                  '${change.toStringAsFixed(2)}',
                  style: TextStyle(
                    color: isPositive ? Colors.green : Colors.red,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}