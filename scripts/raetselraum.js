// Level data
const levelData = {
  1: {
    title: "Das Rätselhafte Gedicht",
    description: "Entziffern sie das mysteriöse Gedicht an Emil den Trommlerjungen.",
    requirements: "Verwenden Sie die Kamera, um QR-Codes zu scannen und versteckte Hinweise zu finden.",
    difficulty: "⭐⭐⭐",
    status: "available"
  },
  2: {
    title: "Die geheime Botschaft",
    description: "Entschlüsseln Sie die Nachricht des jungen Boten Friedrich.",
    requirements: "Nutzen Sie AR-Erkennung, um versteckte Symbole in den Bücherregalen zu entdecken.",
    difficulty: "⭐⭐⭐⭐",
    status: "available"
  },
  3: {
    title: "Das falsche Gemälde",
    description: "Vergleichen Sie die Gemälde und finden Sie die Fehler der Fälschung.",
    requirements: "Verwenden Sie die Kamera, um das Rätsel zu aktivieren.",
    difficulty: "⭐⭐",
    status: "available"
  },
  4: {
    title: "Die verborgene Nachricht",
    description: "Entdecken Sie Annas geheime Botschaft mithilfe von modernen Technik.",
    requirements: "Techische Hilfmittel die im Raum vorhanden sind nutzen",
    difficulty: "⭐",
    status: "available"
  }
};

// DOM elements
const levelCards = document.querySelectorAll('.level-card');
const confirmationModal = document.getElementById('confirmationModal');
const confirmationTitle = document.getElementById('confirmationTitle');
const confirmationText = document.getElementById('confirmationText');
const levelInfoPreview = document.getElementById('levelInfoPreview');
const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
const confirmStartBtn = document.getElementById('confirmStartBtn');

let selectedLevel = null;

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing event listeners...');
  
  // Add click and touch events to level cards
  levelCards.forEach((card, index) => {
    console.log(`Setting up events for card ${index + 1}:`, card);
    
    // Add multiple event types for better mobile support
    const events = ['click', 'touchend'];
    
    events.forEach(eventType => {
      card.addEventListener(eventType, function(e) {
        // Prevent default behavior and event bubbling
        e.preventDefault();
        e.stopPropagation();
        
        // For touch events, make sure it's not a scroll/swipe
        if (eventType === 'touchend') {
          // Only proceed if touch didn't move much (not a swipe)
          const touch = e.changedTouches[0];
          if (touch && this.touchStartX && Math.abs(touch.clientX - this.touchStartX) > 10) {
            return;
          }
        }
        
        const level = this.dataset.level;
        console.log(`Level card clicked: ${level}`);
        
        if (level) {
          showConfirmationModal(level);
        }
      }, { passive: false });
    });
    
    // Track touch start position for swipe detection
    card.addEventListener('touchstart', function(e) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    // Add visual feedback for touch
    card.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
      this.style.transition = 'transform 0.1s ease';
    });
    
    card.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
    
    // Add cursor pointer for desktop
    card.style.cursor = 'pointer';
  });

  // Modal close events
  if (cancelConfirmBtn) {
    cancelConfirmBtn.addEventListener('click', closeConfirmationModal);
    cancelConfirmBtn.addEventListener('touchend', function(e) {
      e.preventDefault();
      closeConfirmationModal();
    });
  }
  
  // Start level button
  if (confirmStartBtn) {
    confirmStartBtn.addEventListener('click', function() {
      if (selectedLevel) {
        startLevel(selectedLevel);
      }
    });
    
    confirmStartBtn.addEventListener('touchend', function(e) {
      e.preventDefault();
      if (selectedLevel) {
        startLevel(selectedLevel);
      }
    });
  }

  // Close modal when clicking outside
  if (confirmationModal) {
    confirmationModal.addEventListener('click', function(e) {
      if (e.target === confirmationModal) {
        closeConfirmationModal();
      }
    });
    
    confirmationModal.addEventListener('touchend', function(e) {
      if (e.target === confirmationModal) {
        e.preventDefault();
        closeConfirmationModal();
      }
    });
  }
});

// Show confirmation modal
function showConfirmationModal(level) {
  console.log(`Opening confirmation modal for level: ${level}`);
  
  selectedLevel = level;
  const data = levelData[level];
  
  if (!data) {
    console.error(`Level data not found for level: ${level}`);
    return;
  }
  
  // Update modal content
  confirmationTitle.textContent = `Level ${level} starten?`;
  confirmationText.textContent = `Möchten Sie "${data.title}" starten?`;
  
  levelInfoPreview.innerHTML = `
    <div class="level-preview-card">
      <h4>${data.title}</h4>
      <p>${data.description}</p>
      <div class="level-meta">
        <span class="difficulty-badge">${data.difficulty}</span>
        <span class="level-status">${data.status === 'completed' ? '✓ Abgeschlossen' : '▶ Verfügbar'}</span>
      </div>
    </div>
  `;
  
  // Show modal
  confirmationModal.classList.add('active');
  
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
  
  console.log('Confirmation modal should now be visible');
}

// Close confirmation modal
function closeConfirmationModal() {
  console.log('Closing confirmation modal');
  
  confirmationModal.classList.remove('active');
  selectedLevel = null;
  
  // Re-enable body scroll
  document.body.style.overflow = '';
}

// Start level function
function startLevel(level) {
  console.log(`Starting level: ${level}`);
  
  // Close modal first
  closeConfirmationModal();
  
  // Small delay to ensure modal closes smoothly
  setTimeout(() => {
    // Redirect to game page with level parameter
    window.location.href = `game.html?level=${level}`;
  }, 200);
}

// Add keyboard support
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && confirmationModal.classList.contains('active')) {
    closeConfirmationModal();
  }
});

// Debug function to test modal manually
window.testModal = function() {
  console.log('Testing confirmation modal...');
  showConfirmationModal('1');
};

// Log when script is loaded
console.log('raetselraum.js loaded successfully');