# 📱 A.C.D. Los Locos — Ecosistema Digital Completo

<p align="center">
  <img src="https://img.shields.io/badge/Status-En%20Desarrollo-orange?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/License-All%20Rights%20Reserved-red?style=for-the-badge" alt="Licencia">
  <img src="https://img.shields.io/badge/Framework-Angular%20%2F%20Ionic-blueviolet?style=for-the-badge" alt="Framework">
</p>

---

¡Bienvenido al repositorio central de **A.C.D. Los Locos**! Este monorepositorio alberga toda la infraestructura tecnológica, lógica de negocio y aplicaciones multiplataforma que dan vida al ecosistema digital del club.

## 📖 Portal de Documentación Técnica

Contamos con un portal web interactivo autogenerado con **VitePress** que incluye guías de arquitectura, flujos de datos detallados y la **API Reference completa** mapeada directamente desde el código fuente mediante JSDocs y TypeDoc.

> 🚀 **[¡Haz clic aquí para abrir la Documentación del Proyecto!](http://localhost:5173)**  
> *(Nota: Cambia esta URL por el enlace de producción si despliegas la documentación en GitHub Pages, Netlify o Vercel).*

---

## 📦 Estructura del Ecosistema

El proyecto está diseñado bajo una arquitectura modular para maximizar la reutilización de código:

*   **`📱 src/app/` (App Móvil Principal):** Aplicación híbrida desarrollada con **Ionic y Angular**. Centraliza la gestión de socios, reservas, control de accesos y visualización de aforos en tiempo real mediante suscripciones reactivas a la base de datos.
*   **`🌐 projects/web-onboarding/` (Web Onboarding):** Portal web independiente ligero enfocado en la captación y flujo de registro automatizado para nuevos miembros del club.
*   **`📦 projects/shared-core/` (Librería Core):** El núcleo lógico del ecosistema. Reúne interfaces, tipos de TypeScript, servicios compartidos, helpers y utilidades comunes que consumen tanto la app móvil como la web.
*   **`🔥 functions/` (Cloud Functions Backend):** Capa de backend *serverless* ejecutada sobre **Firebase/Google Cloud**. Contiene los triggers de base de datos, tareas programadas, integraciones con pasarelas de pago y lógica de negocio crítica que requiere un entorno seguro.

---

## 🛠️ Stack Tecnológico Principal

*   **Frontend:** Angular / Ionic Framework / TypeScript / TailwindCSS
*   **Backend & Cloud:** Firebase (Auth, Firestore, Cloud Functions, Hosting)
*   **QA & Testing:** Cypress (Tests de integración y End-to-End)
*   **Documentación:** VitePress / TypeDoc / JSDoc

---

## 🚀 Guía Rápida de Inicio Local

### Prerrequisitos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión LTS recomendada) y el CLI de Angular global.

### 1. Clonar e Instalar
git clone [https://github.com/Erladron/adcLosLocosV2.git](https://github.com/Erladron/adcLosLocosV2.git)
cd adcLosLocosV2
npm install

---

## 2. Configurar Entornos
Crea manualmente los archivos de entorno locales (ignorados en este repositorio por motivos de seguridad) replicando las variables de configuración de Firebase en las siguientes rutas:

src/environments/environment.ts

projects/web-onboarding/src/environments/environment.ts

---

## 3. Levantar los Servidores de Desarrollo
App Móvil: npm run start o ionic serve

Web Onboarding: ng serve web-onboarding

Backend (Emuladores de Firebase): cd functions && npm run serve

Portal de Documentación: npm run docs:dev

---

## ⚠️ Términos de Licencia y Propiedad Intelectual
Copyright © 2026 Juan Jesús (Erladron). Todos los derechos reservados.

Este software es propiedad privada y exclusiva del autor. Queda estrictamente prohibida la copia, reproducción, modificación, distribución, sublicencia o uso de este código fuente —en su totalidad o en cualquiera de sus partes— para cualquier propósito ajeno a la gestión interna autorizada del club, sin el consentimiento previo expreso y por escrito del titular del copyright.

Cualquier uso no autorizado será reportado inmediatamente ante los canales legales de propiedad intelectual de GitHub (DMCA Takedown Notice).