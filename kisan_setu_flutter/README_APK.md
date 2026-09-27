# 📱 KisanSetu — Flutter Android APK Guide

This directory contains the Flutter mobile project configured to package **KisanSetu** into a standalone Android `.apk` with **100% exact UI parity**, hardware-accelerated **WebGL 3D digital twins (Three.js)**, **WebAR live camera scanning**, **offline storage**, and **Farmer Copilot voice speech synthesis**.

---

## 🚀 How to Build the APK

### Method 1: Using the 1-Click Batch Script (Windows)
Double-click or run:
```cmd
e:\AJ\VNR\kisan_setu_flutter\build_apk.bat
```

---

### Method 2: Manual Flutter Commands
```bash
# 1. Ensure latest web assets are compiled into Flutter
cd e:\AJ\VNR\client
npm run build
powershell -Command "Copy-Item -Recurse -Force dist\* ..\kisan_setu_flutter\assets\web\"

# 2. Build Release APK
cd e:\AJ\VNR\kisan_setu_flutter
flutter pub get
flutter build apk --release
```

The compiled APK will be generated at:
```text
kisan_setu_flutter/build/app/outputs/flutter-apk/app-release.apk
```

---

## 📲 Installing on Your Android Mobile Phone

1. Connect your Android phone via USB or send `app-release.apk` to your phone via Google Drive, WhatsApp, or Telegram.
2. Tap the `.apk` file on your phone and select **Install**.
3. When prompted, grant **Camera** permission for WebAR field scanning and **Audio** permission for the Farmer Copilot assistant.
4. Enjoy the full **KisanSetu** experience natively on your mobile device!
