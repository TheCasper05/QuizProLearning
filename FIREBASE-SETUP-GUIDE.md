# 🔥 Guía de Configuración de Firebase - QuizPro Learning

## ✅ Pre-requisitos Completados

- ✅ Dependencias npm instaladas
- ✅ `android/build.gradle` configurado
- ✅ `android/app/build.gradle` configurado
- ✅ Vector Icons configurado
- ✅ Permisos de Android agregados

---

## 📋 Pasos de Configuración en Firebase Console

### **PASO 1: Crear Proyecto en Firebase** (5 minutos)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Agregar proyecto"** o **"Add project"**
3. **Nombre del proyecto**: `QuizProLearning`
4. Haz clic en **"Continuar"**
5. **Google Analytics**:
   - Puedes dejarlo habilitado (recomendado) o deshabilitarlo
   - Si lo habilitas, selecciona tu cuenta de Analytics
6. Haz clic en **"Crear proyecto"**
7. Espera a que se complete (30 segundos aprox)
8. Haz clic en **"Continuar"**

✅ **Checkpoint**: Deberías ver el dashboard de tu proyecto Firebase

---

### **PASO 2: Habilitar Authentication** (5 minutos)

1. En el menú lateral, busca **"Authentication"** (o **"Autenticación"**)
2. Haz clic en **"Comenzar"** o **"Get started"**
3. Ve a la pestaña **"Sign-in method"** (o **"Método de inicio de sesión"**)

#### 2.1 Habilitar Email/Password

1. Haz clic en **"Email/Password"**
2. Habilita el switch de **"Email/Password"** (primer switch)
3. **NO habilites** "Email link (passwordless sign-in)" por ahora
4. Haz clic en **"Guardar"** o **"Save"**

#### 2.2 Habilitar Google Sign-In

1. Haz clic en **"Google"**
2. Habilita el switch
3. **Correo electrónico de asistencia del proyecto**: Ingresa tu email
4. Haz clic en **"Guardar"** o **"Save"**
5. **IMPORTANTE**: Expande "Google" de nuevo y **copia el Web client ID**
   - Guárdalo en un lugar seguro, lo necesitarás después
   - Formato: `XXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com`

✅ **Checkpoint**: Deberías ver Email/Password y Google con el estado "Habilitado"

---

### **PASO 3: Crear Firestore Database** (5 minutos)

1. En el menú lateral, busca **"Firestore Database"**
2. Haz clic en **"Crear base de datos"** o **"Create database"**
3. **Ubicación de Cloud Firestore**:
   - Selecciona la región más cercana a ti
   - Para Latinoamérica: `southamerica-east1 (São Paulo)`
   - Para USA: `us-central1 (Iowa)`
   - Para Europa: `europe-west1 (Belgium)`
4. **Reglas de seguridad**:
   - Selecciona **"Comenzar en modo de prueba"** (Start in test mode)
   - Esto permite lectura/escritura por 30 días - lo cambiaremos después
5. Haz clic en **"Crear"** o **"Create"**
6. Espera a que se cree la base de datos (30 segundos aprox)

✅ **Checkpoint**: Deberías ver el editor de Firestore vacío

---

### **PASO 4: Configurar Reglas de Firestore** (3 minutos)

1. En Firestore Database, ve a la pestaña **"Reglas"** (Rules)
2. **Reemplaza** todo el contenido con estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios: Lectura pública, escritura solo del propio usuario
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Quizzes: Lectura pública, escritura solo del creador
    match /quizzes/{quizId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        resource.data.creatorId == request.auth.uid;
    }

    // Resultados: Solo el usuario puede leer/escribir sus propios resultados
    match /results/{resultId} {
      allow read: if request.auth != null &&
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null &&
        request.resource.data.userId == request.auth.uid;
    }

    // Favoritos: Lectura/escritura solo para usuarios autenticados
    match /favorites/{favoriteId} {
      allow read, write: if request.auth != null;
    }

    // Calificaciones: Lectura pública, escritura para usuarios autenticados
    match /ratings/{ratingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

3. Haz clic en **"Publicar"** o **"Publish"**

✅ **Checkpoint**: Las reglas deberían estar publicadas sin errores

---

### **PASO 5: Agregar App Android** (5 minutos)

1. En el dashboard de Firebase, haz clic en el ícono de **Android** para agregar una app
   - Si no lo ves, ve a **Configuración del proyecto** > **Tus apps** > **Agregar app** > **Android**
2. **Registrar app**:
   - **Nombre del paquete de Android**: `com.quizprolearning`
   - **Alias de la app** (opcional): `QuizPro Learning`
   - **Certificado de firma de depuración SHA-1** (opcional por ahora): Déjalo vacío
3. Haz clic en **"Registrar app"**

✅ **Checkpoint**: Deberías ver un botón para descargar google-services.json

---

### **PASO 6: Descargar google-services.json** (2 minutos)

1. Haz clic en **"Descargar google-services.json"**
2. **IMPORTANTE**: Coloca el archivo descargado en:
   ```
   QuizProLearning/android/app/google-services.json
   ```
3. Verifica que el archivo esté en la ubicación correcta
4. Haz clic en **"Siguiente"** en Firebase Console
5. Puedes hacer clic en **"Siguiente"** en las siguientes pantallas (ya configuramos los archivos)
6. Haz clic en **"Continuar a la consola"**

✅ **Checkpoint**: El archivo google-services.json debe estar en `android/app/google-services.json`

---

### **PASO 7: Actualizar Web Client ID** (2 minutos)

Ahora que tienes el Web Client ID de Google Sign-In (del Paso 2.2), actualízalo en el código:

1. Abre el archivo: `src/services/firebase/auth.service.ts`
2. Busca la línea:
   ```typescript
   webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
   ```
3. Reemplaza `YOUR_WEB_CLIENT_ID.apps.googleusercontent.com` con tu Web Client ID real
4. Guarda el archivo

---

## 🎉 ¡Configuración Completada!

### Verificación Final

✅ Proyecto Firebase creado
✅ Authentication habilitado (Email/Password y Google)
✅ Firestore Database creado
✅ Reglas de Firestore configuradas
✅ App Android agregada
✅ google-services.json descargado y colocado
✅ Web Client ID actualizado en el código
✅ Archivos de Android configurados

---

## 🚀 Siguiente Paso: Probar la Aplicación

### Opción 1: Limpiar y ejecutar

```bash
cd android
./gradlew clean
cd ..
npm start --reset-cache
```

En otra terminal:
```bash
npm run android
```

### Opción 2: Si hay errores de compilación

```bash
# Limpiar todo
cd android
./gradlew clean
./gradlew cleanBuildCache
cd ..

# Reinstalar dependencias
rm -rf node_modules
npm install

# Ejecutar
npm start --reset-cache
```

En otra terminal:
```bash
npm run android
```

---

## 🐛 Solución de Problemas Comunes

### Error: "google-services.json is missing"
- Verifica que el archivo esté en `android/app/google-services.json`
- El nombre debe ser exactamente `google-services.json`

### Error: "Default FirebaseApp is not initialized"
- Asegúrate de que `apply plugin: "com.google.gms.google-services"` esté en `android/app/build.gradle`
- Asegúrate de que `classpath("com.google.gms:google-services:4.4.2")` esté en `android/build.gradle`

### Error en Google Sign-In
- Verifica que el Web Client ID esté actualizado en `auth.service.ts`
- Verifica que el package name sea exactamente `com.quizprolearning`

### Error de compilación de Gradle
```bash
cd android
./gradlew clean
./gradlew --stop
cd ..
npm start --reset-cache
```

---

## 📝 Información Importante

### Web Client ID
Tu Web Client ID está en:
- Firebase Console > Authentication > Sign-in method > Google > Web client ID

### Package Name
- `com.quizprolearning`
- Debe coincidir en Firebase Console y en `android/app/build.gradle`

### Reglas de Firestore
- Las reglas actuales permiten lectura/escritura según autenticación
- En producción, considera hacerlas más restrictivas

---

## ✅ ¿Listo para Continuar?

Una vez completados todos estos pasos, tu aplicación estará lista para:
- ✅ Registrar usuarios con email/password
- ✅ Iniciar sesión con Google
- ✅ Guardar datos en Firestore
- ✅ Autenticación completa

**Siguiente paso**: Probar la aplicación y verificar que compile correctamente.
