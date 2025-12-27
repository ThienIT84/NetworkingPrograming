// ============================================
// TẾT THEME CONTROLLER
// Pháo hoa, hoa mai, lì xì, chúc mừng năm mới
// ============================================

class TetTheme {
    constructor() {
        this.isActive = false;
        this.intervals = [];
        this.init();
    }

    init() {
        // FORCE DISABLE on every page load - user must manually enable each session
        // Always start with disabled state
        localStorage.setItem('tetMode', 'false');
        this.isActive = false;
        
        // Create toggle button
        this.createToggleButton();
        
        // Do NOT auto-activate - user must click toggle button
        console.log('🎊 Tết theme initialized (disabled by default)');
    }

    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'tet-toggle';
        button.innerHTML = '🎊';
        button.title = 'Click để bật/tắt chế độ Tết 🎉';
        button.setAttribute('aria-label', 'Toggle Tet Theme - Click to celebrate Lunar New Year!');
        
        // Add tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tet-tooltip';
        tooltip.textContent = 'Bật chế độ Tết';
        button.appendChild(tooltip);
        
        button.addEventListener('click', () => {
            if (this.isActive) {
                this.deactivate();
                tooltip.textContent = 'Bật chế độ Tết';
            } else {
                this.activate();
                tooltip.textContent = 'Tắt chế độ Tết';
            }
        });
        
        document.body.appendChild(button);
    }

    activate() {
        this.isActive = true;
        document.body.classList.add('tet-mode');
        localStorage.setItem('tetMode', 'true');
        
        // Show welcome message
        this.showWelcomeMessage();
        
        // Create containers
        this.createFireworksContainer();
        
        // Start animations
        this.startFireworks();
        this.startPetals();
        this.startRedEnvelopes();
        this.startLanterns();
        this.startSparkles();
        this.startConfetti();
        this.createDragon();
        this.createBanner();
        
        console.log('🎊 Chúc Mừng Năm Mới! Tết theme activated!');
    }

    deactivate() {
        this.isActive = false;
        document.body.classList.remove('tet-mode');
        localStorage.setItem('tetMode', 'false');
        
        // Clear all intervals
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
        
        // Remove all Tet elements
        const tetElements = document.querySelectorAll(
            '.fireworks-container, .petal, .red-envelope, .lantern, ' +
            '.sparkle, .confetti, .dragon, .tet-banner, .tet-message'
        );
        tetElements.forEach(el => el.remove());
        
        console.log('Tết theme deactivated');
    }

    showWelcomeMessage() {
        const messages = [
            '🎊 Chúc Mừng Năm Mới! 🎊',
            '🧧 Vạn Sự Như Ý! 🧧',
            '🎆 An Khang Thịnh Vượng! 🎆',
            '🏮 Phúc Lộc Thọ! 🏮'
        ];
        
        const message = document.createElement('div');
        message.className = 'tet-message';
        message.textContent = messages[Math.floor(Math.random() * messages.length)];
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 500);
        }, 3000);
    }

    createFireworksContainer() {
        if (!document.querySelector('.fireworks-container')) {
            const container = document.createElement('div');
            container.className = 'fireworks-container';
            document.body.appendChild(container);
        }
    }

    startFireworks() {
        const createFirework = () => {
            const container = document.querySelector('.fireworks-container');
            if (!container) return;
            
            const colors = ['#ff0000', '#ffcc00', '#00ff00', '#0000ff', '#ff00ff', '#ffd700'];
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * (window.innerHeight * 0.6);
            
            // Create multiple particles for explosion effect
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.className = 'firework';
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                const angle = (Math.PI * 2 * i) / 30;
                const velocity = 50 + Math.random() * 50;
                particle.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
                particle.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
                
                container.appendChild(particle);
                
                setTimeout(() => particle.remove(), 1500);
            }
        };
        
        // Create fireworks every 2 seconds
        const interval = setInterval(createFirework, 2000);
        this.intervals.push(interval);
        
        // Initial firework
        createFirework();
    }

    startPetals() {
        const createPetal = () => {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.left = Math.random() * window.innerWidth + 'px';
            petal.style.animationDuration = (5 + Math.random() * 5) + 's';
            petal.style.animationDelay = Math.random() * 2 + 's';
            
            document.body.appendChild(petal);
            
            setTimeout(() => petal.remove(), 12000);
        };
        
        // Create petals every 1000ms (reduced from 500ms)
        const interval = setInterval(createPetal, 1000);
        this.intervals.push(interval);
    }

    startRedEnvelopes() {
        const createEnvelope = () => {
            const envelope = document.createElement('div');
            envelope.className = 'red-envelope';
            envelope.style.left = Math.random() * window.innerWidth + 'px';
            envelope.style.animationDuration = (4 + Math.random() * 3) + 's';
            
            document.body.appendChild(envelope);
            
            setTimeout(() => envelope.remove(), 8000);
        };
        
        // Create envelopes every 3 seconds
        const interval = setInterval(createEnvelope, 3000);
        this.intervals.push(interval);
    }

    startLanterns() {
        const positions = [
            { top: '100px', left: '10%' },
            { top: '100px', right: '10%' },
            { top: '150px', left: '30%' },
            { top: '150px', right: '30%' }
        ];
        
        positions.forEach((pos, index) => {
            const lantern = document.createElement('div');
            lantern.className = 'lantern';
            Object.assign(lantern.style, pos);
            lantern.style.animationDelay = (index * 0.5) + 's';
            document.body.appendChild(lantern);
        });
    }

    startSparkles() {
        const createSparkle = () => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = Math.random() * window.innerWidth + 'px';
            sparkle.style.top = Math.random() * window.innerHeight + 'px';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => sparkle.remove(), 1500);
        };
        
        // Create sparkles every 600ms (reduced from 300ms)
        const interval = setInterval(createSparkle, 600);
        this.intervals.push(interval);
    }

    startConfetti() {
        const createConfetti = () => {
            const colors = ['#ff0000', '#ffcc00', '#00ff00', '#0000ff', '#ff00ff', '#ffd700'];
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (3 + Math.random() * 2) + 's';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 6000);
        };
        
        // Create confetti every 400ms (reduced from 200ms)
        const interval = setInterval(createConfetti, 400);
        this.intervals.push(interval);
    }

    createDragon() {
        const dragon = document.createElement('div');
        dragon.className = 'dragon';
        dragon.textContent = '🐉';
        document.body.appendChild(dragon);
    }

    createBanner() {
        const banner = document.createElement('div');
        banner.className = 'tet-banner';
        banner.innerHTML = '🎊 CHÚC MỪNG NĂM MỚI 2025 🎊';
        document.body.appendChild(banner);
    }
}

// Initialize Tet Theme when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.tetTheme = new TetTheme();
    });
} else {
    window.tetTheme = new TetTheme();
}

// Export for manual control
window.TetTheme = TetTheme;
