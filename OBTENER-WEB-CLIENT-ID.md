# 🔑 Cómo Obtener el Web Client ID de Google

## Método 1: Desde la Configuración de Google Sign-In

1. En Firebase Console > Authentication > Sign-in method
2. Haz clic en **"Google"** (el método de inicio de sesión)
3. Selecciona tu correo de asistencia
4. **Expande la sección "Configuración del SDK web"** (abajo en la misma pantalla)
5. Copia el **ID de cliente web** (Web client ID)
6. Haz clic en **"Guardar"**

El ID se verá algo así:
```
123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```

---

## Método 2: Desde Configuración del Proyecto

1. Ve a **Configuración del proyecto** (ícono de engranaje arriba a la izquierda)
2. Ve a la pestaña **"Cuentas de servicio"**
3. En la parte inferior, verás una sección que dice "Configuración del SDK de Firebase Admin"
4. Ahí también aparece el Web client ID

---

## Método 3: Desde Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto "QuizProLearning"
3. Ve a **APIs y servicios** > **Credenciales**
4. Busca el cliente OAuth 2.0 que dice "Web client (auto created by Google Service)"
5. Copia el **ID de cliente**

---

## ⚠️ Sobre el SHA-1 (Opcional por ahora)

El mensaje que ves sobre SHA-1 es para producción. Para desarrollo, puedes:

**Opción 1: Continuar sin SHA-1** (Recomendado para empezar)
- Google Sign-In funcionará en el emulador
- Más adelante agregas el SHA-1 para dispositivos físicos

**Opción 2: Agregar SHA-1 ahora**

Si quieres agregarlo ahora, ejecuta estos comandos:

### Windows:
```bash
cd android
./gradlew signingReport
```

Busca en la salida la sección "Task :app:signingReport" y copia el SHA-1 de "Variant: debug"

Ejemplo:
```
SHA1: A1:B2:C3:D4:E5:F6:G7:H8:I9:J0:K1:L2:M3:N4:O5:P6:Q7:R8:S9:T0
```

Luego:
1. Ve a Firebase Console > Configuración del proyecto
2. Selecciona tu app Android
3. Haz clic en "Agregar huella digital"
4. Pega el SHA-1
5. Guarda

---

## ✅ Siguiente Paso

Una vez que tengas el Web Client ID:

1. Abre: `src/services/firebase/auth.service.ts`
2. Busca la línea 7:
   ```typescript
   webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
   ```
3. Reemplaza `YOUR_WEB_CLIENT_ID.apps.googleusercontent.com` con tu ID real
4. Guarda el archivo

Ejemplo:
```typescript
GoogleSignin.configure({
  webClientId: '123456789012-abc123.apps.googleusercontent.com',
});
```
