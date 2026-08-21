/* 首页逻辑：顶部全站搜索 + 技能轨道 */
(function () {
  var TOOLS = window.EE_TOOLS || [];

  /* ---------- 全站搜索索引 ---------- */
  var INDEX = [
    { type: 'page', title: '首页', desc: '回到顶部', href: '#top', tags: 'home 首页' },
    { type: 'page', title: 'EE 工具箱', desc: '进入完整工具箱，38+ 纯前端工具', href: 'EE_Toolbox/index.html', tags: '工具 计算器 toolbox 工具箱' },
    { type: 'page', title: '项目&作品', desc: '硬件设计 / 3D 建模 / 绘画作品', href: '#projects', tags: '项目 作品 硬件 project' },
    { type: 'page', title: '动态', desc: '站点与项目最新进展', href: '#news', tags: '动态 新闻 news 更新' },
    { type: 'page', title: '关于我', desc: '自我介绍与技能领域', href: '#about', tags: '关于 技能 about' },
    { type: 'page', title: '社交', desc: 'Bilibili / OSHWHub / GitHub / QQ 群', href: '#social', tags: '社交 联系 social' },
    { type: 'project', title: 'TPS45335ADRCR 3A 输出降压模块', desc: '高效降压模块 · 3A 输出', href: '#projects', tags: '降压 电源 PCB 硬件 模块' },
    { type: 'project', title: 'CH340K 串口调试模块', desc: 'USB 转串口 · 多种波特率', href: '#projects', tags: '串口 USB 调试 嵌入式' },
    { type: 'project', title: '独立创立小硬件', desc: '独立设计的实用工具与创意装置', href: '#projects', tags: '创意 DIY 硬件' },
    { type: 'project', title: '雪花造型蓝灯', desc: '雪花造型 LED 蓝灯', href: '#projects', tags: 'LED 装饰 灯' },
    { type: 'project', title: '3D 建模作品', desc: '角色 / 场景 / 产品原型', href: '#projects', tags: '3D Blender 建模' },
    { type: 'project', title: '绘画作品', desc: '数字绘画 / 手绘', href: '#projects', tags: '绘画 数字 艺术' },
    { type: 'social', title: 'Bilibili', desc: '视频创作与分享平台', href: 'https://b23.tv/Nu1D5P9', tags: 'b站 视频 bilibili' },
    { type: 'social', title: 'OSHWHub', desc: '开源硬件项目分享', href: 'https://oshwhub.com/qxqpcb', tags: '开源硬件 立创 oshwhub' },
    { type: 'social', title: 'GitHub', desc: '代码仓库与开源项目', href: 'https://github.com/E-Nucleon', tags: 'github 代码 开源' },
    { type: 'social', title: 'QQ 群', desc: '技术交流与讨论', href: 'https://qm.qq.com/q/vcaDmKQtPM', tags: 'qq 群 交流' }
  ];
  TOOLS.forEach(function (t) {
    INDEX.push({ type: 'tool', title: t.name, desc: t.description, href: 'EE_Toolbox/' + encodeURI(t.file), tags: (t.tags || []).join(' ') + ' ' + t.category });
  });

  var ORDER = { page: 0, project: 1, tool: 2, social: 3 };
  var TYPE_LABEL = { page: '页面', project: '项目', tool: '工具', social: '社交' };
  var box = document.getElementById('siteSearchBox');
  var input = document.getElementById('siteSearch');
  var panel = document.getElementById('searchPanel');
  var lastList = [];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function search(q) {
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return INDEX.filter(function (item) {
      var hay = (item.title + ' ' + (item.desc || '') + ' ' + (item.tags || '')).toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) > -1; });
    }).sort(function (a, b) { return ORDER[a.type] - ORDER[b.type]; }).slice(0, 12);
  }

  function renderPanel() {
    var q = input.value.trim();
    if (!q) { panel.hidden = true; panel.innerHTML = ''; lastList = []; return; }
    lastList = search(q);
    panel.hidden = false;
    if (!lastList.length) {
      panel.innerHTML = '<div class="sr-empty">😶‍🌫️ 没找到与 “' + esc(q) + '” 相关的内容</div>';
      return;
    }
    panel.innerHTML = lastList.map(function (item, i) {
      return '<a class="sr-row" data-i="' + i + '" href="' + esc(item.href) + '">'
        + '<span class="sr-type ' + item.type + '">' + TYPE_LABEL[item.type] + '</span>'
        + '<span class="sr-main"><span class="sr-title">' + esc(item.title) + '</span>'
        + (item.desc ? '<span class="sr-desc">' + esc(item.desc) + '</span>' : '')
        + '</span></a>';
    }).join('');
  }

  input.addEventListener('input', renderPanel);
  input.addEventListener('focus', function () { if (input.value.trim()) renderPanel(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { panel.hidden = true; input.blur(); }
    else if (e.key === 'Enter') {
      var sel = panel.querySelector('.sr-row.sel');
      var target = sel ? lastList[Number(sel.dataset.i)] : lastList[0];
      if (target) window.location.href = target.href;
    }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      var rows = panel.querySelectorAll('.sr-row');
      if (!rows.length) return;
      e.preventDefault();
      var cur = panel.querySelector('.sr-row.sel');
      var idx = cur ? Number(cur.dataset.i) : -1;
      if (cur) cur.classList.remove('sel');
      idx = e.key === 'ArrowDown' ? (idx + 1) % rows.length : (idx - 1 + rows.length) % rows.length;
      rows[idx].classList.add('sel');
      rows[idx].scrollIntoView({ block: 'nearest' });
    }
  });
  document.addEventListener('click', function (e) { if (!box.contains(e.target)) panel.hidden = true; });
  document.addEventListener('keydown', function (e) {
    var tag = document.activeElement && document.activeElement.tagName;
    if (e.key === '/' && document.activeElement !== input && tag !== 'INPUT' && tag !== 'TEXTAREA') { e.preventDefault(); input.focus(); }
  });

  var statTools = document.getElementById('statTools');
  if (statTools) statTools.textContent = TOOLS.length + '+';

  /* ---------- 技能轨道 ---------- */
  var SKILLS = [
    { name: 'PCB Layout', cat: 'eng' },
    { name: '嵌入式开发', cat: 'eng' },
    { name: '硬件开发', cat: 'eng' },
    { name: '急救', cat: 'med' },
    { name: '解剖学', cat: 'med' },
    { name: '外科学', cat: 'med' },
    { name: '无机化学', cat: 'sci' },
    { name: '微生物学', cat: 'sci' },
    { name: '平面设计', cat: 'art' },
    { name: '3D 建模', cat: 'art' },
    { name: '业余无线电', cat: 'radio' },
    { name: 'Furry', cat: 'furry' }
  ];
  var ring = document.getElementById('orbitRing');
  if (ring) {
    SKILLS.forEach(function (s, i) {
      var a = Math.round(i * 360 / SKILLS.length);
      var el = document.createElement('div');
      el.className = 'orbit-chip cat-' + s.cat;
      el.style.setProperty('--a', a + 'deg');
      el.innerHTML = '<span>' + s.name + '</span>';
      ring.appendChild(el);
    });
  }
})();

/* ---------- 侧边时间轴：滚动定位 + 快速跳转 ---------- */
(function () {
  var list = document.getElementById('railList');
  if (!list) return;
  var SECTIONS = [
    { id: 'top', label: '简介' },
    { id: 'projects', label: '作品' },
    { id: 'news', label: '动态' },
    { id: 'about', label: '关于我' },
    { id: 'social', label: '社交' }
  ];
  var fill = document.createElement('div');
  fill.className = 'rail-fill';
  list.appendChild(fill);
  SECTIONS.forEach(function (s, i) {
    var a = document.createElement('a');
    a.className = 'rail-item';
    a.href = '#' + s.id;
    a.dataset.i = i;
    a.innerHTML = '<span class="dot"></span><span class="label">' + s.label + '</span>';
    list.appendChild(a);
  });
  var items = list.querySelectorAll('.rail-item');
  var headerEl = document.getElementById('siteHeader');
  var ticking = false;
  function spy() {
    ticking = false;
    var trigger = (headerEl ? headerEl.offsetHeight : 64) + 120;
    var activeIdx = 0;
    for (var i = 0; i < SECTIONS.length; i++) {
      var el = document.getElementById(SECTIONS[i].id);
      if (el && el.getBoundingClientRect().top <= trigger) activeIdx = i;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) activeIdx = SECTIONS.length - 1;
    for (var j = 0; j < items.length; j++) {
      items[j].classList.toggle('active', j === activeIdx);
      items[j].classList.toggle('past', j < activeIdx);
    }
    var ai = items[activeIdx];
    if (ai) fill.style.height = Math.max(0, ai.offsetTop + ai.offsetHeight / 2 - 10) + 'px';
  }
  window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(spy); ticking = true; } }, { passive: true });
  window.addEventListener('resize', spy);
  spy();
})();
