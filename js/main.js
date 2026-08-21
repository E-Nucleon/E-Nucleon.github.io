/* 全局交互：导航 / 语言占位 / 回顶 / toast / 滚动显现 */
(function () {
  var header = document.getElementById('siteHeader');
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('siteNav');
  var backtop = document.getElementById('backtop');

  menuBtn.addEventListener('click', function () { nav.classList.toggle('open'); });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') nav.classList.remove('open');
  });

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
    backtop.classList.toggle('show', window.scrollY > 480);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backtop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  document.getElementById('year').textContent = new Date().getFullYear();

  /* toast 轻提示 */
  var toastEl = document.getElementById('toast');
  var tTimer = null;
  window.toast = function (msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(tTimer);
    tTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  };

  /* 语言切换（英文为占位，后续可扩展 i18n） */
  var langBtn = document.getElementById('langBtn');
  var langMenu = document.getElementById('langMenu');
  langBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    langMenu.classList.toggle('open');
  });
  document.addEventListener('click', function () { langMenu.classList.remove('open'); });
  langMenu.querySelectorAll('button').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.lang === 'en') window.toast('英文版规划中，敬请期待 ✨');
      else window.toast('Currently in Chinese 🈶');
      langMenu.classList.remove('open');
    });
  });

  /* 滚动显现动画 */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('on'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('on'); });
  }
})();
