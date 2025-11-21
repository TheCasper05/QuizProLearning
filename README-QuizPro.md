# 📱 QuizPro Learning

Una aplicación móvil educativa moderna para crear, compartir y resolver quizzes interactivos.

## 🎯 Estado del Proyecto

### ✅ Completado

- [x] Proyecto React Native creado
- [x] Estructura de carpetas completa
- [x] Modelos TypeScript (User, Quiz, Category, Result, Favorite, Rating)
- [x] Sistema de estilos y temas (Light/Dark mode)
- [x] Configuración básica de Firebase

### ⏳ Pendiente

- [ ] Instalar dependencias npm
- [ ] Configurar Firebase (Authentication, Firestore)
- [ ] Copiar servicios de Firebase y API
- [ ] Copiar Contexts (Auth, Theme, Quiz)
- [ ] Copiar navegación
- [ ] Copiar componentes
- [ ] Implementar pantallas
- [ ] Probar aplicación

## 🚀 Inicio Rápido

### Opción 1: Instalación Automática (Recomendado)

```bash
# Ejecutar el instalador automático
install-dependencies.bat
```

### Opción 2: Instalación Manual

Ver [SETUP-INSTRUCTIONS.md](./SETUP-INSTRUCTIONS.md) para instrucciones detalladas paso a paso.

## 📦 Archivos de Referencia

En la carpeta padre (`C:\Users\jeanm\`) encontrarás estos archivos de referencia:

1. **QuizPro-INSTALLATION-GUIDE.md** - Guía completa de instalación
2. **QuizPro-RESUMEN-COMPLETO.md** - Resumen del proyecto completo
3. **QuizPro-FirebaseServices.ts** - Servicios de Firebase
4. **QuizPro-APIServices.ts** - Servicios de API
5. **QuizPro-Contexts.tsx** - Contexts de React
6. **QuizPro-Navigation.tsx** - Sistema de navegación
7. **QuizPro-Components.tsx** - Componentes reutilizables
8. **QuizPro-App.tsx** - App principal
9. **QuizPro-LoginScreen-EXAMPLE.tsx** - Ejemplo de pantalla

## 🏗️ Estructura Actual

```
QuizProLearning/
├── src/
│   ├── models/          ✅ Completado
│   │   ├── User.ts
│   │   ├── Category.ts
│   │   ├── Quiz.ts
│   │   ├── Result.ts
│   │   ├── Favorite.ts
│   │   └── Rating.ts
│   │
│   ├── styles/          ✅ Completado
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── borderRadius.ts
│   │   ├── shadows.ts
│   │   └── theme.ts
│   │
│   ├── services/        ⏳ Por copiar
│   │   ├── firebase/
│   │   └── api/
│   │
│   ├── context/         ⏳ Por copiar
│   ├── navigation/      ⏳ Por copiar
│   ├── components/      ⏳ Por copiar
│   └── screens/         ⏳ Por implementar
│
├── SETUP-INSTRUCTIONS.md
├── install-dependencies.bat
└── README.md
```

## 📝 Próximos Pasos

1. **Instalar dependencias**:
   ```bash
   install-dependencies.bat
   ```

2. **Configurar Firebase**:
   - Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Descargar `google-services.json`
   - Configurar Authentication y Firestore
   - Ver [SETUP-INSTRUCTIONS.md](./SETUP-INSTRUCTIONS.md#paso-2-configurar-firebase-20-minutos)

3. **Copiar archivos faltantes**:
   - Servicios de Firebase y API
   - Contexts (Auth, Theme, Quiz)
   - Navegación
   - Componentes
   - App.tsx

4. **Ejecutar la app**:
   ```bash
   npm run android
   ```

## 🛠️ Tecnologías

- React Native 0.82
- TypeScript
- Firebase (Auth, Firestore, Storage)
- React Navigation
- Context API

## 📚 Documentación

- [Guía de Instalación](./SETUP-INSTRUCTIONS.md)
- [Resumen Completo](../QuizPro-RESUMEN-COMPLETO.md)
- [Guía Detallada](../QuizPro-INSTALLATION-GUIDE.md)

## ❓ Ayuda

Si tienes problemas:
1. Revisa [SETUP-INSTRUCTIONS.md](./SETUP-INSTRUCTIONS.md)
2. Consulta la sección "Solución de Problemas"
3. Verifica que todas las dependencias estén instaladas

## 📞 Soporte

- Documentación: Ver archivos QuizPro-* en carpeta padre
- Issues: Crear issue en el repositorio

---

<div align="center">
  <p>Desarrollado con ❤️ usando React Native</p>
  <p>© 2025 QuizPro Learning</p>
</div>
