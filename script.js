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
