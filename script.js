

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

  let index = 0; 

  function update() {
    const percent = -(index * 25); 
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


(function() {
   
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }
    function loadUsers() {
        return JSON.parse(localStorage.getItem('users') || '{}');
    }
    function setCurrent(email) {
        if (email)
            localStorage.setItem('currentUser', email);
        else
            localStorage.removeItem('currentUser');
    }
    function getCurrent() {
        return localStorage.getItem('currentUser') || null;
    }
   
    function hash(str) {
        let h = 0; if (str.length === 0) return h;
        for (let i = 0; i < str.length; i++) { h = ((h<<5)-h)+str.charCodeAt(i); h=h&h; }
        return h.toString();
    }


    const regForm = document.getElementById('register-form');
    if (regForm) {
        regForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = regForm.email.value.trim();
            const pwd = regForm.password.value;
            const conf = regForm.confirm.value;
            const err = document.getElementById('register-error');
            err.textContent = '';
            if (!/^[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email)) {
                err.textContent = 'Некорректный email'; return;
            }
            if (pwd.length < 4) {
                err.textContent = 'Пароль слишком короткий'; return;
            }
            if (pwd !== conf) {
                err.textContent = 'Пароли не совпадают'; return;
            }
            let users = loadUsers();
            if (users[email]) {
                err.textContent = 'Пользователь уже существует'; return;
            }
            users[email] = hash(pwd);
            saveUsers(users);
            setCurrent(email);
            window.location = 'index.html';
        });
    }

 
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = loginForm.email.value.trim();
            const pwd = loginForm.password.value;
            const err = document.getElementById('login-error');
            err.textContent = '';
            if (!/^[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email)) {
                err.textContent = 'Некорректный email'; return;
            }
            let users = loadUsers();
            if (!users[email]) {
                err.textContent = 'Пользователь не найден'; return;
            }
            if (users[email] !== hash(pwd)) {
                err.textContent = 'Неправильный пароль'; return;
            }
            setCurrent(email);
            window.location = 'index.html';
        });
    }


    function updateHeader() {
        const cartDiv = document.querySelector('.cart');
        const regBtn = document.querySelector('.reg-btn');
        const email = getCurrent();
        if (!cartDiv) return;
        if (email) {
            cartDiv.innerHTML = `Добро пожаловать, <b>${email}</b> | <a href="#" id="logout-link">Выйти</a>`;
            if(regBtn) regBtn.style.display = 'none';
            const logout = document.getElementById('logout-link');
            if (logout) logout.onclick = (e) => { e.preventDefault(); setCurrent(null); window.location = 'index.html'; };
        } else {
            cartDiv.innerHTML = '| Корзина/ 0 BYN';
            if(regBtn) regBtn.style.display = '';
        }
    }
    updateHeader();

    document.addEventListener('click', e => {
        if(e.target && e.target.id === 'logout-link') {
            setCurrent(null); window.location = 'index.html';
        }
    });
})();



