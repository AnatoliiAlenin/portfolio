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
        
        console.log(`Создано ${created} звезд`);
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