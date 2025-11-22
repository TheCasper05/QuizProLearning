# Solución: Pantalla de Carga Infinita

## Problema
La aplicación se queda atascada mostrando "Reloading..." o una pantalla en blanco.

## Cambios Realizados

He agregado las siguientes mejoras para diagnosticar y resolver el problema:

### 1. ✅ Logs de Depuración en AuthContext
- Agregué logs detallados en `src/context/AuthContext.tsx`
- Agregué un **timeout de 10 segundos** para evitar espera infinita
- Los logs incluyen emojis para fácil identificación:
  - 🔵 = Información
  - ✅ = Éxito
  - ❌ = Error
  - ⚠️ = Advertencia

### 2. ✅ Mejora en la Pantalla de Carga
- Agregué texto informativo en `src/navigation/AppNavigator.tsx`
- Agregué información de depuración visible en modo desarrollo
- Mejoré el manejo de errores

### 3. ✅ Verificación de Firebase
- Creé `src/utils/firebaseCheck.ts` para verificar la configuración
- Se ejecuta automáticamente al iniciar la app
- Muestra detalles de qué servicios están funcionando

## Pasos para Solucionar

### Paso 1: Recargar la Aplicación

1. **Si tienes Metro Bundler corriendo**, presiona:
   - **R** en Android (o **Cmd+R** / **Ctrl+R**)
   - **Cmd+R** en iOS

2. **Si no tienes Metro Bundler corriendo**:
   ```bash
   npm start
   ```

   En otra terminal:
   ```bash
   # Para Android
   npm run android

   # Para iOS
   npm run ios
   ```

### Paso 2: Revisar los Logs

Abre **React Native Debugger** o la **consola del terminal** donde corre Metro Bundler y busca estos mensajes:

#### ✅ Mensajes Esperados (Todo Bien):
```
🚀 App: Iniciando aplicación QuizPro Learning
🔵 Verificando Firebase Auth...
✅ Firebase Auth inicializado correctamente
🔵 Verificando Firebase Firestore...
✅ Firebase Firestore inicializado correctamente
🔵 AuthContext: Iniciando suscripción a cambios de autenticación
🔵 AuthContext: Estado de autenticación cambiado
🔵 AuthContext: No hay usuario autenticado
🔵 AuthContext: Finalizando carga
🔵 AppNavigator: Estado actual { loading: false, hasUser: false, hasError: false }
```

#### ❌ Mensajes de Error a Buscar:
```
❌ Error en Firebase Auth: ...
❌ Error en Firebase Firestore: ...
❌ AuthContext: Error al obtener usuario: ...
⚠️ AuthContext: Timeout alcanzado, continuando sin autenticación
```

### Paso 3: Soluciones Según el Error

#### Error 1: "Firebase no está inicializado"
**Causa**: Falta el archivo `google-services.json` o está mal configurado

**Solución**:
1. Verifica que existe `android/app/google-services.json`
2. Si no existe, descárgalo desde Firebase Console:
   - Ve a [Firebase Console](https://console.firebase.google.com)
   - Selecciona tu proyecto "QuizProLearning"
   - Ve a Configuración del Proyecto > Tus aplicaciones
   - Descarga `google-services.json`
   - Colócalo en `android/app/google-services.json`

3. Limpia y reconstruye:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

#### Error 2: "Timeout alcanzado"
**Causa**: Firebase tarda más de 10 segundos en responder

**Solución**:
1. Verifica tu conexión a Internet
2. Verifica que Firebase esté configurado correctamente
3. Revisa las reglas de seguridad de Firestore:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true; // Para desarrollo
       }
     }
   }
   ```

#### Error 3: "Cannot read property 'colors' of undefined"
**Causa**: El ThemeContext no se está inicializando correctamente

**Solución**: Verifica que existe `src/context/ThemeContext.tsx` y está exportando correctamente el tema.

#### Error 4: La app se cierra o crashea al iniciar
**Causa**: Posible problema con las dependencias nativas

**Solución**:
```bash
# Limpiar todo
cd android
./gradlew clean
cd ..

# Reinstalar node_modules
rm -rf node_modules
npm install

# Limpiar caché de Metro
npm start -- --reset-cache

# En otra terminal
npm run android
```

### Paso 4: Verificar Logs en Android Studio (Opcional)

Si los pasos anteriores no funcionan, abre Android Studio:

1. Abre **Android Studio**
2. Ve a **Logcat** (en la parte inferior)
3. Filtra por "ReactNative" o "Firebase"
4. Busca errores en rojo

## Verificación Rápida

Ejecuta estos comandos para verificar que todo está en orden:

```bash
# 1. Verificar que existe google-services.json
ls -la android/app/google-services.json

# 2. Verificar que las dependencias están instaladas
npm list @react-native-firebase/app
npm list @react-native-firebase/auth
npm list @react-native-firebase/firestore

# 3. Ver la configuración actual
cat android/app/google-services.json
```

## Contacto para Debugging

Si después de estos pasos la app sigue sin cargar, comparte:

1. Los logs completos de Metro Bundler
2. Los logs de Logcat (Android Studio)
3. El contenido de `android/app/google-services.json` (puedes ocultar datos sensibles)
4. La versión de React Native: `npx react-native --version`

## Mejoras Implementadas

- ✅ Timeout de 10 segundos en AuthContext
- ✅ Logs detallados con emojis para fácil identificación
- ✅ Verificación automática de Firebase al iniciar
- ✅ Pantalla de carga con texto informativo
- ✅ Información de depuración en modo desarrollo
- ✅ Mejor manejo de errores en toda la app

## Próximos Pasos

Una vez que la app cargue correctamente:

1. ✅ Deberías ver la pantalla de login/registro
2. ✅ Podrás crear una cuenta o iniciar sesión
3. ✅ Los logs se pueden reducir eliminando los console.log una vez que todo funcione
