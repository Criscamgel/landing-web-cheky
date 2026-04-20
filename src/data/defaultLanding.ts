import type { LandingPageData } from '@/types/landing'

/** Contenido por defecto (mismo copy que `template.html`). Strapi puede reemplazarlo por API. */
export const defaultLandingPage: LandingPageData = {
  seo: {
    title: 'Cheky — Huella Digital & Confiabilidad',
    description:
      'Verifica la huella digital de cualquier comprador. Score de confiabilidad en tiempo real.',
  },
  navbar: {
    brandName: 'Cheky',
    links: [
      { label: 'Cómo funciona', href: '#como-funciona' },
      { label: 'Precios', href: '#precios' },
      { label: 'Contacto', href: '#contacto' },
    ],
    loginLabel: 'Iniciar sesión',
    loginHref: 'https://app.cheky.co',
  },
  hero: {
    badge: 'Score de confiabilidad en tiempo real',
    titleLine1: 'Verifica la huella digital',
    titleLine2: 'de cualquier comprador',
    subtitle:
      'Genera una calificación de confiabilidad basada en datos reales. Identifica riesgos antes de cerrar una operación.',
    primaryCta: { label: 'Crear cuenta', href: '#contacto' },
    secondaryCta: { label: 'Ver cómo funciona', href: '#como-funciona' },
  },
  stats: [
    { value: '42', label: 'Compañías activas' },
    { value: '1,284', label: 'Checks realizados' },
    { value: '94%', label: 'Precisión del score' },
    { value: '<2s', label: 'Tiempo de respuesta' },
  ],
  howItWorks: {
    overline: 'Proceso',
    title: 'Tres pasos, un resultado',
    steps: [
      {
        step: '1',
        title: 'Ingresa los datos',
        description:
          'Nombre, email, teléfono o documento del comprador que quieres verificar.',
      },
      {
        step: '2',
        title: 'Se analiza la huella',
        description:
          'Cheky cruza múltiples fuentes de datos para construir el perfil digital completo.',
      },
      {
        step: '3',
        title: 'Recibe el score',
        description:
          'Obtén una calificación de confiabilidad de 0 a 100 con el detalle de cada factor.',
      },
    ],
  },
  pricing: {
    overline: 'Precios',
    title: 'Un plan por cada volumen',
    subtitle: 'Sin contratos de permanencia. Escala cuando lo necesites.',
    plans: [
      {
        id: 'basic',
        name: 'Basic',
        price: '$29',
        period: '/mes',
        description: 'Para comenzar a verificar compradores de forma esporádica.',
        features: [
          { text: '100 checks / mes' },
          { text: 'Score de confiabilidad 0–100' },
          { text: 'Desglose por factor' },
          { text: '1 usuario' },
          { text: 'Soporte por email' },
        ],
        ctaLabel: 'Comenzar prueba',
        ctaVariant: 'outlined',
        variant: 'default',
      },
      {
        id: 'pro',
        name: 'Pro',
        price: '$89',
        period: '/mes',
        description: 'Para equipos que verifican compradores a diario.',
        badge: 'Popular',
        features: [
          { text: '1,000 checks / mes' },
          { text: 'Score de confiabilidad 0–100' },
          { text: 'Desglose completo por factor' },
          { text: 'API RESTful' },
          { text: 'Webhooks en tiempo real' },
          { text: '5 usuarios' },
          { text: 'Soporte prioritario' },
        ],
        ctaLabel: 'Comenzar prueba',
        ctaVariant: 'primary',
        variant: 'popular',
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: '$299',
        period: '/mes',
        description:
          'Para operaciones de alto volumen con necesidades específicas.',
        features: [
          { text: 'Checks ilimitados' },
          { text: 'Todo lo de Pro' },
          { text: 'Usuarios ilimitados' },
          { text: 'Integración white-label' },
          { text: 'SLA garantizado' },
          { text: 'Account manager dedicado' },
          { text: 'Factores personalizados' },
        ],
        ctaLabel: 'Habla con ventas',
        ctaVariant: 'inverted',
        variant: 'enterprise',
      },
    ],
  },
  benefits: {
    overline: 'Beneficios',
    title: 'Por qué elegir Cheky',
    items: [
      {
        icon: 'zap',
        iconTone: 'primary',
        title: 'Respuesta en segundos',
        description:
          'Score calculado en menos de 2 segundos. Sin esperas que frenen tu operación.',
      },
      {
        icon: 'shield-check',
        iconTone: 'primary',
        title: 'Datos cruzados reales',
        description:
          'No adivinamos. Cruzamos fuentes públicas y privadas para validar cada dato.',
      },
      {
        icon: 'users',
        iconTone: 'secondary',
        title: 'API simple de integrar',
        description:
          'Un endpoint, un JSON de respuesta. Integración en horas, no semanas.',
      },
      {
        icon: 'lock',
        iconTone: 'secondary',
        title: 'Seguro y compliant',
        description:
          'Datos encriptados, cumplimiento GDPR. No almacenamos datos sensibles del comprador.',
      },
    ],
  },
  contact: {
    overline: 'Comienza ahora',
    title: 'Habla con un experto',
    description:
      'Te mostramos cómo Cheky puede integrarse a tu flujo de venta y reducir el fraude desde el día uno.',
    highlights: [
      {
        icon: 'phone',
        title: 'Llamada personalizada',
        subtitle: 'Te contactamos en menos de 24h',
      },
      {
        icon: 'file',
        title: 'Demo en vivo',
        subtitle: 'Te mostramos Cheky con tus datos reales',
      },
      {
        icon: 'shield',
        title: 'Sin compromiso',
        subtitle: 'Prueba gratuita, cancela cuando quieras',
      },
    ],
    fields: [
      {
        id: 'name',
        label: 'Nombre',
        placeholder: 'Tu nombre',
        type: 'text',
      },
      {
        id: 'email',
        label: 'Email',
        placeholder: 'tu@empresa.com',
        type: 'email',
      },
      {
        id: 'company',
        label: 'Empresa',
        placeholder: 'Nombre de tu empresa',
        type: 'text',
      },
      {
        id: 'volume',
        label: '¿Cuántos checks necesitas al mes?',
        placeholder: 'Selecciona un rango',
        type: 'select',
        options: [
          { label: 'Selecciona un rango', value: '' },
          { label: '1 – 100', value: '1-100' },
          { label: '100 – 1.000', value: '100-1000' },
          { label: '1.000 – 10.000', value: '1000-10000' },
          { label: '10.000+', value: '10000+' },
        ],
      },
    ],
    submitLabel: 'Solicitar demo',
  },
  footer: {
    brandName: 'Cheky',
    copyright: '© 2026 Cheky. Todos los derechos reservados.',
    socials: [
      { name: 'Twitter', href: '#', icon: 'twitter' },
      { name: 'LinkedIn', href: '#', icon: 'linkedin' },
    ],
  },
}
