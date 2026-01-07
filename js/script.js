document.addEventListener("DOMContentLoaded", function() {
    const starField = document.querySelector('.starfield');

    let starsCount = 1000;
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * window.innerWidth}px`;
        star.style.top = `${Math.random() * window.innerHeight}px`;
        star.style.animationDelay = `${Math.random()}s`;
        starField.appendChild(star);
    }
});