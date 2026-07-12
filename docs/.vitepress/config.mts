import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "A.C.D. Los Locos",
  description: "Ecosistema Completo",
  themeConfig: {
    // Menú superior horizontal de la web
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Documentación', link: '/app-movil/' }
    ],

    // EL MENÚ LATERAL UNIFICADO (Actualizado con JSDocs)
    sidebar: [
      {
        text: '📱 App Móvil Principal',
        items: [
          { text: 'Introducción y Setup', link: '/app-movil/' }
        ]
      },
      {
        text: '🌐 Web Onboarding',
        items: [
          { text: 'Flujo de Registro Web', link: '/web-onboarding/' }
        ]
      },
      {
        text: '📦 Shared Core (Librería)',
        items: [
          { text: 'Guía de Uso', link: '/shared-core/' }
        ]
      },
      {
        text: '🔥 Cloud Functions',
        items: [
          { text: 'Backend & Triggers', link: '/functions/' }
        ]
      },
      {
        text: '📚 API Reference (Código)',
        collapsed: true,
        items: [
          { text: '📱 App Móvil (Componentes)', link: '/api-reference/app-movil/' },
          { text: '🌐 Web Onboarding', link: '/api-reference/web-onboarding/' },
          { text: '⚡ Cloud Functions', link: '/api-reference/functions/' },
          { text: '📦 Shared Core (Librería)', link: '/api-reference/shared-core/' }
        ]
      }
    ],

    // 👇 AQUÍ PONES LA URL REAL DE TU REPOSITORIO 👇
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Erladron/adcLosLocosV2/' }
    ]
  }
})