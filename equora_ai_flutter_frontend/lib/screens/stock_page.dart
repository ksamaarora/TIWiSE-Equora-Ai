import 'package:equora_ai_flutter_frontend/widgets/error_view.dart';
import 'package:equora_ai_flutter_frontend/widgets/stock_data_view.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:fl_chart/fl_chart.dart';

class StockHomePage extends StatefulWidget {
  const StockHomePage({Key? key}) : super(key: key);

  @override
  State<StockHomePage> createState() => _StockHomePageState();
}

class _StockHomePageState extends State<StockHomePage> {
  bool isLoading = false;
  Map<String, dynamic>? stockData;
  String errorMessage = '';

  // For chart data
  List<FlSpot> chartData = [];
  double minY = 0;
  double maxY = 0;
  List<String> dates = [];

  @override
  void initState() {
    super.initState();
    fetchStockData();
  }

  Future<void> fetchStockData() async {
    setState(() {
      isLoading = true;
      errorMessage = '';
    });

    try {
      // Change the URL to match your backend endpoint
      final response = await http
          .get(Uri.parse('http://192.168.29.227:3000/api/stocks/daily'));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          stockData = data;
          processChartData();
        });
      } else {
        setState(() {
          errorMessage = 'Failed to load data: ${response.statusCode}';
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Error connecting to the server: $e';
      });
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  void processChartData() {
    if (stockData == null || !stockData!.containsKey('Time Series (Daily)')) {
      print("No time series data found");
      return;
    }

    final timeSeriesData =
        stockData!['Time Series (Daily)'] as Map<String, dynamic>;
    if (timeSeriesData.isEmpty) {
      print("Time series data is empty");
      return;
    }

    // Clear previous data
    chartData = [];
    dates = [];

    // Get all dates and sort them in ascending order (oldest to newest)
    final List<String> sortedDates = timeSeriesData.keys.toList()
      ..sort((a, b) => a.compareTo(b));

    // Take last 30 days or all if less than 30
    final int dataPoints = sortedDates.length > 30 ? 30 : sortedDates.length;
    final List<String> recentDates = sortedDates.length > 30
        ? sortedDates.sublist(sortedDates.length - dataPoints)
        : sortedDates;

    dates = recentDates;

    // Initialize min/max values
    double? tempMinY;
    double? tempMaxY;

    // Process each date to create chart points
    for (int i = 0; i < recentDates.length; i++) {
      final String date = recentDates[i];
      final dailyData = timeSeriesData[date];

      if (dailyData != null && dailyData.containsKey('4. close')) {
        try {
          final double closePrice = double.parse(dailyData['4. close']);

          // Update min/max values
          if (tempMinY == null || closePrice < tempMinY) {
            tempMinY = closePrice;
          }
          if (tempMaxY == null || closePrice > tempMaxY) {
            tempMaxY = closePrice;
          }

          // Add point to chart data
          chartData.add(FlSpot(i.toDouble(), closePrice));
          print("Added point for $date: x=${i.toDouble()}, y=$closePrice");
        } catch (e) {
          print("Error parsing close price for $date: $e");
        }
      } else {
        print("Missing close price data for $date");
      }
    }

    // Ensure we have chart data
    if (chartData.isEmpty) {
      print("Failed to generate any chart data points");
      return;
    }

    // Add padding to min/max Y for better visualization
    minY = (tempMinY ?? 0) * 0.95;
    maxY = (tempMaxY ?? 0) * 1.05;

    print(
        "Chart data processed: ${chartData.length} points, Y range: $minY to $maxY");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Stock Tracker'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: fetchStockData,
          ),
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : errorMessage.isNotEmpty
              ? ErrorView(errorMessage: errorMessage, onRetry: fetchStockData)
              : stockData == null
                  ? const Center(child: Text('No data available'))
                  : StockDataView(
                      stockData: stockData!,
                      chartData: chartData,
                      minY: minY,
                      maxY: maxY,
                      dates: dates,
                    ),
    );
  }
}
