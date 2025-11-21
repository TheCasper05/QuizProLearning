@echo off
echo.
echo ========================================
echo  Firebase Setup Verification
echo ========================================
echo.

REM Verificar google-services.json
echo [1/5] Verificando google-services.json...
if exist "android\app\google-services.json" (
    echo    ✓ google-services.json encontrado
) else (
    echo    ✗ ERROR: google-services.json NO encontrado
    echo      Descargalo de Firebase Console y colocalo en android\app\
)
echo.

REM Verificar build.gradle
echo [2/5] Verificando android/build.gradle...
findstr /C:"google-services" "android\build.gradle" >nul
if %errorlevel%==0 (
    echo    ✓ Google Services plugin configurado
) else (
    echo    ✗ ERROR: Google Services plugin NO configurado
)
echo.

REM Verificar app/build.gradle
echo [3/5] Verificando android/app/build.gradle...
findstr /C:"google-services" "android\app\build.gradle" >nul
if %errorlevel%==0 (
    echo    ✓ Google Services plugin aplicado
) else (
    echo    ✗ ERROR: Google Services plugin NO aplicado
)
echo.

REM Verificar Vector Icons
echo [4/5] Verificando Vector Icons...
findstr /C:"react-native-vector-icons" "android\app\build.gradle" >nul
if %errorlevel%==0 (
    echo    ✓ Vector Icons configurado
) else (
    echo    ✗ ERROR: Vector Icons NO configurado
)
echo.

REM Verificar permisos
echo [5/5] Verificando permisos de Android...
findstr /C:"ACCESS_NETWORK_STATE" "android\app\src\main\AndroidManifest.xml" >nul
if %errorlevel%==0 (
    echo    ✓ Permisos de red configurados
) else (
    echo    ✗ ERROR: Permisos de red NO configurados
)
echo.

echo ========================================
echo  Verificacion Completa
echo ========================================
echo.
echo Siguiente paso: Seguir la guia en FIREBASE-SETUP-GUIDE.md
echo para configurar Firebase Console
echo.
pause
