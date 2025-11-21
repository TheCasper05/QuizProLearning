# ☕ Instalar Java 17 para React Native

## ⚠️ Problema Actual
- Tienes instalado: **Java 8**
- Necesitas: **Java 17 o superior**
- Error: "Gradle requires JVM 17 or later to run"

---

## 📥 Opción 1: Instalar OpenJDK 17 (Recomendado)

### Usando Chocolatey (si lo tienes instalado):

```bash
choco install microsoft-openjdk17
```

### Descarga Manual:

1. Ve a [Microsoft OpenJDK 17](https://learn.microsoft.com/en-us/java/openjdk/download#openjdk-17)
2. Descarga la versión **Windows x64**:
   - Archivo: `microsoft-jdk-17.x.x-windows-x64.msi`
3. Ejecuta el instalador
4. Sigue los pasos del asistente

---

## 📥 Opción 2: Instalar Oracle JDK 17

1. Ve a [Oracle JDK Downloads](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
2. Descarga **Windows x64 Installer**
3. Ejecuta el instalador
4. Acepta los términos y condiciones

---

## 🔧 Configurar Variables de Entorno (Importante)

Después de instalar, debes configurar las variables de entorno:

### **1. Encontrar la Ruta de Instalación**

Java 17 generalmente se instala en:
- Microsoft OpenJDK: `C:\Program Files\Microsoft\jdk-17.x.x`
- Oracle JDK: `C:\Program Files\Java\jdk-17`

### **2. Configurar JAVA_HOME**

#### Opción A: Usando PowerShell (Administrador):

```powershell
# Reemplaza la ruta con tu instalación real
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Microsoft\jdk-17.0.14", [System.EnvironmentVariableTarget]::Machine)
```

#### Opción B: Manualmente:

1. Presiona **Windows + R**
2. Escribe: `sysdm.cpl` y presiona Enter
3. Ve a la pestaña **"Opciones avanzadas"**
4. Haz clic en **"Variables de entorno"**
5. En **"Variables del sistema"**, haz clic en **"Nueva"**:
   - **Nombre**: `JAVA_HOME`
   - **Valor**: `C:\Program Files\Microsoft\jdk-17.0.14` (ajusta según tu instalación)
6. Haz clic en **"Aceptar"**

### **3. Actualizar PATH**

1. En "Variables del sistema", busca **"Path"**
2. Haz clic en **"Editar"**
3. Agrega una nueva entrada: `%JAVA_HOME%\bin`
4. Mueve esta entrada al principio de la lista (importante)
5. Haz clic en **"Aceptar"**

---

## ✅ Verificar Instalación

**IMPORTANTE**: Cierra y vuelve a abrir todas las terminales/VSCode antes de verificar.

```bash
# Verificar versión de Java
java -version

# Deberías ver algo como:
# openjdk version "17.0.14" 2024-XX-XX
# OpenJDK Runtime Environment Microsoft-XXXXXXX (build 17.0.14+X)
# OpenJDK 64-Bit Server VM Microsoft-XXXXXXX (build 17.0.14+X, mixed mode, sharing)

# Verificar JAVA_HOME
echo %JAVA_HOME%

# Deberías ver:
# C:\Program Files\Microsoft\jdk-17.0.14
```

---

## 🔄 Después de Instalar Java 17

1. **Cierra VSCode completamente**
2. **Cierra todas las terminales**
3. **Abre una nueva terminal**
4. **Verifica que Java 17 esté activo**: `java -version`
5. **Continúa con la compilación**

---

## 🚨 Solución de Problemas

### Si `java -version` sigue mostrando Java 8:

1. Verifica que `JAVA_HOME` apunte a Java 17:
   ```bash
   echo %JAVA_HOME%
   ```

2. Verifica que `%JAVA_HOME%\bin` esté al PRINCIPIO del PATH:
   ```bash
   echo %PATH%
   ```

3. Asegúrate de haber cerrado y reabierto la terminal

### Si Gradle sigue usando Java 8:

Agrega esto a `gradle.properties` en la carpeta `android/`:

```properties
org.gradle.java.home=C:\\Program Files\\Microsoft\\jdk-17.0.14
```

(Ajusta la ruta según tu instalación, usa doble backslash `\\`)

---

## 📝 Comandos Útiles

```bash
# Ver todas las versiones de Java instaladas (Windows)
where java

# Ver qué Java está usando Gradle
cd android
./gradlew -version
```

---

## ✅ Una Vez Instalado

Vuelve aquí y avísame cuando tengas Java 17 instalado y verificado. Continuaremos con la compilación de la app.
