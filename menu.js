// Menu Page Functionality

let menuData = null;
let currentCategory = 'all';
let currentSearch = '';

// Product emojis mapping
const productEmojis = {
    'chicken-crepe': '🌯',
    'pizza': '🍕',
    'egg-pies': '🥚',
    'meat-pies': '🥩',
    'mozzarella-pies': '🧀',
    'garlic-pies': '🧄',
    'cheddar-pies': '🧀',
    'shawarma-sandwiches': '🌯',
    'western-sandwiches': '🍔',
    'classic-sandwiches': '🥙',
    'western-meals': '🍽️',
    'shawarma-meals': '🍽️',
    'shawarma-rice': '🍚',
    'western-dishes': '🍽️',
    'broasted': '🍗',
    'grilled': '🔥',
    'potatoes': '🍟',
    'kabao': '🍢',
    'pasta': '🍝',
    'appetizers': '🥗'
};

// Load menu data
async function loadMenuData() {
    try {
        const response = await fetch('menu-data.json');
        menuData = await response.json();
        initializeMenu();
    } catch (error) {
        console.error('Error loading menu:', error);
        document.getElementById('productsGrid').innerHTML = `
            <div class="error-message">
                <p>عذراً، حدث خطأ في تحميل المنيو</p>
                <button onclick="location.reload()" class="btn btn-primary">إعادة المحاولة</button>
            </div>
        `;
    }
}

// Initialize menu
function initializeMenu() {
    renderCategoryFilter();
    renderProducts();
    setupSearch();
    setupCartSummary();
}

// Render category filter buttons
function renderCategoryFilter() {
    const filterContainer = document.getElementById('categoryFilter');
    
    menuData.categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.dataset.category = category.id;
        button.textContent = category.nameAr;
        
        button.addEventListener('click', () => {
            currentCategory = category.id;
            updateActiveFilter();
            renderProducts();
        });
        
        filterContainer.appendChild(button);
    });
}

// Update active filter button
function updateActiveFilter() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === currentCategory) {
            btn.classList.add('active');
        }
    });
}

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    let allProducts = [];
    
    // Filter by category
    if (currentCategory === 'all') {
        menuData.categories.forEach(cat => {
            cat.items.forEach(item => {
                allProducts.push({ ...item, categoryId: cat.id, categoryNameAr: cat.nameAr });
            });
        });
    } else {
        const category = menuData.categories.find(cat => cat.id === currentCategory);
        if (category) {
            category.items.forEach(item => {
                allProducts.push({ ...item, categoryId: category.id, categoryNameAr: category.nameAr });
            });
        }
    }
    
    // Filter by search
    if (currentSearch) {
        allProducts = allProducts.filter(item => 
            item.nameAr.includes(currentSearch)
        );
    }
    
    // Render products
    if (allProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="loading">لا توجد نتائج للبحث 🔍</div>
        `;
        return;
    }
    
    productsGrid.innerHTML = allProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                ${productEmojis[product.categoryId] || '🍽️'}
                ${product.isPopular ? '<span class="popular-badge">🔥 الأكثر طلباً</span>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.nameAr}</h3>
                ${product.size ? `<div class="product-meta"><span class="product-size">${product.size}</span></div>` : ''}
                <div class="product-price">${product.price} ج.م</div>
                <div class="product-actions">
                    <div class="quantity-selector">
                        <button class="qty-btn" onclick="decrementQty('${product.id}')">−</button>
                        <span class="qty-display" id="qty-${product.id}">1</span>
                        <button class="qty-btn" onclick="incrementQty('${product.id}')">+</button>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                        أضف للسلة 🛒
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim();
        renderProducts();
    });
}

// Quantity controls
function incrementQty(productId) {
    const qtyDisplay = document.getElementById(`qty-${productId}`);
    let currentQty = parseInt(qtyDisplay.textContent);
    qtyDisplay.textContent = currentQty + 1;
}

function decrementQty(productId) {
    const qtyDisplay = document.getElementById(`qty-${productId}`);
    let currentQty = parseInt(qtyDisplay.textContent);
    if (currentQty > 1) {
        qtyDisplay.textContent = currentQty - 1;
    }
}

// Add to cart
function addToCart(productId) {
    const qtyDisplay = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyDisplay.textContent);
    
    // Find product in menu data
    let product = null;
    for (let category of menuData.categories) {
        const found = category.items.find(item => item.id === productId);
        if (found) {
            product = { ...found, categoryId: category.id };
            break;
        }
    }
    
    if (product) {
        cart.addItem(product, quantity);
        qtyDisplay.textContent = '1'; // Reset quantity
        updateCartSummary();
    }
}

// Setup cart summary
function setupCartSummary() {
    const closeBtn = document.getElementById('closeCartSummary');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('cartSummary').style.display = 'none';
        });
    }
    
    updateCartSummary();
}

// Update cart summary display
function updateCartSummary() {
    const cartSummary = document.getElementById('cartSummary');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    const cartItems = cart.getItems();
    
    if (cartItems.length === 0) {
        cartSummary.style.display = 'none';
        return;
    }
    
    cartSummary.style.display = 'block';
    
    // Render cart items
    cartItemsList.innerHTML = cartItems.map(item => `
        <div class="cart-item-mini">
            <span class="cart-item-name">${item.nameAr}</span>
            <span class="cart-item-qty">× ${item.quantity}</span>
            <span class="cart-item-price">${item.price * item.quantity} ج.م</span>
        </div>
    `).join('');
    
    // Update total
    cartTotalPrice.textContent = `${cart.getTotal()} ج.م`;
}

// Make functions global
window.incrementQty = incrementQty;
window.decrementQty = decrementQty;
window.addToCart = addToCart;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadMenuData();
});
