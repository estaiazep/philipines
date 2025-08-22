const canvas = document.getElementById("canvas")
const ctx = canvas ? canvas.getContext("2d") : null

// Проверяем, что канвас существует
if (!canvas || !ctx) {
  console.warn("Canvas element not found")
}

// Функция для установки фиксированного размера канваса
function resizeCanvas() {
  if (!canvas) return

  const size = 271 // Фиксированный размер 271 на 271 пикселя
  canvas.width = size
  canvas.height = size

  const totalSpacing = size * 0.05 // 5% от общего размера на отступы
  const availableSize = size - totalSpacing // Размер доступного пространства для квадратов

  rectSize = availableSize / gridSize // Размер каждого прямоугольника
  spacing = totalSpacing / (gridSize - 1) // Отступ между квадратами

  createGrid() // Пересоздаем сетку после изменения размера
  drawGrid() // Перерисовываем сетку
}

// Вызов resizeCanvas при загрузке страницы
window.addEventListener("load", resizeCanvas)

// Загрузка изображений
const rectangleImg = new Image()
rectangleImg.src = "RectangleMines.svg"
const starImg = new Image()
starImg.src = "StarMines.svg"

// Кастомизируемые переменные
const gridSize = 5 // Размер сетки (количество прямоугольников в ряду/столбце)
let rectSize = 100 // Размер одного прямоугольника (пересчитывается динамически)
let spacing = 10 // Отступы между квадратами (пересчитываются динамически)
const pieceCount = 50 // Количество частиц, создаваемых при клике
const pieceMinSize = 5 // Минимальный размер частицы
const pieceMaxSize = 15 // Максимальный размер частицы
const pieceSpeedFactor = 0.05 // Фактор скорости разлета частиц
const pieceColor = "#0168CF" // Цвет прямоугольников и частиц
const starSize = 50 // Размер звезды

const rectangles = []
const pieces = []
const stars = [] // Массив для хранения звёзд

// Функция для создания начальной сетки
function createGrid() {
  rectangles.length = 0 // Очистка массива перед пересозданием

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      rectangles.push({
        x: j * (rectSize + spacing), // Позиция по X с учетом отступов
        y: i * (rectSize + spacing), // Позиция по Y с учетом отступов
        size: rectSize, // Размер прямоугольника
        color: pieceColor,
        index: i * gridSize + j,
      })
    }
  }
}

// Функция для рисования изображения прямоугольника
function drawRectangleImage(x, y, size) {
  if (!ctx) return
  ctx.drawImage(rectangleImg, x, y, size, size) // Рисуем изображение
}

// Функция для рисования сетки
function drawGrid() {
  if (!ctx || !canvas) return

  ctx.clearRect(0, 0, canvas.width, canvas.height) // Очищаем канвас перед перерисовкой
  ctx.fillStyle = "#090E1D" // Цвет фона
  ctx.fillRect(0, 0, canvas.width, canvas.height) // Заполнение фона
  rectangles.forEach((rect) => {
    drawRectangleImage(rect.x, rect.y, rect.size) // Рисуем прямоугольник изображением
  })
}

// Функция для рисования звезды с использованием изображения
function drawStarImage(x, y, size) {
  if (!ctx) return
  ctx.drawImage(starImg, x - size / 2, y - size / 2, size, size) // Центрируем изображение звезды
}

// Функция для рисования звёзд
function drawStars() {
  stars.forEach((star) => {
    drawStarImage(star.x, star.y, starSize) // Рисуем звезду из изображения
  })
}

// Функция для создания частиц
function createPieces(rect) {
  for (let i = 0; i < pieceCount; i++) {
    const angle = Math.random() * 2 * Math.PI // Случайный угол
    const distance = Math.random() * 150 + 50 // Дистанция разлета

    pieces.push({
      x: rect.x + rect.size / 2,
      y: rect.y + rect.size / 2,
      vx: Math.cos(angle) * distance, // Скорость по оси X
      vy: Math.sin(angle) * distance, // Скорость по оси Y
      size: pieceMinSize + Math.random() * (pieceMaxSize - pieceMinSize), // Размер частички
      color: rect.color, // Цвет частички такой же, как у квадрата
      opacity: 1,
    })
  }
}

// Функция для анимации частиц
function animatePieces() {
  if (!ctx || !canvas) return

  ctx.clearRect(0, 0, canvas.width, canvas.height) // Очистка канваса
  drawGrid() // Перерисовка сетки
  drawStars() // Рисуем звезды

  // Перемещение и отрисовка частиц
  pieces.forEach((piece, index) => {
    piece.x += piece.vx * pieceSpeedFactor // Уменьшаем скорость по оси X
    piece.y += piece.vy * pieceSpeedFactor // Уменьшаем скорость по оси Y
    piece.opacity -= 0.02 // Уменьшаем прозрачность

    ctx.fillStyle = `rgba(${Number.parseInt(piece.color.slice(1, 3), 16)}, ${Number.parseInt(piece.color.slice(3, 5), 16)}, ${Number.parseInt(piece.color.slice(5, 7), 16)}, ${piece.opacity})`
    ctx.fillRect(piece.x, piece.y, piece.size, piece.size) // Рисуем квадратные частицы

    // Удаляем частицы, когда они становятся невидимыми или выходят за границы канваса
    if (piece.opacity <= 0 || piece.y > canvas.height) {
      pieces.splice(index, 1)
    }
  })

  requestAnimationFrame(animatePieces) // Запуск следующего кадра
}

// Запуск начальной отрисовки и анимации
function initCanvas() {
  if (!canvas) return

  createGrid()

  // Запускаем анимацию только после загрузки изображения звезды
  if (starImg.complete) {
    animatePieces()
  } else {
    starImg.onload = animatePieces
  }
}

// Инициализация канваса при загрузке DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCanvas)
} else {
  initCanvas()
}

// Функция для удаления случайных квадратов
function removeRandomRectangles(count) {
  if (!canvas || !ctx) return

  // Сбрасываем состояние
  rectangles.length = 0
  pieces.length = 0
  stars.length = 0

  createGrid() // Создаем новую сетку
  let removed = 0

  function removeNextRectangle() {
    if (removed < count && rectangles.length > 0) {
      const randomIndex = Math.floor(Math.random() * rectangles.length) // Случайный индекс
      if (rectangles[randomIndex]) {
        stars.push({
          x: rectangles[randomIndex].x + rectangles[randomIndex].size / 2, // Центр квадрата
          y: rectangles[randomIndex].y + rectangles[randomIndex].size / 2, // Центр квадрата
        })
        createPieces(rectangles[randomIndex]) // Создаём частицы для выбранного квадрата
        rectangles.splice(randomIndex, 1) // Удаляем случайный прямоугольник
      }
      removed++

      // Удаляем следующий квадрат через 600 мс
      setTimeout(removeNextRectangle, 600)
    }
  }

  removeNextRectangle() // Начать удаление квадратов
}

// Функция для получения случайного количества квадратов для удаления
function getRandomIndex() {
  return Math.floor(Math.random() * 2) + 3 // Вернёт либо 3, либо 4
}

// Функция для обработки сценариев удаления (экспортируем в глобальную область)
window.handleScenario = (input) => {
  switch (input) {
    case 1:
      removeRandomRectangles(getRandomIndex()) // Уничтожить случайное количество квадратов
      break
    case 3:
      removeRandomRectangles(getRandomIndex()) // Уничтожить случайное количество квадратов
      break
    case 5:
      removeRandomRectangles(getRandomIndex()) // Уничтожить случайное количество квадратов
      break
    case 7:
      removeRandomRectangles(getRandomIndex()) // Уничтожить случайное количество квадратов
      break
    default:
      console.log("Нет сценария для этого значения") // Обработка неизвестных значений
      break
  }
}
