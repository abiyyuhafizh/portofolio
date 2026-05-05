/**
 * COMPLETE PORTFOLIO SCRIPT v2.0 - MODIFIED
 * ==============================
 * 1. Documentation Coming Soon Popup (NO X CLOSE BUTTON)
 * 2. Achievement Image Popup (NO X CLOSE BUTTON, KEEP ZOOM X)
 * 3. Smooth Scroll
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfolio v2.0 MODIFIED loaded!');
    
    initDocumentationPopup();
    initAchievementPopup();
    initSmoothScroll();
});

function initDocumentationPopup() {
    const cards = document.querySelectorAll('#documentation .items .card a');
    
    cards.forEach(link => {
        link.removeAttribute('data-lightbox');
        link.removeAttribute('data-title');
        link.href = '#';
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const labName = getLabName(this);
            showComingSoonPopup(labName);
        });
        
        link.parentElement.style.cursor = 'pointer';
    });
}

function initAchievementPopup() {
    const achieveLinks = document.querySelectorAll('#achieve .achieve-card a');
    
    achieveLinks.forEach(link => {
        link.removeAttribute('data-lightbox');
        link.removeAttribute('data-title');
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const imgSrc = this.querySelector('img').src;
            const title = this.querySelector('h5')?.textContent || 'Achievement';
            showAchievementPopup(imgSrc, title);
        });
    });
    
    console.log(`✅ ${achieveLinks.length} Achievement popups ready!`);
}

function getLabName(link) {
    return link.querySelector('small')?.textContent?.replace(/<[^>]*>/g, '').trim() || 
           link.querySelector('img')?.alt || 'Lab';
}

function showComingSoonPopup(labName) {
    showGenericPopup({
        title: labName,
        content: `<div style="font-size: 4rem;">🚧</div><strong>Coming Soon!</strong><br>Dokumentasi ${labName} sedang dalam pengembangan.`,
        type: 'coming-soon'
    });
}

function showAchievementPopup(imgSrc, title) {
    showGenericPopup({
        title: title,
        content: `<img src="${imgSrc}" class="zoomable-img" data-original-src="${imgSrc}">`,
        type: 'achievement',
        imageMode: true
    });
}

function showGenericPopup({ title, content, type = 'default', imageMode = false }) {
    // Hapus popup lama
    document.querySelectorAll('#portfolio-popup, .portfolio-popup').forEach(p => p.remove());
    
    const popup = document.createElement('div');
    popup.id = 'portfolio-popup';
    
    popup.innerHTML = `
        <div class="popup-overlay" style="
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(15,40,84,0.97); z-index: 10000; backdrop-filter: blur(25px);
            display: flex; align-items: center; justify-content: center; padding: 20px;
        ">
            <div class="popup-container" style="
                background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(115,165,202,0.3));
                border: 3px solid rgba(255,255,255,0.4); border-radius: 25px;
                padding: ${imageMode ? '30px' : '50px 40px'}; max-width: ${imageMode ? '90%' : '500px'};
                width: 95%; max-height: 95vh; overflow-y: auto; text-align: center; color: white;
                font-family: 'Lexend Deca', sans-serif; box-shadow: 0 35px 120px rgba(0,0,0,0.8);
                backdrop-filter: blur(35px); position: relative; animation: popupSlide 0.4s ease-out;
            ">
                <!-- HAPUS X CLOSE BUTTON BESAR - TIDAK ADA LAGI -->
                
                <div class="popup-title" style="font-size: 2.8rem; margin-bottom: 25px; font-weight: 700;
                    background: linear-gradient(45deg, #fff, #73A5CA); -webkit-background-clip: text;
                    background-clip: text; -webkit-text-fill-color: transparent;">
                    ${title}
                </div>
                <div class="popup-content" style="font-size: 1.8rem; line-height: 1.6; opacity: 0.95; margin-bottom: 35px;">
                    ${content}
                </div>
                ${!imageMode ? `<button class="popup-ok-btn" style="
                    background: linear-gradient(45deg, #73A5CA, #1C4D8D); color: white; border: none;
                    padding: 16px 45px; border-radius: 50px; font-size: 1.8rem; font-weight: 600;
                    cursor: pointer; transition: all 0.3s ease; box-shadow: 0 10px 30px rgba(0,0,0,0.4);
                    font-family: 'Lexend Deca', sans-serif;">Tutup</button>` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    document.body.style.overflow = 'hidden';
    
    // Animation CSS
    if (!document.getElementById('popup-styles')) {
        const style = document.createElement('style');
        style.id = 'popup-styles';
        style.textContent = `
            @keyframes popupSlide {
                0% { opacity: 0; transform: scale(0.7) translateY(50px); }
                100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            .popup-ok-btn:hover {
                transform: translateY(-3px) scale(1.05) !important;
                box-shadow: 0 15px 40px rgba(0,0,0,0.5) !important;
                background: linear-gradient(45deg, #1C4D8D, #73A5CA) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Event listeners - HAPUS closeBtn reference
    if (!imageMode) popup.querySelector('.popup-ok-btn').onclick = closePopup;
    popup.querySelector('.popup-overlay').onclick = e => e.target.classList.contains('popup-overlay') && closePopup();
    
    function closePopup() {
        popup.style.animation = 'popupSlide 0.3s reverse';
        setTimeout(() => {
            if (popup.parentNode) popup.remove();
            document.body.style.overflow = '';
        }, 300);
    }
    
    // ESC key
    const escHandler = e => e.key === 'Escape' && closePopup();
    document.addEventListener('keydown', escHandler);
    
    popup.onremove = () => document.removeEventListener('keydown', escHandler);
    
    const zoomableImg = popup.querySelector('.zoomable-img');
    if (zoomableImg) {
        initImageZoom(zoomableImg, popup);
    }
}

function initImageZoom(img, popup) {
    let scale = 1;
    let minScale = 0.5;
    let maxScale = 4;
    let translateX = 0, translateY = 0;
    
    img.style.cssText = `
        max-width: 100%; max-height: 70vh; border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.6); cursor: grab;
        transition: transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94);
        user-select: none; touch-action: none;
    `;
    
    // ZOOM CONTROLS + X CLOSE
    const controls = document.createElement('div');
    controls.style.cssText = `
        position: absolute; top: 20px; right: 20px; display: flex; gap: 12px;
        pointer-events: auto; z-index: 10; padding: 15px; background: rgba(0,0,0,0.4);
        border-radius: 20px; backdrop-filter: blur(20px);
    `;
    
    controls.innerHTML = `
        <div style="display: flex; gap: 8px;">
            <button class="zoom-in" title="Zoom In">+</button>
            <button class="zoom-out" title="Zoom Out">−</button>
            <button class="zoom-reset" title="Reset">⟲</button>
        </div>
        <button class="popup-x-close" title="Close">✕</button>
    `;
    
    popup.querySelector('.popup-container').appendChild(controls);
    
    // STYLES semua button
    controls.querySelectorAll('button').forEach(btn => {
        btn.style.cssText = `
            width: 45px; height: 45px; border-radius: 12px; border: none;
            background: rgba(255,255,255,0.9); color: #0F2854; font-size: 1.5rem;
            font-weight: 700; cursor: pointer; transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2); backdrop-filter: blur(10px);
        `;
        btn.onmouseenter = () => btn.style.transform = 'scale(1.1)';
        btn.onmouseleave = () => btn.style.transform = 'scale(1)';
    });
    
    // ✅ FIX: Buat closePopup function LOCAL di sini
    function closePopupLocal() {
        popup.style.animation = 'popupSlide 0.3s reverse';
        setTimeout(() => {
            if (popup.parentNode) popup.remove();
            document.body.style.overflow = '';
        }, 300);
    }
    
    // X CLOSE - Tutup popup (SEKARANG BERFUNGSI!)
    controls.querySelector('.popup-x-close').onclick = closePopupLocal;
    
    function updateTransform() {
        img.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        controls.querySelector('.zoom-in').style.opacity = scale >= maxScale ? 0.4 : 1;
        controls.querySelector('.zoom-out').style.opacity = scale <= minScale ? 0.4 : 1;
    }
    
    // ✅ ZOOM BUTTONS - SEKARANG BERFUNGSI!
    controls.querySelector('.zoom-in').onclick = () => {
        scale = Math.min(maxScale, scale + 0.25);
        updateTransform();
    };
    
    controls.querySelector('.zoom-out').onclick = () => {
        scale = Math.max(minScale, scale - 0.25);
        updateTransform();
    };
    
    controls.querySelector('.zoom-reset').onclick = () => {
        scale = 1; translateX = 0; translateY = 0;
        updateTransform();
    };
    
    // MOUSE WHEEL ZOOM
    img.onwheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.008;
        scale = Math.max(minScale, Math.min(maxScale, scale + delta));
        updateTransform();
    };
    
    // DRAG PAN
    let isDragging = false, lastX, lastY;
    
    img.onmousedown = (e) => {
        if (scale <= 1.1) return;
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        img.style.cursor = 'grabbing';
        img.style.transition = 'none';
        e.preventDefault();
    };
    
    document.onmousemove = (e) => {
        if (!isDragging || scale <= 1.1) return;
        
        const dx = (e.clientX - lastX) / scale * 2;
        const dy = (e.clientY - lastY) / scale * 2;
        translateX += dx;
        translateY += dy;
        
        const maxX = Math.max(50, (img.offsetWidth * scale - img.offsetWidth) / 2);
        const maxY = Math.max(50, (img.offsetHeight * scale - img.offsetHeight) / 2);
        translateX = Math.max(-maxX, Math.min(maxX, translateX));
        translateY = Math.max(-maxY, Math.min(maxY, translateY));
        
        updateTransform();
        lastX = e.clientX;
        lastY = e.clientY;
    };
    
    document.onmouseup = () => {
        if (isDragging) {
            isDragging = false;
            img.style.cursor = scale > 1.1 ? 'grab' : 'zoom-in';
            img.style.transition = 'transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94)';
        }
    };
    
    // MOBILE TOUCH
    img.ontouchstart = (e) => {
        if (e.touches.length === 1 && scale > 1.1) {
            isDragging = true;
            lastX = e.touches[0].clientX;
            lastY = e.touches[0].clientY;
            img.style.transition = 'none';
        }
    };
    
    img.ontouchmove = (e) => {
        if (isDragging && e.touches.length === 1) {
            e.preventDefault();
            const dx = (e.touches[0].clientX - lastX) / scale * 2;
            const dy = (e.touches[0].clientY - lastY) / scale * 2;
            translateX += dx;
            translateY += dy;
            
            const maxX = Math.max(50, (img.offsetWidth * scale - img.offsetWidth) / 2);
            const maxY = Math.max(50, (img.offsetHeight * scale - img.offsetHeight) / 2);
            translateX = Math.max(-maxX, Math.min(maxX, translateX));
            translateY = Math.max(-maxY, Math.min(maxY, translateY));
            
            updateTransform();
            lastX = e.touches[0].clientX;
            lastY = e.touches[0].clientY;
        }
    };
    
    img.ontouchend = document.ontouchend = () => {
        if (isDragging) {
            isDragging = false;
            img.style.transition = 'transform 0.25s cubic-bezier(0.25,0.46,0.45,0.94)';
        }
    };
}