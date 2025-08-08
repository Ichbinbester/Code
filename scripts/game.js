// Hint System with Time-based Unlocking
class HintSystem {
  constructor() {
    this.startTime = Date.now();
    this.hints = [
      {
        id: 1,
        unlockTime: 10000, // 10 seconds for testing (change to 60000 for 1 minute)
        title: "Erster Hinweis",
        content: "Schauen Sie sich die Umgebung genau an. Manchmal verstecken sich wichtige Hinweise in alltäglichen Objekten.",
        unlocked: false,
        viewed: false
      },
      {
        id: 2,
        unlockTime: 20000, // 20 seconds for testing (change to 120000 for 2 minutes)
        title: "Zweiter Hinweis",
        content: "Denken Sie daran, dass manche Rätsel eine bestimmte Reihenfolge haben. Versuchen Sie, Muster zu erkennen.",
        unlocked: false,
        viewed: false
      },
      {
        id: 3,
        unlockTime: 30000, // 30 seconds for testing (change to 180000 for 3 minutes)
        title: "Dritter Hinweis",
        content: "Falls Sie immer noch nicht weiterkommen: Überprüfen Sie alle Ecken und vergessen Sie nicht, auch nach oben zu schauen!",
        unlocked: false,
        viewed: false
      }
    ];
    
    this.hintsUsed = 0;
    this.init();
  }
  
  init() {
    // Wait for DOM to be ready before setting up
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupHintSystem();
      });
    } else {
      this.setupHintSystem();
    }
  }
  
  setupHintSystem() {
    this.bindEvents();
    this.updateHintStates(); // Initial update
    this.updateTimer = setInterval(() => {
      this.updateHintStates();
    }, 1000);
  }
  
  bindEvents() {
    // Hints button
    const hintBtn = document.getElementById('hintBtn');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        this.openHintsModal();
      });
    }
    
    // Close hints modal
    const closeHints = document.getElementById('closeHints');
    if (closeHints) {
      closeHints.addEventListener('click', () => {
        this.closeHintsModal();
      });
    }
    
    // Story button (existing)
    const storyBtn = document.getElementById('storyBtn');
    if (storyBtn) {
      storyBtn.addEventListener('click', () => {
        this.openStoryModal();
      });
    }
    
    // Close story modal
    const closeStory = document.getElementById('closeStory');
    if (closeStory) {
      closeStory.addEventListener('click', () => {
        this.closeStoryModal();
      });
    }
    
    // Hint item clicks - bind dynamically
    this.bindHintClicks();
    
    // Close modals when clicking outside
    const hintsModal = document.getElementById('hintsModal');
    if (hintsModal) {
      hintsModal.addEventListener('click', (e) => {
        if (e.target === hintsModal) {
          this.closeHintsModal();
        }
      });
    }
    
    const storyModal = document.getElementById('storyModal');
    if (storyModal) {
      storyModal.addEventListener('click', (e) => {
        if (e.target === storyModal) {
          this.closeStoryModal();
        }
      });
    }
  }
  
  bindHintClicks() {
  this.hints.forEach(hint => {
    this.ensureClickHandler(hint.id);
  });
}

testUnlockHint(hintId) {
  const hint = this.hints.find(h => h.id === hintId);
  if (hint) {
    hint.unlocked = true;
    this.updateHintStates();
    console.log(`Manually unlocked hint ${hintId}`);
  }
}
  
  updateHintStates() {
  const currentTime = Date.now();
  const elapsed = currentTime - this.startTime;
  
  console.log(`Elapsed time: ${elapsed}ms`);
  
  this.hints.forEach(hint => {
    const hintElement = document.getElementById(`hint${hint.id}`);
    const timerElement = document.getElementById(`hint${hint.id}Timer`);
    
    if (!hintElement || !timerElement) {
      console.warn(`Hint elements not found for hint ${hint.id}`);
      return;
    }
    
    if (elapsed >= hint.unlockTime && !hint.unlocked) {
      console.log(`Unlocking hint ${hint.id}`);
      hint.unlocked = true;
      
      // Update classes
      hintElement.classList.remove('locked');
      hintElement.classList.add('unlocked');
      
      // Update timer text
      timerElement.textContent = 'Verfügbar';
      timerElement.classList.add('unlocked');
      
      // Enable interaction
      hintElement.style.pointerEvents = 'auto';
      hintElement.style.opacity = '1';
      hintElement.style.cursor = 'pointer';
      
      // Add click event if not already added
      this.ensureClickHandler(hint.id);
      
    } else if (!hint.unlocked) {
      const remainingTime = hint.unlockTime - elapsed;
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);
      
      timerElement.textContent = `Verfügbar in ${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      // Update classes
      hintElement.classList.add('locked');
      hintElement.classList.remove('unlocked');
      
      // Disable interaction
      hintElement.style.pointerEvents = 'none';
      hintElement.style.opacity = '0.5';
      hintElement.style.cursor = 'not-allowed';
    }
  });
}

ensureClickHandler(hintId) {
  const hintElement = document.getElementById(`hint${hintId}`);
  if (hintElement && !hintElement.dataset.clickHandlerAdded) {
    hintElement.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleHint(hintId);
    });
    hintElement.dataset.clickHandlerAdded = 'true';
    console.log(`Click handler added for hint ${hintId}`);
  }
}
  
  toggleHint(hintId) {
  const hint = this.hints.find(h => h.id === hintId);
  const hintElement = document.getElementById(`hint${hintId}`);
  
  if (!hint || !hint.unlocked || !hintElement) {
    console.log(`Cannot toggle hint ${hintId}: unlocked=${hint?.unlocked}, element=${!!hintElement}`);
    return;
  }
  
  // Check if this hint is currently active
  const isActive = hintElement.classList.contains('active');
  
  // Close all other hints first
  this.hints.forEach(h => {
    const element = document.getElementById(`hint${h.id}`);
    if (element) {
      element.classList.remove('active');
    }
  });
  
  // If this hint wasn't active, make it active
  if (!isActive) {
    hintElement.classList.add('active');
    
    // Mark as viewed if not already viewed
    if (!hint.viewed) {
      hint.viewed = true;
      this.hintsUsed++;
      this.updateHintsUsedDisplay();
      console.log(`Hint ${hintId} viewed. Total hints used: ${this.hintsUsed}`);
    }
  }
}
  
  openHintsModal() {
    const modal = document.getElementById('hintsModal');
    if (modal) {
      modal.classList.add('active');
    }
  }
  
  closeHintsModal() {
    const modal = document.getElementById('hintsModal');
    if (modal) {
      modal.classList.remove('active');
    }
    // Close all expanded hints
    this.hints.forEach(hint => {
      const element = document.getElementById(`hint${hint.id}`);
      if (element) {
        element.classList.remove('active');
      }
    });
  }
  
  openStoryModal() {
    const modal = document.getElementById('storyModal');
    if (modal) {
      modal.classList.add('active');
    }
  }
  
  closeStoryModal() {
    const modal = document.getElementById('storyModal');
    if (modal) {
      modal.classList.remove('active');
    }
  }
  
  updateHintsUsedDisplay() {
    const hintsUsedElement = document.getElementById('hintsUsed');
    if (hintsUsedElement) {
      hintsUsedElement.textContent = this.hintsUsed;
    }
  }
  
  getHintsUsed() {
    return this.hintsUsed;
  }
  
  // Add method to manually unlock hint (for testing)
  unlockHint(hintId) {
    const hint = this.hints.find(h => h.id === hintId);
    if (hint) {
      hint.unlocked = true;
      this.updateHintStates();
    }
  }
  
  // Add method to get current elapsed time (for debugging)
  getElapsedTime() {
    return Date.now() - this.startTime;
  }
  
  destroy() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
  }
}

// Game Timer
class GameTimer {
  constructor() {
    this.startTime = Date.now();
    this.timerElement = document.getElementById('gameTimer');
    this.updateTimer();
    this.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }
  
  updateTimer() {
    const elapsed = Date.now() - this.startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    if (this.timerElement) {
      this.timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }
  
  getElapsedTime() {
    return Date.now() - this.startTime;
  }
  
  getFormattedTime() {
    const elapsed = this.getElapsedTime();
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  destroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}

// Game State Management
class GameState {
  constructor() {
    this.currentLevel = 1;
    this.startTime = Date.now();
    this.isGameActive = false;
    this.gameTimer = null;
    this.progress = 0;
    this.currentStoryPage = 0;
    this.storyPages = [];
    this.foundObjects = [];
    this.requiredObjects = [];
    this.camera = {
      video: null,
      canvas: null,
      context: null,
      stream: null,
      facingMode: 'environment' // Start with back camera
    };
    this.isUsingFrontCamera = false;
  }

  // Initialize game for specific level
  initializeLevel(levelNumber) {
    this.currentLevel = levelNumber;
    this.startTime = Date.now();
    this.progress = 0;
    this.foundObjects = [];
    this.isGameActive = true;
    
    // Load level-specific configuration
    this.loadLevelConfiguration(levelNumber);
    
    // Start the game timer
    this.startGameTimer();
    
    // Update UI
    this.updateUI();
  }

  // Load level-specific configuration
  loadLevelConfiguration(levelNumber) {
    const levelConfigs = {
      1: {
        title: "Das Rätselhafte Gedicht",
        description: "Entziffern sie das mysteriöse Gedicht an Emil den Trommlerjungen.",
        requiredObjects: ["poem"],
        storyPages: [
          {
            title: "Der geheime Brief",
            content: "Sie stehen vor einer alten Komode. Als sie die Schublade öffneten, finden Sie einen geheimen Brief an Emil dem Trommlerjungen. Er enthält ein rätselhaftes Gedicht vom Hauptmann des Schlosses welches es zu entschlüsseln gilt."
          },
          {
            title: "Der erste Hinweis",
            content: "Das erste Wort des Rätsels ist 'Feuer'. Lasst euch nicht von der Wirrheit der Reime verirren."
          },
          {
            title: "Erfolgreiche Entschlüsselung",
            content: "Mit dengefundenen Lösungswörtern sind sie einen Schritt näher am Schatz von Ebelsberg."
          }
        ]
      },
      2: {
        title: "Die geheime Botschaft",
        description: "Entschlüsseln Sie die Nachricht des jungen Boten Friedrich.",
        requiredObjects: ["book", "code", "cipher"],
        storyPages: [
          {
            title: "Der Bote in Gefahr",
            content: "In der Ecke des Raumes liegt ein zerknitterter Brief. Laut Notiz stammt er vom jungen Boten Friedrich, der während der Schlacht eine wichtige Botschaft transportierte – verschlüsselt, damit sie dem Feind nicht in die Hände fällt."
          },
          {
            title: "Der Buchstaben-Schieber",
            content: "Friedrich nutzte ein altes Verfahren, das er vom Schlossbibliothekar kannte. Ein einfacher Zahlencode der an einem bekanntem Römischem Kaiser inspiriert ist."
          },
          {
            title: "Botschaft entschlüsselt",
            content: "Mit klugem Verstand und der richtigen Technik haben Sie Friedrichs Nachricht gelesen, ein weiterer Schritt zur Lösung des Gesamtgeheimnisses."
          }
        ]
      },
      3: {
        title: "Das falsche Gemälde",
        description: "Vergleichen Sie die Gemälde und finden Sie die Fehler der Fälschung.",
        requiredObjects: ["crown", "scepter", "portrait"],
        storyPages: [
          {
            title: "Das vergessene Meisterwerk",
            content: "Ein großes Gemälde hängt an der Wand, es zeigt die Schlacht von Ebelsberg. Doch auf einem alten Tablet finden Sie eine scheinbar identische Version, die sich leicht unterscheidet..."
          },
          {
            title: "Ein Plan zur Täuschung",
            content: "Ein französischer Offizier ließ das Bild nachmalen, mit kleinen Fehlern, um den Verlauf der Schlacht zu seinen Gunsten zu verändern. Nur wer genau hinsieht, erkennt die Manipulationen."
          },
          {
            title: "Die Wahrheit ans Licht gebracht",
            content: "Durch die Aufdeckung der Unterschiede konnten Sie die wahre Geschichte der Schlacht von Ebelsberg wiederherstellen."
          }
        ]
      },
      4: {
        title: "Die verborgene Nachricht",
        description: "Entdecken Sie Annas geheime Botschaft mithilfe von modernen Technik.",
        requiredObjects: ["treasure", "safe", "combination"],
        storyPages: [
          {
            title: "Ein Brief ohne Inhalt?",
            content: "Auf dem Schreibtisch liegt ein scheinbar leerer Brief von Anna, einer jungen Helferin im Schloss. Auf den ersten Blick ist nichts zu erkennen, doch Sie spüren: Hier steckt mehr dahinter."
          },
          {
            title: "Das Licht der Wahrheit",
            content: "Mit einer UV-Lampe zeigen sich plötzlich Wörter und Sätze, eine versteckte Botschaft, die Anna heimlich niedergeschrieben hat, um Verwundete zu retten."
          },
          {
            title: "Verborgene Hinweise entdeckt",
            content: "Dank Ihres Scharfsinns wurden Annas Hinweise sichtbar, sie führen Sie zum nächsten Schritt in der Schatzsuche."
          }
        ]
      }
    };

    const config = levelConfigs[levelNumber];
    if (config) {
      this.requiredObjects = config.requiredObjects;
      this.storyPages = config.storyPages;
      
      // Update level title
      const levelTitle = document.getElementById('levelTitle');
      if (levelTitle) {
        levelTitle.textContent = config.title;
      }
      
      // Load story pages
      this.loadStoryPages();
    }
  }

  // Load story pages into the story book
  loadStoryPages() {
    const storyPagesContainer = document.getElementById('storyPages');
    if (!storyPagesContainer) return;
    
    storyPagesContainer.innerHTML = '';
    
    this.storyPages.forEach((page, index) => {
      const pageElement = document.createElement('div');
      pageElement.className = 'story-page';
      pageElement.style.display = index === 0 ? 'block' : 'none';
      pageElement.innerHTML = `
        <h3>${page.title}</h3>
        <p>${page.content}</p>
      `;
      storyPagesContainer.appendChild(pageElement);
    });
    
    this.currentStoryPage = 0;
    this.updateStoryNavigation();
  }

  // Update story navigation
  updateStoryNavigation() {
    const pageIndicator = document.getElementById('pageIndicator');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    
    if (pageIndicator) {
      pageIndicator.textContent = `Seite ${this.currentStoryPage + 1} von ${this.storyPages.length}`;
    }
    
    if (prevBtn) {
      prevBtn.disabled = this.currentStoryPage === 0;
    }
    
    if (nextBtn) {
      nextBtn.disabled = this.currentStoryPage === this.storyPages.length - 1;
    }
  }

  // Navigate story pages
  navigateStoryPage(direction) {
    const pages = document.querySelectorAll('.story-page');
    
    if (direction === 'next' && this.currentStoryPage < this.storyPages.length - 1) {
      pages[this.currentStoryPage].style.display = 'none';
      this.currentStoryPage++;
      pages[this.currentStoryPage].style.display = 'block';
    } else if (direction === 'prev' && this.currentStoryPage > 0) {
      pages[this.currentStoryPage].style.display = 'none';
      this.currentStoryPage--;
      pages[this.currentStoryPage].style.display = 'block';
    }
    
    this.updateStoryNavigation();
  }

  // Start the game timer
  startGameTimer() {
    this.gameTimer = setInterval(() => {
      if (this.isGameActive) {
        this.updateTimer();
      }
    }, 1000);
  }

  // Update timer display
  updateTimer() {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    const timerElement = document.getElementById('gameTimer');
    if (timerElement) {
      timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  // Stop the game timer
  stopGameTimer() {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
    this.isGameActive = false;
  }

  // Update UI elements
  updateUI() {
    this.updateProgress();
    this.updateTimer();
  }

  // Update progress bar
  updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    this.progress = Math.floor((this.foundObjects.length / this.requiredObjects.length) * 100);
    
    if (progressFill) {
      progressFill.style.width = `${this.progress}%`;
    }
    
    if (progressText) {
      progressText.textContent = `${this.progress}% abgeschlossen`;
    }
  }

  // Add found object
  addFoundObject(objectName) {
    if (!this.foundObjects.includes(objectName) && this.requiredObjects.includes(objectName)) {
      this.foundObjects.push(objectName);
      this.updateUI();
      
      // Check if level is complete
      if (this.foundObjects.length === this.requiredObjects.length) {
        this.completeLevel();
      }
    }
  }

  // Complete the level
  completeLevel() {
    this.stopGameTimer();
    this.showSuccessModal();
  }

  // Show success modal
  showSuccessModal() {
    const modal = document.getElementById('successModal');
    const completionTime = document.getElementById('completionTime');
    const hintsUsed = document.getElementById('hintsUsed');
    
    // Calculate completion time
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    if (completionTime) {
      completionTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Get hints used from hint system
    if (hintsUsed && window.hintSystem) {
      hintsUsed.textContent = window.hintSystem.getHintsUsed();
    }
    
    if (modal) {
      modal.classList.add('active');
    }
  }
}

// Camera Management
// Enhanced Camera Management with MediaPipe Paper Detection
class CameraManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.isInitialized = false;
    this.objectDetector = null;
    this.isDetecting = false;
    this.detectedPapers = [];
    this.arTextElements = [];
  }

  // Initialize camera with MediaPipe
  async initializeCamera() {
    try {
      const video = document.getElementById('cameraVideo');
      const canvas = document.getElementById('cameraCanvas');
      
      if (!video || !canvas) {
        throw new Error('Camera elements not found');
      }

      this.gameState.camera.video = video;
      this.gameState.camera.canvas = canvas;
      this.gameState.camera.context = canvas.getContext('2d');

      // Initialize MediaPipe Object Detection
      await this.initializeMediaPipe();

      // Request camera permission
      await this.requestCameraPermission();
      
      // Start continuous AR processing
      this.startARProcessing();
      
      this.isInitialized = true;
      console.log('Camera initialized successfully with MediaPipe');
    } catch (error) {
      console.error('Camera initialization failed:', error);
      this.showCameraError();
    }
  }

  // Initialize MediaPipe Object Detection
  async initializeMediaPipe() {
    try {
      // Load MediaPipe Vision tasks
      const vision = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest');
      
      // Create ObjectDetector
      this.objectDetector = await vision.ObjectDetector.createFromOptions({
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite',
          delegate: 'GPU'
        },
        scoreThreshold: 0.3,
        runningMode: 'VIDEO'
      });
      
      console.log('MediaPipe ObjectDetector initialized');
    } catch (error) {
      console.error('MediaPipe initialization failed, falling back to simple detection:', error);
      // Fallback to simple detection method
      this.objectDetector = null;
    }
  }

  // Request camera permission (unchanged)
  async requestCameraPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: this.gameState.camera.facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      this.gameState.camera.stream = stream;
      this.gameState.camera.video.srcObject = stream;
      
      return new Promise((resolve) => {
        this.gameState.camera.video.onloadedmetadata = () => {
          resolve();
        };
      });
    } catch (error) {
      console.error('Camera permission denied:', error);
      throw error;
    }
  }

  // Enhanced AR processing with real paper detection
  startARProcessing() {
    let lastDetectionTime = 0;
    const detectionInterval = 200; // Detect every 200ms for performance

    const processFrame = () => {
      if (this.gameState.camera.video && this.gameState.camera.video.readyState === 4) {
        const currentTime = Date.now();
        
        // Only run detection at intervals
        if (currentTime - lastDetectionTime > detectionInterval) {
          this.detectPapersAndProjectText();
          lastDetectionTime = currentTime;
        }
      }
      
      // Continue processing
      requestAnimationFrame(processFrame);
    };
    
    processFrame();
  }

  // Detect papers and project AR text
  async detectPapersAndProjectText() {
    if (this.isDetecting) return;
    this.isDetecting = true;

    try {
      const { video, canvas, context } = this.gameState.camera;
      
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      let detectedPapers = [];

      if (this.objectDetector) {
        // Use MediaPipe for advanced detection
        detectedPapers = await this.detectWithMediaPipe(video);
      } else {
        // Fallback to simple detection
        detectedPapers = this.detectPapersSimple(canvas);
      }

      // Update detected papers
      this.detectedPapers = detectedPapers;

      // Project AR text on detected papers
      this.projectARText();

    } catch (error) {
      console.error('Detection error:', error);
    } finally {
      this.isDetecting = false;
    }
  }

  // MediaPipe detection
  async detectWithMediaPipe(video) {
    try {
      const detections = await this.objectDetector.detectForVideo(video, Date.now());
      
      // Filter for book/paper-like objects
      const paperDetections = detections.detections.filter(detection => {
        const category = detection.categories[0];
        // Look for books, papers, or rectangular objects
        return category.categoryName === 'book' || 
               category.categoryName === 'laptop' ||
               category.score > 0.5;
      });

      return paperDetections.map(detection => ({
        x: detection.boundingBox.originX,
        y: detection.boundingBox.originY,
        width: detection.boundingBox.width,
        height: detection.boundingBox.height,
        confidence: detection.categories[0].score,
        type: 'mediapipe'
      }));

    } catch (error) {
      console.error('MediaPipe detection error:', error);
      return [];
    }
  }

  // Simple paper detection (fallback)
  detectPapersSimple(canvas) {
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Simple detection based on brightness and rectangular shapes
    const detectedRegions = this.findWhiteRectangularRegions(imageData);
    
    return detectedRegions.map(region => ({
      ...region,
      type: 'simple'
    }));
  }

  // Find white rectangular regions (simplified algorithm)
  findWhiteRectangularRegions(imageData) {
    const { data, width, height } = imageData;
    const regions = [];
    
    // Simple grid-based detection
    const gridSize = 50;
    
    for (let y = 0; y < height - gridSize; y += gridSize) {
      for (let x = 0; x < width - gridSize; x += gridSize) {
        const brightness = this.calculateRegionBrightness(data, x, y, gridSize, width);
        
        if (brightness > 200) { // Bright region detected
          // Check if it's large enough to be a paper
          const expandedRegion = this.expandRegion(data, x, y, gridSize, width, height);
          
          if (expandedRegion.width > 100 && expandedRegion.height > 100) {
            regions.push({
              x: expandedRegion.x,
              y: expandedRegion.y,
              width: expandedRegion.width,
              height: expandedRegion.height,
              confidence: brightness / 255
            });
          }
        }
      }
    }
    
    return regions;
  }

  // Calculate brightness of a region
  calculateRegionBrightness(data, startX, startY, size, width) {
    let totalBrightness = 0;
    let pixelCount = 0;
    
    for (let y = startY; y < startY + size; y++) {
      for (let x = startX; x < startX + size; x++) {
        const index = (y * width + x) * 4;
        const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
        totalBrightness += brightness;
        pixelCount++;
      }
    }
    
    return totalBrightness / pixelCount;
  }

  // Expand detected region to find full paper boundaries
  expandRegion(data, startX, startY, initialSize, width, height) {
    // Simple expansion algorithm
    let minX = startX;
    let minY = startY;
    let maxX = startX + initialSize;
    let maxY = startY + initialSize;
    
    // This is a simplified version - in practice, you'd use edge detection
    return {
      x: Math.max(0, minX - 20),
      y: Math.max(0, minY - 20),
      width: Math.min(width, maxX - minX + 40),
      height: Math.min(height, maxY - minY + 40)
    };
  }

  // Project AR text on detected papers
  projectARText() {
    // Clear existing AR text elements
    this.clearARText();

    // Create new AR text for each detected paper
    this.detectedPapers.forEach((paper, index) => {
      this.createARTextElement(paper, index);
    });
  }

  // Create AR text element
  createARTextElement(paper, index) {
    const video = this.gameState.camera.video;
    const videoRect = video.getBoundingClientRect();
    
    // Calculate scale factors
    const scaleX = videoRect.width / video.videoWidth;
    const scaleY = videoRect.height / video.videoHeight;
    
    // Calculate position on screen
    const screenX = (paper.x * scaleX) + videoRect.left;
    const screenY = (paper.y * scaleY) + videoRect.top;
    const screenWidth = paper.width * scaleX;
    const screenHeight = paper.height * scaleY;

    // Create AR text element
    const arElement = document.createElement('div');
    arElement.className = 'ar-text-overlay';
    arElement.style.cssText = `
      position: fixed;
      left: ${screenX}px;
      top: ${screenY}px;
      width: ${screenWidth}px;
      height: ${screenHeight}px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      z-index: 1000;
      pointer-events: none;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      border: 2px solid #00ff00;
      animation: arPulse 2s ease-in-out infinite;
    `;

    // Get level-specific text
    const levelText = this.getLevelARText();
    arElement.innerHTML = levelText;

    // Add to DOM
    document.body.appendChild(arElement);
    this.arTextElements.push(arElement);

    // Remove after 5 seconds
    setTimeout(() => {
      if (arElement.parentNode) {
        arElement.parentNode.removeChild(arElement);
      }
    }, 5000);
  }

  // Get AR text based on current level
  getLevelARText() {
    const levelTexts = {
      1: `🔍 <strong>Geheimes Gedicht entdeckt!</strong><br><br>
          <em>"In Flammen steht das alte Schloss,<br>
          Der Feind ist nah, der Kampf ist groß.<br>
          Doch wo der Adler seinen Horst,<br>
          Dort liegt verborgen unser Forst."</em>`,
      
      2: `📜 <strong>Friedrichs Botschaft:</strong><br><br>
          <em>"GHU VFKDWA LVW LP WXUP YHUVWHFNW"</em><br><br>
          💡 Hinweis: Caesar-Verschlüsselung (Schlüssel 3)`,
      
      3: `🖼️ <strong>Bildvergleich aktiv!</strong><br><br>
          Suchen Sie nach Unterschieden:<br>
          • Fehlende Krone<br>
          • Zusätzliche Fahne<br>
          • Veränderte Uniform`,
      
      4: `💡 <strong>UV-Licht Simulation:</strong><br><br>
          <em>"Der Schatz liegt dort wo drei Wege sich kreuzen,<br>
          beim alten Brunnen im Schlosshof."</em><br><br>
          - Annas geheime Nachricht`
    };
    
    return levelTexts[this.gameState.currentLevel] || "📄 Papier erkannt! Halten Sie ruhig für weitere Informationen...";
  }

  // Clear existing AR text
  clearARText() {
    this.arTextElements.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    this.arTextElements = [];
  }

  // Capture photo (enhanced)
  capturePhoto() {
    if (!this.isInitialized) return;
    
    const { video, canvas, context } = this.gameState.camera;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Draw detection boxes on canvas
    this.drawDetectionBoxes(context);
    
    // Process the captured image
    this.processImage(canvas);
    
    // Show capture feedback
    this.showCaptureEffect();
  }

  // Draw detection boxes on canvas
  drawDetectionBoxes(context) {
    context.strokeStyle = '#00ff00';
    context.lineWidth = 3;
    
    this.detectedPapers.forEach(paper => {
      context.strokeRect(paper.x, paper.y, paper.width, paper.height);
      
      // Draw confidence score
      context.fillStyle = '#00ff00';
      context.font = '16px Arial';
      context.fillText(
        `Paper ${(paper.confidence * 100).toFixed(1)}%`,
        paper.x,
        paper.y - 5
      );
    });
  }

  // Process captured image (enhanced)
  processImage(canvas) {
    // Award points for detected papers
    if (this.detectedPapers.length > 0) {
      // Simulate object detection success
      const detectedObjects = this.simulateObjectDetection();
      
      detectedObjects.forEach(obj => {
        this.gameState.addFoundObject(obj);
      });
    }
  }

  // Simulate object detection (unchanged)
  simulateObjectDetection() {
    const detectedObjects = [];
    const { requiredObjects, foundObjects } = this.gameState;
    
    const remainingObjects = requiredObjects.filter(obj => !foundObjects.includes(obj));
    
    if (remainingObjects.length > 0) {
      // Higher chance if paper is detected
      const detectionChance = this.detectedPapers.length > 0 ? 0.6 : 0.2;
      
      if (Math.random() < detectionChance) {
        const randomObject = remainingObjects[Math.floor(Math.random() * remainingObjects.length)];
        detectedObjects.push(randomObject);
      }
    }
    
    return detectedObjects;
  }

  // Switch camera (unchanged)
  async switchCamera() {
    try {
      if (this.gameState.camera.stream) {
        this.gameState.camera.stream.getTracks().forEach(track => track.stop());
      }
      
      this.gameState.isUsingFrontCamera = !this.gameState.isUsingFrontCamera;
      this.gameState.camera.facingMode = this.gameState.isUsingFrontCamera ? 'user' : 'environment';
      
      await this.requestCameraPermission();
      
    } catch (error) {
      console.error('Camera switch failed:', error);
    }
  }

  // Show capture effect (unchanged)
  showCaptureEffect() {
    const overlay = document.getElementById('arOverlay');
    if (overlay) {
      overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
      setTimeout(() => {
        overlay.style.backgroundColor = 'transparent';
      }, 200);
    }
  }

  // Show camera error (unchanged)
  showCameraError() {
    const cameraContainer = document.querySelector('.camera-container');
    if (cameraContainer) {
      cameraContainer.innerHTML = `
        <div class="camera-permission">
          <div class="permission-content">
            <h2>Kamera nicht verfügbar</h2>
            <p>Bitte erlauben Sie den Zugriff auf die Kamera, um das Spiel zu spielen.</p>
            <button class="permission-btn" onclick="location.reload()">Erneut versuchen</button>
          </div>
        </div>
      `;
    }
  }

  // Cleanup
  destroy() {
    this.clearARText();
    
    if (this.gameState.camera.stream) {
      this.gameState.camera.stream.getTracks().forEach(track => track.stop());
    }
  }
}

// Game Controller
class GameController {
  constructor() {
    this.gameState = new GameState();
    this.cameraManager = new CameraManager(this.gameState);
    this.isInitialized = false;
  }

  // Initialize the game
  async initialize() {
    try {
      // Get level from URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const levelNumber = parseInt(urlParams.get('level')) || 1;
      
      // Initialize game state
      this.gameState.initializeLevel(levelNumber);
      
      // Initialize camera
      await this.cameraManager.initializeCamera();
      
      // Set up event listeners
      this.setupEventListeners();
      
      this.isInitialized = true;
      
    } catch (error) {
      console.error('Game initialization failed:', error);
    }
  }

  // Set up event listeners
  setupEventListeners() {
    // Capture button
    const captureBtn = document.getElementById('captureBtn');
    if (captureBtn) {
      captureBtn.addEventListener('click', () => {
        this.cameraManager.capturePhoto();
      });
    }

    // Switch camera button
    const switchCameraBtn = document.getElementById('switchCameraBtn');
    if (switchCameraBtn) {
      switchCameraBtn.addEventListener('click', () => {
        this.cameraManager.switchCamera();
      });
    }

    // Story navigation
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    
    if (prevPageBtn) {
      prevPageBtn.addEventListener('click', () => {
        this.gameState.navigateStoryPage('prev');
      });
    }
    
    if (nextPageBtn) {
      nextPageBtn.addEventListener('click', () => {
        this.gameState.navigateStoryPage('next');
      });
    }

    // Next level button
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    if (nextLevelBtn) {
      nextLevelBtn.addEventListener('click', () => {
        this.goToNextLevel();
      });
    }

    // Close success modal when clicking outside
    const successModal = document.getElementById('successModal');
    if (successModal) {
      successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
          this.hideSuccessModal();
        }
      });
    }
  }

  // Hide success modal
  hideSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  // Go to next level
  goToNextLevel() {
    const nextLevel = this.gameState.currentLevel + 1;
    if (nextLevel <= 4) {
      window.location.href = `game.html?level=${nextLevel}`;
    } else {
      // All levels completed, go back to level selection
      window.location.href = 'raetselraum.html';
    }
  }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize hint system
  window.hintSystem = new HintSystem();
  
  // Initialize game timer
  window.gameTimer = new GameTimer();
  
  // Initialize game controller
  window.gameController = new GameController();
  window.gameController.initialize();

  window.debugHints = {
  unlockHint: (id) => window.hintSystem.testUnlockHint(id),
  checkState: () => {
    console.log('Hint System State:', {
      elapsedTime: window.hintSystem.getElapsedTime(),
      hints: window.hintSystem.hints.map(h => ({
        id: h.id,
        unlocked: h.unlocked,
        viewed: h.viewed
      }))
    });
  }
};
});

// Show success modal (for compatibility)
function showSuccessModal() {
  const completionTimeElement = document.getElementById('completionTime');
  const hintsUsedElement = document.getElementById('hintsUsed');
  
  if (window.gameTimer) {
    completionTimeElement.textContent = window.gameTimer.getFormattedTime();
  }
  
  if (window.hintSystem) {
    hintsUsedElement.textContent = window.hintSystem.getHintsUsed();
  }
  
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.classList.add('active');
  }
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, pause game if needed
  } else {
    // Page is visible, resume game if needed
  }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  // Clean up camera stream
  if (window.gameController && window.gameController.gameState.camera.stream) {
    window.gameController.gameState.camera.stream.getTracks().forEach(track => track.stop());
  }
  
  // Clean up hint system
  if (window.hintSystem) {
    window.hintSystem.destroy();
  }
  
  // Clean up game timer
  if (window.gameTimer) {
    window.gameTimer.destroy();
  }
});