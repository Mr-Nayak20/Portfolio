/**
 * CartStore & UI Controller
 * Lightweight reactive pub/sub store for e-commerce interactions.
 * Persists to localStorage and handles cart drawer & checkout modal state.
 */

export const PRODUCTS = {
  'ocean-blue': {
    id: 'ocean-blue',
    name: 'Sleepy Pod — Ocean Blue',
    color: 'Ocean Blue',
    price: 79,
    image: 'images/blue.webp',
    category: 'Relax',
    target: 'Sleep',
    impact: '>51%'
  },
  'midnight-black': {
    id: 'midnight-black',
    name: 'Sleepy Pod — Midnight Black',
    color: 'Midnight Black',
    price: 79,
    image: 'images/black.webp',
    category: 'Rest',
    target: 'Calm + Sleep',
    impact: '2.1x'
  },
  'cloud-gray': {
    id: 'cloud-gray',
    name: 'Sleepy Pod — Cloud Gray',
    color: 'Cloud Gray',
    price: 79,
    image: 'images/gray.webp',
    category: 'Balance',
    target: 'Calm',
    impact: '>85%'
  }
};

class CartStore {
  constructor() {
    this.storageKey = 'sleepy_cart_v1';
    this.items = this.load();
    this.subscribers = new Set();
  }

  load() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
    this.notify();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    callback(this.getState());
    return () => this.subscribers.delete(callback);
  }

  notify() {
    const state = this.getState();
    this.subscribers.forEach(cb => cb(state));
  }

  getState() {
    const totalCount = this.items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = this.items.reduce((acc, item) => {
      const prod = PRODUCTS[item.id];
      return acc + (prod ? prod.price * item.quantity : 0);
    }, 0);
    return {
      items: [...this.items],
      totalCount,
      subtotal
    };
  }

  addItem(productId, quantity = 1) {
    if (!PRODUCTS[productId]) return;
    const existing = this.items.find(i => i.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ id: productId, quantity });
    }
    this.save();
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.id !== productId);
    this.save();
  }

  updateQuantity(productId, quantity) {
    const item = this.items.find(i => i.id === productId);
    if (!item) return;
    if (quantity <= 0) {
      this.removeItem(productId);
    } else {
      item.quantity = quantity;
      this.save();
    }
  }

  clear() {
    this.items = [];
    this.save();
  }
}

export const cartStore = new CartStore();

/**
 * Initializes DOM bindings for the Cart Drawer, Badges, and Checkout Modal
 */
export function initCartUI() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  const openButtons = document.querySelectorAll('[data-action="open-cart"]');
  const closeButtons = document.querySelectorAll('[data-action="close-cart"]');
  const itemsContainer = document.getElementById('cart-items-container');
  const countBadges = document.querySelectorAll('.cart-count-badge');
  const subtotalEl = document.getElementById('cart-subtotal');
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  const emptyState = document.getElementById('cart-empty-state');
  const footerEl = document.getElementById('cart-footer');

  // Checkout modal elements
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutBackdrop = document.getElementById('checkout-backdrop');
  const closeCheckoutBtns = document.querySelectorAll('[data-action="close-checkout"]');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutSuccess = document.getElementById('checkout-success');

  function openDrawer() {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  function openCheckout() {
    closeDrawer();
    checkoutModal.classList.add('is-open');
    checkoutBackdrop.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    checkoutModal.classList.remove('is-open');
    checkoutBackdrop.classList.remove('is-visible');
    document.body.style.overflow = '';
    // Reset view
    setTimeout(() => {
      if (checkoutForm) checkoutForm.style.display = 'block';
      if (checkoutSuccess) checkoutSuccess.style.display = 'none';
    }, 300);
  }

  openButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  }));

  closeButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    closeDrawer();
  }));

  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
  closeCheckoutBtns.forEach(btn => btn.addEventListener('click', closeCheckout));
  if (checkoutBackdrop) checkoutBackdrop.addEventListener('click', closeCheckout);

  // Escape key closes modal / drawer
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeCheckout();
    }
  });

  // Handle checkout form submit
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Processing...';
      submitBtn.disabled = true;

      setTimeout(() => {
        cartStore.clear();
        checkoutForm.style.display = 'none';
        if (checkoutSuccess) {
          checkoutSuccess.style.display = 'block';
          const orderNumEl = document.getElementById('order-number');
          if (orderNumEl) {
            orderNumEl.textContent = 'SLP-' + Math.floor(100000 + Math.random() * 900000);
          }
        }
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1200);
    });
  }

  // Handle product "Add to Bag" buttons in the shop grid
  document.querySelectorAll('[data-product-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-product-id');
      cartStore.addItem(id, 1);
      // Visual feedback
      const originalText = btn.textContent;
      btn.textContent = 'Added ✓';
      btn.classList.add('is-added');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('is-added');
      }, 1200);
      openDrawer();
    });
  });

  // Subscribe UI to CartStore updates
  cartStore.subscribe(state => {
    // Update badge counts
    countBadges.forEach(badge => {
      badge.textContent = state.totalCount;
      badge.style.display = state.totalCount > 0 ? 'inline-flex' : 'none';
    });

    // Update Subtotal
    if (subtotalEl) {
      subtotalEl.textContent = `$${state.subtotal.toFixed(2)} USD`;
    }

    // Toggle Empty State vs Items
    if (state.items.length === 0) {
      if (emptyState) emptyState.style.display = 'flex';
      if (footerEl) footerEl.style.display = 'none';
      if (itemsContainer) itemsContainer.innerHTML = '';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (footerEl) footerEl.style.display = 'block';

    // Render items
    if (itemsContainer) {
      itemsContainer.innerHTML = state.items.map(item => {
        const prod = PRODUCTS[item.id];
        if (!prod) return '';
        return `
          <div class="cart-item" data-cart-item-id="${prod.id}">
            <div class="cart-item__img">
              <img src="${prod.image}" alt="${prod.name}" />
            </div>
            <div class="cart-item__details">
              <div class="cart-item__header">
                <h4 class="cart-item__title">${prod.name}</h4>
                <button class="cart-item__remove" data-action="remove" data-id="${prod.id}" aria-label="Remove item">
                  &times;
                </button>
              </div>
              <p class="cart-item__variant">Color: ${prod.color}</p>
              <div class="cart-item__footer">
                <div class="cart-item__qty-control">
                  <button data-action="decrease" data-id="${prod.id}" aria-label="Decrease quantity">-</button>
                  <span>${item.quantity}</span>
                  <button data-action="increase" data-id="${prod.id}" aria-label="Increase quantity">+</button>
                </div>
                <div class="cart-item__price">$${(prod.price * item.quantity).toFixed(2)}</div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Attach item action handlers
      itemsContainer.querySelectorAll('[data-action]').forEach(el => {
        el.addEventListener('click', () => {
          const action = el.getAttribute('data-action');
          const id = el.getAttribute('data-id');
          const curItem = state.items.find(i => i.id === id);
          if (!curItem) return;

          if (action === 'remove') {
            cartStore.removeItem(id);
          } else if (action === 'increase') {
            cartStore.updateQuantity(id, curItem.quantity + 1);
          } else if (action === 'decrease') {
            cartStore.updateQuantity(id, curItem.quantity - 1);
          }
        });
      });
    }
  });
}
