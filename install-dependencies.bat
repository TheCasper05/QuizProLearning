@echo off
echo ==========================================
echo QuizPro Learning - Instalador Automatico
echo ==========================================
echo.

echo [1/7] Instalando dependencias de navegacion...
call npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
call npm install react-native-screens react-native-safe-area-context react-native-gesture-handler

echo.
echo [2/7] Instalando Firebase...
call npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage

echo.
echo [3/7] Instalando Google Sign-In...
call npm install @react-native-google-signin/google-signin

echo.
echo [4/7] Instalando almacenamiento local...
call npm install @react-native-async-storage/async-storage

echo.
echo [5/7] Instalando componentes UI...
call npm install react-native-vector-icons react-native-linear-gradient

echo.
echo [6/7] Instalando librerias de formularios...
call npm install formik yup

echo.
echo [7/7] Instalando utilidades...
call npm install date-fns @react-native-community/netinfo

echo.
echo ==========================================
echo Instalacion completada!
echo ==========================================
echo.
echo Siguiente paso:
echo 1. Configurar Firebase (ver SETUP-INSTRUCTIONS.md)
echo 2. Copiar archivos faltantes
echo 3. Ejecutar: npm run android
echo.
pause
