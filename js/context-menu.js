document.addEventListener('DOMContentLoaded', () => {
    // 1. Build the base HTML structure
    const contextMenu = document.createElement('div');
    contextMenu.id = 'context-menu';
    contextMenu.innerHTML = `
        <div class="context-item" id="ctx-refresh"><i data-lucide="refresh-cw"></i> Refresh System</div>
        <div class="context-divider"></div>
        <div class="context-item" id="ctx-fullscreen"><i data-lucide="maximize"></i> Toggle Fullscreen</div>
        <div class="context-item" id="ctx-source"><i data-lucide="code"></i> View Source Code</div>
        <div class="context-divider"></div>
        <div class="context-item" id="ctx-about"><i data-lucide="info"></i> About</div>
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

    document.getElementById('ctx-about').addEventListener('click', () => {
        window.location.href = 'about';
        contextMenu.style.display = 'none';
    });

    // 3. Intercept the right-click globally
    document.addEventListener('contextmenu', (e) => {
        // If the user disabled the custom context menu in Settings, revert to default browser menu!
        if (localStorage.getItem('waelos_feature_contextmenu') === 'false') return;

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
        const menuHeight = 180; // Increased slightly to make room for the new About Wael button
        
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
