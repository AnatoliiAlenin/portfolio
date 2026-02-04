document.addEventListener('DOMContentLoaded', function() {
    class Carousel {
        constructor(container) {
            this.container = container;
            this.carousel = container.querySelector('.carousel');
            this.cards = container.querySelectorAll('.card');
            this.prevBtn = container.querySelector('.btn__left');
            this.nextBtn = container.querySelector('.btn__right');
            this.indicatorsContainer = null;
            this.indicators = [];
            
            this.currentIndex = 0;
            this.totalCards = this.cards.length;
            
            this.init();
        }
        
        init() {
            // Устанавливаем первую карточку как активную
            this.setActiveCard(0);
            
            // Создаем индикаторы
            this.createIndicators();
            
            // Назначаем обработчики событий
            this.addEventListeners();
            
            // Добавляем поддержку клавиатуры
            this.addKeyboardSupport();
        }
        
        setActiveCard(index) {
            // Удаляем активный класс у всех карточек
            this.cards.forEach(card => {
                card.classList.remove('active');
            });
            
            // Добавляем активный класс текущей карточке
            this.cards[index].classList.add('active');
            
            // Перемещаем карусель
            this.carousel.style.transform = `translateX(-${index * 100}%)`;
            
            // Обновляем индикаторы
            this.updateIndicators(index);
            
            // Обновляем состояние кнопок
            this.updateButtons();
        }
        
        createIndicators() {
            this.indicatorsContainer = document.createElement('div');
            this.indicatorsContainer.className = 'carousel-indicators';
            
            for (let i = 0; i < this.totalCards; i++) {
                const indicator = document.createElement('div');
                indicator.className = `carousel-indicator ${i === 0 ? 'active' : ''}`;
                indicator.dataset.index = i;
                
                indicator.addEventListener('click', () => {
                    this.currentIndex = i;
                    this.setActiveCard(i);
                });
                
                this.indicatorsContainer.appendChild(indicator);
                this.indicators.push(indicator);
            }
            
            this.container.appendChild(this.indicatorsContainer);
        }
        
        updateIndicators(index) {
            this.indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
        }
        
        updateButtons() {
            // Кнопка "назад" отключается на первой карточке
            this.prevBtn.disabled = this.currentIndex === 0;
            
            // Кнопка "вперед" отключается на последней карточке
            this.nextBtn.disabled = this.currentIndex === this.totalCards - 1;
        }
        
        next() {
            if (this.currentIndex < this.totalCards - 1) {
                this.currentIndex++;
                this.setActiveCard(this.currentIndex);
            }
        }
        
        prev() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.setActiveCard(this.currentIndex);
            }
        }
        
        addEventListeners() {
            this.nextBtn.addEventListener('click', () => this.next());
            this.prevBtn.addEventListener('click', () => this.prev());
            
            // Добавляем свайп для мобильных устройств
            this.addSwipeSupport();
        }
        
        addSwipeSupport() {
            let startX = 0;
            let endX = 0;
            
            this.carousel.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });
            
            this.carousel.addEventListener('touchmove', (e) => {
                endX = e.touches[0].clientX;
            });
            
            this.carousel.addEventListener('touchend', () => {
                const diff = startX - endX;
                const minSwipe = 50; // минимальное расстояние для свайпа
                
                if (Math.abs(diff) > minSwipe) {
                    if (diff > 0) {
                        this.next(); // свайп влево
                    } else {
                        this.prev(); // свайп вправо
                    }
                }
            });
        }
        
        addKeyboardSupport() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    this.prev();
                } else if (e.key === 'ArrowRight') {
                    this.next();
                }
            });
        }
    }
    
    // Инициализация карусели
    const carouselContainer = document.querySelector('.gates__right');
    if (carouselContainer) {
        new Carousel(carouselContainer);
    }
});