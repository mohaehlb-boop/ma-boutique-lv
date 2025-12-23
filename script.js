// Funciones frontend: modales, eventos, analytics, PWA helpers

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/js/sw.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.log('SW error', err));
  });
}

// Funciones modales
function openProductModal(id) {
  document.getElementById('product-modal').style.display = 'flex';
  gtag('event', 'view_item', { item_name: `Producto ${id}` });
  fbq('track', 'ViewContent');
  ttq.track('ViewContent');
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

function openPreCheckout(method) {
  document.getElementById('pre-checkout-modal').style.display = 'flex';
  window.paymentMethod = method;
  gtag('event', 'add_to_cart', { item_name: 'Ebook Shopify', value: 69 });
  fbq('track', 'AddToCart');
  ttq.track('AddToCart');
}

function openLeadMagnet() {
  document.getElementById('lead-magnet-modal').style.display = 'flex';
  // Integra form submit a Airtable o email capture para funnel
}

document.getElementById('pre-checkout-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const params = new URLSearchParams(window.location.search);
  const utm = {
    source: params.get('utm_source'),
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign')
  };
  gtag('event', 'begin_checkout', { value: 69 });
  fbq('track', 'InitiateCheckout');
  ttq.track('InitiateCheckout');

  const endpoint = window.paymentMethod === 'stripe' ? '/.netlify/functions/create-checkout-session' : '/.netlify/functions/create-paypal-order';
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: 'ebook-shopify',
        customer_name: name,
        customer_email: email,
        price: 6900, // cents para Stripe, ajusta para PayPal
        return_url_success: `${window.location.origin}/success.html`,
        return_url_cancel: `${window.location.origin}/cancel.html`,
        utm
      })
    });
    if (!res.ok) throw new Error('Error en endpoint');
    const { url } = await res.json();
    window.location.href = url;
  } catch (err) {
    alert('Error: Intenta de nuevo o contacta soporte.');
  }
});

// Exit-Intent para descuento
document.addEventListener('mouseout', (e) => {
  if (e.toElement === null && e.relatedTarget === null) {
    document.getElementById('exit-intent-modal').style.display = 'flex';
  }
});

// Fade-in on scroll
const sections = document.querySelectorAll('section');
const options = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.animation = 'fadeIn 1s';
    }
  });
}, options);
sections.forEach(sec => observer.observe(sec));

// Carousel simple (manual scroll o auto)
const carousel = document.querySelector('.carousel');
let autoScroll = setInterval(() => {
  carousel.scrollLeft += 320; // Ancho approx
  if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) carousel.scrollLeft = 0;
}, 5000);

// Cerrar modales con ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Para upsell en success.html: carga si ?session_id, muestra botón
if (window.location.pathname === '/success.html') {
  const params = new URLSearchParams(window.location.search);
  if (params.get('session_id')) {
    // Opcional: Fetch status from DB via endpoint
    document.querySelector('.upsell-button').style.display = 'block';
  }
}

function scrollToEbook() {
  document.getElementById('ebook').scrollIntoView({ behavior: 'smooth' });
}

// Modo demo: Para pruebas sin pagos, comenta el fetch y haz:
// window.location.href = '/success.html'; 
