// Простые два слайдера: hero (fade) и карусель брендов

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initBrandsCarousel();
});

function initHeroSlider() {
  const slider = document.querySelector('[data-slider="hero"]');
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.hero-slide'));
  const dotsContainer = slider.querySelector('[data-dots="hero"]');
  let current = 0;
  let timer = null;

  // создать точки
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll('.dot'));

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    restart();
  }

  function next() { goTo(current + 1); }

  function start() { timer = setInterval(next, 4000); }
  function stop() { if (timer) clearInterval(timer); }
  function restart() { stop(); start(); }

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);

  start();
}

function initBrandsCarousel() {
  const carousel = document.querySelector('[data-slider="brands"]');
  if (!carousel) return;

  const track = carousel.querySelector('.brands-track');
  const items = Array.from(track.children);
  const prevBtn = carousel.querySelector('[data-action="prev"]');
  const nextBtn = carousel.querySelector('[data-action="next"]');

  let index = 0; // смещение в элементах (по 1 карточке)

  function update() {
    const percent = -(index * 25); // т.к. grid-auto-columns: 25%
    track.style.transform = `translateX(${percent}%)`;
  }

  function next() {
    index = (index + 1) % items.length;
    update();
  }

  function prev() {
    index = (index - 1 + items.length) % items.length;
    update();
  }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  let autoplay = setInterval(next, 3000);
  carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
  carousel.addEventListener('mouseleave', () => autoplay = setInterval(next, 3000));

  update();
}


