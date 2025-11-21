# 📦 Instrucciones para Subir Datos de Demostración

## 🎯 Objetivo
Subir 8 categorías y 10 quizzes con preguntas a Firestore para tener contenido real en la app.

---

## 📱 Pasos para Subir los Datos

### 1. Abre la App
- Asegúrate de tener la app compilada y corriendo
- Debes estar **logueado** con tu cuenta

### 2. Accede a la Pantalla de Carga

**Opción A: Desde el HomeScreen**
1. En el HomeScreen, verás un **botón amarillo con emoji 📦** en la parte superior derecha (entre el badge de XP y las notificaciones)
2. Haz clic en ese botón

**Opción B: Navegación directa (desarrollo)**
- El botón 📦 te llevará a la pantalla "Subir Datos Demo"

### 3. Verifica el Estado Actual

La pantalla te mostrará:
- 📊 **Estado Actual**: Número de categorías y quizzes que ya existen
- 📦 **Datos a Subir**: Resumen de lo que se subirá
- ⚠️ **Advertencia**: Recordatorio de que solo debe ejecutarse una vez

### 4. Sube los Datos

1. Presiona el botón **"🚀 Subir Datos de Demostración"**
2. Si ya existen datos, aparecerá una confirmación
3. Espera a que termine el proceso (15-30 segundos)
4. Verás un mensaje de éxito con el resumen

### 5. Verifica los Datos

**En la App:**
- Sal de la pantalla y vuelve al HomeScreen
- Recarga la app (doble R en el emulador)
- Los quizzes ahora deberían mostrarse desde Firestore

**En Firebase Console:**
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto "QuizProLearning"
3. Ve a **Firestore Database**
4. Deberías ver:
   - Colección `categories` con 8 documentos
   - Colección `quizzes` con 10 documentos

---

## 📊 Datos que se Subirán

### 8 Categorías:
1. 🔬 Ciencias
2. 🔢 Matemáticas
3. 📚 Historia
4. 🎨 Arte
5. ⚽ Deportes
6. 💻 Tecnología
7. 🌍 Geografía
8. 🌟 Cultura General

### 10 Quizzes:
1. **Animales del Mundo** (Ciencias - Fácil) - 5 preguntas
2. **Matemáticas Básicas** (Matemáticas - Fácil) - 5 preguntas
3. **Historia Mundial** (Historia - Intermedio) - 5 preguntas
4. **Capitales del Mundo** (Geografía - Intermedio) - 5 preguntas
5. **Tecnología Moderna** (Tecnología - Intermedio) - 5 preguntas
6. **Deportes Populares** (Deportes - Fácil) - 5 preguntas
7. **El Sistema Solar** (Ciencias - Intermedio) - 5 preguntas
8. **Arte y Artistas Famosos** (Arte - Intermedio) - 5 preguntas
9. **Cultura General Avanzada** (Cultura General - Difícil) - 6 preguntas
10. **Álgebra Básica** (Matemáticas - Difícil) - 5 preguntas

**Total**: ~52 preguntas con respuestas y explicaciones

---

## ⚠️ Importante

### Solo Ejecutar UNA VEZ
- Este script está diseñado para ejecutarse **una sola vez**
- Si lo ejecutas múltiples veces, duplicará los datos
- Si necesitas resetear, elimina las colecciones en Firebase Console

### Los Quizzes se Asocian a tu Usuario
- Los quizzes creados tendrán tu `userId` como creador
- Esto permite que aparezcan en "Mis Quizzes"
- Puedes editarlos o eliminarlos después

### Requiere Conexión a Internet
- El emulador/dispositivo debe tener internet
- Firebase debe estar correctamente configurado
- Verifica que `google-services.json` esté en su lugar

---

## 🐛 Solución de Problemas

### Error: "Debes estar logueado"
**Solución**: Cierra sesión y vuelve a iniciar sesión con tu cuenta

### Error: "Network error"
**Solución**:
- Verifica que el emulador tenga internet
- Revisa la configuración de Firebase
- Asegúrate de que las reglas de Firestore permitan escritura

### Los datos no aparecen en el HomeScreen
**Solución**:
1. Recarga la app (RR en el emulador)
2. Verifica en Firebase Console que los datos se subieron
3. Revisa los logs de la consola para ver errores

### Error: "Permission denied"
**Solución**:
- Ve a Firebase Console → Firestore Database → Rules
- Las reglas deben permitir que usuarios autenticados escriban:
```javascript
allow write: if request.auth != null;
```

---

## 📝 Después de Subir los Datos

### Siguiente Paso: Conectar HomeScreen con Firestore

Ahora que los datos están en Firestore, necesitamos:

1. **Modificar HomeScreen** para leer de Firestore en lugar de datos mock
2. **Crear QuizDetailScreen** para ver detalles del quiz
3. **Implementar navegación** desde el quiz card al detalle

Estos pasos los implementaremos a continuación.

---

## 🔍 Verificación Manual

### En Firebase Console:

**Colección `categories`:**
```
categories/
  ├── ciencias
  ├── matematicas
  ├── historia
  ├── arte
  ├── deportes
  ├── tecnologia
  ├── geografia
  └── cultura-general
```

**Colección `quizzes`:**
```
quizzes/
  ├── quiz-ciencias-01
  ├── quiz-matematicas-01
  ├── quiz-historia-01
  ├── quiz-geografia-01
  ├── quiz-tecnologia-01
  ├── quiz-deportes-01
  ├── quiz-ciencias-02
  ├── quiz-arte-01
  ├── quiz-cultura-01
  └── quiz-matematicas-02
```

### Estructura de un Quiz en Firestore:
```javascript
{
  quizId: "quiz-ciencias-01",
  title: "Animales del Mundo",
  description: "¿Cuánto sabes sobre los animales?",
  category: "Ciencias",
  level: "Fácil",
  isPublic: true,
  questions: [...],  // Array con 5 preguntas
  stats: {
    totalAttempts: 42,
    averageScore: 85.5,
    averageRating: 4.5,
    totalRatings: 15
  },
  createdBy: {
    userId: "tu-user-id",
    displayName: "Tu Nombre"
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## ✅ Checklist de Verificación

Después de subir los datos, verifica:

- [ ] Firebase Console muestra 8 categorías
- [ ] Firebase Console muestra 10 quizzes
- [ ] Cada quiz tiene preguntas en el array `questions`
- [ ] Los quizzes están asociados a tu usuario
- [ ] No hay errores en la consola de la app
- [ ] Puedes ver los datos en Firebase (online)

---

## 🚀 Próximo Paso

Una vez que hayas subido los datos exitosamente:

1. **Modifica el HomeScreen** para leer quizzes reales de Firestore
2. **Implementa QuizDetailScreen** para mostrar los detalles
3. **Agrega navegación** para ir del quiz al detalle

¿Listo para continuar? ¡Vamos con el QuizDetailScreen!
