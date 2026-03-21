document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. MOROCCO EMOJI LOGIC
    // ==========================================
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

    // ==========================================
    // 2. GLOBAL DYNAMIC BACK BUTTON LOGIC
    // ==========================================
    const backBtn = document.getElementById('dynamicBackBtn');
    
    // Only run if the button was manually placed in the HTML
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

        // Render the injected icon
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
});

// ==========================================
// 3. SPOTLIGHT COMMAND CENTER (Ctrl + K)
// ==========================================
// The specific WaelOS links the user is allowed to search for
const spotlightRoutes = [
    { name: "Home", url: "index", icon: "home" },
    { name: "Projects", url: "projects", icon: "layers" },
    { name: "Shortcuts", url: "shortcuts", icon: "zap" },
    { name: "Tea Clicker", url: "tea", icon: "coffee" },
    { name: "Geometry Dash", url: "gd", icon: "play" },
    { name: "Music Player", url: "music", icon: "music" },
    { name: "Achievements", url: "achievements", icon: "award" },
    { name: "Redeem", url: "redeem", icon: "gift" },
    { name: "Hardware Specs", url: "hardware", icon: "cpu" },
    { name: "Windows Vault", url: "windows", icon: "monitor" },
    { name: "My PC", url: "mypc", icon: "hard-drive" },
    { name: "About Website", url: "about", icon: "info" },
    { name: "System Settings", url: "about", icon: "settings" }
];

// Inject the Spotlight HTML directly into the page
const spotlightHTML = `
    <div id="spotlight-overlay">
        <div id="spotlight-modal">
            <div class="spotlight-input-wrap">
                <i data-lucide="search"></i>
                <input type="text" id="spotlight-input" placeholder="Search WaelOS (e.g. 'tea', 'projects')..." autocomplete="off">
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
    
    // Filter the hardcoded routes based on what the user types
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
        div.className = `spotlight-item ${idx === 0 ? 'active' : ''}`; // Auto-select the first result
        div.innerHTML = `<i data-lucide="${r.icon}"></i> ${r.name}`;
        div.onclick = () => window.location.href = r.url;
        spotlightResults.appendChild(div);
    });
    
    if (window.lucide) lucide.createIcons();
}

// Listen for Ctrl+K (or Cmd+K on Mac)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        spotlightOverlay.classList.add('active');
        spotlightInput.value = "";
        renderSpotlight();
        setTimeout(() => spotlightInput.focus(), 50); // Small delay to ensure focus works
    }
    
    // Close on Escape
    if (e.key === 'Escape' && spotlightOverlay.classList.contains('active')) {
        spotlightOverlay.classList.remove('active');
    }
    
    // Navigate on Enter
    if (e.key === 'Enter' && spotlightOverlay.classList.contains('active')) {
        const activeItem = spotlightResults.querySelector('.spotlight-item.active');
        if (activeItem) activeItem.click();
    }
});

// Close if they click the blurred background
spotlightOverlay.addEventListener('click', (e) => {
    if (e.target === spotlightOverlay) spotlightOverlay.classList.remove('active');
});

// Update results as they type
spotlightInput.addEventListener('input', (e) => renderSpotlight(e.target.value));


// ==========================================
// 4. AMBIENT FLASHLIGHT BUTTON GLOW
// ==========================================
// Tracks the exact X and Y of the mouse inside the button and sends it to CSS
document.querySelectorAll('.btn, .cta, .redeem, .shortcut-btn, .navBtn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        btn.style.setProperty('--x', x + 'px');
        btn.style.setProperty('--y', y + 'px');
    });
});

// ==========================================
// 5. GLOBAL CHEATS ENGINE
// ==========================================

// --- A. Website-Wide RGB Gamer Mode ---
if (localStorage.getItem('waelos_cheat_rgb_multiplier') === 'true') {
    const rgbStyle = document.createElement('style');
    rgbStyle.id = 'rgb-global-style';
    rgbStyle.innerHTML = `
        @keyframes rgb-hue-spin { 
            0% { filter: hue-rotate(0deg) saturate(1.5); } 
            100% { filter: hue-rotate(360deg) saturate(1.5); } 
        }
        /* FIXED: Removed .left and .right so the screen doesn't turn black! */
        .bg-left, .bg-right { 
            animation: rgb-hue-spin 4s linear infinite !important; 
        }
        .cta, .redeem, .btn, .shortcut-btn, .action-btn { 
            animation: rgb-hue-spin 2s linear infinite !important; 
        }
    `;
    document.head.appendChild(rgbStyle);
}

// --- B. Unlock All Achievements Logic ---
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
    
    // Instantly save all badges to the system if they were missing
    if (newlyUnlocked) {
        localStorage.setItem('wael_achievements', JSON.stringify(unlocked));
    }
}
// ==========================================
// 6. CUSTOM WAELOS POPUP SYSTEM (REDEEM STYLE)
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
    
    // Set icon to glowing green INFO
    const iconContainer = document.getElementById('waelos-popup-icon-container');
    iconContainer.style.color = '#4ade80';
    iconContainer.style.filter = 'drop-shadow(0 0 15px rgba(74, 222, 128, 0.4))';
    iconContainer.innerHTML = '<i data-lucide="info" style="width: 64px; height: 64px;"></i>';
    
    const btnContainer = document.getElementById('waelos-popup-btns');
    btnContainer.innerHTML = ''; 
    
    // Create button using your exact .btn class
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
    
    // Set icon to glowing red WARNING
    const iconContainer = document.getElementById('waelos-popup-icon-container');
    iconContainer.style.color = '#ff4757';
    iconContainer.style.filter = 'drop-shadow(0 0 15px rgba(255, 71, 87, 0.4))';
    iconContainer.innerHTML = '<i data-lucide="alert-triangle" style="width: 64px; height: 64px;"></i>';
    
    const btnContainer = document.getElementById('waelos-popup-btns');
    btnContainer.innerHTML = ''; 
    
    // Create buttons using your exact .btn class
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