import 'package:flutter/material.dart';

class StockCard extends StatelessWidget {
  final dynamic stock;

  const StockCard({Key? key, required this.stock}) : super(key: key);

  Color _getPerformanceColor(bool isPositive) {
    return isPositive 
      ? Color(0xFF2E7D32)   // Deep Green for positive
      : Color(0xFFC62828);  // Deep Red for negative
  }

  String _formatMarketCap(num marketCap) {
    if (marketCap >= 1000000000000) {
      return '\$${(marketCap / 1000000000000).toStringAsFixed(1)}T';
    } else if (marketCap >= 1000000000) {
      return '\$${(marketCap / 1000000000).toStringAsFixed(1)}B';
    } else if (marketCap >= 1000000) {
      return '\$${(marketCap / 1000000).toStringAsFixed(1)}M';
    }
    return '\$${marketCap.toStringAsFixed(1)}';
  }

  @override
  Widget build(BuildContext context) {
    bool isPositiveChange = (stock['regularMarketChange'] ?? 0) >= 0;
    Color performanceColor = _getPerformanceColor(isPositiveChange);

    return Container(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 12,
            offset: Offset(0, 6),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Container(
          decoration: BoxDecoration(
            border: Border(
              left: BorderSide(
                color: performanceColor,
                width: 6,
              ),
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Stock Symbol and Company Name
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            stock['symbol'] ?? 'N/A',
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w800,
                              // color: Colors.black87,
                              color: Theme.of(context).canvasColor,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            stock['shortName'] ?? 'Company Name',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 14,
                              // color: Theme.of(context).dividerColor,
                              color: Colors.grey,
                              // color: Colors.deepPurple[100]
                            ),
                          ),
                        ],
                      ),
                    ),
                    SizedBox(width: 16),
                    // Price and Change
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          '\$${stock['regularMarketPrice']?.toStringAsFixed(2) ?? 'N/A'}',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w800,
                            color: performanceColor,
                          ),
                        ),
                        SizedBox(height: 4),
                        Row(
                          children: [
                            Icon(
                              isPositiveChange 
                                ? Icons.trending_up 
                                : Icons.trending_down,
                              color: performanceColor,
                              size: 18,
                            ),
                            SizedBox(width: 4),
                            Text(
                              '${isPositiveChange ? '+' : ''}${stock['regularMarketChange']?.toStringAsFixed(2) ?? 'N/A'} (${stock['regularMarketChangePercent']?.toStringAsFixed(2) ?? 'N/A'}%)',
                              style: TextStyle(
                                fontSize: 14,
                                color: performanceColor,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),

                // Divider
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  child: Divider(
                    color: Colors.grey[300],
                    height: 1,
                  ),
                ),

                // Key Metrics
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _buildMetricColumn(
                      context: context,
                      icon: Icons.account_balance,
                      label: 'Market Cap',
                      value: _formatMarketCap(stock['marketCap'] ?? 0),
                    ),
                    _buildMetricColumn(
                      context: context,
                      icon: Icons.bar_chart,
                      label: 'Volume',
                      value: '${(stock['regularMarketVolume'] / 1000000).toStringAsFixed(1)}M',
                    ),
                    _buildMetricColumn(
                      context: context,
                      icon: Icons.calendar_month,
                      label: '52-Week Range',
                      value: '${stock['fiftyTwoWeekLow']?.toStringAsFixed(1)} - ${stock['fiftyTwoWeekHigh']?.toStringAsFixed(1)}',
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMetricColumn({
    required BuildContext context,
    required IconData icon, 
    required String label, 
    required String value
  }) {
    return Column(
      children: [
        Icon(
          icon, 
          color: Colors.grey[600], 
          size: 20
        ),
        SizedBox(height: 6),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
        SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: Theme.of(context).canvasColor,
            // color: Colors.black87,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ],
    );
  }
}