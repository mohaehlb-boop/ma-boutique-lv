// PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/js/sw.js')
      .then(reg => console.log('SW registrado'))
      .catch(err => console.log('Error SW:', err));
  });
}

// Smooth Scroll para anclas
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Scroll to Ebook
function scrollToEbook() {
  document.getElementById('ebook').scrollIntoView({ behavior: 'smooth' });
}

// Modales mejorados
function openProductModal() {
  document.getElementById('product-modal').style.display = 'flex';
  document.getElementById('product-modal').style.opacity = '0';
  setTimeout(() => {
    document.getElementById('product-modal').style.opacity = '1';
    document.getElementById('product-modal').querySelector('.modal-content').style.transform = 'scale(1)';
  }, 10);
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(m => {
    m.style.opacity = '0';
    m.querySelector('.modal-content').style.transform = 'scale(0.9)';
    setTimeout(() => m.style.display = 'none', 300);
  });
}

// Pre-checkout modal
let paymentMethod = '';
function openPreCheckout(method) {
  paymentMethod = method;
  document.getElementById('pre-checkout-modal').style.display = 'flex';
  setTimeout(() => {
    document.getElementById('pre-checkout-modal').style.opacity = '1';
    document.getElementById('pre-checkout-modal').querySelector('.modal-content').style.transform = 'translateY(0)';
  }, 10);

  // Analytics
  gtag('event', 'add_to_cart', { item_name: 'Ebook Shopify Mastery', value: 69 });
}

// Lead magnet
function openLeadMagnet() {
  document.getElementById('lead-magnet-modal').style.display = 'flex';
  setTimeout(() => document.getElementById('lead-magnet-modal').style.opacity = '1', 10);
}

// Form submit pre-checkout
document.getElementById('pre-checkout-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  // Captura UTM
  const params = new URLSearchParams(window.location.search);
  const utm = {
    source: params.get('utm_source') || 'direct',
    medium: params.get('utm_medium') || 'none',
    campaign: params.get('utm_campaign') || 'direct'
  };

  // Analytics checkout
  gtag('event', 'begin_checkout', { value: 69 });

  const endpoint = paymentMethod === 'stripe' 
    ? '/.netlify/functions/create-checkout-session' 
    : '/.netlify/functions/create-paypal-order';

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: 'ebook-mastery',
        customer_name: name,
        customer_email: email,
        price: 6900,
        return_url_success: `${window.location.origin}/success.html`,
        return_url_cancel: `${window.location.origin}/cancel.html`,
        utm
      })
    });

    if (!res.ok) throw new Error('Error');
    const data = await res.json();
    window.location.href = data.url;
  } catch (err) {
    alert('Error al redirigir al pago. Intenta de nuevo o contáctanos.');
  }
});

// Exit-intent modal (10% descuento)
let exitIntentShown = false;
document.addEventListener('mouseout', (e) => {
  if (!exitIntentShown && e.clientY < 10) {
    exitIntentShown = true;
    document.getElementById('exit-intent-modal').style.display = 'flex';
    setTimeout(() => document.getElementById('exit-intent-modal').style.opacity = '1', 10);
  }
});

// Carousel moderno auto-scroll suave
const carousel = document.querySelector('.carousel-modern');
if (carousel) {
  let scrollAmount = 0;
  const scrollSpeed = 1;
  const scrollInterval = setInterval(() => {
    if (scrollAmount >= carousel.scrollWidth - carousel.clientWidth) {
      scrollAmount = 0;
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      scrollAmount += scrollSpeed;
      carousel.scrollBy({ left: scrollSpeed, behavior: 'instant' });
    }
  }, 30);
}

// Cerrar modales con ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Inicialización extra para transiciones
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '1';
});
