# Ebook Shopify Site

Este es un repositorio listo para desplegar un sitio web PWA profesional para vender un ebook sobre compra-venta con Shopify. Incluye integración con Stripe y PayPal, entrega automática de ebook vía links seguros (S3 presigned URLs), y enfocado 100% en conversión. Mezcla landing startup (hero impactante, trust bar) con estética de tienda real (grid simulada). Objetivo: convertir tráfico de redes en ventas de 50-100€, con upsells para ticket medio >100€.

El sitio es moderno, responsive, accesible, con microinteracciones (fade-in, hover), y preparado para A/B tests (variantes de hero copy). Usa serverless para pagos y webhooks. DB recomendada: Airtable (simple) o Firestore. Email: SendGrid.

## Pasos para Desplegar en Netlify (por defecto)

1. Crea una cuenta en Netlify.
2. Instala Netlify CLI: `npm install netlify-cli -g`
3. Clona o crea este repo en GitHub.
4. Navega al directorio: `cd ebook-shopify-site`
5. Crea .netlify/functions/ y copia los esqueletos de código de /serverless/ a archivos .js (e.g., create-checkout-session.js).
6. Configura variables de entorno en Netlify dashboard (Site settings > Environment variables) desde secrets.example.
7. Desplega: `netlify deploy --prod`
8. Registra webhooks: En Stripe/PayPal dashboard, usa URLs como https://tu-sitio.netlify.app/.netlify/functions/webhook-stripe
9. Para PWA: Verifica en Chrome DevTools > Application.
10. Activa modo real: Configura claves; para demo, comenta llamadas API en script.js.

Comandos clave:
- `netlify init` para conectar repo.
- `netlify functions:create` si necesitas templates, pero usa los esqueletos proporcionados.

## Adaptación a Vercel
1. `npm i -g vercel`
2. `vercel`
3. Configura env vars en dashboard.
4. Serverless: Usa /api/ para functions (renombra /serverless/ a /api/).

## Adaptación a Cloudflare Pages
1. Conecta repo en dashboard.
2. Usa Workers para serverless (configura en Workers KV para DB si needed).
3. Env vars en Pages settings.

## Variables de Entorno (ver secrets.example)
Copia a .env para local, o configura en plataforma:
- STRIPE_SECRET_KEY: Stripe secret key (test: sk_test_...)
- STRIPE_WEBHOOK_SECRET: Webhook signing secret
- PAYPAL_CLIENT_ID: PayPal app ID
- PAYPAL_CLIENT_SECRET: PayPal secret
- AWS_ACCESS_KEY_ID: Para S3
- AWS_SECRET_ACCESS_KEY: Para S3
- S3_BUCKET_NAME: Tu bucket S3 con ebook.pdf
- SENDGRID_API_KEY: Para emails
- DATABASE_URL: Airtable API key/base ID o Firestore config (e.g., json creds)

## Checklist de Pruebas
- [ ] Configurar variables de entorno.
- [ ] Desplegar serverless y registrar webhooks en Stripe/PayPal.
- [ ] Probar flujo sandbox: Click "Comprar", ingresa name/email, redirige a test checkout, paga con test card (Stripe: 4242424242424242), verifica webhook log en Netlify, recibe email con link expirable.
- [ ] Probar PayPal sandbox (usa cuenta test).
- [ ] Test cross-browser (Chrome, Firefox, Safari) y responsive (mobile: hero full-screen, grid 1-col).
- [ ] Verificar eventos analytics: view_item en ebook section, add_to_cart en click comprar, begin_checkout en modal, purchase en webhook (server-side).
- [ ] Verificar pixels: FB/TikTok fire on events (test con dev tools).
- [ ] Verificar PWA: Manifest ok, SW registrado, site instalable (Lighthouse score >90).
- [ ] Revisar accesibilidad: Contrastes (texto #111 on #FFF), ARIA en modals/accordion, focus visible.
- [ ] Test upsell: En success.html, click agrega plantillas, crea nuevo session.
- [ ] Test exit-intent: Mueve mouse fuera, muestra modal descuento.
- [ ] Test lead magnet: Click "Ver muestra", captura email (integra con form to Airtable).
- [ ] Verificar SEO: Meta tags, OG, JSON-LD validan en tools como Google Structured Data Tester.

## Modo Demo/No-Pay vs Real
- Demo: En script.js, comenta fetch a endpoints y redirige directo a success.html con mensaje "Pago simulado". Usa para pruebas sin claves.
- Real: Descomenta, configura claves, sube ebook a S3 privado.

Para ventas iniciales: Enfócate en tráfico dirigido (TikTok/IG ads), objetivo CVR 2-5%, CPA bajo con remarketing via pixels.
