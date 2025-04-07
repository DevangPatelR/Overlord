// Matrix Digital Rain Animation
class MatrixAnimation {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.initialized = false;
    this.drops = [];
    this.fontSize = 14;
    this.columns = 0;
    this.matrixChars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    this.animationFrameId = null;
    this.frameCount = 0;
    this.frameDelay = 3; // Only update every 3 frames (slows down animation)
  }

  init() {
    if (this.initialized) return;
    
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('matrix-canvas');
    document.body.appendChild(this.canvas);
    
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    
    // Initialize drops
    this.drops = [];
    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = Math.floor(Math.random() * -100); // Random start position above the screen
    }
    
    // Start animation
    this.animate();
    this.initialized = true;
    
    // Handle window resize
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    
    // Reinitialize drops if needed
    if (this.drops.length !== this.columns) {
      this.drops = [];
      for (let i = 0; i < this.columns; i++) {
        this.drops[i] = Math.floor(Math.random() * -100);
      }
    }
  }

  animate() {
    // Increment frame counter
    this.frameCount++;
    
    // Only update the animation every few frames to slow it down
    if (this.frameCount % this.frameDelay === 0) {
      // Semi-transparent black to create trail effect (more transparent for slower fade)
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = '#00ff41'; // Matrix green
      this.ctx.font = this.fontSize + 'px monospace';
      
      for (let i = 0; i < this.drops.length; i++) {
        // Only update some columns each frame for a more varied effect
        if (Math.random() > 0.65) {
          // Random character
          const text = this.matrixChars.charAt(Math.floor(Math.random() * this.matrixChars.length));
          
          // Draw the character
          this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
          
          // Move drops down more slowly
          if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.99) {
            this.drops[i] = 0;
          }
          this.drops[i] += 0.5; // Slower drop speed (was 1)
        }
      }
    }
    
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
      this.canvas = null;
      this.initialized = false;
    }
  }
}

// Global instance
const matrixAnimation = new MatrixAnimation();

// Function to check if Matrix theme is active and handle animation
function checkAndToggleMatrixAnimation() {
  const isMatrixTheme = document.body.classList.contains('matrix-theme');
  
  if (isMatrixTheme && !matrixAnimation.initialized) {
    matrixAnimation.init();
  } else if (!isMatrixTheme && matrixAnimation.initialized) {
    matrixAnimation.stop();
  }
}

// Set up observer to watch for theme changes
const bodyObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'class') {
      checkAndToggleMatrixAnimation();
    }
  });
});

// Start observing body for class changes
document.addEventListener('DOMContentLoaded', () => {
  bodyObserver.observe(document.body, { attributes: true });
  
  // Check on initial load
  checkAndToggleMatrixAnimation();
});
