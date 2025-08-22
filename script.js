const buttonGetSignal = document.getElementById("get-signal")
const loadingSignal = document.getElementById("loading")
const screenStart = document.getElementById("screenStart")
const signal = document.getElementById("canvas")
const buttonChoseTraps = document.getElementById("chose-traps")
const selectIndex = document.getElementById("select-index")
const percentChance = document.getElementById("percent-chance")
const mainScreen = document.getElementById("main-screen")
const trapsScreen = document.getElementById("traps-screen")

let cameraStream = null

function showInsufficientFundsScreen() {
  document.getElementById("insufficient-funds-modal").style.display = "flex"
}

function hideInsufficientFundsModal() {
  document.getElementById("insufficient-funds-modal").style.display = "none"
}

if (buttonGetSignal) {
  buttonGetSignal.onclick = getSignal
}

function getSignal() {
  if (
    !signal ||
    !screenStart ||
    !loadingSignal ||
    !buttonGetSignal ||
    !percentChance ||
    !selectIndex ||
    !mainScreen ||
    !trapsScreen
  ) {
    return
  }

  console.log("[v0] Opening photo scanning modal")
  document.getElementById("photo-scanning-modal").style.display = "flex"
  startCamera()
}

async function startCamera() {
  console.log("[v0] Requesting camera access")
  const cameraPreview = document.getElementById("camera-preview")
  const videoElement = document.getElementById("camera-video")

  try {
    // Request camera permission and access
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment", // Use back camera if available
      },
    })

    console.log("[v0] Camera access granted")

    // Show camera feed in video element
    if (videoElement) {
      videoElement.srcObject = cameraStream
      videoElement.play()
    }
  } catch (error) {
    console.error("[v0] Camera access denied or failed:", error)
    // Fallback to simulated scanning if camera fails
    alert("Camera access required for scanning. Please allow camera permission and try again.")
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop())
    cameraStream = null
    console.log("[v0] Camera stopped")
  }
}

function startPhotoScanning() {
  console.log("[v0] Taking photo and starting scanning process")
  const cameraPreview = document.getElementById("camera-preview")
  const scanningProgress = document.getElementById("scanning-progress")
  const scanningSuccess = document.getElementById("scanning-success")
  const takePhotoButton = document.getElementById("take-photo-button")
  const scanningText = document.getElementById("scanning-text")
  const scanningDetails = document.getElementById("scanning-details")
  const videoElement = document.getElementById("camera-video")
  const capturedPhoto = document.getElementById("captured-photo")
  const scanningParticles = document.getElementById("scanning-particles")

  if (videoElement && cameraStream) {
    // Create canvas to capture photo
    const canvas = capturedPhoto
    const context = canvas.getContext("2d")
    canvas.width = videoElement.videoWidth || 400
    canvas.height = videoElement.videoHeight || 300

    // Draw current video frame to canvas (this captures the photo)
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

    console.log("[v0] Photo captured from camera")

    videoElement.style.display = "none"
    capturedPhoto.style.display = "block"
    scanningParticles.style.display = "block"
  }

  stopCamera()

  takePhotoButton.style.display = "none"
  scanningProgress.style.display = "block"

  let progress = 0
  const scanningMessages = [
    "Processing captured image...",
    "Detecting game field...",
    "Analyzing mine positions...",
    "Processing game data...",
    "Calculating probabilities...",
    "Generating signal...",
  ]

  const scanningInterval = setInterval(() => {
    progress += Math.random() * 15 + 5 // Random progress between 5-20%

    if (progress > 100) progress = 100

    scanningText.textContent = `Analyzing game field... ${Math.floor(progress)}%`

    // Update scanning details based on progress
    const messageIndex = Math.floor((progress / 100) * (scanningMessages.length - 1))
    scanningDetails.textContent = scanningMessages[messageIndex]

    console.log("[v0] Scanning progress:", Math.floor(progress) + "%")

    if (progress >= 100) {
      clearInterval(scanningInterval)
      console.log("[v0] Scanning complete, showing success")

      // Show success message
      scanningProgress.style.display = "none"
      scanningSuccess.style.display = "block"

      // Close modal and start normal signal generation after 2 seconds
      setTimeout(() => {
        console.log("[v0] Closing modal and starting signal generation")
        document.getElementById("photo-scanning-modal").style.display = "none"
        resetPhotoModal()
        startNormalSignalGeneration()
      }, 2000)
    }
  }, 150) // Update every 150ms for smooth progress
}

function resetPhotoModal() {
  const cameraPreview = document.getElementById("camera-preview")
  const scanningProgress = document.getElementById("scanning-progress")
  const scanningSuccess = document.getElementById("scanning-success")
  const takePhotoButton = document.getElementById("take-photo-button")
  const videoElement = document.getElementById("camera-video")
  const capturedPhoto = document.getElementById("captured-photo")
  const scanningParticles = document.getElementById("scanning-particles")

  cameraPreview.style.display = "block"
  takePhotoButton.style.display = "block"
  scanningProgress.style.display = "none"
  scanningSuccess.style.display = "none"
  videoElement.style.display = "block"
  capturedPhoto.style.display = "none"
  scanningParticles.style.display = "none"
}

function startNormalSignalGeneration() {
  if (
    !signal ||
    !screenStart ||
    !loadingSignal ||
    !buttonGetSignal ||
    !percentChance ||
    !selectIndex ||
    !mainScreen ||
    !trapsScreen
  ) {
    return
  }

  signal.classList.add("deactive")
  screenStart.classList.add("deactive")
  loadingSignal.classList.remove("deactive")
  buttonGetSignal.disabled = true

  mainScreen.style.display = ""
  trapsScreen.style.display = "none"

  percentChance.textContent = "ACCURACY: " + getRandomNumber() + "%"
  percentChance.style.display = ""

  setTimeout(() => {
    if (!loadingSignal || !signal || !buttonGetSignal || !selectIndex) return
    loadingSignal.classList.add("deactive")
    signal.classList.remove("deactive")
    buttonGetSignal.disabled = false

    // Вызываем handleScenario из CanvasMines.js
    if (window.handleScenario) {
      window.handleScenario(Number(selectIndex.textContent))
    }
  }, 3000)
}

function handleClick(element) {
  if (!selectIndex) return
  const value = element.querySelector("a").innerText
  selectIndex.textContent = value
  getSignal()
}

function getRandomNumber() {
  return (Math.random() * (95 - 80) + 80).toFixed(2)
}

function activeTrapsScreen() {
  if (!mainScreen || !trapsScreen) return

  if (mainScreen.style.display === "none") {
    mainScreen.style.display = ""
    trapsScreen.style.display = "none"
  } else {
    mainScreen.style.display = "none"
    trapsScreen.style.display = ""
  }
}

// Set event handlers for photo scanning
document.addEventListener("DOMContentLoaded", () => {
  const takePhotoButton = document.getElementById("take-photo-button")
  if (takePhotoButton) {
    takePhotoButton.onclick = startPhotoScanning
    console.log("[v0] Photo scanning button event handler set")
  } else {
    console.log("[v0] Take photo button not found")
  }
})

const takePhotoBtn = document.getElementById("take-photo-button")
if (takePhotoBtn) {
  takePhotoBtn.onclick = startPhotoScanning
  console.log("[v0] Photo scanning button event handler set immediately")
}

