# 🔧 Configuración de Índices de Firestore

## 🐛 Problema

Cuando intentas cargar los quizzes en MyQuizzesScreen, aparece este error:

```
[firestore/failed-precondition] The query requires an index.
```

**Causa**: Firestore requiere índices compuestos cuando haces consultas con múltiples filtros u ordenamientos.

---

## ✅ Solución: Crear Índice en Firebase Console

### Opción 1: Usar el Link del Error (Recomendado)

El error incluye un link directo para crear el índice. Simplemente:

1. Copia el URL del error (empieza con `https://console.firebase.google.com/...`)
2. Pégalo en tu navegador
3. Haz clic en **"Crear índice"**
4. Espera 2-5 minutos mientras Firebase lo crea
5. Recarga la app

### Opción 2: Crear Manualmente

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto: **QuizProLearning**
3. Ve a **Firestore Database** → **Índices**
4. Haz clic en **"Crear índice"**

**Configuración del índice:**

```
Collection ID: quizzes
Fields indexed:
  - createdBy.userId (Ascending)
  - createdAt (Descending)
Query scope: Collection
```

5. Haz clic en **"Crear"**
6. Espera a que el estado cambie de "Building" a "Enabled"

---

## 📊 Índices Recomendados

Para que la app funcione completamente, necesitas crear estos índices:

### 1. Índice para MyQuizzesScreen (Quizzes del usuario)

```
Collection: quizzes
Fields:
  - createdBy.userId: Ascending
  - createdAt: Descending
```

**Uso**: Muestra los quizzes creados por el usuario ordenados por fecha.

### 2. Índice para Quizzes Públicos con filtro (Opcional)

```
Collection: quizzes
Fields:
  - createdBy.userId: Ascending
  - isPublic: Ascending
  - createdAt: Descending
```

**Uso**: Filtrar entre quizzes públicos y privados del usuario.

### 3. Índice para Categoría + Público (HomeScreen)

```
Collection: quizzes
Fields:
  - isPublic: Ascending
  - category: Ascending
  - createdAt: Descending
```

**Uso**: Mostrar quizzes públicos de una categoría específica.

### 4. Índice para Nivel + Público (HomeScreen)

```
Collection: quizzes
Fields:
  - isPublic: Ascending
  - level: Ascending
  - createdAt: Descending
```

**Uso**: Mostrar quizzes públicos de un nivel específico.

---

## 🔍 Verificar Índices Existentes

1. Ve a Firebase Console → Firestore Database → Índices
2. Verás una lista de todos tus índices
3. Asegúrate de que el estado sea **"Enabled"** (no "Building" ni "Error")

---

## ⚡ Solución Temporal (Sin Índice)

Si no quieres crear índices, puedes modificar `quiz.service.ts` para obtener todos los quizzes y filtrar localmente:

```typescript
// En quiz.service.ts
static async getQuizzesByCreator(
  creatorId: string,
  includePrivate: boolean = false
): Promise<Quiz[]> {
  // Obtener TODOS los quizzes (sin ordenar)
  const allQuizzes = await FirestoreService.query<Quiz>(
    COLLECTIONS.QUIZZES,
    [{ field: 'createdBy.userId', operator: '==', value: creatorId }]
    // SIN orderBy para evitar necesitar índice
  );

  // Filtrar y ordenar localmente
  let filtered = allQuizzes;
  if (!includePrivate) {
    filtered = filtered.filter(q => q.isPublic);
  }

  // Ordenar por fecha (más reciente primero)
  return filtered.sort((a, b) => {
    const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
    const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
}
```

**Ventaja**: No requiere índice, funciona inmediatamente.

**Desventaja**: Menos eficiente si tienes muchos quizzes (trae todos y filtra localmente).

---

## 🚀 Recomendación para Producción

Para una app en producción, **SIEMPRE crea los índices** en Firestore. Esto garantiza:

- ✅ Consultas más rápidas
- ✅ Menor uso de datos
- ✅ Mejor escalabilidad
- ✅ Costos más bajos

Para desarrollo/demo, puedes usar la solución temporal si no quieres esperar a que se creen los índices.

---

## 📝 Estado Actual

Después de implementar CreateQuizScreen, necesitas crear el índice de `createdBy.userId + createdAt` para que MyQuizzesScreen funcione correctamente.

**Comando para verificar que el índice está creado**:

Ve a Firebase Console y verifica que aparezca en la lista de índices con estado **"Enabled"**.

---

## 💡 Tips

- Los índices tardan 2-5 minutos en crearse
- Firebase crea automáticamente índices simples (un solo campo)
- Solo necesitas crear índices compuestos (múltiples campos)
- Puedes tener hasta 200 índices compuestos por proyecto
- Los índices se actualizan automáticamente cuando guardas datos

¡Una vez creado el índice, la app funcionará perfectamente! 🎉
