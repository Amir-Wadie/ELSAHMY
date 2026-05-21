// Order Page Functionality

const WHATSAPP_NUMBER = '+201044804508'; // Restaurant WhatsApp number
const DELIVERY_FEE = 10; // Delivery fee in EGP

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

// Initialize order page
function initializeOrderPage() {
    displayOrderItems();
    setupFormValidation();
    setupClearCart();
}

// Display order items
function displayOrderItems() {
    const orderItemsContainer = document.getElementById('orderItems');
    const orderTotals = document.getElementById('orderTotals');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const submitBtn = document.getElementById('submitOrderBtn');
    
    const cartItems = cart.getItems();
    
    if (cartItems.length === 0) {
        emptyCartMessage.style.display = 'block';
        orderTotals.style.display = 'none';
        submitBtn.disabled = true;
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    orderTotals.style.display = 'block';
    
    // Render order items
    orderItemsContainer.innerHTML = cartItems.map(item => `
        <div class="order-item" data-item-id="${item.id}">
            <div class="item-image">${productEmojis[item.categoryId] || '🍽️'}</div>
            <div class="item-details">
                <div class="item-name">${item.nameAr}</div>
                <div class="item-qty-price">
                    <div class="item-qty-controls">
                        <button class="qty-btn-small" onclick="updateItemQty('${item.id}', ${item.quantity - 1})">−</button>
                        <span class="item-qty-display">${item.quantity}</span>
                        <button class="qty-btn-small" onclick="updateItemQty('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <span class="item-price">${item.price * item.quantity} ج.م</span>
                </div>
            </div>
            <button class="item-remove" onclick="removeItem('${item.id}')" title="حذف">🗑️</button>
        </div>
    `).join('');
    
    // Update totals
    updateOrderTotals();
}

// Update item quantity
function updateItemQty(itemId, newQty) {
    if (newQty <= 0) {
        removeItem(itemId);
    } else {
        cart.updateQuantity(itemId, newQty);
        displayOrderItems();
    }
}

// Remove item
function removeItem(itemId) {
    cart.removeItem(itemId);
    displayOrderItems();
}

// Update order totals
function updateOrderTotals() {
    const subtotal = cart.getTotal();
    const deliveryFee = DELIVERY_FEE;
    const finalTotal = subtotal + deliveryFee;
    
    document.getElementById('subtotal').textContent = `${subtotal} ج.م`;
    document.getElementById('deliveryFee').textContent = `${deliveryFee} ج.م`;
    document.getElementById('finalTotal').textContent = `${finalTotal} ج.م`;
}

// Setup clear cart button
function setupClearCart() {
    const clearBtn = document.getElementById('clearCartBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('هل أنت متأكد من إفراغ السلة؟')) {
                cart.clearCart();
                displayOrderItems();
            }
        });
    }
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('orderForm');
    const submitBtn = document.getElementById('submitOrderBtn');
    
    // Check if cart is not empty
    const cartItems = cart.getItems();
    if (cartItems.length > 0) {
        submitBtn.disabled = false;
    }
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('customerName').value.trim(),
            phone: document.getElementById('customerPhone').value.trim(),
            address: document.getElementById('customerAddress').value.trim(),
            notes: document.getElementById('customerNotes').value.trim()
        };
        
        // Validate
        if (!formData.name || !formData.phone || !formData.address) {
            alert('برجاء ملء جميع البيانات المطلوبة');
            return;
        }
        
        // Validate phone number (11 digits)
        if (!/^[0-9]{11}$/.test(formData.phone)) {
            alert('رقم الهاتف يجب أن يكون 11 رقم');
            return;
        }
        
        // Check cart is not empty
        if (cart.getItems().length === 0) {
            alert('السلة فارغة! اختر منتجات من المنيو أولاً');
            return;
        }
        
        // Send order via WhatsApp
        sendOrderViaWhatsApp(formData);
    });
}

// Send order via WhatsApp
function sendOrderViaWhatsApp(customerData) {
    const cartItems = cart.getItems();
    const subtotal = cart.getTotal();
    const deliveryFee = DELIVERY_FEE;
    const finalTotal = subtotal + deliveryFee;
    
    // Format order message
    let message = `🛒 *طلب جديد من موقع الدجاج الشامي*\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    // Order items
    message += `📦 *الأصناف المطلوبة:*\n\n`;
    cartItems.forEach((item, index) => {
        const emoji = productEmojis[item.categoryId] || '🍽️';
        message += `${index + 1}. ${emoji} ${item.nameAr}\n`;
        message += `   الكمية: ${item.quantity}\n`;
        message += `   السعر: ${item.price} ج.م\n`;
        message += `   المجموع: ${item.price * item.quantity} ج.م\n\n`;
    });
    
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    // Totals
    message += `💰 *الحساب:*\n`;
    message += `• مجموع الأصناف: ${subtotal} ج.م\n`;
    message += `• رسوم التوصيل: ${deliveryFee} ج.م\n`;
    message += `• *الإجمالي النهائي: ${finalTotal} ج.م*\n\n`;
    
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    // Customer info
    message += `👤 *بيانات العميل:*\n`;
    message += `• الاسم: ${customerData.name}\n`;
    message += `• الهاتف: ${customerData.phone}\n`;
    message += `• العنوان: ${customerData.address}\n`;
    
    if (customerData.notes) {
        message += `\n📝 *ملاحظات:*\n${customerData.notes}\n`;
    }
    
    message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    message += `⏰ تم الطلب بتاريخ: ${new Date().toLocaleString('ar-EG')}`;
    
    // Encode message for WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    showSuccessMessage();
}

// Show success message
function showSuccessMessage() {
    const successOverlay = document.createElement('div');
    successOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    successOverlay.innerHTML = `
        <div style="
            background: white;
            padding: 40px;
            border-radius: 16px;
            text-align: center;
            max-width: 400px;
            margin: 20px;
        ">
            <div style="font-size: 64px; margin-bottom: 20px;">✅</div>
            <h2 style="color: #8B2E2E; margin-bottom: 16px; font-size: 24px;">تم إرسال طلبك!</h2>
            <p style="color: #2C1810; margin-bottom: 24px; line-height: 1.6;">
                جاري تحويلك إلى واتساب...<br>
                سيتواصل معك فريقنا قريباً لتأكيد الطلب
            </p>
            <button onclick="location.href='index.html'" style="
                background: #8B2E2E;
                color: white;
                border: none;
                padding: 12px 32px;
                border-radius: 50px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Cairo', sans-serif;
            ">العودة للصفحة الرئيسية</button>
        </div>
    `;
    
    document.body.appendChild(successOverlay);
    
    // Clear cart after 5 seconds
    setTimeout(() => {
        cart.clearCart();
    }, 5000);
}

// Make functions global
window.updateItemQty = updateItemQty;
window.removeItem = removeItem;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeOrderPage();
});