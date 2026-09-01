/* ================================================================
 * main.js  —  全局交互 & 彩蛋
 * 包含：控制台彩蛋 / Konami 炸板彩蛋 / 导航菜单 / 回顶 / toast / 语言切换 / 滚动显现
 * ================================================================ */

/* ---------- 控制台彩蛋 ----------
 * 打开浏览器控制台（F12）时显示的彩色站点签名。
 * %c 语法用于给 console 输出添加 CSS 样式。
 */
console.log("%c⚡ Nucleon","color:#38bdf8;font-size:42px;font-weight:900;text-shadow:0 0 12px #38bdf8");
console.log("%cSmart Manufacturing","color:#4ade80;font-size:15px;letter-spacing:3px;font-weight:bold");

/* ---------- Konami 彩蛋：炸板模式 ----------
 * 经典魂斗罗秘籍：↑↑↓↓←→←→BA
 * 输入正确序列后触发全屏粒子爆炸效果（电子元件飞溅）。
 * SEQ：按键序列（使用 e.code 而非 e.key，兼容不同键盘布局）
 * ki：当前已匹配到序列第几位
 */
(function(){
  var SEQ=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'];
  var ki=0;
  document.addEventListener('keydown',function(e){
    /* 逐字符匹配，匹配成功则前进；失败时检查是否重新开始 */
    if(e.code===SEQ[ki]){ki++;if(ki===SEQ.length){ki=0;boom();}}
    else{ki=(e.code===SEQ[0])?1:0;}
  });
  function boom(){
    window.toast('💥 炸板模式启动！小心你的 PCB…');
    /* 闪屏：插入全屏白色遮罩，650ms 后移除 */
    var flash=document.createElement('div');flash.className='boom-flash';document.body.appendChild(flash);
    setTimeout(function(){flash.remove();},650);
    /* 粒子层：创建覆盖全屏的 overlay 容器 */
    var overlay=document.createElement('div');overlay.className='boom-overlay';document.body.appendChild(overlay);
    /* P：粒子文字池（电子元件 emoji + 参数文本） */
    var P=['💥','⚡','🔌','🔋','💡','📡','🔧','🔩','🔥','10μF','100Ω','ESP32','0805','3.3V','GND','VCC','MCU','PCB','STM32','💡','⚡','💥'];
    /* C：随机颜色池 */
    var C=['#38bdf8','#4ade80','#fbbf24','#f472b6','#f87171','#a78bfa'];
    /* 生成 48 个粒子，随机分布、随机动画参数 */
    for(var i=0;i<48;i++){
      var p=document.createElement('span');p.className='boom-particle';
      p.textContent=P[Math.floor(Math.random()*P.length)];       /* 随机选一个文字 */
      p.style.left=Math.random()*100+'vw';                        /* 随机水平位置 */
      p.style.setProperty('--dur',(2.5+Math.random()*2.5)+'s');  /* 动画时长（CSS 变量） */
      p.style.setProperty('--dx',(Math.random()*240-120)+'px');  /* 水平偏移量 */
      p.style.setProperty('--rot',(Math.random()*720-360)+'deg');/* 旋转角度 */
      p.style.animationDelay=(Math.random()*0.6)+'s';            /* 动画延迟 */
      if(Math.random()>0.4)p.style.color=C[Math.floor(Math.random()*C.length)]; /* 约 60% 粒子带颜色 */
      overlay.appendChild(p);
    }
    /* 6 秒后移除整个粒子层 */
    setTimeout(function(){overlay.remove();},6000);
  }
})();

/* ---------- 全局交互 IIFE ----------
 * 统一管理：顶栏滚动样式 / 移动端菜单 / 回顶按钮 / toast 提示 / 语言切换 / 滚动显现动画
 * 所有事件监听在此注册，页面加载后自动执行。
 */
(function () {
  /* 获取 DOM 元素引用 */
  var header = document.getElementById('siteHeader');   /* 顶栏 */
  var menuBtn = document.getElementById('menuBtn');     /* 移动端菜单按钮（汉堡） */
  var nav = document.getElementById('siteNav');         /* 导航栏 */
  var backtop = document.getElementById('backtop');     /* 回顶按钮 */

  /* 移动端菜单：点击汉堡按钮切换展开/收起 */
  menuBtn.addEventListener('click', function () { nav.classList.toggle('open'); });
  /* 点击导航链接后自动收起菜单 */
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') nav.classList.remove('open');
  });

  /* 滚动监听：滚动超过 8px 时顶栏加 .scrolled 样式；超过 480px 时显示回顶按钮 */
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
    backtop.classList.toggle('show', window.scrollY > 480);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); /* passive 提升滚动性能 */
  onScroll(); /* 初始执行一次，处理页面刷新时已滚动的情况 */

  /* 回顶按钮：平滑滚动回顶部 */
  backtop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* 页脚年份自动更新 */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- toast 轻提示 ----------
   * 全局可调用：window.toast('消息内容')
   * 显示后 2.6 秒自动隐藏；连续调用时清除上一个计时器重新计时。
   */
  var toastEl = document.getElementById('toast');
  var tTimer = null;
  window.toast = function (msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(tTimer);
    tTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  };

  /* ---------- 语言切换 ----------
   * 点击语言按钮弹出下拉菜单，点击选项后给出提示。
   * 英文版为占位，后续可扩展为真正的 i18n 多语言切换。
   */
  var langBtn = document.getElementById('langBtn');
  var langMenu = document.getElementById('langMenu');
  langBtn.addEventListener('click', function (e) {
    e.stopPropagation();  /* 阻止冒泡，避免触发下方 document 点击关闭 */
    langMenu.classList.toggle('open');
  });
  /* 点击页面任意位置关闭语言菜单 */
  document.addEventListener('click', function () { langMenu.classList.remove('open'); });
  /* 各语言按钮的点击响应 */
  langMenu.querySelectorAll('button').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.lang === 'en') window.toast('英文版规划中，敬请期待 ✨');
      else window.toast('Currently in Chinese 🈶');
      langMenu.classList.remove('open');
    });
  });

  /* ---------- 滚动显现动画 ----------
   * 页面中所有带 .reveal 类的元素，进入视口时添加 .on 类触发 CSS 过渡动画。
   * 使用 IntersectionObserver 实现高性能懒加载式显现；
   * 不支持该 API 的浏览器直接显示所有元素。
   */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('on'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 }); /* 元素 12% 进入视口即触发 */
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    /* 兜底：不支持 IntersectionObserver 的旧浏览器，直接显示 */
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('on'); });
  }
})();

/* ================================================================
 * 鼠标光晕跟随 + 点击波纹涟漪
 * ================================================================ */

/* ---------- 鼠标光晕跟随 ----------
 * 一团柔和冰蓝光晕跟随鼠标移动，用 lerp 插值实现丝滑滞后效果。
 * mix-blend-mode:screen 让光晕在深色背景上自然融合。
 */
(function () {
  var glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  var gx = -400, gy = -400, tx = -400, ty = -400;
  document.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; });
  document.addEventListener('mouseleave', function () { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', function () { glow.style.opacity = '1'; });
  (function loop() {
    gx += (tx - gx) * 0.12;
    gy += (ty - gy) * 0.12;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(loop);
  })();
})();

/* ---------- 点击波纹涟漪 ----------
 * 点击页面任意位置产生冰蓝扩散波纹，0.55s 后自动移除。
 */
document.addEventListener('click', function (e) {
  var r = document.createElement('span');
  r.className = 'click-ripple';
  r.style.left = e.clientX + 'px';
  r.style.top = e.clientY + 'px';
  document.body.appendChild(r);
  setTimeout(function () { r.remove(); }, 550);
});

/* ---------- 页面滚动进度条 ----------
 * 顶部冰蓝渐变条，随滚动实时显示阅读进度（0~100%）。
 */
(function () {
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  function update() {
    var st = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? st / max : 0;
    bar.style.width = (pct * 100) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
