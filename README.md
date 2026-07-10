# MiFormacionApp

Mockup UI (diseño de interfaz) para la PWA de MiFormacionApp. Actualmente es una maqueta estática desarrollada con **React + Javascript + Tailwind CSS + Vite**, enfocada en la experiencia de usuario y el diseño visual, sin funcionalidad de backend.

## Puesta en marcha desde cero

Sigue estos pasos en orden para poder ejecutar la app en local.

### 1. Instalar Node.js

Descarga e instala Node.js desde [nodejs.org](https://nodejs.org/) (versión 18 o superior recomendada).

Para verificar que se instaló correctamente:

```bash
node --version
npm --version
```

En caso de que sí se haya instalado y salte el error:
```bash
node : El término 'node' no se reconoce como nombre de un cmdlet, función, archivo de script o programa ejecutable. Compruebe si escribió 
correctamente el nombre o, si incluyó una ruta de acceso, compruebe que dicha ruta es correcta e inténtelo de nuevo.
En línea: 1 Carácter: 1
+ node --version
+ ~~~~
    + CategoryInfo          : ObjectNotFound: (node:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
```

Es muy probable que no se haya configurado bien las variables del sistema.
Dele a la tecla Win, busque "Variables del sistema". Abajo a la derecha pulse en Variables de entorno. Añada una nueva variable para el usuario llamandola "node", seleccione la carpeta en dónde lo tenga instalado.
Si ha seguido los pasos correctamente ya le debería de funcionar el:
```bash
node --version
```

Sí ahora tiene problemas con:
```bash
npm --version 
npm : No se puede cargar el archivo "Ruta de node.js" porque la ejecución de scripts está deshabilitada en este sistema. Para 
obtener más información, consulta el tema about_Execution_Policies en https:/go.microsoft.com/fwlink/?LinkID=135170.
En línea: 1 Carácter: 1
+ npm --version
+ ~~~
    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
```

Simplemente ejecute:
```bash
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### 2. Instalar pnpm

La app usa **pnpm** como gestor de paquetes. Si no lo tienes instalado:

```bash
npm install -g pnpm
```

Verifica la instalación:

```bash
pnpm --version
```

### 3. Entra en el repositorio

```bash
cd MiFormacionApp
```

### 4. Instalar las dependencias del proyecto

```bash
pnpm install
```

Este comando descarga e instala todas las librerías necesarias (React, Vite, Tailwind, etc.) en la carpeta `node_modules/`.

### 5. Arrancar la app en desarrollo

```bash
pnpm dev
```

Esto inicia el servidor de desarrollo. Abre http://localhost:5173 en el navegador para ver la aplicación.

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `pnpm dev` | Inicia el servidor de desarrollo en `http://localhost:5173` |
| `pnpm build` | Genera los archivos de producción en la carpeta `dist/` |
 | `pnpm preview` | Sirve el contenido de `dist/` para verificar el build localmente |

## HTML autónomo para pruebas sin pnpm ni servidor

Si solo quieres probar la app sin instalar pnpm ni arrancar un servidor, puedes generar un **HTML 100% autónomo** con todo inlineado (React, CSS, imágenes, fuentes):

```bash
node scripts/build-standalone.js
```

Esto genera `standalone.html` en la raíz del proyecto. Ábrelo directamente en el navegador (doble clic o `file://`) y funciona sin necesidad de servidor, build tools ni dependencias.

**Regenerar tras cambios:** Cada vez que modifiques el código, vuelve a ejecutar el comando para actualizar el standalone.

> ⚠️ El archivo pesa +16 MB por las imágenes inlineadas en base64. Es solo para pruebas rápidas, NO para producción.
