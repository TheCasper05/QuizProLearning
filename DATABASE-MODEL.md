# 🗄️ Modelo de Base de Datos - QuizPro Learning

## Tipo de Base de Datos
**Firestore** - Base de datos NoSQL documental de Firebase

---

## 📊 Estructura de Colecciones

### 1. **users** (Colección Principal)
Almacena la información de los usuarios registrados.

```typescript
users/{userId}
{
  // Información Personal
  userId: string;              // ID único del usuario (Firebase Auth UID)
  email: string;               // Correo electrónico
  displayName: string;         // Nombre completo
  photoURL?: string;           // URL de la foto de perfil (opcional)

  // Estadísticas del Usuario
  stats: {
    quizzesCreated: number;    // Quizzes creados por el usuario
    quizzesTaken: number;      // Quizzes completados
    totalScore: number;        // Puntuación total acumulada
    averageScore: number;      // Promedio de puntuación
    level: number;             // Nivel del usuario (1-100)
    xp: number;                // Puntos de experiencia
  };

  // Achievements (Logros desbloqueados)
  achievements: string[];      // Array de IDs de logros

  // Preferencias
  preferences: {
    theme: 'light' | 'dark';   // Tema preferido
    notifications: boolean;     // Notificaciones activadas
    language: string;           // Idioma (es, en, etc.)
  };

  // Metadata
  createdAt: Timestamp;        // Fecha de creación
  updatedAt: Timestamp;        // Última actualización
  lastLoginAt: Timestamp;      // Último inicio de sesión
}
```

**Índices necesarios:**
- `email` (único)
- `createdAt` (descendente)
- `stats.level` (descendente) - Para leaderboards

---

### 2. **quizzes** (Colección Principal)
Almacena todos los quizzes creados en la plataforma.

```typescript
quizzes/{quizId}
{
  // Información Básica
  quizId: string;              // ID único del quiz
  title: string;               // Título del quiz
  description: string;         // Descripción breve
  imageUrl?: string;           // URL de imagen (opcional)

  // Metadata del Quiz
  category: string;            // Categoría (Ciencias, Historia, etc.)
  level: 'Fácil' | 'Intermedio' | 'Difícil';
  isPublic: boolean;           // Público o privado

  // Creador
  createdBy: {
    userId: string;            // ID del creador
    displayName: string;       // Nombre del creador
    photoURL?: string;         // Foto del creador
  };

  // Preguntas (Array de objetos)
  questions: [
    {
      questionId: string;      // ID único de la pregunta
      question: string;        // Texto de la pregunta
      type: 'multiple' | 'boolean';  // Tipo de pregunta
      options: string[];       // Array de opciones (4 para multiple, 2 para boolean)
      correctAnswer: number;   // Índice de la respuesta correcta (0-3)
      points: number;          // Puntos por respuesta correcta (default: 10)
      imageUrl?: string;       // Imagen opcional para la pregunta
      explanation?: string;    // Explicación de la respuesta (opcional)
    }
  ];

  // Estadísticas del Quiz
  stats: {
    totalAttempts: number;     // Veces que se ha tomado el quiz
    totalCompletions: number;  // Veces completado
    averageScore: number;      // Puntuación promedio
    averageRating: number;     // Rating promedio (1-5 estrellas)
    totalRatings: number;      // Cantidad de ratings
  };

  // Configuración
  settings: {
    timeLimit?: number;        // Límite de tiempo en segundos (opcional)
    shuffleQuestions: boolean; // Mezclar preguntas
    shuffleOptions: boolean;   // Mezclar opciones
    showCorrectAnswers: boolean; // Mostrar respuestas correctas al final
    allowRetake: boolean;      // Permitir reintentar
  };

  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;     // Fecha de publicación (si isPublic = true)
}
```

**Índices necesarios:**
- `category` + `isPublic` (compuesto)
- `level` + `isPublic` (compuesto)
- `createdBy.userId` + `createdAt` (compuesto)
- `stats.averageRating` (descendente) - Para quizzes populares
- `stats.totalAttempts` (descendente) - Para quizzes trending

---

### 3. **results** (Colección Principal)
Almacena los resultados de los quizzes completados por los usuarios.

```typescript
results/{resultId}
{
  // IDs de referencia
  resultId: string;            // ID único del resultado
  userId: string;              // ID del usuario que tomó el quiz
  quizId: string;              // ID del quiz

  // Información del Quiz (snapshot para historial)
  quizSnapshot: {
    title: string;
    category: string;
    level: string;
    totalQuestions: number;
  };

  // Resultados
  score: number;               // Puntuación obtenida
  maxScore: number;            // Puntuación máxima posible
  percentage: number;          // Porcentaje de acierto (0-100)
  correctAnswers: number;      // Respuestas correctas
  incorrectAnswers: number;    // Respuestas incorrectas

  // Detalles de las respuestas
  answers: [
    {
      questionId: string;      // ID de la pregunta
      userAnswer: number;      // Respuesta del usuario (índice)
      correctAnswer: number;   // Respuesta correcta (índice)
      isCorrect: boolean;      // ¿Fue correcta?
      points: number;          // Puntos obtenidos
      timeSpent?: number;      // Tiempo en segundos (opcional)
    }
  ];

  // Tiempo
  startedAt: Timestamp;        // Inicio del quiz
  completedAt: Timestamp;      // Finalización del quiz
  totalTimeSpent: number;      // Tiempo total en segundos

  // Metadata
  createdAt: Timestamp;
}
```

**Índices necesarios:**
- `userId` + `completedAt` (compuesto, descendente) - Historial del usuario
- `quizId` + `completedAt` (compuesto, descendente) - Resultados por quiz
- `userId` + `quizId` (compuesto) - Resultados de un usuario en un quiz específico

---

### 4. **favorites** (Colección Principal)
Almacena los quizzes favoritos de cada usuario.

```typescript
favorites/{favoriteId}
{
  favoriteId: string;          // ID único del favorito
  userId: string;              // ID del usuario
  quizId: string;              // ID del quiz favorito

  // Snapshot del quiz (para mostrar en favoritos sin consultar quizzes)
  quizSnapshot: {
    title: string;
    description: string;
    imageUrl?: string;
    category: string;
    level: string;
    averageRating: number;
  };

  createdAt: Timestamp;        // Fecha en que se marcó como favorito
}
```

**Índices necesarios:**
- `userId` + `createdAt` (compuesto, descendente)
- `userId` + `quizId` (compuesto, único) - Para verificar si ya es favorito

---

### 5. **ratings** (Colección Principal)
Almacena las calificaciones (ratings) que los usuarios dan a los quizzes.

```typescript
ratings/{ratingId}
{
  ratingId: string;            // ID único del rating
  userId: string;              // ID del usuario que calificó
  quizId: string;              // ID del quiz calificado

  rating: number;              // Calificación 1-5 estrellas
  comment?: string;            // Comentario opcional

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Índices necesarios:**
- `quizId` + `createdAt` (compuesto, descendente)
- `userId` + `quizId` (compuesto, único) - Un usuario solo puede calificar una vez

---

### 6. **categories** (Colección Principal)
Categorías predefinidas de quizzes.

```typescript
categories/{categoryId}
{
  categoryId: string;          // ID único de la categoría
  name: string;                // Nombre de la categoría
  emoji: string;               // Emoji representativo
  description: string;         // Descripción
  color: string;               // Color hex para UI

  stats: {
    totalQuizzes: number;      // Total de quizzes en esta categoría
    totalAttempts: number;     // Total de intentos
  };

  isActive: boolean;           // Si está activa
  order: number;               // Orden de visualización
}
```

**Categorías Iniciales:**
- Ciencias 🔬
- Historia 📚
- Matemáticas 🔢
- Arte 🎨
- Deportes ⚽
- Tecnología 💻
- Geografía 🌍
- Cultura General 🌟

---

### 7. **achievements** (Colección Principal)
Logros que los usuarios pueden desbloquear.

```typescript
achievements/{achievementId}
{
  achievementId: string;       // ID único del logro
  name: string;                // Nombre del logro
  description: string;         // Descripción
  emoji: string;               // Emoji representativo

  // Condiciones para desbloquear
  condition: {
    type: 'quizzes_taken' | 'quizzes_created' | 'perfect_score' | 'streak' | 'total_score';
    value: number;             // Valor requerido
  };

  rewards: {
    xp: number;                // XP que otorga
    badge?: string;            // Badge especial (opcional)
  };

  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  order: number;               // Orden de visualización
}
```

**Ejemplos de Logros:**
- "Primer Paso" - Completar tu primer quiz (10 XP)
- "Creador" - Crear tu primer quiz (20 XP)
- "Perfeccionista" - Obtener 100% en un quiz (50 XP)
- "Maestro del Saber" - Completar 50 quizzes (200 XP)
- "Mente Brillante" - Acumular 1000 puntos totales (150 XP)

---

## 🔄 Relaciones entre Colecciones

```
users (1) ──── crea ──────> (N) quizzes
              └── toma ──────> (N) results
              └── marca ─────> (N) favorites
              └── califica ──> (N) ratings

quizzes (1) ── recibe ────> (N) results
              └── tiene ─────> (N) ratings
              └── está en ──> (N) favorites
              └── pertenece > (1) categories

results (N) ── pertenece ──> (1) users
              └── refiere ───> (1) quizzes

favorites (N) ─ pertenece ──> (1) users
              └── refiere ───> (1) quizzes

ratings (N) ─── pertenece ──> (1) users
              └── refiere ───> (1) quizzes
```

---

## 🔐 Reglas de Seguridad de Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isOwner(userId);
      allow update, delete: if isOwner(userId);
    }

    // Quizzes collection
    match /quizzes/{quizId} {
      allow read: if resource.data.isPublic || isOwner(resource.data.createdBy.userId);
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.createdBy.userId);
      allow delete: if isOwner(resource.data.createdBy.userId);
    }

    // Results collection
    match /results/{resultId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
      allow update, delete: if false; // Los resultados no se pueden modificar
    }

    // Favorites collection
    match /favorites/{favoriteId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
      allow delete: if isOwner(resource.data.userId);
    }

    // Ratings collection
    match /ratings/{ratingId} {
      allow read: if true; // Todos pueden ver los ratings
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
      allow update: if isOwner(resource.data.userId);
      allow delete: if isOwner(resource.data.userId);
    }

    // Categories collection
    match /categories/{categoryId} {
      allow read: if true; // Todos pueden ver las categorías
      allow write: if false; // Solo admins (mediante Cloud Functions)
    }

    // Achievements collection
    match /achievements/{achievementId} {
      allow read: if true; // Todos pueden ver los logros
      allow write: if false; // Solo admins
    }
  }
}
```

---

## 📈 Consultas Comunes

### 1. Obtener Quizzes Públicos Populares
```typescript
const popularQuizzes = await firestore()
  .collection('quizzes')
  .where('isPublic', '==', true)
  .orderBy('stats.totalAttempts', 'desc')
  .limit(10)
  .get();
```

### 2. Obtener Quizzes por Categoría
```typescript
const categoryQuizzes = await firestore()
  .collection('quizzes')
  .where('isPublic', '==', true)
  .where('category', '==', 'Ciencias')
  .orderBy('stats.averageRating', 'desc')
  .get();
```

### 3. Historial de Resultados del Usuario
```typescript
const userResults = await firestore()
  .collection('results')
  .where('userId', '==', currentUserId)
  .orderBy('completedAt', 'desc')
  .limit(20)
  .get();
```

### 4. Favoritos del Usuario
```typescript
const favorites = await firestore()
  .collection('favorites')
  .where('userId', '==', currentUserId)
  .orderBy('createdAt', 'desc')
  .get();
```

### 5. Verificar si un Quiz es Favorito
```typescript
const isFavorite = await firestore()
  .collection('favorites')
  .where('userId', '==', currentUserId)
  .where('quizId', '==', quizId)
  .get();
```

---

## 🎯 Optimizaciones

### 1. **Denormalización de Datos**
- Guardamos snapshots de quizzes en `favorites` y `results` para evitar consultas adicionales
- Guardamos información del creador en el quiz mismo

### 2. **Índices Compuestos**
- Crear índices para consultas frecuentes (categoría + público, userId + fecha, etc.)

### 3. **Paginación**
- Usar `.startAfter()` para cargar más resultados en listas largas

### 4. **Caché Local**
- Firestore automáticamente cachea datos para modo offline
- Habilitar persistencia: `firestore().settings({ persistence: true })`

---

## 📊 Estimación de Tamaño

Para la demo con 10 quizzes de ejemplo:

- **users**: ~1-5 documentos (tú y usuarios de prueba)
- **quizzes**: 10 documentos
- **categories**: 8 documentos
- **achievements**: ~10-15 documentos
- **results**: Según cuántas veces se pruebe
- **favorites**: Según se marquen
- **ratings**: Según se califiquen

**Total estimado**: ~50-100 documentos para la demo

**Firestore Free Tier**:
- 50,000 lecturas/día
- 20,000 escrituras/día
- 20,000 deletes/día
- **¡Más que suficiente para desarrollo y demo!**

---

## 🚀 Próximos Pasos de Implementación

1. ✅ Crear colección `categories` con categorías iniciales
2. ✅ Crear colección `quizzes` con 10 quizzes de demostración
3. ✅ Crear colección `achievements` con logros básicos
4. ⏳ Implementar servicios de API para cada colección
5. ⏳ Crear pantallas para visualizar y gestionar datos

¿Quieres que ahora cree los datos de demostración (categorías y quizzes) en formato JSON para subirlos a Firestore?
