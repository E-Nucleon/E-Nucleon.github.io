/* ================================================================
 * home.js  —  首页专用脚本
 * 包含三个独立 IIFE：
 *   1. 全站搜索 + 技能轨道（搜索索引 / 搜索逻辑 / 键盘导航 / 技能环形布局）
 *   2. 侧边时间轴（滚动定位 / 快速跳转 / 进度填充）
 *   3. 全屏粒子系统（Logo 水印 + 六边形框 + 三角形 / 视差悬浮 / 萤火虫闪烁）
 * ================================================================ */

/* ================================================================
 * IIFE 1：全站搜索 + 技能轨道
 * ================================================================ */
(function () {
  /* TOOLS：从全局变量获取 EE 工具列表（由 EE_Toolbox 注入） */
  var TOOLS = window.EE_TOOLS || [];

  /* ---------- 全站搜索索引 ----------
   * INDEX 数组定义所有可搜索的内容条目。
   * 每条记录包含：type（类型）/ title（标题）/ desc（描述）/ href（链接）/ tags（搜索关键词）
   * type 决定排序优先级和搜索面板中的分类标签颜色。
   */
  var INDEX = [
    /* —— 页面类 —— */
    { type: 'page', title: '首页', desc: '回到顶部', href: '#top', tags: 'home 首页' },
    { type: 'page', title: 'EE 工具箱', desc: '进入完整工具箱，38+ 纯前端工具', href: 'EE_Toolbox/index.html', tags: '工具 计算器 toolbox 工具箱' },
    { type: 'page', title: '项目&作品', desc: '硬件设计 / 3D 建模 / 绘画作品', href: '#projects', tags: '项目 作品 硬件 project' },
    { type: 'page', title: '动态', desc: '站点与项目最新进展', href: '#news', tags: '动态 新闻 news 更新' },
    { type: 'page', title: '关于我', desc: '自我介绍与技能领域', href: '#about', tags: '关于 技能 about' },
    { type: 'page', title: '社交', desc: 'Bilibili / OSHWHub / GitHub / QQ 群', href: '#social', tags: '社交 联系 social' },
    /* —— 项目类 —— */
    { type: 'project', title: 'TPS45335ADRCR 3A 输出降压模块', desc: '高效降压模块 · 3A 输出', href: '#projects', tags: '降压 电源 PCB 硬件 模块' },
    { type: 'project', title: 'CH340K 串口调试模块', desc: 'USB 转串口 · 多种波特率', href: '#projects', tags: '串口 USB 调试 嵌入式' },
    { type: 'project', title: '独立创立小硬件', desc: '独立设计的实用工具与创意装置', href: '#projects', tags: '创意 DIY 硬件' },
    { type: 'project', title: '雪花造型蓝灯', desc: '雪花造型 LED 蓝灯', href: '#projects', tags: 'LED 装饰 灯' },
    { type: 'project', title: '3D 建模作品', desc: '角色 / 场景 / 产品原型', href: '#projects', tags: '3D Blender 建模' },
    { type: 'project', title: '绘画作品', desc: '数字绘画 / 手绘', href: '#projects', tags: '绘画 数字 艺术' },
    /* —— 社交类 —— */
    { type: 'social', title: 'Bilibili', desc: '视频创作与分享平台', href: 'https://b23.tv/Nu1D5P9', tags: 'b站 视频 bilibili' },
    { type: 'social', title: 'OSHWHub', desc: '开源硬件项目分享', href: 'https://oshwhub.com/qxqpcb', tags: '开源硬件 立创 oshwhub' },
    { type: 'social', title: 'GitHub', desc: '代码仓库与开源项目', href: 'https://github.com/E-Nucleon', tags: 'github 代码 开源' },
    { type: 'social', title: 'QQ 群', desc: '技术交流与讨论', href: 'https://qm.qq.com/q/vcaDmKQtPM', tags: 'qq 群 交流' }
  ];
  /* 将 EE 工具箱的工具也加入搜索索引 */
  TOOLS.forEach(function (t) {
    INDEX.push({ type: 'tool', title: t.name, desc: t.description, href: 'EE_Toolbox/' + encodeURI(t.file), tags: (t.tags || []).join(' ') + ' ' + t.category });
  });

  /* 排序优先级：页面 > 项目 > 工具 > 社交 */
  var ORDER = { page: 0, project: 1, tool: 2, social: 3 };
  /* 搜索面板中的类型标签文字 */
  var TYPE_LABEL = { page: '页面', project: '项目', tool: '工具', social: '社交' };
  var box = document.getElementById('siteSearchBox');  /* 搜索框容器 */
  var input = document.getElementById('siteSearch');  /* 搜索输入框 */
  var panel = document.getElementById('searchPanel');  /* 搜索结果面板 */
  var lastList = [];  /* 当前结果列表（用于键盘导航） */

  /* HTML 转义函数，防止 XSS */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* 搜索核心：按关键词匹配 title + desc + tags，返回最多 12 条，按类型优先级排序 */
  function search(q) {
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return INDEX.filter(function (item) {
      var hay = (item.title + ' ' + (item.desc || '') + ' ' + (item.tags || '')).toLowerCase();
      /* 所有关键词都必须命中 */
      return words.every(function (w) { return hay.indexOf(w) > -1; });
    }).sort(function (a, b) { return ORDER[a.type] - ORDER[b.type]; }).slice(0, 12);
  }

  /* 渲染搜索结果面板 */
  function renderPanel() {
    var q = input.value.trim();
    /* 输入为空时隐藏面板 */
    if (!q) { panel.hidden = true; panel.innerHTML = ''; lastList = []; return; }
    lastList = search(q);
    panel.hidden = false;
    /* 无结果时显示空状态 */
    if (!lastList.length) {
      panel.innerHTML = '<div class="sr-empty">😶‍🌫️ 没找到与 "' + esc(q) + '" 相关的内容</div>';
      return;
    }
    /* 拼接结果列表 HTML */
    panel.innerHTML = lastList.map(function (item, i) {
      return '<a class="sr-row" data-i="' + i + '" href="' + esc(item.href) + '">'
        + '<span class="sr-type ' + item.type + '">' + TYPE_LABEL[item.type] + '</span>'
        + '<span class="sr-main"><span class="sr-title">' + esc(item.title) + '</span>'
        + (item.desc ? '<span class="sr-desc">' + esc(item.desc) + '</span>' : '')
        + '</span></a>';
    }).join('');
  }

  /* ---------- 搜索框事件绑定 ---------- */
  input.addEventListener('input', renderPanel);                        /* 输入时实时搜索 */
  input.addEventListener('focus', function () { if (input.value.trim()) renderPanel(); }); /* 聚焦时如有内容则显示 */
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { panel.hidden = true; input.blur(); }     /* Esc 关闭面板 */
    else if (e.key === 'Enter') {                                      /* Enter 跳转 */
      var sel = panel.querySelector('.sr-row.sel');
      var target = sel ? lastList[Number(sel.dataset.i)] : lastList[0]; /* 无选中时跳转第一条 */
      if (target) window.location.href = target.href;
    }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {           /* 上下键切换选中 */
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
  /* 点击搜索框外部时关闭结果面板 */
  document.addEventListener('click', function (e) { if (!box.contains(e.target)) panel.hidden = true; });
  /* 按 / 键快速聚焦搜索框（排除已在输入框中时） */
  document.addEventListener('keydown', function (e) {
    var tag = document.activeElement && document.activeElement.tagName;
    if (e.key === '/' && document.activeElement !== input && tag !== 'INPUT' && tag !== 'TEXTAREA') { e.preventDefault(); input.focus(); }
  });

  /* 更新首页统计中工具数量 */
  var statTools = document.getElementById('statTools');
  if (statTools) statTools.textContent = TOOLS.length + '+';

  /* ---------- 技能轨道（环形布局）----------
   * SKILLS 数组定义所有技能标签，cat 决定 CSS 类名（颜色分类）。
   * 通过 CSS --a 变量（角度）将各标签均匀分布在圆环上。
   * 分类：eng（工程）/ med（医学）/ sci（科学）/ art（艺术）/ radio（无线电）/ furry
   */
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
      var a = Math.round(i * 360 / SKILLS.length);  /* 计算每个标签的角度（均分 360°） */
      var el = document.createElement('div');
      el.className = 'orbit-chip cat-' + s.cat;     /* cat-xxx 用于 CSS 颜色区分 */
      el.style.setProperty('--a', a + 'deg');        /* 将角度传给 CSS --a 变量控制定位 */
      el.innerHTML = '<span>' + s.name + '</span>';
      ring.appendChild(el);
    });
  }
})();

/* ================================================================
 * IIFE 2：侧边时间轴（滚动定位 + 快速跳转）
 * 右侧固定的时间轴导航，随滚动高亮当前所在区块。
 * ================================================================ */
(function () {
  var list = document.getElementById('railList');
  if (!list) return;

  /* SECTIONS：时间轴上各区块的 id 与显示标签，顺序对应页面从上到下的区块 */
  var SECTIONS = [
    { id: 'top', label: '简介' },
    { id: 'projects', label: '作品' },
    { id: 'news', label: '动态' },
    { id: 'about', label: '关于我' },
    { id: 'links', label: '友链' },
    { id: 'social', label: '社交' }
  ];

  /* 创建进度填充条（已滚过部分的高亮线） */
  var fill = document.createElement('div');
  fill.className = 'rail-fill';
  list.appendChild(fill);

  /* 为每个区块创建一个跳转锚点 */
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

  /* 滚动监听：确定当前活跃区块，更新高亮状态和进度填充高度 */
  function spy() {
    ticking = false;
    /* 触发线位置 = 顶栏高度 + 120px 偏移 */
    var trigger = (headerEl ? headerEl.offsetHeight : 64) + 120;
    var activeIdx = 0;
    /* 遍历所有区块，找到最后一个已滚过触发线的 */
    for (var i = 0; i < SECTIONS.length; i++) {
      var el = document.getElementById(SECTIONS[i].id);
      if (el && el.getBoundingClientRect().top <= trigger) activeIdx = i;
    }
    /* 滚动到页面底部时强制选中最后一个 */
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) activeIdx = SECTIONS.length - 1;

    /* 更新各项目的 active（当前）/ past（已过）状态 */
    for (var j = 0; j < items.length; j++) {
      items[j].classList.toggle('active', j === activeIdx);
      items[j].classList.toggle('past', j < activeIdx);
    }
    /* 进度填充高度 = 当前活跃项目中心到列表顶部的距离 */
    var ai = items[activeIdx];
    if (ai) fill.style.height = Math.max(0, ai.offsetTop + ai.offsetHeight / 2 - 10) + 'px';
  }

  /* 使用 requestAnimationFrame 节流，避免滚动事件频繁触发 */
  window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(spy); ticking = true; } }, { passive: true });
  window.addEventListener('resize', spy);
  spy(); /* 初始执行一次 */
})();

/* ================================================================
 * IIFE 3：全屏粒子系统
 * 背景层：全屏 Canvas，position:fixed，z-index:-1（位于所有内容之下）
 * 粒子类型：logo（站点 LOGO 水印）/ hex（六边形框）/ tri（三角形框）
 * 特效：鼠标悬停发光 / 视差悬浮（随滚动偏移）/ 萤火虫呼吸闪烁
 * ================================================================ */
(function () {
  /* 无障碍：用户设置了"减少动画"偏好时直接跳过粒子系统 */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* 创建 Canvas 并插入到 body 最前面（z-index:-1 确保在最底层） */
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:-1';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var W, H, particles = [], rafId = null, running = false;

  /* 窗口尺寸变化时重设 Canvas 画布大小 */
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* 加载站点 LOGO 图片（用于 logo 类型的粒子绘制） */
  var img = new Image();
  img.src = 'icon/LOGO_1.png';
  var imgW = 1, imgH = 1;  /* 图片实际宽高（加载后更新） */

  /* 追踪鼠标位置，用于六边形/三角形发光交互 */
  var mx = -9999, my = -9999;
  document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseleave', function () { mx = -9999; my = -9999; });

  /* 追踪滚动位置，用于视差悬浮效果 */
  var scrollY = 0, smoothY = 0;
  var recycleIdx = 0, gridCols = 1;  /* 回收计数器 + 网格列数，用于均匀分布回收粒子 */
  window.addEventListener('scroll', function () { scrollY = window.scrollY; }, { passive: true });

  /* 粒子颜色池（冰蓝渐变系）—— 修改这里可换粒子颜色 */
  var HEX_COLORS = ['#38bdf8', '#4ade80', '#a78bfa', '#fbbf24', '#f472b6'];

  /* ---------- Particle 构造函数 ----------
   * type：'logo' / 'hex' / 'tri'
   * interactive：是否响应鼠标悬停（一半粒子交互，一半纯背景）
   */
  function Particle(type, interactive) {
    this.type = type;
    this.interactive = true;
    this.refresh();
  }

  /* ---------- refresh()：重置粒子属性 ----------
   * 每个粒子被回收（飞出屏幕）时重新随机属性。
   * 修改以下参数可调整粒子外观和行为：
   */
  Particle.prototype.refresh = function () {
    this.size = 18 + Math.random() * 55;                    /* 粒子大小范围 */
    this.vy = -(0.04 + Math.random() * 0.12);              /* 垂直速度（负=向上飘） */
    this.vx = (Math.random() - 0.5) * 0.18;                /* 水平速度（随机左右） */
    this.rot = Math.random() * Math.PI * 2;                 /* 初始旋转角度 */
    this.vr = (Math.random() - 0.5) * 0.002;               /* 旋转速度 */
    this.bright = Math.random() < 0.25;                     /* 约 25% 粒子亮度翻倍 */
    this.alpha = (0.015 + Math.random() * 0.03)            /* 基础透明度 */
      * (this.type === 'hex' || this.type === 'tri' ? 2 : 1)  /* 六边形/三角形透明度 ×2 */
      * (this.bright ? 2 : 1);                                /* 亮度翻倍粒子透明度 ×2 */
    this.color = HEX_COLORS[Math.floor(Math.random() * HEX_COLORS.length)]; /* 随机选颜色 */
    this.depth = 0.05 + Math.random() * 0.25;              /* 视差深度（越大移动越多） */
    /* 萤火虫：约 35% 粒子带呼吸闪烁 */
    this.firefly = Math.random() < 0.35;
    this.flickPhase = Math.random() * Math.PI * 2;         /* 闪烁相位偏移（各粒子不同步） */
    this.flickSpeed = 0.8 + Math.random() * 1.6;           /* 闪烁速度 */
    this.flickAmp = 0.5 + Math.random() * 0.5;             /* 闪烁幅度（0.5~1.0） */
  };

  /* ---------- update()：每帧更新粒子位置 ----------
   * 1. 计算视差偏移后的可见 y 坐标（随滚动浮动，超界自动回绕）
   * 2. 鼠标悬停范围内减速
   * 3. 飞出屏幕时回收到底部重新刷新
   */
  Particle.prototype.update = function () {
    /* 视差偏移后的可见 y 坐标（随滚动浮动，超界自动回绕） */
    var py = this.y - smoothY * this.depth;
    py = ((py % H) + H) % H;  /* 取模确保在 [0, H) 范围内（正负数安全） */
    this._py = py;  /* 暂存供 draw() 使用 */
    var slow = 1;
    if (this.interactive) {
      /* 鼠标在粒子附近时减速（slow → 0），实现"被推开"的视觉效果 */
      var dx = this.x - mx, dy = py - my;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var hoverR = this.size / 2 + 40;
      slow = dist < hoverR ? Math.max(0, dist / hoverR) : 1;
    }
    this.x += this.vx * slow;
    this.y += this.vy * slow;
    this.rot += this.vr * slow;
    /* 粒子飞出屏幕顶部或左右边界时，回收到底部并重新随机属性 */
    if (this.y < -100 || this.x < -100 || this.x > W + 100) {
      recycleIdx = (recycleIdx + 1) % gridCols;
      this.x = (recycleIdx + 0.3 + Math.random() * 0.4) * (W / gridCols);
      this.y = H + 80;
      this.refresh();
    }
  };

  /* ---------- draw(t)：每帧绘制粒子 ----------
   * t：performance.now() 时间戳（用于萤火虫正弦波动画）
   * 三种绘制方式：logo（图片）/ tri（三角形描边）/ hex（六边形描边）
   */
  Particle.prototype.draw = function (t) {
    var py = this._py != null ? this._py : this.y;
    /* 鼠标距离 → 发光强度（0~1） */
    var glow = 0;
    if (this.interactive) {
      var dx = this.x - mx, dy = py - my;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var glowR = this.size / 2 + 50;
      glow = Math.max(0, 1 - dist / glowR);
    }
    /* 萤火虫呼吸闪烁：sin 波计算 0~1 的闪烁系数，保底 0.15 避免突然灭掉 */
    var flick = 1;
    if (this.firefly) {
      flick = (Math.sin(t * 0.001 * this.flickSpeed + this.flickPhase) * 0.5 + 0.5) * this.flickAmp + (1 - this.flickAmp);
      flick = flick * 0.85 + 0.15;  /* 压缩到 0.15~1.0，保证不会完全熄灭 */
    }
    ctx.save();
    ctx.translate(this.x, py);
    ctx.rotate(this.rot);
    /* 最终透明度 = 基础值 × 闪烁系数（鼠标悬停时额外提升） */
    ctx.globalAlpha = (glow > 0 ? Math.min(this.alpha + glow * 0.25, 0.4) : this.alpha) * flick;
    /* 发光：鼠标悬停 or 萤火虫闪烁时启用 shadowBlur（无阈值，平滑过渡） */
    if (glow > 0) {
      ctx.shadowBlur = 10 + glow * 20;
      ctx.shadowColor = this.type === 'logo' ? '#38bdf8' : this.color;
    } else if (this.firefly) {
      ctx.shadowBlur = flick * 18;  /* 随闪烁系数平滑变化，不会突然消失 */
      ctx.shadowColor = this.type === 'logo' ? '#38bdf8' : this.color;
    }
    /* —— 根据粒子类型分别绘制 —— */
    if (this.type === 'logo') {
      /* Logo 类型：绘制 LOGO 图片 */
      var w = this.size, h = this.size * (imgH / imgW);
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
    } else if (this.type === 'tri') {
      /* 三角形：3 个顶点，从顶部开始（-π/2）顺时针 */
      var r = this.size / 2;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = (1.5 + glow * 2) * 2;  /* 线宽随发光增加 */
      ctx.beginPath();
      for (var i = 0; i < 3; i++) {
        var ta = i * Math.PI * 2 / 3 - Math.PI / 2;  /* 第 i 个顶点角度 */
        var tx = Math.cos(ta) * r, ty = Math.sin(ta) * r;
        if (i === 0) ctx.moveTo(tx, ty); else ctx.lineTo(tx, ty);
      }
      ctx.closePath();
      ctx.stroke();
    } else {
      /* 六边形：6 个顶点，从 0° 开始每 60° 一个 */
      var r = this.size / 2;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = (1.5 + glow * 2) * 2;
      ctx.beginPath();
      for (var i = 0; i < 6; i++) {
        var a = i * Math.PI / 3;  /* 第 i 个顶点角度（60° 间隔） */
        var hx = Math.cos(a) * r, hy = Math.sin(a) * r;  /* 用 hx/hy 避免与外层 py 变量冲突 */
        if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.shadowBlur = 0;  /* 重置发光，避免影响后续粒子 */
    ctx.restore();
  };

  /* ---------- 粒子数量配置 ----------
   * 修改这三个变量可调整各类粒子数量。
   * HALF = 交互粒子数量，TOTAL = HALF × 2（交互 + 非交互各一半）
   */
  var LOGO_COUNT = 36;   /* LOGO 水印粒子数 */
  var HEX_COUNT = 48;    /* 六边形框粒子数 */
  var TRI_COUNT = 48;    /* 三角形框粒子数 */
  var HALF = LOGO_COUNT + HEX_COUNT + TRI_COUNT;
  var TOTAL = HALF * 2;  /* 总粒子数 = 264 */

  /* ---------- initParticles()：网格初始化 ----------
   * 将粒子均匀分布在网格中（避免重叠），然后打乱类型顺序。
   * 一半粒子可交互（响应鼠标），一半纯背景装饰。
   */
  function initParticles() {
    particles = [];
    /* 构建类型数组：先一半交互粒子，再一半非交互粒子 */
    var types = [];
    for (var i = 0; i < LOGO_COUNT; i++) types.push({ t: 'logo', i: true });
    for (var i = 0; i < HEX_COUNT; i++) types.push({ t: 'hex', i: true });
    for (var i = 0; i < TRI_COUNT; i++) types.push({ t: 'tri', i: true });
    for (var i = 0; i < LOGO_COUNT; i++) types.push({ t: 'logo', i: false });
    for (var i = 0; i < HEX_COUNT; i++) types.push({ t: 'hex', i: false });
    for (var i = 0; i < TRI_COUNT; i++) types.push({ t: 'tri', i: false });
    /* Fisher-Yates 洗牌：随机打乱类型顺序 */
    for (var i = types.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = types[i]; types[i] = types[j]; types[j] = tmp;
    }
    /* 计算网格行列数，使粒子均匀分布 */
    var cols = Math.ceil(Math.sqrt(TOTAL * W / H));
    gridCols = cols;
    var rows = Math.ceil(TOTAL / cols);
    var cellW = W / cols, cellH = H / rows;
    var idx = 0;
    /* 按网格逐格放置粒子，每格内随机偏移（0.3~0.7，缩小偏移使分布更均匀） */
    for (var r = 0; r < rows && idx < TOTAL; r++) {
      for (var c = 0; c < cols && idx < TOTAL; c++) {
        var d = types[idx];
        var p = new Particle(d.t, d.i);
        p.x = cellW * (c + 0.3 + Math.random() * 0.4);
        p.y = cellH * (r + 0.3 + Math.random() * 0.4);
        particles.push(p);
        idx++;
      }
    }
  }
  initParticles();

  /* ---------- loop()：动画主循环 ----------
   * 每帧执行：平滑滚动插值 → 清空画布 → 更新+绘制所有粒子 → 请求下一帧
   */
  function loop() {
    if (!running) return;
    /* 滚动平滑插值，让视差移动更柔和（0.08 = 追赶速度） */
    smoothY += (scrollY - smoothY) * 0.08;
    ctx.clearRect(0, 0, W, H);
    var now = performance.now();
    /* 遍历所有粒子：先 update 再 draw，传入时间戳给萤火虫闪烁 */
    for (var i = 0; i < particles.length; i++) { particles[i].update(); particles[i].draw(now); }
    rafId = requestAnimationFrame(loop);
  }

  /* 图片加载完成后启动动画循环 */
  img.onload = function () { imgW = img.naturalWidth || 1; imgH = img.naturalHeight || 1; running = true; loop(); };
  /* 图片已缓存（complete）时直接启动 */
  if (img.complete) { imgW = img.naturalWidth || 1; imgH = img.naturalHeight || 1; running = true; loop(); }

  /* 标签页不可见时暂停动画，节省 CPU/电量 */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { running = false; if (rafId) cancelAnimationFrame(rafId); }
    else if (!running) { running = true; loop(); }
  });
})();
