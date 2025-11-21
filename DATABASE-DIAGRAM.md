# 📊 Diagrama del Modelo de Base de Datos - QuizPro Learning

## 🎨 Diagrama ER (Entity-Relationship) en Mermaid

### Diagrama Completo con Relaciones

```mermaid
erDiagram
    USERS ||--o{ QUIZZES : creates
    USERS ||--o{ RESULTS : takes
    USERS ||--o{ FAVORITES : marks
    USERS ||--o{ RATINGS : gives
    USERS ||--o{ USER_ACHIEVEMENTS : unlocks

    QUIZZES ||--o{ RESULTS : generates
    QUIZZES ||--o{ FAVORITES : receives
    QUIZZES ||--o{ RATINGS : receives
    QUIZZES }o--|| CATEGORIES : belongs_to

    ACHIEVEMENTS ||--o{ USER_ACHIEVEMENTS : awards

    USERS {
        string userId PK
        string email UK
        string displayName
        string photoURL
        object stats
        array achievements
        object preferences
        timestamp createdAt
        timestamp updatedAt
    }

    QUIZZES {
        string quizId PK
        string title
        string description
        string imageUrl
        string category FK
        string level
        boolean isPublic
        object createdBy
        array questions
        object stats
        object settings
        timestamp createdAt
    }

    RESULTS {
        string resultId PK
        string userId FK
        string quizId FK
        number score
        number percentage
        array answers
        timestamp completedAt
    }

    FAVORITES {
        string favoriteId PK
        string userId FK
        string quizId FK
        object quizSnapshot
        timestamp createdAt
    }

    RATINGS {
        string ratingId PK
        string userId FK
        string quizId FK
        number rating
        string comment
        timestamp createdAt
    }

    CATEGORIES {
        string categoryId PK
        string name UK
        string emoji
        string description
        string color
        object stats
    }

    ACHIEVEMENTS {
        string achievementId PK
        string name
        string description
        string emoji
        object condition
        object rewards
        string rarity
    }

    USER_ACHIEVEMENTS {
        string userId FK
        string achievementId FK
        timestamp unlockedAt
    }
```

---

## 🔄 Diagrama de Flujo de Datos Simplificado

```mermaid
graph TB
    subgraph "👤 Usuario"
        U[User]
    end

    subgraph "📝 Contenido"
        Q[Quizzes]
        C[Categories]
    end

    subgraph "📊 Interacciones"
        R[Results]
        F[Favorites]
        RT[Ratings]
    end

    subgraph "🏆 Gamificación"
        A[Achievements]
    end

    U -->|crea| Q
    U -->|completa| R
    U -->|marca| F
    U -->|califica| RT
    U -->|desbloquea| A

    Q -->|pertenece a| C
    Q -->|genera| R
    Q -->|recibe| F
    Q -->|recibe| RT

    R -->|actualiza| U
    R -->|actualiza stats| Q

    style U fill:#4A90E2,stroke:#2E5C8A,color:#fff
    style Q fill:#50C878,stroke:#3A9B5C,color:#fff
    style C fill:#FFA500,stroke:#CC8400,color:#fff
    style R fill:#9B59B6,stroke:#7D3C98,color:#fff
    style F fill:#E74C3C,stroke:#C0392B,color:#fff
    style RT fill:#F39C12,stroke:#C87F0A,color:#fff
    style A fill:#FFD700,stroke:#DAA520,color:#333
```

---

## 🗂️ Estructura de Colecciones (Árbol)

```mermaid
graph TD
    FS[🔥 Firestore Database]

    FS --> U[📁 users/]
    FS --> Q[📁 quizzes/]
    FS --> R[📁 results/]
    FS --> F[📁 favorites/]
    FS --> RT[📁 ratings/]
    FS --> C[📁 categories/]
    FS --> A[📁 achievements/]

    U --> U1[📄 userId1]
    U --> U2[📄 userId2]

    Q --> Q1[📄 quizId1]
    Q --> Q2[📄 quizId2]
    Q1 --> QQ[questions Array]

    R --> R1[📄 resultId1]
    R --> R2[📄 resultId2]
    R1 --> RA[answers Array]

    F --> F1[📄 favoriteId1]

    RT --> RT1[📄 ratingId1]

    C --> C1[📄 Ciencias]
    C --> C2[📄 Historia]
    C --> C3[📄 Matemáticas]

    A --> A1[📄 primer_paso]
    A --> A2[📄 creador]

    style FS fill:#FF6B35,stroke:#CC5429,color:#fff
    style U fill:#4A90E2,stroke:#2E5C8A,color:#fff
    style Q fill:#50C878,stroke:#3A9B5C,color:#fff
    style R fill:#9B59B6,stroke:#7D3C98,color:#fff
    style F fill:#E74C3C,stroke:#C0392B,color:#fff
    style RT fill:#F39C12,stroke:#C87F0A,color:#fff
    style C fill:#FFA500,stroke:#CC8400,color:#fff
    style A fill:#FFD700,stroke:#DAA520,color:#333
```

---

## 📐 Diagrama de Cardinalidad

```mermaid
graph LR
    subgraph "1:N Relationships"
        U1[User 1] -->|creates| Q1[Quizzes N]
        U2[User 1] -->|takes| R1[Results N]
        U3[User 1] -->|marks| F1[Favorites N]
        U4[User 1] -->|gives| RT1[Ratings N]

        Q2[Quiz 1] -->|has| R2[Results N]
        Q3[Quiz 1] -->|receives| F2[Favorites N]
        Q4[Quiz 1] -->|receives| RT2[Ratings N]

        C1[Category 1] -->|contains| Q5[Quizzes N]
    end

    subgraph "N:M Relationship"
        UN[Users N] -.->|unlocks| AM[Achievements M]
    end

    style U1 fill:#4A90E2,color:#fff
    style U2 fill:#4A90E2,color:#fff
    style U3 fill:#4A90E2,color:#fff
    style U4 fill:#4A90E2,color:#fff
    style UN fill:#4A90E2,color:#fff

    style Q1 fill:#50C878,color:#fff
    style Q2 fill:#50C878,color:#fff
    style Q3 fill:#50C878,color:#fff
    style Q4 fill:#50C878,color:#fff
    style Q5 fill:#50C878,color:#fff

    style C1 fill:#FFA500,color:#fff
    style AM fill:#FFD700,color:#333
```

---

## 🎯 Índices y Optimizaciones

```mermaid
graph TD
    subgraph "🔍 Índices Importantes"
        I1[users.email - único]
        I2[quizzes.category + isPublic]
        I3[quizzes.createdBy.userId]
        I4[results.userId + completedAt]
        I5[favorites.userId + quizId - único]
        I6[ratings.userId + quizId - único]
    end

    subgraph "⚡ Consultas Optimizadas"
        Q1[Quizzes populares]
        Q2[Quizzes por categoría]
        Q3[Historial del usuario]
        Q4[Favoritos del usuario]
        Q5[Ratings de quiz]
    end

    I2 --> Q1
    I2 --> Q2
    I4 --> Q3
    I5 --> Q4
    I6 --> Q5

    style I1 fill:#3498DB,color:#fff
    style I2 fill:#3498DB,color:#fff
    style I3 fill:#3498DB,color:#fff
    style I4 fill:#3498DB,color:#fff
    style I5 fill:#3498DB,color:#fff
    style I6 fill:#3498DB,color:#fff
```

---

## 🛠️ Herramientas para Crear Diagramas Profesionales

### 1. **draw.io (diagrams.net)** ⭐ RECOMENDADO
- **URL**: https://app.diagrams.net/
- **Ventajas**:
  - ✅ Gratis y open source
  - ✅ No requiere registro
  - ✅ Exporta a PNG, SVG, PDF
  - ✅ Integración con Google Drive, OneDrive
  - ✅ Plantillas de ER y base de datos
- **Cómo usarlo**:
  1. Ve a https://app.diagrams.net/
  2. Selecciona "Create New Diagram"
  3. Escoge plantilla "Entity Relation" o "Software"
  4. Arrastra y suelta entidades
  5. Exporta como imagen

### 2. **Lucidchart**
- **URL**: https://www.lucidchart.com/
- **Ventajas**:
  - ✅ Muy profesional y pulido
  - ✅ Colaboración en tiempo real
  - ✅ Plantillas específicas para bases de datos
  - ⚠️ Requiere cuenta (tiene plan gratuito limitado)

### 3. **dbdiagram.io**
- **URL**: https://dbdiagram.io/
- **Ventajas**:
  - ✅ Especializado en bases de datos
  - ✅ Código declarativo (escribes texto, genera diagrama)
  - ✅ Exporta a PNG, PDF, SQL
  - ✅ Gratis para uso básico
- **Ejemplo de código**:
```dbml
Table users {
  userId varchar [pk]
  email varchar [unique]
  displayName varchar
  createdAt timestamp
}

Table quizzes {
  quizId varchar [pk]
  title varchar
  category varchar [ref: > categories.categoryId]
  createdBy varchar [ref: > users.userId]
}

Table categories {
  categoryId varchar [pk]
  name varchar [unique]
}
```

### 4. **Mermaid Live Editor**
- **URL**: https://mermaid.live/
- **Ventajas**:
  - ✅ Gratis, sin registro
  - ✅ Preview en tiempo real
  - ✅ Exporta a PNG, SVG
  - ✅ Funciona en GitHub, VSCode, Notion
- **Cómo usarlo**:
  1. Copia el código Mermaid de arriba
  2. Pégalo en https://mermaid.live/
  3. Descarga como imagen

### 5. **Visual Studio Code con extensiones**
- **Extensiones recomendadas**:
  - `Mermaid Preview` - Preview de diagramas Mermaid
  - `Draw.io Integration` - draw.io dentro de VSCode
  - `PlantUML` - Otro formato de diagramas
- **Ventajas**:
  - ✅ Todo dentro del editor
  - ✅ Control de versiones con Git
  - ✅ Markdown + diagramas en un solo lugar

### 6. **Excalidraw**
- **URL**: https://excalidraw.com/
- **Ventajas**:
  - ✅ Estilo dibujado a mano (muy visual)
  - ✅ Gratis, sin registro
  - ✅ Colaboración en tiempo real
  - ✅ Exporta a PNG, SVG
  - ✅ Muy intuitivo

---

## 📝 Instrucciones Rápidas para draw.io

### Paso a Paso:

1. **Abre draw.io**: https://app.diagrams.net/
2. **Selecciona ubicación**: "Device" o "Google Drive"
3. **Escoge plantilla**: "Entity Relation" o "Blank Diagram"
4. **Crea las entidades**:
   - Busca "Rectangle" o "Entity" en la barra lateral
   - Arrastra 7 rectángulos (una por colección)
   - Nómbralos: users, quizzes, results, etc.
5. **Agrega atributos**:
   - Doble clic en cada entidad
   - Lista los campos principales
6. **Conecta las relaciones**:
   - Usa flechas para conectar
   - Etiqueta las relaciones: "creates", "takes", etc.
7. **Estiliza**:
   - Colores diferentes por tipo
   - Agrega iconos/emojis
8. **Exporta**:
   - File → Export as → PNG/SVG/PDF

---

## 🎨 Código para dbdiagram.io

Copia y pega esto en https://dbdiagram.io/:

```dbml
Table users {
  userId varchar [pk]
  email varchar [unique]
  displayName varchar
  photoURL varchar
  stats json
  achievements json_array
  preferences json
  createdAt timestamp
  updatedAt timestamp
}

Table quizzes {
  quizId varchar [pk]
  title varchar
  description text
  imageUrl varchar
  category varchar [ref: > categories.categoryId]
  level varchar
  isPublic boolean
  createdBy_userId varchar [ref: > users.userId]
  questions json_array
  stats json
  settings json
  createdAt timestamp
  updatedAt timestamp
}

Table results {
  resultId varchar [pk]
  userId varchar [ref: > users.userId]
  quizId varchar [ref: > quizzes.quizId]
  score int
  percentage float
  correctAnswers int
  answers json_array
  completedAt timestamp
  createdAt timestamp
}

Table favorites {
  favoriteId varchar [pk]
  userId varchar [ref: > users.userId]
  quizId varchar [ref: > quizzes.quizId]
  quizSnapshot json
  createdAt timestamp

  Indexes {
    (userId, quizId) [unique]
  }
}

Table ratings {
  ratingId varchar [pk]
  userId varchar [ref: > users.userId]
  quizId varchar [ref: > quizzes.quizId]
  rating int
  comment text
  createdAt timestamp
  updatedAt timestamp

  Indexes {
    (userId, quizId) [unique]
  }
}

Table categories {
  categoryId varchar [pk]
  name varchar [unique]
  emoji varchar
  description text
  color varchar
  stats json
  isActive boolean
  order int
}

Table achievements {
  achievementId varchar [pk]
  name varchar
  description text
  emoji varchar
  condition json
  rewards json
  rarity varchar
  order int
}
```

---

## 📊 Resumen Visual de Colecciones

```
┌─────────────────────────────────────────────────────────┐
│                   🗄️ FIRESTORE DATABASE                 │
└─────────────────────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
    ┌───▼───┐           ┌────▼────┐         ┌────▼────┐
    │ USERS │           │ QUIZZES │         │CATEGORIES│
    │  (1)  │           │   (N)   │         │   (8)   │
    └───┬───┘           └────┬────┘         └─────────┘
        │                    │
        │    ┌───────────────┼───────────────┐
        │    │               │               │
    ┌───▼────▼───┐      ┌────▼────┐    ┌────▼────┐
    │  RESULTS   │      │FAVORITES│    │ RATINGS │
    │    (N)     │      │   (N)   │    │   (N)   │
    └────────────┘      └─────────┘    └─────────┘
        │
    ┌───▼──────────┐
    │ ACHIEVEMENTS │
    │     (15)     │
    └──────────────┘

Leyenda:
(1)  = Pocos documentos
(N)  = Muchos documentos
(8)  = Cantidad fija
```

---

## 💡 Recomendación Final

**Para la demo del lunes**, te recomiendo:

1. **Usa Mermaid** en el README.md para documentación técnica
2. **Crea un diagrama en draw.io** para la presentación visual (más profesional)
3. **Exporta como PNG** para incluir en documentos o presentaciones

¿Quieres que te ayude a crear el diagrama en alguna herramienta específica o prefieres que ahora creemos los datos de demostración?
