import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:permission_handler/permission_handler.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Set dark forest system UI overlay
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Color(0xFF061208),
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color(0xFF061208),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  // Request permissions for AR Camera and Copilot voice
  if (!kIsWeb && (Platform.isAndroid || Platform.isIOS)) {
    await [
      Permission.camera,
      Permission.microphone,
      Permission.storage,
    ].request();
  }

  runApp(const KisanSetuApp());
}

class KisanSetuApp extends StatelessWidget {
  const KisanSetuApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'KisanSetu AR',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF061208),
        primaryColor: const Color(0xFF7ED957),
      ),
      home: const KisanSetuWebViewScreen(),
    );
  }
}

class KisanSetuWebViewScreen extends StatefulWidget {
  const KisanSetuWebViewScreen({super.key});

  @override
  State<KisanSetuWebViewScreen> createState() => _KisanSetuWebViewScreenState();
}

class _KisanSetuWebViewScreenState extends State<KisanSetuWebViewScreen> {
  InAppWebViewController? webViewController;
  bool isLoading = true;
  double progress = 0;

  final InAppWebViewSettings settings = InAppWebViewSettings(
    isInspectable: kDebugMode,
    mediaPlaybackRequiresUserGesture: false,
    allowsInlineMediaPlayback: true,
    iframeAllow: "camera; microphone; geolocation",
    iframeAllowFullscreen: true,
    useHybridComposition: true,
    javaScriptEnabled: true,
    domStorageEnabled: true,
    databaseEnabled: true,
    clearCache: false,
    hardwareAcceleration: true,
    supportZoom: false,
    allowFileAccessFromFileURLs: true,
    allowUniversalAccessFromFileURLs: true,
    mixedContentMode: MixedContentMode.MIXED_CONTENT_ALWAYS_ALLOW,
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF061208),
      body: SafeArea(
        child: Stack(
          children: [
            InAppWebView(
              initialFile: "assets/web/index.html",
              initialSettings: settings,
              onWebViewCreated: (controller) {
                webViewController = controller;
              },
              onLoadError: (controller, url, code, message) {
                // If live dev server is unreachable, automatically fall back to bundled offline assets!
                controller.loadFile(assetFilePath: "assets/web/index.html");
              },
              onProgressChanged: (controller, progress) {
                setState(() {
                  this.progress = progress / 100;
                  if (progress >= 95) {
                    isLoading = false;
                  }
                });
              },
              onPermissionRequest: (controller, request) async {
                return PermissionResponse(
                  resources: request.resources,
                  action: PermissionResponseAction.GRANT,
                );
              },
            ),
            if (isLoading)
              Container(
                color: const Color(0xFF061208),
                child: Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 72,
                        height: 72,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: const LinearGradient(
                            colors: [Color(0xFF7ED957), Color(0xFF10B981)],
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF7ED957).withOpacity(0.4),
                              blurRadius: 24,
                              spreadRadius: 4,
                            )
                          ],
                        ),
                        child: const Icon(
                          Icons.eco,
                          color: Color(0xFF061208),
                          size: 38,
                        ),
                      ),
                      const SizedBox(height: 24),
                      const Text(
                        "KisanSetu AR",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        useLiveHotReload ? "Connecting to Live Auto-Sync..." : "Loading Offline Experience...",
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 12,
                          fontFamily: 'monospace',
                        ),
                      ),
                      const SizedBox(height: 24),
                      SizedBox(
                        width: 140,
                        child: LinearProgressIndicator(
                          value: progress,
                          backgroundColor: Colors.white10,
                          valueColor: const AlwaysStoppedAnimation<Color>(
                            Color(0xFF7ED957),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
