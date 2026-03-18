document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/json/emoji-mapping.json');
        const emojiMap = await response.json();

        function replaceEmojisInNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                let text = node.nodeValue;
                if (!text) return;

                let newHtml = text;
                let hasReplaced = false;

                for (const [emoji, filename] of Object.entries(emojiMap)) {
                    if (text.includes(emoji)) {
                        hasReplaced = true;
                        
                        const imgSrc = filename.startsWith('/') 
                            ? filename 
                            : `https://cdn.jsdelivr.net/gh/zhdsmy/apple-emoji@master/png/160/${filename}`;
                            
                        newHtml = newHtml.split(emoji).join(`<img src="${imgSrc}" class="custom-emoji-inline" alt="${emoji}">`);
                    }
                }

                if (hasReplaced) {
                    const span = document.createElement('span');
                    span.innerHTML = newHtml;
                    node.replaceWith(span);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const skipTags = ['SCRIPT', 'STYLE', 'IMG', 'NOSCRIPT', 'TEXTAREA'];
                if (!skipTags.includes(node.tagName) && !node.classList.contains('custom-emoji-inline')) {
                    Array.from(node.childNodes).forEach(replaceEmojisInNode);
                }
            }
        }

        // 1. Run initially on the whole body when the page loads
        replaceEmojisInNode(document.body);

        // 2. Set up the observer to watch for any new emojis added in real-time
        const observer = new MutationObserver((mutations) => {
            // Pause the observer briefly so we don't create an infinite loop when replacing
            observer.disconnect();

            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    // Check new elements added to the page
                    mutation.addedNodes.forEach(node => {
                        replaceEmojisInNode(node);
                    });
                } else if (mutation.type === 'characterData') {
                    // Check if existing text was updated (like a click counter)
                    replaceEmojisInNode(mutation.target);
                }
            });

            // Turn the observer back on
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                characterData: true
            });
        });

        // Start watching the page
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
        
    } catch (error) {
        console.error("Emoji mapping failed to load:", error);
    }
});
