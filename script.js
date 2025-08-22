const buttonGetSignal = document.getElementById("get-signal")
const loadingSignal = document.getElementById("loading")
const screenStart = document.getElementById("screenStart")
const signal = document.getElementById("canvas")
const buttonChoseTraps = document.getElementById("chose-traps")
const selectIndex = document.getElementById("select-index")
const percentChance = document.getElementById("percent-chance")
const mainScreen = document.getElementById("main-screen")
const trapsScreen = document.getElementById("traps-screen")

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

  // Show photo scanning modal instead of immediately starting signal generation
  document.getElementById("photo-scanning-modal").style.display = "flex"
}

function startPhotoScanning() {
  const cameraPreview = document.getElementById("camera-preview")
  const scanningProgress = document.getElementById("scanning-progress")
  const scanningSuccess = document.getElementById("scanning-success")
  const takePhotoButton = document.getElementById("take-photo-button")
  const scanningText = document.getElementById("scanning-text")
  const scanningDetails = document.getElementById("scanning-details")

  // Hide camera preview and button, show scanning progress
  cameraPreview.style.display = "none"
  takePhotoButton.style.display = "none"
  scanningProgress.style.display = "block"

  let progress = 0
  const scanningMessages = [
    "Initializing scanner...",
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

    if (progress >= 100) {
      clearInterval(scanningInterval)

      // Show success message
      scanningProgress.style.display = "none"
      scanningSuccess.style.display = "block"

      // Close modal and start normal signal generation after 2 seconds
      setTimeout(() => {
        document.getElementById("photo-scanning-modal").style.display = "none"
        startNormalSignalGeneration()
      }, 2000)
    }
  }, 150) // Update every 150ms for smooth progress
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

  percentChance.textContent = "CHANCE: " + getRandomNumber() + "%"
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
document.getElementById("take-photo-button").onclick = startPhotoScanning
