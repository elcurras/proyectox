document.addEventListener('DOMContentLoaded', function () {
    // Configuración del Slider 3D
    const slider = document.querySelector('.slider-3d-container');
    const track = document.querySelector('.slider-3d-track');
    const slides = document.querySelectorAll('.slide-3d');
    const dotsContainer = document.querySelector('.slider-3d-dots');
    const prevBtn = document.querySelector('.slider-3d-prev');
    const nextBtn = document.querySelector('.slider-3d-next');

    let currentIndex = 0;
    let autoPlayInterval;
    const slideCount = slides.length;
    const slideWidth = 100; // 100vw

    // Inicializar slider
    function initSlider() {
        // Mostrar todos los slides
        slides.forEach(slide => slide.style.display = 'block');

        // Asegurarse de que solo el slide activo tenga la clase active
        slides.forEach((slide, index) => {
            if (index === currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Actualizar perspectiva
        updateSlidePerspective();
    }

    // Crear indicadores de puntos
    function createDots() {
        dotsContainer.innerHTML = ''; // Limpiar dots existentes
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-3d-dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Ir a slide específico
    // Reemplaza la función goToSlide con esta versión mejorada
    function goToSlide(index) {
        // Validar índice sin modificar el valor original
        let newIndex = index;
        if (newIndex >= slideCount) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = slideCount - 1;
        }

        // Solo proceder si es un cambio real
        if (newIndex === currentIndex) return;

        // Actualizar estado visual
        slides[currentIndex].classList.remove('active');
        if (dotsContainer.children.length > 0) {
            dotsContainer.children[currentIndex].classList.remove('active');
        }

        currentIndex = newIndex;

        slides[currentIndex].classList.add('active');
        if (dotsContainer.children.length > 0) {
            dotsContainer.children[currentIndex].classList.add('active');
        }

        // Mover el track con transición suave
        track.style.transition = 'transform 0.8s cubic-bezier(0.33, 1, 0.68, 1)';
        track.style.transform = `translateX(-${currentIndex * slideWidth}vw)`;

        // Actualizar perspectiva después de la transición
        setTimeout(updateSlidePerspective, 800);

        // Reiniciar autoplay
        resetAutoPlay();
    }

    // Autoplay
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000); // Cambia cada 5 segundos
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Efecto 3D para slides inactivos
    function updateSlidePerspective() {
        slides.forEach((slide, index) => {
            if (index !== currentIndex) {
                const distance = index - currentIndex;
                const angle = distance * 15; // Ajusta este valor para cambiar el ángulo
                slide.style.transform = `translateX(${distance * 100}vw) translateZ(-80px) rotateY(${angle}deg)`;
            } else {
                slide.style.transform = 'translateX(0) translateZ(0) rotateY(0)';
            }
        });
    }

    // Event listeners
    function setupEventListeners() {
        // Remover event listeners existentes para evitar duplicados
        prevBtn.removeEventListener('click', handlePrevClick);
        nextBtn.removeEventListener('click', handleNextClick);

        // Nuevos handlers
        function handlePrevClick() {
            goToSlide(currentIndex - 1);
        }

        function handleNextClick() {
            goToSlide(currentIndex + 1);
        }

        // Asignar nuevos listeners
        prevBtn.addEventListener('click', handlePrevClick);
        nextBtn.addEventListener('click', handleNextClick);

        // Touch events para móviles
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(autoPlayInterval);
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoPlay();
        }, { passive: true });

        function handleSwipe() {
            const diff = touchStartX - touchEndX;
            if (diff > 50) goToSlide(currentIndex + 1); // Swipe izquierda
            if (diff < -50) goToSlide(currentIndex - 1); // Swipe derecha
        }
    }

    // Inicialización
    initSlider();
    createDots();
    setupEventListeners();
    startAutoPlay();
});