# 🔑 Cómo Copiar el Web Client ID

## ✅ Método Recomendado: Google Cloud Console

1. **Abre** [Google Cloud Console - Credenciales](https://console.cloud.google.com/apis/credentials)

2. **Selecciona tu proyecto**: `QuizProLearning` (arriba en el selector de proyectos)

3. **Busca en la sección "ID de clientes de OAuth 2.0"**:
   - Verás una lista de clientes OAuth
   - Busca uno que diga: **"Web client (auto created by Google Service)"**
   - Este fue creado automáticamente por Firebase

4. **Copia el ID de cliente**:
   - Está en la columna "ID de cliente"
   - Termina en `.apps.googleusercontent.com`
   - Ejemplo: `123456789012-abcdefg123456.apps.googleusercontent.com`

5. **¡Listo!** Ya tienes tu Web Client ID

---

## 📋 Método Alternativo: Desde el archivo google-services.json

Si ya descargaste el archivo `google-services.json`, también puedes encontrarlo ahí:

1. Abre el archivo: `android/app/google-services.json`
2. Busca la sección `oauth_client`
3. Busca el cliente que tenga `"client_type": 3`
4. Copia el valor de `"client_id"`

Ejemplo en el archivo:
```json
"oauth_client": [
  {
    "client_id": "123456789012-abcdefg123456.apps.googleusercontent.com",
    "client_type": 3
  }
]
```

El que tiene `"client_type": 3` es el **Web Client**.

---

## ⚡ Método Rápido: Desde Firebase Settings

1. Ve a Firebase Console
2. Haz clic en el **ícono de engranaje** ⚙️ (arriba a la izquierda)
3. Selecciona **"Configuración del proyecto"**
4. Ve a la pestaña **"Cuentas de servicio"**
5. En la parte inferior, verás fragmentos de código
6. Selecciona la pestaña **"Admin SDK"**
7. Ahí aparecerá información del proyecto, pero...

**MEJOR:** Usa el Método 1 (Google Cloud Console) - es más directo.

---

## 🎯 Una Vez que Tengas el Web Client ID

Copia el ID y pégalo aquí para que te ayude a actualizarlo en el código.

El formato es:
```
NÚMEROS-LETRAS_Y_NÚMEROS.apps.googleusercontent.com
```

Ejemplo real:
```
533427489714-abc123def456ghi789jkl012mno345pq.apps.googleusercontent.com
```
