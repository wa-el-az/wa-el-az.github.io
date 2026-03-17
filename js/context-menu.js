document.addEventListener('DOMContentLoaded', () => {
    const MOROCCO_EMOJI = '<img src="/assets/morocco_flag_emoji_ios.png" alt="Morocco flag" class="ma-flag">';
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

        const parts = text.split(/(<img src="/assets/morocco_flag_emoji_ios.png" alt="Morocco flag" class="ma-flag">|:ma:)/g);
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

    // 1. Build the base HTML structure
    const contextMenu = document.createElement('div');
    contextMenu.id = 'context-menu';
    contextMenu.innerHTML = `
        <div class="context-item" id="ctx-refresh"><i data-lucide="refresh-cw"></i> Refresh System</div>
        <div class="context-divider"></div>
        <div class="context-item" id="ctx-fullscreen"><i data-lucide="maximize"></i> Toggle Fullscreen</div>
        <div class="context-item" id="ctx-source"><i data-lucide="code"></i> View Source Code</div>
    `;
    document.body.appendChild(contextMenu);

    // Initialize initial icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ root: contextMenu });
    }

    // 2. Button Actions
    document.getElementById('ctx-refresh').addEventListener('click', () => {
        location.reload();
    });

    document.getElementById('ctx-fullscreen').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        contextMenu.style.display = 'none';
    });

    document.getElementById('ctx-source').addEventListener('click', () => {
        window.open('https://github.com/wa-el-az/WaelOS', '_blank');
        contextMenu.style.display = 'none';
    });

    // 3. Intercept the right-click globally
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        
        // --- DYNAMIC FULLSCREEN CHECK ---
        const fsItem = document.getElementById('ctx-fullscreen');
        if (!document.fullscreenElement) {
            fsItem.innerHTML = '<i data-lucide="maximize"></i> Toggle Fullscreen';
        } else {
            fsItem.innerHTML = '<i data-lucide="minimize"></i> Toggle Windowed';
        }
        
        // Re-render the specific icon we just swapped
        if (typeof lucide !== 'undefined') {
            lucide.createIcons({ root: fsItem });
        }
        // --------------------------------
        
        let x = e.clientX;
        let y = e.clientY;
        const menuWidth = 220;
        const menuHeight = 140; 
        
        // Prevent menu from clipping off the edges of the screen
        if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
        if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;

        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.style.display = 'flex';
    });

    // 4. Hide menu when clicking anywhere else
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#context-menu')) {
            contextMenu.style.display = 'none';
        }
    });
});
