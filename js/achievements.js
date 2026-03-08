// js/achievements.js - Secure Achievement Engine

const ACHIEVEMENTS = {
    tea_first: { title: "First Brew", desc: "You clicked the Moroccan Tea for the first time.", icon: "🍵" },
    tea_500: { title: "Sugar Rush", desc: "You reached 500 points in the Tea Clicker.", icon: "🍬" },
    tea_10k: { title: "Atay Master", desc: "You reached 10,000 points. True dedication.", icon: "👑" },
    tea_sync: { title: "Making a Name", desc: "You synced your score to the Global Leaderboard.", icon: "🌍" },
    ttt_win: { title: "Warming Up", desc: "You won a game of Tic-Tac-Toe.", icon: "⭕" },
    ttt_tie: { title: "The Pacifist", desc: "You tied against the Unbeatable AI.", icon: "🕊️" },
    ttt_hack: { title: "The Impossible", desc: "You beat the Unbeatable AI. Wait, that's illegal.", icon: "🤖" },
    exp_404: { title: "Lost in the Souk", desc: "You found the 404 Error page.", icon: "🧭" },
    exp_mail: { title: "You've Got Mail", desc: "You successfully sent Wael a message.", icon: "📨" },
    exp_proj: { title: "The Recruiter", desc: "You clicked to view one of my projects.", icon: "💼" },
    hack_denied: { title: "Access Denied", desc: "You failed the Admin Hub login.", icon: "🔒" },
    hack_brute: { title: "Brute Force", desc: "You tried 3 invalid codes in a row.", icon: "🧨" },
    hack_captain: { title: "I Am The Captain Now", desc: "You tried to use the ADMIN bypass code.", icon: "🏴‍☠️" },
    egg_patriot: { title: "Patriot", desc: "You clicked the Moroccan flag 7 times.", icon: "🇲🇦" },
    egg_owl: { title: "Night Owl", desc: "You are browsing Wael OS between 1 AM and 4 AM.", icon: "🦉" }
};

let unlocked = JSON.parse(localStorage.getItem('wael_achievements')) || [];

// Inject CSS ONLY for the Popups
const sysStyle = document.createElement('style');
sysStyle.innerHTML = `
    .achieve-popup {
        position: fixed; top: -120px; left: 50%; transform: translateX(-50%);
        background: rgba(11, 11, 11, 0.95); border: 1px solid #4ade80;
        backdrop-filter: blur(12px); padding: 16px 24px; border-radius: 16px;
        box-shadow: 0 10px 40px rgba(74, 222, 128, 0.2); z-index: 99999;
        display: flex; align-items: center; gap: 15px;
        transition: top 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        color: #fff; min-width: 320px; font-family: system-ui, sans-serif;
    }
    .achieve-popup.show { top: 20px; }
    .achieve-icon { font-size: 36px; filter: drop-shadow(0 0 10px rgba(255,255,255,0.3)); }
    .achieve-text h4 { margin: 0 0 4px 0; color: #4ade80; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
    .achieve-text p { margin: 0; font-size: 16px; font-weight: 900; }
    .achieve-text span { display: block; font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 4px; }
`;
document.head.appendChild(sysStyle);

window.unlockAchievement = function(id) {
    // SECURITY CHECK: Only save if the user is authenticated as Wael
    const isAuthenticated = localStorage.getItem('gh_token') === CONFIG.GITHUB_TOKEN;
    const isWael = localStorage.getItem('active_user') === 'Wael';

    if (!isAuthenticated || !isWael) {
        console.log("Achievement triggered, but not logged in as Wael. Data not saved.");
        return; 
    }

    if (!ACHIEVEMENTS[id] || unlocked.includes(id)) return;

    unlocked.push(id);
    localStorage.setItem('wael_achievements', JSON.stringify(unlocked));
    
    const popup = document.createElement('div');
    popup.className = 'achieve-popup';
    popup.innerHTML = `
        <div class="achieve-icon">${ACHIEVEMENTS[id].icon}</div>
        <div class="achieve-text">
            <h4>Achievement Unlocked</h4>
            <p>${ACHIEVEMENTS[id].title}</p>
            <span>${ACHIEVEMENTS[id].desc}</span>
        </div>
    `;
    document.body.appendChild(popup);
    
    setTimeout(() => popup.classList.add('show'), 100);
    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 600);
    }, 5000);
};

// Night Owl Check
const hour = new Date().getHours();
if (hour >= 1 && hour < 4) window.unlockAchievement('egg_owl');

// Patriot Check
let flagClicks = 0;
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        const src = e.target.src.toLowerCase();
        const alt = e.target.alt.toLowerCase();
        if (src.includes('morocco') || alt.includes('morocco')) {
            flagClicks++;
            if (flagClicks >= 7) window.unlockAchievement('egg_patriot');
        }
    }
});
