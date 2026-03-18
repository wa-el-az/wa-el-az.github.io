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
// 1. BROWSER TAB "MISS YOU" STATE
// ==========================================
const originalTitle = document.title;
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = "⚙️ System Paused...";
    } else {
        document.title = originalTitle;
    }
});

// ==========================================
// 2. SPOTLIGHT COMMAND CENTER (Ctrl + K)
// ==========================================
// The specific WaelOS links the user is allowed to search for
const spotlightRoutes = [
    { name: "Home", url: "index", icon: "home" },
    { name: "Projects", url: "projects", icon: "layers" },
    { name: "Shortcuts", url: "shortcuts", icon: "zap" },
    { name: "Tea Clicker", url: "tea", icon: "coffee" },
    { name: "Geometry Dash", url: "gd", icon: "play" },
    { name: "Achievements", url: "achievements", icon: "award" },
    { name: "Redeem", url: "redeem", icon: "gift" },
    { name: "Hardware Specs", url: "hardware", icon: "cpu" },
    { name: "Windows Gallery", url: "windows", icon: "monitor" },
    { name: "My PC", url: "mypc", icon: "hard-drive" }
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
// 3. AMBIENT FLASHLIGHT BUTTON GLOW
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
