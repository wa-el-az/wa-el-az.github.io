document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('/json/emoji-mapping.json');
        const emojiMap = await response.json();

        function replaceEmojisInNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                let text = node.nodeValue;
                let newHtml = text;
                let hasReplaced = false;

                for (const [emoji, filename] of Object.entries(emojiMap)) {
                    if (text.includes(emoji)) {
                        hasReplaced = true;
                        
                        // If it's your custom flag, load locally. Otherwise, pull from the CDN!
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

        replaceEmojisInNode(document.body);
        
    } catch (error) {
        console.error("Emoji mapping failed to load:", error);
    }
});