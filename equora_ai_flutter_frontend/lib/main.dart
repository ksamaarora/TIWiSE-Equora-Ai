import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Stock Tracker',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        brightness: Brightness.light,
        canvasColor: Colors.black,
        dividerColor: Colors.grey,
        // cardColor: const Color.fromARGB(255, 0, 2, 105),
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        primarySwatch: Colors.blue,
        cardColor: const Color.fromARGB(255, 39, 38, 38),
        canvasColor: Colors.white,
        dividerColor: Colors.grey,
        // textTheme: TextTheme(),
        // cardColor: const Color.fromARGB(255, 131, 216, 255),
        useMaterial3: true,
      ),
      themeMode: ThemeMode.system,
      home: const HomePage(),
      debugShowCheckedModeBanner: false,
    );
  }
}
