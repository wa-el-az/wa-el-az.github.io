// ==========================================
// 1. GLOBAL BLUR ENGINE (Glassmorphism Pro)
// ==========================================
const savedBlur = localStorage.getItem('waelos_glass_blur') || '20';
document.documentElement.style.setProperty('--glass-blur', `${savedBlur}px`);

// ==========================================
// 2. CUSTOM OS CURSOR ENGINE (LOCAL .PNG FILES)
// ==========================================
const cursorType = localStorage.getItem('waelos_cursor') || 'default';
if (cursorType !== 'default') {
    let normal = '';
    let pointer = '';

    if (cursorType === 'win11-light') {
        normal = `url('assets/cursors/light-normal.png') 4 4, auto`;
        pointer = `url('assets/cursors/light-link.png') 10 4, pointer`;
    } else if (cursorType === 'win11-dark') {
        normal = `url('assets/cursors/dark-normal.png') 4 4, auto`;
        pointer = `url('assets/cursors/dark-link.png') 10 4, pointer`;
    }

    if (normal) {
        const cursorStyle = document.createElement('style');
        cursorStyle.innerHTML = `
            * { cursor: ${normal} !important; }
            a, button, .btn, .navBtn, .action-btn, .shortcut-btn, select, input[type="range"], .toggle-switch, .context-item, .spotlight-item, .custom-select-trigger, .custom-select-option { cursor: ${pointer} !important; }
        `;
        document.head.appendChild(cursorStyle);
    }
}

// ==========================================
// 3. CORE OS MODULE OVERRIDES
// ==========================================
if (localStorage.getItem('waelos_feature_selection') === 'false') {
    const selStyle = document.createElement('style');
    selStyle.innerHTML = `::selection { background-color: Highlight !important; color: HighlightText !important; } ::-moz-selection { background-color: Highlight !important; color: HighlightText !important; }`;
    document.head.appendChild(selStyle);
}

if (localStorage.getItem('waelos_feature_contextmenu') === 'false') {
    document.addEventListener('contextmenu', (e) => {
        e.stopImmediatePropagation();
    }, true); 
}

// ==========================================
// 4. SYSTEM TELEMETRY (Digital Wellbeing)
// ==========================================
// BUG FIX 1: Prevent memory thrashing by saving to localStorage less frequently
let waelosTimeSpent = parseInt(localStorage.getItem('waelos_time_spent')) || 0;

setInterval(() => {
    waelosTimeSpent++;
}, 1000);

setInterval(() => {
    localStorage.setItem('waelos_time_spent', waelosTimeSpent);
}, 30000); // Save only every 30 seconds

window.addEventListener('beforeunload', () => {
    localStorage.setItem('waelos_time_spent', waelosTimeSpent); // Save right before leaving
});

// ==========================================
// 5. GLOBAL CHEATS ENGINE
// ==========================================
if (localStorage.getItem('waelos_cheat_rgb_multiplier') === 'true') {
    const rgbStyle = document.createElement('style');
    rgbStyle.id = 'rgb-global-style';
    rgbStyle.innerHTML = `
        @keyframes rgb-hue-spin { 
            0% { filter: hue-rotate(0deg) saturate(1.5); } 
            100% { filter: hue-rotate(360deg) saturate(1.5); } 
        }
        .bg-left, .bg-right { 
            animation: rgb-hue-spin 4s linear infinite !important; 
        }
        .cta, .redeem, .btn, .shortcut-btn, .action-btn { 
            animation: rgb-hue-spin 2s linear infinite !important; 
        }
    `;
    document.head.appendChild(rgbStyle);
}

if (localStorage.getItem('waelos_cheat_all_achievements') === 'true') {
    let unlocked = JSON.parse(localStorage.getItem('wael_achievements')) || [];
    const allAchievements = [
        "tea_first", "tea_500", "tea_10k", "tea_sync", "ttt_win", 
        "ttt_tie", "ttt_hack", "exp_404", "exp_mail", "exp_proj", 
        "hack_denied", "hack_brute", "hack_captain", "egg_patriot", "egg_owl"
    ];
    let newlyUnlocked = false;
    
    allAchievements.forEach(id => {
        if (!unlocked.includes(id)) {
            unlocked.push(id);
            newlyUnlocked = true;
        }
    });
    
    if (newlyUnlocked) {
        localStorage.setItem('wael_achievements', JSON.stringify(unlocked));
    }
}

// ==========================================
// 6. SPOTLIGHT COMMAND CENTER (Ctrl + K)
// ==========================================
if (localStorage.getItem('waelos_feature_spotlight') !== 'false') {
    const spotlightRoutes = [
        { name: "Home", url: "index", icon: "home" },
        { name: "Projects", url: "projects", icon: "layers" },
        { name: "Shortcuts", url: "shortcuts", icon: "zap" },
        { name: "Desktop Pet", url: "pet", icon: "bot" }, 
        { name: "Tea Clicker", url: "tea", icon: "coffee" },
        { name: "Geometry Dash", url: "gd", icon: "play" },
        { name: "Music Player", url: "music", icon: "music" },
        { name: "Achievements", url: "achievements", icon: "award" },
        { name: "Redeem", url: "redeem", icon: "gift" },
        { name: "Hardware Specs", url: "hardware", icon: "cpu" },
        { name: "Windows Vault", url: "windows", icon: "monitor" },
        { name: "My PC", url: "mypc", icon: "hard-drive" },
        { name: "About Website", url: "about", icon: "info" },
        { name: "System Settings", url: "admin/hub", icon: "settings" }
    ];

    const spotlightHTML = `
        <div id="spotlight-overlay">
            <div id="spotlight-modal">
                <div class="spotlight-input-wrap">
                    <i data-lucide="search"></i>
                    <input type="text" id="spotlight-input" placeholder="Search WaelOS (e.g. 'pet', 'projects')..." autocomplete="off">
                </div>
                <div id="spotlight-results"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', spotlightHTML);

    const spotlightOverlay = document.getElementById('spotlight-overlay');
    const spotlightInput = document.getElementById('spotlight-input');
    const spotlightResults = document.getElementById('spotlight-results');

    function renderSpotlight(query = "") {
        spotlightResults.innerHTML = "";
        
        const filtered = spotlightRoutes.filter(r => 
            r.name.toLowerCase().includes(query.toLowerCase()) || 
            r.url.toLowerCase().includes(query.toLowerCase())
        );
        
        if (filtered.length === 0) {
            spotlightResults.innerHTML = `<div class="spotlight-empty">No matching WaelOS files found.</div>`;
            return;
        }

        filtered.forEach((r, idx) => {
            const div = document.createElement('div');
            div.className = `spotlight-item ${idx === 0 ? 'active' : ''}`; 
            div.innerHTML = `<i data-lucide="${r.icon}"></i> ${r.name}`;
            div.onclick = () => window.location.href = r.url;
            spotlightResults.appendChild(div);
        });
        
        if (window.lucide) lucide.createIcons();
    }

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            spotlightOverlay.classList.add('active');
            spotlightInput.value = "";
            renderSpotlight();
            setTimeout(() => spotlightInput.focus(), 50); 
        }
        if (e.key === 'Escape' && spotlightOverlay.classList.contains('active')) {
            spotlightOverlay.classList.remove('active');
        }
        if (e.key === 'Enter' && spotlightOverlay.classList.contains('active')) {
            const activeItem = spotlightResults.querySelector('.spotlight-item.active');
            if (activeItem) activeItem.click();
        }
    });

    spotlightOverlay.addEventListener('click', (e) => {
        if (e.target === spotlightOverlay) spotlightOverlay.classList.remove('active');
    });

    spotlightInput.addEventListener('input', (e) => renderSpotlight(e.target.value));
}

// ==========================================
// 7. AMBIENT FLASHLIGHT BUTTON GLOW
// ==========================================
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
const glowSetting = localStorage.getItem('waelos_feature_glow');

// OFF by default on mobile devices, ON by default on desktop PCs
const shouldGlow = glowSetting === 'true' || (glowSetting === null && !isMobile);

if (shouldGlow) {
    document.querySelectorAll('.btn, .cta, .redeem, .shortcut-btn, .navBtn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            btn.style.setProperty('--x', x + 'px');
            btn.style.setProperty('--y', y + 'px');
        });
    });
} else {
    const glowStyle = document.createElement('style');
    glowStyle.innerHTML = `.btn::before, .cta::before, .redeem::before, .shortcut-btn::before, .navBtn::before { display: none !important; }`;
    document.head.appendChild(glowStyle);
}

// ==========================================
// 8. CUSTOM WAELOS POPUP SYSTEM
// ==========================================
const injectPopup = () => {
    if (!document.getElementById('waelos-popup-overlay')) {
        const html = `
        <div id="waelos-popup-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 9999999; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
            <div id="waelos-popup-card" class="card" style="width: 90%; max-width: 450px; text-align: center; transform: scale(0.9) translateY(20px); transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1); margin: 0 auto; padding: 40px 30px;">
                <div id="waelos-popup-icon-container" style="margin-bottom: 15px; filter: drop-shadow(0 0 15px rgba(74, 222, 128, 0.4)); color: #4ade80;">
                    <i data-lucide="info" style="width: 64px; height: 64px;"></i>
                </div>
                <h1 id="waelos-popup-title" style="margin: 0 0 5px; font-size: 32px;">Alert</h1>
                <p id="waelos-popup-msg" class="sub" style="margin-bottom: 25px;"></p>
                <div id="waelos-popup-btns" style="display: flex; gap: 15px; justify-content: center; width: 100%;"></div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', html);
    }
};

window.closeWaelPopup = () => {
    const overlay = document.getElementById('waelos-popup-overlay');
    const card = document.getElementById('waelos-popup-card');
    if (overlay) {
        overlay.style.opacity = '0';
        card.style.transform = 'scale(0.9) translateY(20px)';
        setTimeout(() => { overlay.style.display = 'none'; }, 300); 
    }
};

window.waelAlert = (title, msg) => {
    injectPopup();
    const overlay = document.getElementById('waelos-popup-overlay');
    const card = document.getElementById('waelos-popup-card');
    
    document.getElementById('waelos-popup-title').innerText = title;
    document.getElementById('waelos-popup-msg').innerText = msg;
    
    const iconContainer = document.getElementById('waelos-popup-icon-container');
    iconContainer.style.color = '#4ade80';
    iconContainer.style.filter = 'drop-shadow(0 0 15px rgba(74, 222, 128, 0.4))';
    iconContainer.innerHTML = '<i data-lucide="info" style="width: 64px; height: 64px;"></i>';
    
    const btnContainer = document.getElementById('waelos-popup-btns');
    btnContainer.innerHTML = ''; 
    
    const okBtn = document.createElement('button');
    okBtn.className = 'btn';
    okBtn.style.cssText = 'background: #4ade80; color: #000; font-size: 16px;';
    okBtn.innerText = 'OK';
    okBtn.addEventListener('click', () => window.closeWaelPopup());
    
    btnContainer.appendChild(okBtn);
    
    if(window.lucide) lucide.createIcons();
    
    overlay.style.display = 'flex';
    void overlay.offsetWidth; 
    overlay.style.opacity = '1';
    card.style.transform = 'scale(1) translateY(0)';
};

window.waelConfirm = (title, msg, onConfirm) => {
    injectPopup();
    const overlay = document.getElementById('waelos-popup-overlay');
    const card = document.getElementById('waelos-popup-card');
    
    document.getElementById('waelos-popup-title').innerText = title;
    document.getElementById('waelos-popup-msg').innerText = msg;
    
    const iconContainer = document.getElementById('waelos-popup-icon-container');
    iconContainer.style.color = '#ff4757';
    iconContainer.style.filter = 'drop-shadow(0 0 15px rgba(255, 71, 87, 0.4))';
    iconContainer.innerHTML = '<i data-lucide="alert-triangle" style="width: 64px; height: 64px;"></i>';
    
    const btnContainer = document.getElementById('waelos-popup-btns');
    btnContainer.innerHTML = ''; 
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn';
    cancelBtn.style.cssText = 'background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; font-size: 16px;';
    cancelBtn.innerText = 'Cancel';
    cancelBtn.addEventListener('click', () => window.closeWaelPopup());
    
    const proceedBtn = document.createElement('button');
    proceedBtn.className = 'btn';
    proceedBtn.style.cssText = 'background: #ff4757; color: #fff; font-size: 16px; border: none;';
    proceedBtn.innerText = 'Proceed';
    proceedBtn.addEventListener('click', () => {
        window.closeWaelPopup();
        if (onConfirm) onConfirm();
    });
    
    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(proceedBtn);
    
    if(window.lucide) lucide.createIcons();
    
    overlay.style.display = 'flex';
    void overlay.offsetWidth;
    overlay.style.opacity = '1';
    card.style.transform = 'scale(1) translateY(0)';
};

// ==========================================
// 9. GLASSMORPHISM SELECT ENGINE
// ==========================================
// BUG FIX 4: Prevent global click listener leak
let customSelectListenerAttached = false;

function initCustomSelects() {
    document.querySelectorAll('select.pwd-input').forEach(select => {
        if (select.nextElementSibling && select.nextElementSibling.classList.contains('custom-select-wrapper')) return;

        select.style.display = 'none';

        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select-wrapper';
        wrapper.style.position = 'relative';
        wrapper.style.flex = select.style.flex || '1';
        wrapper.style.width = select.style.width || '100%';

        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger pwd-input';
        trigger.style.display = 'flex';
        trigger.style.justifyContent = 'space-between';
        trigger.style.alignItems = 'center';
        trigger.style.userSelect = 'none';
        trigger.style.padding = '10px 14px';
        trigger.style.margin = '0';
        trigger.style.height = '42px';
        trigger.style.cursor = 'pointer';
        
        const selectedText = document.createElement('span');
        selectedText.innerText = select.options[select.selectedIndex]?.text || '';
        trigger.appendChild(selectedText);

        const icon = document.createElement('i');
        icon.setAttribute('data-lucide', 'chevron-down');
        icon.style.width = '18px';
        icon.style.height = '18px';
        icon.style.transition = 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), color 0.3s';
        icon.style.color = 'var(--text-muted, rgba(255,255,255,0.7))';
        trigger.appendChild(icon);

        const optionsPanel = document.createElement('div');
        optionsPanel.className = 'custom-select-options custom-scrollbar';
        optionsPanel.style.position = 'absolute';
        optionsPanel.style.top = 'calc(100% + 8px)';
        optionsPanel.style.left = '0';
        optionsPanel.style.width = '100%';
        optionsPanel.style.background = 'rgba(20, 20, 20, 0.85)';
        optionsPanel.style.backdropFilter = 'blur(16px)';
        optionsPanel.style.webkitBackdropFilter = 'blur(16px)';
        optionsPanel.style.border = '1px solid rgba(255, 255, 255, 0.15)';
        optionsPanel.style.borderRadius = '12px';
        optionsPanel.style.boxShadow = '0 15px 40px rgba(0,0,0,0.6)';
        optionsPanel.style.padding = '6px';
        optionsPanel.style.display = 'none';
        optionsPanel.style.flexDirection = 'column';
        optionsPanel.style.gap = '4px';
        optionsPanel.style.zIndex = '999999';
        optionsPanel.style.maxHeight = '240px';
        optionsPanel.style.overflowY = 'auto';
        optionsPanel.style.opacity = '0';
        optionsPanel.style.transform = 'translateY(-10px)';
        optionsPanel.style.transition = 'opacity 0.2s ease, transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)';

        Array.from(select.options).forEach(option => {
            const optDiv = document.createElement('div');
            optDiv.className = 'custom-select-option';
            optDiv.innerText = option.text;
            optDiv.style.padding = '10px 14px';
            optDiv.style.borderRadius = '8px';
            optDiv.style.fontSize = '14px';
            optDiv.style.fontWeight = '500';
            optDiv.style.color = option.value === select.value ? '#fff' : 'rgba(255, 255, 255, 0.7)';
            optDiv.style.background = option.value === select.value ? 'rgba(255, 255, 255, 0.1)' : 'transparent';
            optDiv.style.transition = '0.2s';
            optDiv.style.cursor = 'pointer';
            optDiv.style.userSelect = 'none';

            optDiv.addEventListener('mouseenter', () => {
                optDiv.style.background = 'rgba(255, 255, 255, 0.15)';
                optDiv.style.color = '#fff';
            });
            
            optDiv.addEventListener('mouseleave', () => {
                if(option.value !== select.value) {
                    optDiv.style.background = 'transparent';
                    optDiv.style.color = 'rgba(255, 255, 255, 0.7)';
                } else {
                    optDiv.style.background = 'rgba(255, 255, 255, 0.1)';
                    optDiv.style.color = '#fff';
                }
            });

            optDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                select.value = option.value;
                selectedText.innerText = option.text;
                
                optionsPanel.style.opacity = '0';
                optionsPanel.style.transform = 'translateY(-10px)';
                setTimeout(() => optionsPanel.style.display = 'none', 200);
                
                trigger.style.borderColor = 'rgba(255,255,255,0.2)';
                icon.style.transform = 'rotate(0deg)';
                icon.style.color = 'rgba(255,255,255,0.7)';
                
                select.dispatchEvent(new Event('change'));

                Array.from(optionsPanel.children).forEach((child, idx) => {
                    if (select.options[idx].value !== select.value) {
                        child.style.background = 'transparent';
                        child.style.color = 'rgba(255,255,255,0.7)';
                    }
                });
                optDiv.style.background = 'rgba(255, 255, 255, 0.1)';
                optDiv.style.color = '#fff';
            });
            
            optionsPanel.appendChild(optDiv);
        });

        wrapper.appendChild(trigger);
        wrapper.appendChild(optionsPanel);
        select.parentNode.insertBefore(wrapper, select.nextSibling);

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = optionsPanel.style.display === 'flex';
            
            document.querySelectorAll('.custom-select-options').forEach(p => {
                if (p !== optionsPanel) {
                    p.style.opacity = '0';
                    p.style.transform = 'translateY(-10px)';
                    p.style.display = 'none'; 
                }
            });
            
            document.querySelectorAll('.custom-select-trigger').forEach(t => {
                if (t !== trigger) t.style.borderColor = 'rgba(255,255,255,0.2)';
            });
            
            document.querySelectorAll('.custom-select-trigger i').forEach(i => {
                if (i !== icon) {
                    i.style.transform = 'rotate(0deg)';
                    i.style.color = 'rgba(255,255,255,0.7)';
                }
            });

            if (!isVisible) {
                optionsPanel.style.display = 'flex';
                void optionsPanel.offsetWidth;
                optionsPanel.style.opacity = '1';
                optionsPanel.style.transform = 'translateY(0)';
                trigger.style.borderColor = '#4ade80';
                icon.style.transform = 'rotate(180deg)';
                icon.style.color = '#4ade80';
            } else {
                optionsPanel.style.opacity = '0';
                optionsPanel.style.transform = 'translateY(-10px)';
                setTimeout(() => optionsPanel.style.display = 'none', 200);
                trigger.style.borderColor = 'rgba(255,255,255,0.2)';
                icon.style.transform = 'rotate(0deg)';
                icon.style.color = 'rgba(255,255,255,0.7)';
            }
        });
    });

    if (!customSelectListenerAttached) {
        document.addEventListener('click', () => {
            document.querySelectorAll('.custom-select-options').forEach(p => {
                p.style.opacity = '0';
                p.style.transform = 'translateY(-10px)';
                setTimeout(() => p.style.display = 'none', 200);
            });
            document.querySelectorAll('.custom-select-trigger').forEach(t => t.style.borderColor = 'rgba(255,255,255,0.2)');
            document.querySelectorAll('.custom-select-trigger i').forEach(i => {
                i.style.transform = 'rotate(0deg)';
                i.style.color = 'rgba(255,255,255,0.7)';
            });
        });
        customSelectListenerAttached = true;
    }
    
    if (window.lucide) lucide.createIcons();
}

window.addEventListener('load', () => {
    setTimeout(initCustomSelects, 50);
});

// ==========================================
// 10. DOM LOADED EVENTS (Emoji & Back Button)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // MOROCCO EMOJI LOGIC
    if (localStorage.getItem('waelos_feature_emoji') !== 'false') {
        const MOROCCO_EMOJI = '🇲🇦';
        const MOROCCO_SHORTCODE = ':ma:';
        const MOROCCO_IMAGE_SRC = '/assets/morocco_flag_emoji_ios.png';
        const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE', 'NOSCRIPT']);

        function createMoroccoEmojiImage(originalText) {
            const img = document.createElement('img');
            img.src = MOROCCO_IMAGE_SRC;
            img.alt = originalText || 'Morocco flag';
            img.className = 'custom-emoji-inline ma-flag';
            img.loading = 'lazy';
            img.decoding = 'async';
            return img;
        }

        function replaceMoroccoEmojiInTextNode(node) {
            const text = node.nodeValue;
            if (!text || (!text.includes(MOROCCO_EMOJI) && !text.includes(MOROCCO_SHORTCODE))) {
                return;
            }
            const parts = text.split(/(🇲🇦|:ma:)/g);
            if (parts.length <= 1) return;
            const fragment = document.createDocumentFragment();
            for (const part of parts) {
                if (part === MOROCCO_EMOJI || part === MOROCCO_SHORTCODE) {
                    fragment.appendChild(createMoroccoEmojiImage(part));
                } else if (part) {
                    fragment.appendChild(document.createTextNode(part));
                }
            }
            node.parentNode.replaceChild(fragment, node);
        }

        function walkAndReplace(root) {
            const walker = document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode(node) {
                        const parent = node.parentElement;
                        if (!parent) return NodeFilter.FILTER_REJECT;
                        if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
                        if (!node.nodeValue || (!node.nodeValue.includes(MOROCCO_EMOJI) && !node.nodeValue.includes(MOROCCO_SHORTCODE))) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            const nodes = [];
            let current;
            while ((current = walker.nextNode())) {
                nodes.push(current);
            }

            nodes.forEach(replaceMoroccoEmojiInTextNode);
        }

        walkAndReplace(document.body);

        // BUG FIX 3: Add MutationObserver to catch dynamically loaded emojis
        const emojiObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            walkAndReplace(node);
                        } else if (node.nodeType === Node.TEXT_NODE) {
                            replaceMoroccoEmojiInTextNode(node);
                        }
                    });
                }
            });
        });
        
        emojiObserver.observe(document.body, { childList: true, subtree: true });
    }

    // GLOBAL DYNAMIC BACK BUTTON LOGIC
    const backBtn = document.getElementById('dynamicBackBtn');
    if (backBtn) {
        const referrer = document.referrer.toLowerCase();
        
        if (referrer.includes('shortcuts')) {
            backBtn.href = 'shortcuts';
            backBtn.innerHTML = '<i data-lucide="zap"></i> Shortcuts';
        } else if (referrer.includes('redeem')) {
            backBtn.href = 'redeem';
            backBtn.innerHTML = '<i data-lucide="ticket"></i> Redeem';
        } else {
            backBtn.href = 'index';
            backBtn.innerHTML = '<i data-lucide="home"></i> Home';
        }

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
});
