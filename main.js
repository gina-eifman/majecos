// ========== КАРУСЕЛЬ БАННЕРОВ ==========
const slidesContainer = document.getElementById('carouselSlides');
const slides = document.querySelectorAll('.carousel__slide');
const prevBtn = document.getElementById('prevBannerBtn');
const nextBtn = document.getElementById('nextBannerBtn');
const dotsContainer = document.getElementById('bannerDots');

let currentIndex = 0;
const totalSlides = slides.length;

function updateCarousel() {
    const offset = -currentIndex * 100;
    slidesContainer.style.transform = `translateX(${offset}%)`;
    document.querySelectorAll('.carousel__dot').forEach((dot, idx) => {
        if (idx === currentIndex) dot.classList.add('carousel__dot_active');
        else dot.classList.remove('carousel__dot_active');
    });
}

function goToSlide(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    updateCarousel();
}

function nextSlide() { goToSlide(currentIndex + 1); }
function prevSlide() { goToSlide(currentIndex - 1); }

// Создание точек
for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('carousel__dot');
    if (i === currentIndex) dot.classList.add('carousel__dot_active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
}

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Автопрокрутка
let autoInterval = setInterval(nextSlide, 5000);
const carouselContainer = document.querySelector('.carousel');
carouselContainer.addEventListener('mouseenter', () => clearInterval(autoInterval));
carouselContainer.addEventListener('mouseleave', () => {
    autoInterval = setInterval(nextSlide, 5000);
});

// ========== РИЛСЫ - НАСТОЯЩАЯ ЦИКЛИЧЕСКАЯ КАРУСЕЛЬ ==========
const reelsTrack = document.querySelector('.reels__track');
const reelsContainer = document.getElementById('reelsContainer');
const reelsPrevBtn = document.getElementById('reelsPrevBtn');
const reelsNextBtn = document.getElementById('reelsNextBtn');

const reelsData = [
    { product: "Скраб для тела", desc: "Мягкое отшелушивание", videoBg: "/majecos/assets/scrub.jpg", tag: "BodySmooth" },
    { product: "Сыворотка с витамином С", desc: "Сияние кожи", videoBg: "/majecos/assets/serum.jpg", tag: "BrightMood" },
    { product: "Маска для лица альгинатная", desc: "Лифтинг эффект", videoBg: "/majecos/assets/mask.jpg", tag: "AlgoPure" },
    { product: "Пенка для умывания", desc: "Нежная, без сухости", videoBg: "/majecos/assets/foam.jpg", tag: "CleanBubble" },
    { product: "Бальзам для губ", desc: "Питание и комфорт", videoBg: "/majecos/assets/hygiene.jpg", tag: "LipCare" },
    { product: "Мист для тела", desc: "Освежение спреем", videoBg: "/majecos/assets/mist.jpg", tag: "BodyMist" },
    { product: "Крем для лица", desc: "Интенсивное увлажнение", videoBg: "/majecos/assets/cream_reel.jpg", tag: "HydraCare" },
    { product: "Тоник", desc: "Успокаивает и тонизирует", videoBg: "/majecos/assets/tonic.jpg", tag: "FreshSkin" }
];

// Порядок отображения: [левый-дальний, левый-ближний, ЦЕНТР, правый-ближний, правый-дальний]
let visibleOrder = [2, 3, 4, 5, 6]; // Индексы из reelsData (начинаем с 3-го в центре)
let isAnimating = false;

function createCard(item, realIndex, position) {
    const card = document.createElement('div');
    card.className = 'reels__card';
    card.innerHTML = `
        <div class="reels__video" style="background-image: url(${item.videoBg});">
            <div class="reels__play">🎬 Reel</div>
        </div>
        <div class="reels__caption">
            <div class="reels__product">✨ ${item.product}</div>
            <div class="reels__desc">${item.desc} · ${item.tag}</div>
        </div>
    `;
    card.dataset.realIndex = realIndex;
    
    // Добавляем класс в зависимости от позиции
    if (position === 0) {
        card.classList.add('reels__card_place_far-left');
    } else if (position === 1) {
        card.classList.add('reels__card_place_left');
    } else if (position === 2) {
        card.classList.add('reels__card_place_center');
    } else if (position === 3) {
        card.classList.add('reels__card_place_right');
    } else if (position === 4) {
        card.classList.add('reels__card_place_far-right');
    }
    
    card.addEventListener('click', () => {
        alert(`🎥 (Учебный рилс) Видео-превью: ${item.product}`);
    });
    return card;
}

function buildReels() {
    reelsContainer.innerHTML = '';
    renderVisibleCards();
}

function renderVisibleCards() {
    reelsContainer.innerHTML = '';
    
    visibleOrder.forEach((realIndex, position) => {
        const item = reelsData[realIndex];
        const card = createCard(item, realIndex, position);
        reelsContainer.appendChild(card);
    });
}

function moveReels(direction) {
    if (isAnimating) return;
    isAnimating = true;
    
    const totalCards = reelsData.length;
    
    if (direction === 'next') {
        // Сдвигаем все индексы вправо
        visibleOrder = visibleOrder.map(idx => (idx + 1) % totalCards);
    } else {
        // Сдвигаем все индексы влево
        visibleOrder = visibleOrder.map(idx => (idx - 1 + totalCards) % totalCards);
    }
    
    // Анимация смены карточек
    reelsContainer.style.transition = 'opacity 0.2s ease';
    reelsContainer.style.opacity = '0.5';
    
    setTimeout(() => {
        renderVisibleCards();
        reelsContainer.style.opacity = '1';
        
        setTimeout(() => {
            reelsContainer.style.transition = '';
            isAnimating = false;
        }, 200);
    }, 150);
}

// Обработчики для стрелок
reelsPrevBtn.addEventListener('click', () => moveReels('prev'));
reelsNextBtn.addEventListener('click', () => moveReels('next'));

// Блокируем нативный скролл пользователя
reelsTrack.addEventListener('wheel', (e) => {
    e.preventDefault();
});

// ========== КАТЕГОРИИ ==========
const categories = [
    { name: "Лицо", icon: "/majecos/assets/face.png", type: 'face' },
    { name: "Губы", icon: "/majecos/assets/lips.png", type: 'lips' },
    { name: "Волосы", icon: "/majecos/assets/hair.png", type: 'hair' },
    { name: "Руки", icon: "/majecos/assets/hands.png", type: 'hands' }
];

const careProducts = [
    "Сыворотка", "Шампунь", "Маска для лица", "Скраб",
    "Бальзам для губ", "Пенка для умывания", "Мист для тела", "Крем для лица"
];

function renderCategories() {
    const grid = document.getElementById('categoryGrid');
    grid.innerHTML = '';
    categories.forEach(cat => {
        const card = document.createElement('div');
        card.className = `categories__card categories__card_type_${cat.type}`;
        card.innerHTML = `<img class="categories__image" src="${cat.icon}" alt="${cat.name}"/><div class="categories__name">${cat.name}</div>`;
        card.addEventListener('click', () => alert(`Категория "${cat.name}" (учебный проект)`));
        grid.appendChild(card);
    });
}

function renderCareGrid() {
    const careGridContainer = document.getElementById('careGrid');
    careGridContainer.innerHTML = '';
    careProducts.forEach(item => {
        const careItem = document.createElement('div');
        careItem.className = 'products__item';
        careItem.textContent = item;
        careItem.addEventListener('click', () => alert(`Товар: ${item} — добавлен в демо-корзину (учебный проект)`));
        careGridContainer.appendChild(careItem);
    });
}

// ========== НАВИГАЦИЯ ==========
const navItems = document.querySelectorAll('.nav__link');
navItems.forEach(nav => {
    if (nav.innerText !== 'Главная') {
        nav.addEventListener('click', () => {
            alert(`📄 Раздел "${nav.innerText}" — в разработке`);
        });
    }
});

const carouselLinks = document.querySelectorAll('.carousel__button');
carouselLinks.forEach(link => {
    link.addEventListener('click', () => {
        alert(`Страница магазина находится в разработке`);
    });
});

// ========== ЗАПУСК ==========
function init() {
    buildReels();
    renderCategories();
    renderCareGrid();
}

init();