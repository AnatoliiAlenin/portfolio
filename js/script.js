document.addEventListener("DOMContentLoaded", function() {
    const starfield = document.getElementById('starfield');
    
    // 1. Создаем центральную точку
    const centerPoint = document.createElement('div');
    centerPoint.className = 'center-point';
    starfield.appendChild(centerPoint);
    
    // 2. Настройки (можно менять)
    const starsCount = 500; // Увеличил количество звезд
    const maxDistance = 100; // Максимальное начальное расстояние от центра
    
    // 3. Типы звезд с их свойствами
    const starTypes = [
        { class: 'tiny', speed: 0.8, count: 150 },
        { class: 'small', speed: 1.2, count: 150 },
        { class: 'medium', speed: 2, count: 120 },
        { class: 'large', speed: 3, count: 80 }
    ];
    
    // 4. Функция создания одной звезды
    function createStar(type, colorClass = '') {
        const star = document.createElement('div');
        star.className = `star ${type.class}`;
        
        if (colorClass) {
            star.classList.add(colorClass);
        }
        
        // Случайное направление от центра
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * maxDistance;
        
        // Начальные координаты
        const startX = Math.cos(angle) * distance;
        const startY = Math.sin(angle) * distance;
        
        // Устанавливаем CSS переменные
        star.style.setProperty('--start-x', startX + 'px');
        star.style.setProperty('--start-y', startY + 'px');
        
        // Длительность анимации
        const duration = type.speed + Math.random() * 1.5;
        star.style.animationDuration = duration + 's';
        
        // Случайная задержка (чтобы не все начинались одновременно)
        const delay = Math.random() * 5;
        star.style.animationDelay = '-' + delay + 's';
        
        // Случайная яркость
        const brightness = 0.6 + Math.random() * 0.4;
        star.style.opacity = brightness;
        
        return star;
    }
    
    // 5. Создаем все звезды
    function createAllStars() {
        // Очищаем только звезды, оставляя центральную точку
        const existingStars = starfield.querySelectorAll('.star');
        existingStars.forEach(star => star.remove());
        
        let created = 0;
        
        // Создаем звезды по типам
        starTypes.forEach(type => {
            for (let i = 0; i < type.count; i++) {
                // Иногда добавляем цветные звезды
                let colorClass = '';
                if (Math.random() < 0.2) {
                    colorClass = Math.random() > 0.5 ? 'blue' : 'yellow';
                }
                
                starfield.appendChild(createStar(type, colorClass));
                created++;
                
                // Если достигли лимита, останавливаемся
                if (created >= starsCount) return;
            }
        });
        
        // Добиваем до нужного количества
        while (created < starsCount) {
            const randomType = starTypes[Math.floor(Math.random() * starTypes.length)];
            starfield.appendChild(createStar(randomType));
            created++;
        }
    }
    
    // 6. Инициализация
    createAllStars();
    
    // 7. Адаптация при изменении размера окна
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Пересоздаем звезды с новыми параметрами
            createAllStars();
        }, 250);
    });
    
});
// 10. Запускаем при полной загрузке страницы
window.addEventListener('load', function() {
    // Небольшая задержка для плавного появления
    setTimeout(() => {
        document.getElementById('starfield').style.opacity = '1';
    }, 100);
});
// Функция для инициализации прогресс-баров
function initializeProgressBars() {
    // Находим все карточки с навыками
    const skillCards = document.querySelectorAll('.skills__card, .skills__сard', '.literature__item, literature__item');    
    skillCards.forEach((card, index) => {
        const percentElement = card.querySelector('.skill__procent', '.book__pro');
        const progressBar = card.querySelector('.progress__bar');
        
        if (percentElement && progressBar) {
            const percentText = percentElement.textContent.trim();
            const percent = parseInt(percentText.replace('%', ''), 10);
            
            if (!isNaN(percent)) {
                // Генерируем уникальный ID
                const skillName = card.querySelector('.skill__title').textContent;
                const safeId = skillName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                const progressId = `progress-${safeId}-${index}`;
                
                progressBar.id = progressId;
                
                // Добавляем aria-атрибуты для доступности
                progressBar.setAttribute('role', 'progressbar');
                progressBar.setAttribute('aria-valuenow', '0');
                progressBar.setAttribute('aria-valuemin', '0');
                progressBar.setAttribute('aria-valuemax', '100');
                progressBar.setAttribute('aria-label', `${skillName}: ${percent}%`);
                
                // Запускаем анимацию с небольшой задержкой для визуального эффекта
                setTimeout(() => {
                    animateProgressBar(progressBar, percent, skillName);
                }, index * 150); 
            }
        }
    });
}

function animateProgressBar(progressBar, targetPercent, skillName) {
    progressBar.classList.add('animating');
    progressBar.classList.remove('animation-complete');
    
    // Устанавливаем начальное значение
    let currentPercent = 0;
    progressBar.style.width = '0%';
    progressBar.setAttribute('aria-valuenow', '0');
    
    // Настраиваем анимацию
    const duration = 1500;
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        currentPercent = targetPercent * easeProgress;
        
        if (progress < 1) {
            progressBar.style.width = `${currentPercent}%`;
            progressBar.setAttribute('aria-valuenow', Math.round(currentPercent));
            requestAnimationFrame(animate);
        } else {
            progressBar.style.width = `${targetPercent}%`;
            progressBar.setAttribute('aria-valuenow', targetPercent);
            progressBar.classList.remove('animating');
            progressBar.classList.add('animation-complete');
        }
    }
    
    // Запускаем анимацию
    requestAnimationFrame(animate);
}

function initializeProgressBarsWithObserver() {
    const skillElements = document.querySelectorAll('.skill__procent');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const percentElement = entry.target;
                const card = percentElement.closest('.skills__card, .skills__сard');
                const progressBar = card?.querySelector('.progress__bar');
                const skillName = card?.querySelector('.skill__title')?.textContent;
                
                if (percentElement && progressBar && skillName) {
                    const percentText = percentElement.textContent.trim();
                    const percent = parseInt(percentText.replace('%', ''), 10);
                    
                    if (!isNaN(percent)) {
                        const safeId = skillName.toLowerCase().replace(/[^a-z0-9]/g, '-');
                        const progressId = `progress-${safeId}-${index}`;
                        progressBar.id = progressId;
                        
                        // Добавляем aria-атрибуты
                        progressBar.setAttribute('role', 'progressbar');
                        progressBar.setAttribute('aria-valuemin', '0');
                        progressBar.setAttribute('aria-valuemax', '100');
                        progressBar.setAttribute('aria-label', `${skillName}: ${percent}%`);
                        
                        // Запускаем анимацию с задержкой
                        setTimeout(() => {
                            animateProgressBar(progressBar, percent, skillName);
                        }, index * 100);
                        
                        observer.unobserve(percentElement);
                    }
                }
            }
        });
    }, {
        threshold: 0.3, 
        rootMargin: '0px 0px -50px 0px'
    });
    
    skillElements.forEach(element => {
        observer.observe(element);
    });
}


document.addEventListener('DOMContentLoaded', function() {
     initializeProgressBarsWithObserver();
});

// Функция для обновления прогресс-бара по ID
function updateProgressBarById(id, newPercent) {
    const progressBar = document.getElementById(id);
    if (progressBar) {
        const skillName = progressBar.getAttribute('aria-label').split(':')[0];
        animateProgressBar(progressBar, newPercent, skillName);
    }
}

// Функция для обновления всех прогресс-баров
  function updateAllProgressBars() {
    const progressBars = document.querySelectorAll('.progress__bar[id]');
      progressBars.forEach(bar => {
          const currentValue = parseInt(bar.getAttribute('aria-valuenow') || '0', 10);
          const skillName = bar.getAttribute('aria-label').split(':')[0];
          animateProgressBar(bar, currentValue, skillName);
      });
}
// burger меню
const burger = document.querySelector('.burger');
const nav__list = document.querySelector('.nav__list');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  nav__list.classList.toggle('active');
});

// Закрываем меню при клике вне него
document.addEventListener('click', (e) => {
  if (!nav__list.contains(e.target) && !burger.contains(e.target)) {
    burger.classList.remove('active');
    nav__list.classList.remove('active');
  }
});