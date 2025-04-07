// Hacker Theme Animations
class HackerAnimations {
  constructor() {
    this.initialized = false;
    this.typingElements = [];
    this.commandLineElements = [];
    this.cursorElements = [];
    this.consoleContainer = null;
    this.consoleLines = [];
    this.scrollObserver = null;
    this.consoleAnimationInterval = null;
  }

  init() {
    if (this.initialized) return;
    
    // Create console background
    this.createConsoleBackground();
    
    // Find elements to animate
    this.findElements();
    
    // Set up scroll observer for typing animations
    this.setupScrollObserver();
    
    // Add command-line prefixes
    this.applyCommandLineStyle();
    
    // Add cursor effects
    this.applyCursorEffects();
    
    this.initialized = true;
  }

  createConsoleBackground() {
    // Create container for console animation
    this.consoleContainer = document.createElement('div');
    this.consoleContainer.classList.add('hacker-console-container');
    
    // Make sure the console container is inserted at the beginning of the body
    if (document.body.firstChild) {
      document.body.insertBefore(this.consoleContainer, document.body.firstChild);
    } else {
      document.body.appendChild(this.consoleContainer);
    }
    
    // Generate initial console lines
    this.generateConsoleLines();
    
    // Start animation
    this.animateConsole();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.resizeConsole();
    });
  }

  resizeConsole() {
    // Update console lines on resize
    this.generateConsoleLines();
  }

  generateConsoleLines() {
    const commands = [
      'cd /home/user',
      'ls -la',
      'cat /etc/passwd',
      'sudo apt-get update',
      'ping 192.168.1.1',
      'ssh user@server',
      'nmap -sV 10.0.0.1',
      'grep -r "password" .',
      'curl https://api.example.com',
      'git clone https://github.com/user/repo',
      'docker ps',
      'npm install',
      'python3 script.py',
      'openssl enc -aes-256-cbc -in file.txt',
      'chmod +x script.sh',
      'find / -name "*.conf"',
      'tail -f /var/log/syslog',
      'netstat -tuln',
      'ifconfig',
      'traceroute google.com'
    ];
    
    const responses = [
      'Permission denied',
      'Connection refused',
      'Access granted',
      'File not found',
      '[+] Operation successful',
      '[!] Warning: system unstable',
      'Error 404',
      'Scanning network...',
      'Found 3 vulnerabilities',
      'Encrypted connection established',
      'Downloading data: 64%',
      'System compromised',
      'Firewall bypassed',
      'Brute force attack detected',
      'Packet loss: 15%',
      'Backdoor installed',
      'Database dumped successfully',
      'Cracking password hashes...',
      'Rootkit detected',
      'Proxy chain initialized'
    ];
    
    // Clear existing console lines
    if (this.consoleContainer) {
      this.consoleContainer.innerHTML = '';
    }
    
    // Create new console lines
    const lineHeight = 20;
    const windowHeight = window.innerHeight;
    const totalLines = Math.floor(windowHeight / lineHeight) + 5;
    
    for (let i = 0; i < totalLines; i++) {
      const lineDiv = document.createElement('div');
      lineDiv.classList.add('console-line');
      
      const isCommand = Math.random() > 0.4;
      const text = isCommand 
        ? '> ' + commands[Math.floor(Math.random() * commands.length)]
        : '  ' + responses[Math.floor(Math.random() * responses.length)];
      
      lineDiv.textContent = text;
      lineDiv.style.left = Math.random() * (window.innerWidth - 400) + 'px';
      lineDiv.style.top = (i * lineHeight - 100) + 'px';
      lineDiv.style.opacity = (Math.random() * 0.3 + 0.1).toString();
      
      if (isCommand) {
        lineDiv.classList.add('command-line-bg');
      } else {
        lineDiv.classList.add('response-line-bg');
      }
      
      this.consoleContainer.appendChild(lineDiv);
      this.consoleLines.push(lineDiv);
    }
  }

  animateConsole() {
    // Clear any existing animation
    if (this.consoleAnimationInterval) {
      clearInterval(this.consoleAnimationInterval);
    }
    
    // Set up animation interval
    this.consoleAnimationInterval = setInterval(() => {
      // Move each line down
      this.consoleLines.forEach(line => {
        const currentTop = parseFloat(line.style.top);
        line.style.top = (currentTop + 0.5) + 'px';
        
        // Reset line if it's off screen
        if (currentTop > window.innerHeight + 20) {
          line.style.top = '-20px';
          line.style.left = Math.random() * (window.innerWidth - 400) + 'px';
          
          const commands = Array.from(document.querySelectorAll('.command-line-bg'))
            .map(el => el.textContent.substring(2));
          
          const responses = Array.from(document.querySelectorAll('.response-line-bg'))
            .map(el => el.textContent.substring(2));
          
          if (line.classList.contains('command-line-bg')) {
            line.textContent = '> ' + commands[Math.floor(Math.random() * commands.length)];
          } else {
            line.textContent = '  ' + responses[Math.floor(Math.random() * responses.length)];
          }
        }
      });
    }, 50);
  }

  findElements() {
    // Find headings to animate
    const headings = document.querySelectorAll('.hacker-theme h1, .hacker-theme h2, .hacker-theme h3');
    const paragraphs = document.querySelectorAll('.hacker-theme p');
    const logo = document.querySelector('.hacker-theme .logo a');
    
    // Add logo to typing elements (always animate)
    if (logo) {
      // Store original text and clear it
      const originalText = logo.textContent;
      logo.textContent = '';
      this.typingElements.push(logo);
      
      // Start typing animation for logo
      setTimeout(() => {
        this.typeText(logo, originalText, 100);
      }, 500);
    }
    
    // Store elements for scroll-triggered animations
    this.scrollElements = [...headings, ...paragraphs];
    
    // Select elements for command-line style
    this.commandLineElements = [...paragraphs].filter(() => Math.random() > 0.6);
    
    // Select elements for cursor effect
    this.cursorElements = [...headings].filter(() => Math.random() > 0.5);
  }

  setupScrollObserver() {
    // Create IntersectionObserver to detect when elements are visible
    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.hasAttribute('data-typed')) {
          // Element is now visible, start typing animation
          const element = entry.target;
          const originalText = element.textContent;
          
          // Skip very long text
          if (originalText.length > 100) {
            element.setAttribute('data-typed', 'true');
            return;
          }
          
          // Clear the element
          const originalHTML = element.innerHTML;
          element.innerHTML = '';
          
          // Type the text
          this.typeText(element, originalText, 30, () => {
            // If the original had HTML, restore it but keep the text
            if (originalHTML !== originalText) {
              element.innerHTML = originalHTML;
            }
          });
          
          // Mark as typed
          element.setAttribute('data-typed', 'true');
        }
      });
    }, { threshold: 0.2 });
    
    // Observe all scroll elements
    this.scrollElements.forEach(element => {
      this.scrollObserver.observe(element);
    });
  }

  typeText(element, text, speed, callback) {
    let i = 0;
    element.classList.add('typing-effect');
    
    const interval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(interval);
        // Remove typing effect class to hide cursor
        element.classList.remove('typing-effect');
        if (callback) callback();
      }
    }, speed);
  }

  applyCommandLineStyle() {
    this.commandLineElements.forEach(element => {
      if (!element.classList.contains('command-line')) {
        element.classList.add('command-line');
      }
    });
  }

  applyCursorEffects() {
    this.cursorElements.forEach(element => {
      if (!element.classList.contains('cursor-effect')) {
        element.classList.add('cursor-effect');
      }
    });
  }

  stop() {
    // Stop console animation
    if (this.consoleAnimationInterval) {
      clearInterval(this.consoleAnimationInterval);
      this.consoleAnimationInterval = null;
    }
    
    // Remove console container
    if (this.consoleContainer && this.consoleContainer.parentNode) {
      this.consoleContainer.parentNode.removeChild(this.consoleContainer);
      this.consoleContainer = null;
    }
    
    // Disconnect scroll observer
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
      this.scrollObserver = null;
    }
    
    // Remove all animation classes
    document.querySelectorAll('.typing-effect').forEach(element => {
      element.classList.remove('typing-effect');
    });
    
    document.querySelectorAll('.command-line').forEach(element => {
      element.classList.remove('command-line');
    });
    
    document.querySelectorAll('.cursor-effect').forEach(element => {
      element.classList.remove('cursor-effect');
    });
    
    // Remove data-typed attributes
    document.querySelectorAll('[data-typed]').forEach(element => {
      element.removeAttribute('data-typed');
    });
    
    this.initialized = false;
    this.typingElements = [];
    this.commandLineElements = [];
    this.cursorElements = [];
    this.scrollElements = [];
    this.consoleLines = [];
  }
}

// Global instance
const hackerAnimations = new HackerAnimations();

// Function to check if Hacker theme is active and handle animations
function checkAndToggleHackerAnimations() {
  const isHackerTheme = document.body.classList.contains('hacker-theme');
  
  if (isHackerTheme && !hackerAnimations.initialized) {
    hackerAnimations.init();
  } else if (!isHackerTheme && hackerAnimations.initialized) {
    hackerAnimations.stop();
  }
}

// Set up observer to watch for theme changes
const hackerThemeObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'class') {
      checkAndToggleHackerAnimations();
    }
  });
});

// Start observing body for class changes
document.addEventListener('DOMContentLoaded', () => {
  hackerThemeObserver.observe(document.body, { attributes: true });
  
  // Check on initial load
  checkAndToggleHackerAnimations();
});
