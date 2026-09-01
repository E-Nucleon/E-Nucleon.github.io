/* ================================================================
 * api.js — 前后端集成脚本
 * 当后端服务运行时，自动从 API 拉取动态/项目/友链数据替换静态内容。
 * 后端不可用时，保持原有静态 HTML 不变（渐进增强）。
 *
 * 依赖：后端启动后访问 /api/* 接口
 * ================================================================ */
(function () {
  var API = '/api';

  /* 检测后端是否可用：尝试请求 /api/stats，超时则降级为静态站 */
  function checkBackend() {
    return fetch(API + '/stats', { timeout: 3000 })
      .then(function (r) { return r.ok; })
      .catch(function () { return false; });
  }

  /* 加载并渲染动态列表 */
  function loadNews() {
    fetch(API + '/news').then(function (r) { return r.json(); }).then(function (list) {
      if (!list || !list.length) return;
      var ul = document.querySelector('#news .timeline');
      if (!ul) return;
      ul.innerHTML = list.map(function (n) {
        return '<li><time>' + fmtDate(n.pub_date) + '</time><p>' + esc(n.content) + '</p></li>';
      }).join('');
    }).catch(function () {});
  }

  /* 加载并渲染项目卡片 */
  function loadProjects() {
    fetch(API + '/projects').then(function (r) { return r.json(); }).then(function (list) {
      if (!list || !list.length) return;
      var grid = document.querySelector('#projects .projects-grid');
      if (!grid) return;
      grid.innerHTML = list.map(function (p) {
        var tags = (p.tags || '').split(',').filter(Boolean).map(function (t) {
          return '<span class="tag">' + esc(t.trim()) + '</span>';
        }).join('');
        return '<a class="card proj" href="' + esc(p.link) + '" target="_blank" rel="noopener">' +
          '<div class="proj-img"><img src="' + esc(p.image) + '" alt="' + esc(p.title) + '"></div>' +
          '<div class="proj-body"><h3>' + esc(p.title) + '</h3><p>' + esc(p.description) + '</p>' +
          '<div class="tags">' + tags + '</div></div></a>';
      }).join('');
    }).catch(function () {});
  }

  /* 加载并渲染友链卡片 */
  function loadLinks() {
    fetch(API + '/links').then(function (r) { return r.json(); }).then(function (list) {
      if (!list || !list.length) return;
      var grid = document.querySelector('#links .links-grid');
      if (!grid) return;
      grid.innerHTML = list.map(function (l) {
        return '<a class="link-card" href="' + esc(l.url) + '" target="_blank" rel="noopener">' +
          '<div class="link-avatar"><img src="' + esc(l.avatar) + '" alt="' + esc(l.name) + '"></div>' +
          '<div class="link-info"><b>' + esc(l.name) + '</b><span>' + esc(l.url) + '</span></div></a>';
      }).join('');
    }).catch(function () {});
  }

  /* 在社交区添加联系表单（后端可用时） */
  function injectContactForm() {
    var social = document.querySelector('#social .social-grid');
    if (!social) return;
    var form = document.createElement('div');
    form.className = 'card';
    form.style.cssText = 'padding:24px;grid-column:1/-1';
    form.innerHTML =
      '<h3 style="margin-bottom:16px;font-size:1.1rem">留言 / 联系</h3>' +
      '<input id="msgName" placeholder="你的名字" style="width:100%;padding:10px 14px;background:var(--card-2);border:1px solid var(--line-soft);border-radius:8px;color:var(--text);margin-bottom:10px;outline:none">' +
      '<input id="msgEmail" placeholder="邮箱（选填）" style="width:100%;padding:10px 14px;background:var(--card-2);border:1px solid var(--line-soft);border-radius:8px;color:var(--text);margin-bottom:10px;outline:none">' +
      '<textarea id="msgContent" placeholder="留言内容…" style="width:100%;min-height:80px;padding:10px 14px;background:var(--card-2);border:1px solid var(--line-soft);border-radius:8px;color:var(--text);margin-bottom:10px;outline:none;resize:vertical"></textarea>' +
      '<button class="btn primary" style="padding:10px 24px" onclick="submitMessage()">发送留言</button>' +
      '<div id="msgResult" style="margin-top:8px;font-size:.85rem"></div>';
    social.appendChild(form);
  }

  /* 提交留言 */
  window.submitMessage = function () {
    var name = document.getElementById('msgName').value.trim();
    var email = document.getElementById('msgEmail').value.trim();
    var content = document.getElementById('msgContent').value.trim();
    var result = document.getElementById('msgResult');
    if (!name || !content) {
      result.textContent = '请填写名字和内容';
      result.style.color = 'var(--red)';
      return;
    }
    fetch(API + '/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, email: email, content: content })
    }).then(function (r) { return r.json(); }).then(function (d) {
      if (d.message) {
        result.textContent = '留言成功！我会尽快查看。';
        result.style.color = 'var(--accent)';
        document.getElementById('msgName').value = '';
        document.getElementById('msgEmail').value = '';
        document.getElementById('msgContent').value = '';
      } else {
        result.textContent = d.error || '发送失败';
        result.style.color = 'var(--red)';
      }
    }).catch(function () {
      result.textContent = '网络错误';
      result.style.color = 'var(--red)';
    });
  };

  /* —— 工具函数 —— */
  function esc(s) { return (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function fmtDate(d) {
    if (!d) return '';
    var dt = new Date(d);
    return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0');
  }

  /* —— 启动：检测后端 → 加载数据 —— */
  checkBackend().then(function (ok) {
    if (!ok) return; // 后端不可用，保持静态内容
    loadNews();
    loadProjects();
    loadLinks();
    injectContactForm();
  });
})();
