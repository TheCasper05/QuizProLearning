# 🧪 Guía de Testing - QuizPro Learning

## 📱 Estado Actual de la Aplicación

### ✅ Completado (Listo para probar)
- **LoginScreen** - Pantalla de inicio de sesión
- **RegisterScreen** - Pantalla de registro
- **ForgotPasswordScreen** - Recuperación de contraseña
- **HomeScreen** - Pantalla principal con diseño pastel
- **Componentes UI** - Button, Input, Card, Loading
- **Firebase** - Configurado y conectado
- **Navegación** - Completa con tabs

### ⏳ Pendiente
- QuizDetailScreen
- TakeQuizScreen
- QuizResultScreen
- CreateQuizScreen
- ProfileScreen
- Datos de demostración en Firestore

---

## 🔐 Cómo Iniciar Sesión y Probar la App

### Opción 1: Crear una Cuenta Nueva (RECOMENDADO)

1. **Abre la app** en el emulador
2. Verás la **LoginScreen**
3. Haz clic en **"Regístrate aquí"** (abajo)
4. Llena el formulario de registro:
   ```
   Nombre: Tu Nombre
   Email: test@example.com
   Contraseña: 123456
   Confirmar Contraseña: 123456
   ```
5. Presiona **"Crear Cuenta"**
6. ✅ Si todo sale bien, te creará el usuario en Firebase y te llevará al HomeScreen

### Opción 2: Usar Email/Contraseña de Prueba

Si ya tienes una cuenta creada anteriormente:

1. En la **LoginScreen**
2. Ingresa:
   ```
   Email: test@example.com
   Contraseña: 123456
   ```
3. Presiona **"Iniciar Sesión"**
4. ✅ Deberías entrar al HomeScreen

### Opción 3: Google Sign-In

⚠️ **NOTA**: Para que Google Sign-In funcione necesitas:
- Configurar el SHA-1 en Firebase Console
- Tener Google Play Services en el emulador
- **Por ahora, usa las opciones 1 o 2 que son más sencillas**

---

## 🔍 Verificar que Firebase Funciona

### 1. Ver Usuarios en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto **QuizProLearning**
3. Ve a **Authentication** → **Users**
4. Deberías ver el usuario que acabas de crear:
   - Email: test@example.com
   - Provider: Email/Password
   - Created: Fecha actual

### 2. Ver Datos en Firestore (cuando creemos usuarios)

1. En Firebase Console
2. Ve a **Firestore Database**
3. Busca la colección **users**
4. Deberías ver un documento con tu `userId`

---

## 🧭 Navegar por la App

### HomeScreen (Pantalla Actual)

Una vez logueado, verás:

**Header:**
- Avatar con emoji
- Barra de progreso de nivel
- Badge de XP (323 XP)
- Botón de notificaciones
- Saludo: "Hi, [tu nombre]"

**Continue Quiz Card:**
- Card morado/azul con quiz en progreso
- "Animals Name" o "Math Quiz"
- Botón amarillo "Let's Go!"

**My Friends:**
- 5 avatares de amigos (mock data)
- Scroll horizontal

**Categories:**
- Chips con categorías (All, Science, Math, Music, History, Art)
- El seleccionado se pone amarillo

**Latest Quiz:**
- Lista de 3 quizzes:
  - Math Quiz 🧮
  - Animals Name 🦁
  - Space Quiz 🚀

⚠️ **IMPORTANTE**: Por ahora estos son datos MOCK (de ejemplo). Aún no navegan a ninguna pantalla porque faltan las pantallas siguientes.

### Bottom Tabs (Navegación inferior)

Aunque aún no funcionan completamente, puedes ver los tabs:
- 🏠 **Home** (actual)
- 🔍 **Search**
- ➕ **Create**
- 📝 **My Quizzes**
- 👤 **Profile**

---

## 🐛 Problemas Comunes y Soluciones

### Error: "Cannot connect to Firebase"
**Solución**:
- Verifica que el archivo `google-services.json` esté en `android/app/`
- Reinicia Metro bundler: Ctrl+C y `npm start`
- Recompila: `npm run android`

### Error: "Email already in use"
**Solución**:
- Usa otro email: `test2@example.com`, `test3@example.com`, etc.
- O inicia sesión con el email existente

### Error: "Network error"
**Solución**:
- Verifica que el emulador tenga internet
- En el emulador: Settings → Network & Internet → WiFi debe estar ON

### La app crashea al abrir
**Solución**:
1. Limpia y recompila:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm start -- --reset-cache
   npm run android
   ```

### No aparece el HomeScreen después de login
**Solución**:
- Abre React Native Debugger: Presiona Ctrl+M en el emulador
- Selecciona "Debug"
- Revisa la consola para ver errores

---

## 📋 Testing Checklist

### ✅ Funcionalidades a Probar Hoy

- [ ] **Registro de usuario**
  - [ ] Crear cuenta con email/password
  - [ ] Validaciones funcionan (email inválido, contraseñas no coinciden)
  - [ ] Aparece en Firebase Authentication

- [ ] **Inicio de sesión**
  - [ ] Login con email/password funciona
  - [ ] Login con credenciales incorrectas muestra error
  - [ ] Después de login, aparece HomeScreen

- [ ] **HomeScreen**
  - [ ] Se muestra el nombre del usuario
  - [ ] Los datos mock se visualizan correctamente
  - [ ] Los chips de categorías cambian de color al seleccionar
  - [ ] El scroll funciona correctamente

- [ ] **Navegación**
  - [ ] Los tabs inferiores son visibles
  - [ ] (Aún no funcionan - pendiente implementar)

---

## 🎯 Próximos Pasos para Completar la Demo

### 1. Crear Datos de Demostración en Firestore (1 hora)

**Por qué es importante**:
- Actualmente los datos son MOCK (hardcodeados)
- Necesitamos quizzes reales en Firebase para la demo
- Permitirá probar el flujo completo

**Qué voy a crear**:
- ✅ 8 Categorías en Firestore
- ✅ 10 Quizzes con preguntas en Firestore
- ✅ Script para subirlos automáticamente

### 2. QuizDetailScreen (2-3 horas)

**Qué mostrará**:
- Detalles del quiz seleccionado
- Imagen/emoji del quiz
- Categoría y nivel
- Número de preguntas
- Rating y estadísticas
- Botón "Comenzar Quiz"
- Botón de favoritos

### 3. TakeQuizScreen (4-5 horas)

**Funcionalidad**:
- Mostrar pregunta actual
- 4 opciones de respuesta
- Navegación: Siguiente/Anterior
- Barra de progreso (Pregunta X de Y)
- Timer opcional
- Confirmación antes de enviar
- Guardar respuestas

### 4. QuizResultScreen (2 horas)

**Qué mostrará**:
- Puntuación final
- Porcentaje de aciertos
- Respuestas correctas/incorrectas
- Botón: Ver respuestas detalladas
- Botón: Volver al inicio
- Botón: Reintentar

### 5. CreateQuizScreen (5-6 horas)

**Funcionalidad**:
- Formulario para crear quiz
- Título, descripción, categoría
- Agregar preguntas dinámicamente
- Tipo de pregunta (múltiple opción)
- Marcar respuesta correcta
- Guardar en Firestore

### 6. ProfileScreen (2-3 horas)

**Qué mostrará**:
- Avatar y nombre
- Estadísticas del usuario
- Quizzes creados
- Quizzes completados
- Achievements
- Botón de cerrar sesión

---

## 📊 Cronograma Recomendado para el Lunes

### **Hoy Miércoles (Resto del día - 3-4 horas)**
- ✅ Testing de Login/Register
- ⏳ Crear datos de demostración en Firestore
- ⏳ Subir 10 quizzes a Firebase

### **Jueves (8-10 horas)**
- QuizDetailScreen
- TakeQuizScreen
- QuizResultScreen
- Testing del flujo completo de tomar quiz

### **Viernes (8-10 horas)**
- CreateQuizScreen
- ProfileScreen
- Integrar datos reales de Firestore
- Testing de crear quiz

### **Sábado (6-8 horas)**
- Pulir UI/UX
- Agregar 1-2 features avanzadas (Favoritos, Rating)
- Testing completo
- Bugfixing

### **Domingo (4-6 horas)**
- Últimos ajustes
- Crear quizzes adicionales de demo
- Preparar presentación
- Screenshots

### **Lunes (Día de entrega)**
- ✅ Demo lista
- ✅ Presentación preparada

---

## 🚀 Comandos Útiles

### Iniciar Metro Bundler
```bash
npm start
```

### Compilar e Instalar en Android
```bash
npm run android
```

### Limpiar Cache y Recompilar
```bash
npm start -- --reset-cache
cd android && ./gradlew clean && cd ..
npm run android
```

### Ver Logs de Android
```bash
npx react-native log-android
```

### Abrir React Native Debugger
- En el emulador: Presiona **Ctrl+M** (Windows) o **Cmd+M** (Mac)
- Selecciona "Debug"

### Recargar la App
- En el emulador: Presiona **R** dos veces (RR)
- O desde el menú: Ctrl+M → "Reload"

---

## 📸 Capturas de Pantalla para la Demo

### Pantallas a Capturar:

1. **LoginScreen**
2. **RegisterScreen**
3. **HomeScreen** (con datos)
4. **QuizDetailScreen** (cuando esté listo)
5. **TakeQuizScreen** (mostrando pregunta)
6. **QuizResultScreen** (con puntuación)
7. **CreateQuizScreen** (formulario)
8. **ProfileScreen** (con estadísticas)

---

## ❓ FAQ - Preguntas Frecuentes

### ¿Cómo cerrar sesión?
Por ahora no hay botón implementado. Puedes:
1. Detener la app
2. Limpiar datos de la app en el emulador
3. O esperar al ProfileScreen que tendrá el botón

### ¿Dónde están los datos?
- **Actualmente**: Hardcodeados en los archivos (MOCK_QUIZZES, MOCK_FRIENDS)
- **Pronto**: En Firestore Database

### ¿Puedo cambiar los colores?
Sí, edita `src/screens/home/HomeScreen.tsx`:
```typescript
const PASTEL_COLORS = {
  purple: '#9B9BE8',  // Cambia aquí
  yellow: '#FFD666',  // Y aquí
  // etc...
}
```

### ¿Cómo agregar más quizzes mock?
En `src/screens/home/HomeScreen.tsx`, agrega más objetos al array `MOCK_QUIZZES`:
```typescript
{
  id: '4',
  title: 'Tu Quiz',
  description: 'Descripción',
  category: 'math',
  illustration: '📐',
  color: PASTEL_COLORS.green,
  questions: 5,
  progress: 0,
}
```

---

## 🎯 Siguiente Acción Inmediata

**¿Qué quieres que haga ahora?**

1. **Crear los datos de demostración** (categorías + 10 quizzes) para Firestore ⭐ RECOMENDADO
2. **Empezar con QuizDetailScreen** para poder navegar desde el HomeScreen
3. **Documentar más detalles** sobre alguna funcionalidad específica
4. **Ayudarte a probar** algo específico en la app actual

**Recomiendo la opción 1**: Crear los datos de demostración en Firestore para que puedas ver la app con contenido real.

¿Qué prefieres?
