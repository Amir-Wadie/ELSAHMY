// Contact Page Functionality

// Initialize contact page
function initializeContactPage() {
    setupContactForm();
    updateWorkingHoursStatus();
}

// Setup contact form
function setupContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('contactName').value.trim(),
                contactInfo: document.getElementById('contactInfo').value.trim(),
                message: document.getElementById('contactMessage').value.trim()
            };
            
            // Validate
            if (!formData.name || !formData.contactInfo || !formData.message) {
                alert('برجاء ملء جميع البيانات');
                return;
            }
            
            // Send via WhatsApp
            sendContactMessageViaWhatsApp(formData);
        });
    }
}

// Send contact message via WhatsApp
function sendContactMessageViaWhatsApp(data) {
    const WHATSAPP_NUMBER = '+201044804508';
    
    let message = `📩 *رسالة جديدة من موقع الدجاج الشامي*\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `👤 *الاسم:* ${data.name}\n`;
    message += `📞 *التواصل:* ${data.contactInfo}\n\n`;
    message += `💬 *الرسالة:*\n${data.message}\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `⏰ ${new Date().toLocaleString('ar-EG')}`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    showContactSuccessMessage();
    
    // Reset form
    document.getElementById('contactForm').reset();
}

// Show success message
function showContactSuccessMessage() {
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
        animation: fadeIn 0.3s ease;
    `;
    
    successOverlay.innerHTML = `
        <div style="
            background: white;
            padding: 40px;
            border-radius: 16px;
            text-align: center;
            max-width: 400px;
            margin: 20px;
            animation: slideUp 0.3s ease;
        ">
            <div style="font-size: 64px; margin-bottom: 20px;">✉️</div>
            <h2 style="color: #8B2E2E; margin-bottom: 16px; font-size: 24px;">تم إرسال رسالتك!</h2>
            <p style="color: #2C1810; margin-bottom: 24px; line-height: 1.6;">
                شكراً لتواصلك معنا<br>
                سنرد عليك في أقرب وقت ممكن
            </p>
            <button onclick="this.closest('div').parentElement.remove()" style="
                background: #8B2E2E;
                color: white;
                border: none;
                padding: 12px 32px;
                border-radius: 50px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                font-family: 'Cairo', sans-serif;
            ">إغلاق</button>
        </div>
    `;
    
    document.body.appendChild(successOverlay);
    
    // Auto close after 5 seconds
    setTimeout(() => {
        if (successOverlay.parentElement) {
            successOverlay.remove();
        }
    }, 5000);
}

// Update working hours status
function updateWorkingHoursStatus() {
    const statusBadge = document.querySelector('.status-badge');
    
    if (!statusBadge) return;
    
    // Get current time
    const now = new Date();
    const currentHour = now.getHours();
    
    // Working hours: 11:00 AM to 2:00 AM (next day)
    // So open from 11 to 23, and from 0 to 2
    const isOpen = (currentHour >= 11 && currentHour < 24) || (currentHour >= 0 && currentHour < 2);
    
    if (isOpen) {
        statusBadge.textContent = 'مفتوح الآن';
        statusBadge.classList.add('open');
        statusBadge.classList.remove('closed');
    } else {
        statusBadge.textContent = 'مغلق حالياً';
        statusBadge.classList.add('closed');
        statusBadge.classList.remove('open');
    }
}

// Add animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(animationStyles);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeContactPage();
});