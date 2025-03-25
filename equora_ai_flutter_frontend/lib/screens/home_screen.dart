import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shimmer/shimmer.dart';
import 'package:equora_ai_flutter_frontend/screens/stock_page.dart';

import '../widgets/stock_sentiment_card.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final TextEditingController _searchController = TextEditingController();
  List<dynamic> _stockQuotes = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchStockQuotes();
  }

  Future<void> _fetchStockQuotes() async {
    try {
      final response = await http.get(
        Uri.parse(
            'http://192.168.29.227:3000/api/yahoo/quotes?tickers=AAPL,MSFT,GOOGL,AMZN,TSLA,IBM'),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        // Access the 'body' list inside 'data'
        if (data['data'] != null && data['data']['body'] is List) {
          setState(() {
            _stockQuotes = data['data']['body']; // Correctly accessing the list
            _isLoading = false;
          });
        } else {
          setState(() {
            _stockQuotes = [];
            _isLoading = false;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('No stock quotes found')),
          );
        }
      } else {
        setState(() {
          _isLoading = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load stock quotes')),
        );
      }
    } catch (e) {
      print(e);
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${e.toString()}')),
      );
    }
  }

  Widget _buildStockCard(dynamic stock) {
  return StockCard(stock: stock);
}

  Widget _buildLoadingCard() {
    return Card(
      elevation: 4,
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15),
      ),
      child: Shimmer.fromColors(
        baseColor: Colors.grey[300]!,
        highlightColor: Colors.grey[800]!,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 100,
                    height: 20,
                    color: Colors.white,
                  ),
                  SizedBox(height: 8),
                  Container(
                    width: 150,
                    height: 15,
                    color: Colors.white,
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Container(
                    width: 80,
                    height: 20,
                    color: Colors.white,
                  ),
                  SizedBox(height: 8),
                  Container(
                    width: 100,
                    height: 15,
                    color: Colors.white,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Equora.AI'),
        centerTitle: true,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search stock symbol (e.g. AAPL, GOOGL)',
                prefixIcon: const Icon(Icons.stacked_line_chart_rounded),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.search),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => StockHomePage(),
                      ),
                    );
                  },
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
    
          // Stock Quotes Section
          Expanded(
            child: _isLoading
                ? ListView.builder(
                    itemCount: 5,
                    itemBuilder: (context, index) => _buildLoadingCard(),
                  )
                : RefreshIndicator(
                    onRefresh: _fetchStockQuotes,
                    child: ListView.builder(
                      itemCount: _stockQuotes.length,
                      itemBuilder: (context, index) {
                        return _buildStockCard(_stockQuotes[index]);
                      },
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}
