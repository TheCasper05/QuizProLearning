# 🚀 Instrucciones de Configuración - QuizPro Learning

## ✅ Progreso Actual

Ya se han creado:
- ✅ Proyecto React Native base
- ✅ Estructura de carpetas completa
- ✅ Modelos TypeScript (User, Quiz, Category, Result, etc.)
- ✅ Sistema de estilos y temas (Light/Dark)
- ✅ Configuración básica de Firebase

---

## 📦 Paso 1: Instalar Dependencias (15 minutos)

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
cd C:\Users\jeanm\QuizProLearning

# Instalar dependencias de navegación
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context react-native-gesture-handler

# Instalar Firebase
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage

# Instalar Google Sign-In
npm install @react-native-google-signin/google-signin

# Instalar almacenamiento local
npm install @react-native-async-storage/async-storage

# Instalar UI components
npm install react-native-vector-icons
npm install react-native-linear-gradient

# Instalar formularios
npm install formik yup

# Instalar utilidades
npm install date-fns
npm install @react-native-community/netinfo
```

---

## 🔥 Paso 2: Configurar Firebase (20 minutos)

### 2.1 Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Clic en "Agregar proyecto"
3. Nombre: **QuizProLearning**
4. Sigue los pasos hasta completar

### 2.2 Habilitar Authentication

1. En Firebase Console → **Authentication** → **Comenzar**
2. Habilita:
   - ✅ Correo electrónico/Contraseña
   - ✅ Google

### 2.3 Crear Firestore Database

1. Ve a **Firestore Database** → **Crear base de datos**
2. Modo: **Comenzar en modo de prueba**
3. Ubicación: Elige la más cercana

### 2.4 Configurar reglas de Firestore

Ve a la pestaña "Reglas" y pega:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /quizzes/{quizId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        resource.data.creatorId == request.auth.uid;
    }

    match /results/{resultId} {
      allow read: if request.auth != null &&
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null &&
        request.resource.data.userId == request.auth.uid;
    }

    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null;
    }

    match /ratings/{ratingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 2.5 Configurar Android

1. En Firebase Console, clic en ícono de **Android**
2. Nombre del paquete: `com.quizprolearning`
3. **Descargar google-services.json**
4. Colocar en: `QuizProLearning\android\app\google-services.json`

5. Editar `android\build.gradle`:

```gradle
buildscript {
    dependencies {
        // ... otras dependencias
        classpath('com.google.gms:google-services:4.4.0')  // Agregar esta línea
    }
}
```

6. Editar `android\app\build.gradle`:

Al final del archivo, agregar:

```gradle
apply plugin: 'com.google.gms.google-services'
```

### 2.6 Configurar Vector Icons

En `android\app\build.gradle`, agregar al final:

```gradle
apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
```

---

## 📂 Paso 3: Copiar Archivos Restantes

Los siguientes archivos están en tu carpeta principal y necesitan ser copiados:

1. **Servicios de Firebase**:
   - Copiar contenido de `QuizPro-FirebaseServices.ts`
   - Dividir en archivos separados en `src/services/firebase/`

2. **Servicios de API**:
   - Copiar contenido de `QuizPro-APIServices.ts`
   - Dividir en archivos separados en `src/services/api/`

3. **Contexts**:
   - Copiar contenido de `QuizPro-Contexts.tsx`
   - Dividir en `src/context/AuthContext.tsx`, `ThemeContext.tsx`, `QuizContext.tsx`

4. **Navegación**:
   - Copiar contenido de `QuizPro-Navigation.tsx`
   - Dividir en archivos de navegación en `src/navigation/`

5. **Componentes**:
   - Copiar contenido de `QuizPro-Components.tsx`
   - Dividir en componentes individuales en `src/components/`

6. **App.tsx**:
   - Reemplazar el `App.tsx` raíz con el contenido de `QuizPro-App.tsx`

---

## 🎨 Paso 4: Configurar Vector Icons

### Para Android:

Ya está configurado con el paso anterior.

### Para iOS:

```bash
cd ios
pod install
cd ..
```

---

## 🔑 Paso 5: Obtener Web Client ID para Google Sign-In

1. En Firebase Console → **Authentication** → **Métodos de inicio de sesión**
2. Clic en **Google**
3. Copiar el **Web client ID**
4. Guardar para usarlo en AuthService.ts

---

## ▶️ Paso 6: Ejecutar la App

### Android:

```bash
# Terminal 1: Metro bundler
npm start

# Terminal 2: Ejecutar en Android
npm run android
```

### iOS (solo macOS):

```bash
# Terminal 1: Metro bundler
npm start

# Terminal 2: Ejecutar en iOS
npm run ios
```

---

## 📝 Paso 7: Implementar Pantallas Faltantes

Usa el archivo `QuizPro-LoginScreen-EXAMPLE.tsx` como referencia.

Las pantallas que necesitas crear:

### Autenticación:
- [ ] `src/screens/auth/LoginScreen.tsx` (ya tienes el ejemplo)
- [ ] `src/screens/auth/RegisterScreen.tsx`
- [ ] `src/screens/auth/ForgotPasswordScreen.tsx`

### Home:
- [ ] `src/screens/home/HomeScreen.tsx`

### Search:
- [ ] `src/screens/search/SearchScreen.tsx`

### My Quizzes:
- [ ] `src/screens/myQuizzes/MyQuizzesScreen.tsx`
- [ ] `src/screens/myQuizzes/CreateQuizScreen.tsx`
- [ ] `src/screens/myQuizzes/EditQuizScreen.tsx`
- [ ] `src/screens/myQuizzes/QuizStatisticsScreen.tsx`

### Quiz:
- [ ] `src/screens/quiz/QuizDetailScreen.tsx`
- [ ] `src/screens/quiz/TakeQuizScreen.tsx`
- [ ] `src/screens/quiz/QuizResultScreen.tsx`

### Profile:
- [ ] `src/screens/profile/ProfileScreen.tsx`
- [ ] `src/screens/profile/SettingsScreen.tsx`

---

## 🐛 Solución de Problemas

### Error: Module not found

```bash
npm install
cd android && ./gradlew clean && cd ..
npm start -- --reset-cache
```

### Error con Google Sign-In

Verifica que:
- `google-services.json` esté en `android/app/`
- Web Client ID esté en el código
- Authentication esté habilitado en Firebase

### Error de permisos

En `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

---

## 📚 Recursos

- [Guía completa de instalación](../QuizPro-INSTALLATION-GUIDE.md)
- [Resumen del proyecto](../QuizPro-RESUMEN-COMPLETO.md)
- [README](../QuizPro-README.md)
- [Ejemplo de LoginScreen](../QuizPro-LoginScreen-EXAMPLE.tsx)

---

## ✅ Checklist de Configuración

- [ ] Dependencias instaladas
- [ ] Proyecto Firebase creado
- [ ] Authentication habilitado
- [ ] Firestore creado y configurado
- [ ] google-services.json copiado
- [ ] build.gradle modificado
- [ ] Vector icons configurado
- [ ] Web Client ID obtenido
- [ ] Servicios copiados
- [ ] Contexts copiados
- [ ] Navegación configurada
- [ ] Componentes copiados
- [ ] App.tsx reemplazado
- [ ] App ejecutándose correctamente

---

## 🎉 ¡Siguiente Paso!

Una vez completados estos pasos, estarás listo para:
1. Implementar las pantallas
2. Probar la autenticación
3. Crear tu primer quiz
4. Compartir con amigos

---

**Tiempo estimado total**: 1-2 horas

¿Necesitas ayuda? Revisa la documentación completa o pregunta.
