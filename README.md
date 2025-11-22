# 📱 QuizPro Learning

Una aplicación móvil educativa moderna para crear, compartir y resolver quizzes interactivos, desarrollada con React Native y Firebase.

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características Implementadas](#-características-implementadas)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración de Firebase](#-configuración-de-firebase)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades Principales](#-funcionalidades-principales)
- [Solución de Problemas](#-solución-de-problemas)
- [Arquitectura](#-arquitectura)
- [Próximas Funcionalidades](#-próximas-funcionalidades)

---

## 🎯 Descripción

**QuizPro Learning** es una plataforma educativa móvil que permite a los usuarios:
- Crear quizzes personalizados con diferentes tipos de preguntas
- Resolver quizzes creados por otros usuarios
- Seguir su progreso y estadísticas
- Explorar quizzes por categorías y niveles de dificultad
- Gestionar sus quizzes creados (editar, eliminar, ver estadísticas)

El objetivo final es crear una comunidad de aprendizaje interactivo donde los usuarios puedan compartir conocimientos a través de quizzes gamificados.

---

## ✅ Características Implementadas

### Autenticación
- ✅ Login con email y contraseña
- ✅ Registro de nuevos usuarios
- ✅ Autenticación con Google Sign-In
- ✅ Recuperación de contraseña
- ✅ Gestión de sesión persistente

### Home y Exploración
- ✅ Pantalla principal con quizzes destacados
- ✅ Filtrado por categorías (General, Ciencia, Historia, etc.)
- ✅ Filtrado por niveles (Básico, Intermedio, Avanzado, Experto)
- ✅ Búsqueda de quizzes
- ✅ Visualización de estadísticas de quizzes

### Creación de Quizzes
- ✅ Formulario completo de creación con validación
- ✅ Gestión dinámica de preguntas y respuestas
- ✅ Soporte para múltiples tipos de pregunta
- ✅ Configuración de nivel y categoría
- ✅ Opción de quiz público/privado
- ✅ Integración con Firestore
- ✅ Actualización automática de estadísticas de usuario

### Gestión de Quizzes
- ✅ Vista "Mis Quizzes" con lista de quizzes creados
- ✅ Eliminación de quizzes con confirmación
- ✅ Actualización automática de estadísticas al eliminar
- ✅ Recarga automática al volver a la pantalla
- ✅ Pull-to-refresh
- ✅ Estado vacío con mensaje informativo
- ✅ Botón flotante para crear nuevo quiz

### Resolver Quizzes
- ✅ Interfaz interactiva para responder preguntas
- ✅ Navegación entre preguntas
- ✅ Marcado de preguntas
- ✅ Sistema de puntuación
- ✅ Guardado de progreso
- ✅ Pantalla de resultados detallada
- ✅ Almacenamiento de resultados en Firestore

### Navegación
- ✅ Navegación por pestañas (Home, Búsqueda, Mis Quizzes, Perfil)
- ✅ Stack navigation para flujos complejos
- ✅ Navegación correcta entre pantallas
- ✅ Manejo de estados de navegación

### Perfil y Estadísticas
- ✅ Visualización de perfil de usuario
- ✅ Estadísticas personales (quizzes creados, completados, puntuación promedio)
- ✅ Configuración de la aplicación
- ✅ Cerrar sesión

---

## 🛠️ Tecnologías

### Frontend
- **React Native 0.82** - Framework de desarrollo móvil
- **TypeScript** - Tipado estático
- **React Navigation** - Sistema de navegación
- **React Hooks** - Gestión de estado

### Backend y Servicios
- **Firebase Authentication** - Autenticación de usuarios
- **Cloud Firestore** - Base de datos NoSQL
- **Firebase Storage** - Almacenamiento de archivos

### UI/UX
- **React Native Vector Icons** - Iconografía
- **React Native Linear Gradient** - Gradientes
- **Custom Theme System** - Sistema de temas personalizado

### Utilidades
- **Formik + Yup** - Gestión y validación de formularios
- **date-fns** - Manejo de fechas
- **AsyncStorage** - Almacenamiento local
- **NetInfo** - Detección de conectividad

---

## 📋 Requisitos Previos

- **Node.js** >= 20.0.0
- **npm** o **yarn**
- **React Native CLI**
- **Android Studio** (para Android) o **Xcode** (para iOS/macOS)
- **JDK** 17 o superior
- Cuenta de **Firebase**

---

## 🚀 Instalación

### 1. Clonar o navegar al proyecto

```bash
cd C:\Users\jeanm\QuizProLearning
```

### 2. Instalar dependencias

```bash
npm install
```

O si las dependencias ya están instaladas, verificar:

```bash
npm list
```

### 3. Dependencias principales ya instaladas:

```json
{
  "@react-native-firebase/app": "^23.5.0",
  "@react-native-firebase/auth": "^23.5.0",
  "@react-native-firebase/firestore": "^23.5.0",
  "@react-native-firebase/storage": "^23.5.0",
  "@react-native-google-signin/google-signin": "^16.0.0",
  "@react-navigation/native": "^7.1.20",
  "@react-navigation/stack": "^7.6.4",
  "@react-navigation/bottom-tabs": "^7.8.5",
  "react-native-vector-icons": "^10.3.0",
  "formik": "^2.4.9",
  "yup": "^1.7.1",
  "date-fns": "^4.1.0"
}
```

### 4. Configurar Vector Icons (Android)

Ya está configurado en `android/app/build.gradle`:

```gradle
apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")
```

### 5. Para iOS (solo macOS)

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

---

## 🔥 Configuración de Firebase

### 1. Crear Proyecto Firebase

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Crear un nuevo proyecto llamado **QuizProLearning**
3. Seguir los pasos de configuración

### 2. Habilitar Authentication

1. En Firebase Console → **Authentication** → **Sign-in method**
2. Habilitar:
   - ✅ **Email/Password**
   - ✅ **Google**

### 3. Configurar Firestore Database

1. Ir a **Firestore Database** → **Crear base de datos**
2. Modo: **Comenzar en modo de prueba** (cambiar a producción después)
3. Seleccionar ubicación más cercana

### 4. Reglas de Firestore

Ir a la pestaña **Reglas** y configurar:

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
        resource.data.createdBy.userId == request.auth.uid;
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

### 5. Configurar Android App

1. En Firebase Console → **Project Settings** → Agregar app Android
2. **Package name**: `com.quizprolearning`
3. **Descargar** `google-services.json`
4. Colocar en: `android/app/google-services.json`

### 6. Configurar build.gradle

En `android/build.gradle`, verificar:

```gradle
buildscript {
    dependencies {
        classpath('com.google.gms:google-services:4.4.0')
    }
}
```

En `android/app/build.gradle`, al final:

```gradle
apply plugin: 'com.google.gms.google-services'
```

### 7. Obtener Web Client ID (para Google Sign-In)

1. Firebase Console → **Authentication** → **Sign-in method**
2. Click en **Google**
3. Copiar el **Web client ID**
4. Configurar en el código si es necesario

### 8. Crear Índices de Firestore (Opcional pero Recomendado)

Para optimizar las consultas, crear estos índices compuestos:

**Colección: `quizzes`**

| Campo | Orden |
|-------|-------|
| `createdBy.userId` | Ascending |
| `isPublic` | Ascending |
| `createdAt` | Descending |

Firestore automáticamente mostrará un enlace para crear índices cuando sean necesarios.

---

## 📁 Estructura del Proyecto

```
QuizProLearning/
├── android/                    # Configuración Android
│   ├── app/
│   │   ├── google-services.json   # Configuración Firebase
│   │   └── build.gradle           # Gradle app
│   └── build.gradle               # Gradle proyecto
│
├── ios/                        # Configuración iOS (macOS)
│
├── src/
│   ├── models/                 # Modelos TypeScript
│   │   ├── User.ts            # Modelo de usuario
│   │   ├── Quiz.ts            # Modelo de quiz
│   │   ├── Result.ts          # Modelo de resultado
│   │   ├── Category.ts        # Enums de categorías
│   │   ├── Favorite.ts        # Favoritos
│   │   └── Rating.ts          # Valoraciones
│   │
│   ├── services/              # Servicios
│   │   ├── api/
│   │   │   ├── user.service.ts      # CRUD usuarios
│   │   │   ├── quiz.service.ts      # CRUD quizzes
│   │   │   ├── result.service.ts    # CRUD resultados
│   │   │   ├── favorite.service.ts  # Favoritos
│   │   │   └── rating.service.ts    # Valoraciones
│   │   └── firebase/
│   │       ├── auth.service.ts      # Autenticación
│   │       ├── firestore.service.ts # Firestore genérico
│   │       └── storage.service.ts   # Firebase Storage
│   │
│   ├── context/               # React Context
│   │   ├── AuthContext.tsx    # Contexto de autenticación
│   │   ├── ThemeContext.tsx   # Contexto de tema
│   │   └── QuizContext.tsx    # Contexto de quiz
│   │
│   ├── navigation/            # Navegación
│   │   ├── AppNavigator.tsx   # Navegador principal
│   │   ├── AuthStack.tsx      # Stack de autenticación
│   │   ├── HomeStack.tsx      # Stack de home
│   │   ├── SearchStack.tsx    # Stack de búsqueda
│   │   ├── MyQuizzesStack.tsx # Stack de mis quizzes
│   │   ├── ProfileStack.tsx   # Stack de perfil
│   │   └── TabNavigator.tsx   # Navegador de pestañas
│   │
│   ├── screens/              # Pantallas
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── home/
│   │   │   └── HomeScreen.tsx
│   │   ├── search/
│   │   │   └── SearchScreen.tsx
│   │   ├── myQuizzes/
│   │   │   ├── MyQuizzesScreen.tsx      # Lista de quizzes
│   │   │   ├── CreateQuizScreen.tsx     # Crear quiz
│   │   │   ├── EditQuizScreen.tsx       # Editar quiz
│   │   │   └── QuizStatisticsScreen.tsx # Estadísticas
│   │   ├── quiz/
│   │   │   ├── QuizDetailScreen.tsx     # Detalle del quiz
│   │   │   ├── TakeQuizScreen.tsx       # Resolver quiz
│   │   │   └── QuizResultScreen.tsx     # Resultado
│   │   └── profile/
│   │       ├── ProfileScreen.tsx
│   │       └── SettingsScreen.tsx
│   │
│   ├── components/           # Componentes reutilizables
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── quiz/
│   │   │   ├── QuizCard.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   └── ProgressBar.tsx
│   │   └── profile/
│   │       └── StatCard.tsx
│   │
│   └── styles/               # Sistema de estilos
│       ├── colors.ts         # Paleta de colores
│       ├── typography.ts     # Tipografía
│       ├── spacing.ts        # Espaciado
│       ├── borderRadius.ts   # Radio de bordes
│       ├── shadows.ts        # Sombras
│       └── theme.ts          # Tema general
│
├── App.tsx                   # Punto de entrada
├── package.json              # Dependencias
└── tsconfig.json            # Configuración TypeScript
```

---

## 🎮 Funcionalidades Principales

### 1. Creación de Quizzes

**Ubicación**: [CreateQuizScreen.tsx](src/screens/myQuizzes/CreateQuizScreen.tsx)

**Características**:
- Formulario con validación completa
- Campos: título, descripción, categoría, nivel, visibilidad
- Gestión dinámica de preguntas (añadir/eliminar)
- Gestión dinámica de respuestas (añadir/eliminar)
- Limpieza automática de campos undefined antes de guardar
- Actualización de estadísticas de usuario

**Flujo**:
1. Usuario completa formulario de metadatos
2. Añade preguntas con sus respectivas respuestas
3. Marca la respuesta correcta para cada pregunta
4. Valida que todo esté completo
5. Guarda en Firestore
6. Actualiza estadísticas del usuario
7. Navega de vuelta a "Mis Quizzes"

**Código clave**:
```typescript
// Limpieza de campos undefined
const questionsWithId: Question[] = questions.map((q, index) => {
  const question: Question = {
    questionId: `q${Date.now()}_${index}`,
    question: q.question,
    type: q.type,
    options: q.options,
    correctAnswer: q.correctAnswer,
    points: q.points,
  };
  if (q.explanation) question.explanation = q.explanation;
  if (q.imageURL) question.imageURL = q.imageURL;
  return question;
});
```

### 2. Gestión de Quizzes (Mis Quizzes)

**Ubicación**: [MyQuizzesScreen.tsx](src/screens/myQuizzes/MyQuizzesScreen.tsx)

**Características**:
- Lista de quizzes creados por el usuario
- Botón de eliminación en cada tarjeta
- Confirmación antes de eliminar
- Actualización automática de estadísticas
- Pull-to-refresh
- Auto-recarga al enfocar la pantalla
- Estado vacío con mensaje
- FAB para crear nuevo quiz

**Funcionalidad de eliminación**:
```typescript
const handleDeleteQuiz = async (quizId: string, quizTitle: string) => {
  Alert.alert(
    'Eliminar Quiz',
    `¿Estás seguro de que deseas eliminar "${quizTitle}"?`,
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await QuizService.deleteQuiz(quizId);
          if (user) {
            await UserService.decrementQuizzesCreated(user.id);
          }
          await loadQuizzes();
        },
      },
    ]
  );
};
```

### 3. Resolver Quizzes

**Ubicación**: [TakeQuizScreen.tsx](src/screens/quiz/TakeQuizScreen.tsx)

**Características**:
- Navegación entre preguntas
- Selección de respuestas
- Marcado de preguntas para revisión
- Barra de progreso
- Sistema de puntuación
- Guardado automático de progreso
- Timer opcional

**Flujo**:
1. Usuario selecciona un quiz
2. Pantalla muestra primera pregunta
3. Usuario responde y navega
4. Al terminar, calcula puntuación
5. Guarda resultado en Firestore
6. Muestra pantalla de resultados

### 4. Resultados de Quiz

**Ubicación**: [QuizResultScreen.tsx](src/screens/quiz/QuizResultScreen.tsx)

**Características**:
- Puntuación total
- Porcentaje de aciertos
- Desglose de respuestas correctas/incorrectas
- Botón para volver al inicio
- Opción para volver a intentar

**Navegación corregida**:
```typescript
const handleGoHome = () => {
  navigation.popToTop(); // Vuelve al inicio del stack actual
};
```

### 5. Autenticación

**Ubicación**:
- [LoginScreen.tsx](src/screens/auth/LoginScreen.tsx)
- [RegisterScreen.tsx](src/screens/auth/RegisterScreen.tsx)

**Métodos soportados**:
- Email y contraseña
- Google Sign-In
- Recuperación de contraseña

**Persistencia de sesión**: Implementada con Firebase Auth

---

## 🐛 Solución de Problemas

### Error: Índice de Firestore requerido

**Error**:
```
[firestore/failed-precondition] The query requires an index
```

**Solución implementada**:

En [quiz.service.ts:95](src/services/api/quiz.service.ts#L95):

```typescript
static async getQuizzesByCreator(
  creatorId: string,
  includePrivate: boolean = false
): Promise<Quiz[]> {
  try {
    // Intenta con índice compuesto
    const filters = [{ field: 'createdBy.userId', operator: '==', value: creatorId }];
    if (!includePrivate) {
      filters.push({ field: 'isPublic', operator: '==', value: true });
    }
    return await FirestoreService.query<Quiz>(
      COLLECTIONS.QUIZZES,
      filters as any,
      { field: 'createdAt', direction: 'desc' }
    );
  } catch (error: any) {
    if (error.code === 'firestore/failed-precondition') {
      // Fallback: consulta simple + ordenación local
      console.log('⚠️ Índice no encontrado, usando consulta simple');
      const allUserQuizzes = await FirestoreService.query<Quiz>(
        COLLECTIONS.QUIZZES,
        [{ field: 'createdBy.userId', operator: '==', value: creatorId }]
      );
      let filtered = allUserQuizzes;
      if (!includePrivate) {
        filtered = filtered.filter(q => q.isPublic);
      }
      return filtered.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
    }
    throw error;
  }
}
```

**Para crear el índice recomendado**:
- Firestore mostrará un enlace cuando el error ocurra
- O crear manualmente en Firebase Console

### Error: Campos undefined en Firestore

**Error**:
```
Error: Unsupported field value: undefined
```

**Causa**: Firestore no acepta valores `undefined`, solo `null` o valores explícitos.

**Solución implementada**:

En [quiz.service.ts:46](src/services/api/quiz.service.ts#L46):

```typescript
// Helper para remover campos undefined
private static removeUndefinedFields(obj: any): any {
  const cleaned: any = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        cleaned[key] = this.removeUndefinedFields(obj[key]);
      } else if (Array.isArray(obj[key])) {
        cleaned[key] = obj[key].map((item: any) =>
          typeof item === 'object' && item !== null ? this.removeUndefinedFields(item) : item
        );
      } else {
        cleaned[key] = obj[key];
      }
    }
  });
  return cleaned;
}
```

Aplicado en `createQuiz()` antes de guardar.

### Error: Navigation 'NAVIGATE' not handled

**Error**:
```
The action 'NAVIGATE' with payload {"name":"HomeMain"} was not handled
```

**Causa**: Intentar navegar a una pantalla que no existe en el contexto actual.

**Solución**:

Usar `navigation.popToTop()` en lugar de `navigation.navigate()`:

```typescript
// ❌ Incorrecto
navigation.navigate('HomeMain');

// ✅ Correcto
navigation.popToTop();
```

### Limpiar caché de Metro

```bash
npm start -- --reset-cache
```

### Reconstruir Android

```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Error de permisos de red

Verificar en `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

---

## 🏛️ Arquitectura

### Patrón de Arquitectura

La aplicación sigue una arquitectura en capas:

```
┌─────────────────────────────────────┐
│         PRESENTACIÓN (UI)           │
│  - Screens                          │
│  - Components                       │
│  - Navigation                       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         LÓGICA DE NEGOCIO           │
│  - Context (State Management)       │
│  - API Services (CRUD)              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         DATOS Y SERVICIOS           │
│  - Firebase Services                │
│  - Firestore                        │
│  - Authentication                   │
│  - Storage                          │
└─────────────────────────────────────┘
```

### Flujo de Datos

1. **Usuario interactúa** con la UI (Screen/Component)
2. **Screen llama** a un servicio de API
3. **API Service** valida y procesa datos
4. **Firebase Service** ejecuta operación en Firestore/Auth
5. **Resultado vuelve** a través de las capas
6. **UI se actualiza** con el nuevo estado

### Gestión de Estado

- **AuthContext**: Estado de autenticación global
- **ThemeContext**: Tema (Light/Dark)
- **QuizContext**: Quiz actual en resolución
- **Local State**: useState para estados de componentes

---

## 🎯 Próximas Funcionalidades

### Corto Plazo
- [ ] Editar quizzes existentes
- [ ] Ver estadísticas detalladas de cada quiz
- [ ] Sistema de favoritos
- [ ] Sistema de valoraciones
- [ ] Compartir quizzes

### Mediano Plazo
- [ ] Modo offline
- [ ] Búsqueda avanzada con filtros múltiples
- [ ] Rankings y leaderboards
- [ ] Notificaciones push
- [ ] Temas personalizables

### Largo Plazo
- [ ] Modo multijugador en tiempo real
- [ ] Sistema de logros y badges
- [ ] Integración con redes sociales
- [ ] Soporte para imágenes en preguntas
- [ ] Exportar/importar quizzes
- [ ] Analytics avanzados

---

## 📊 Modelos de Datos

### User
```typescript
interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  stats: {
    quizzesCreated: number;
    quizzesCompleted: number;
    averageScore: number;
    totalPoints: number;
  };
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  createdAt: Date;
}
```

### Quiz
```typescript
interface Quiz {
  quizId: string;
  title: string;
  description: string;
  category: QuizCategory;
  level: QuizLevel;
  questions: Question[];
  createdBy: {
    userId: string;
    displayName: string;
    photoURL?: string;
  };
  isPublic: boolean;
  stats: {
    totalAttempts: number;
    totalCompletions: number;
    averageScore: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Result
```typescript
interface Result {
  resultId: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: Date;
}
```

---

## 🤝 Contribuir

Este es un proyecto educativo personal. Si deseas contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👨‍💻 Autor

Desarrollado por Jean Martinez

---

## 🙏 Agradecimientos

- React Native Team
- Firebase Team
- Comunidad de React Native
- Todos los que han contribuido con librerías open source utilizadas

---

## 📞 Soporte

Para reportar problemas o sugerir mejoras:
- Crear un issue en el repositorio
- Contactar al desarrollador

---

## 📚 Recursos Adicionales

- [Documentación de React Native](https://reactnative.dev/docs/getting-started)
- [Documentación de Firebase](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

<div align="center">
  <p><strong>Desarrollado con ❤️ usando React Native y Firebase</strong></p>
  <p>© 2025 QuizPro Learning</p>
</div>
