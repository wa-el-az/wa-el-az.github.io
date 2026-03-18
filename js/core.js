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
