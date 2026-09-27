@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo   Building KisanSetu Android APK with Flutter
echo ===================================================

set "ROOT_DIR=%~dp0.."
set "CLIENT_DIR=%ROOT_DIR%\client"
set "FLUTTER_DIR=%ROOT_DIR%\kisan_setu_flutter"

echo [1/3] Bundling latest web application assets...
cd /d "%CLIENT_DIR%"
call npm run build

if not exist "%FLUTTER_DIR%\assets\web" (
    mkdir "%FLUTTER_DIR%\assets\web"
)

powershell -NoProfile -Command "Copy-Item -Recurse -Force '%CLIENT_DIR%\dist\*' '%FLUTTER_DIR%\assets\web'"

echo [2/3] Getting Flutter dependencies...
cd /d "%FLUTTER_DIR%"
call flutter pub get

echo [3/3] Compiling Release APK...
call flutter build apk --release --android-skip-build-dependency-validation

echo ===================================================
echo   KisanSetu APK build complete!
echo   Location: %FLUTTER_DIR%\build\app\outputs\flutter-apk\app-release.apk
echo ===================================================
pause
