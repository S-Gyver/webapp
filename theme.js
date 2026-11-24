/* ===== ระบบสลับโหมด มืด / สว่าง (ใช้ร่วมกันทุกหน้า) ===== */
(function () {
  var KEY = 'wc-theme';
  var root = document.documentElement;

  function getStored() {
    try {
      var s = localStorage.getItem(KEY);
      return (s === 'dark' || s === 'light') ? s : null;
    } catch (e) { return null; }
  }

  function systemPref() {
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }

  var ICON_MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  var ICON_SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><line x1="12" y1="1.5" x2="12" y2="3.5"/><line x1="12" y1="20.5" x2="12" y2="22.5"/><line x1="4.2" y1="4.2" x2="5.6" y2="5.6"/><line x1="18.4" y1="18.4" x2="19.8" y2="19.8"/><line x1="1.5" y1="12" x2="3.5" y2="12"/><line x1="20.5" y1="12" x2="22.5" y2="12"/><line x1="4.2" y1="19.8" x2="5.6" y2="18.4"/><line x1="18.4" y1="5.6" x2="19.8" y2="4.2"/></svg>';

  function updateButton(theme) {
    var btn = document.getElementById('themeToggleBtn');
    if (!btn) return;
    var isDark = theme === 'dark';
    btn.innerHTML = (isDark ? ICON_SUN : ICON_MOON) +
      '<span class="tt-label">' + (isDark ? 'โหมดสว่าง' : 'โหมดมืด') + '</span>';
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.title = isDark ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    updateButton(theme);
  }

  // ตั้งค่าธีมทันทีก่อนหน้าเว็บแสดงผล (กันหน้าจอกะพริบ)
  apply(getStored() || systemPref());

  window.toggleTheme = function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.classList.add('theme-transition');
    apply(next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
    setTimeout(function () { root.classList.remove('theme-transition'); }, 380);
  };

  function injectButton() {
    if (document.getElementById('themeToggleBtn')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'themeToggleBtn';
    btn.className = 'theme-toggle';
    btn.onclick = window.toggleTheme;

    var navPill = document.querySelector('.ios-nav-pill');
    var host = document.querySelector('.topbar-right') || document.querySelector('.toolbar-controls');

    if (navPill && navPill.parentNode) {
      // หน้าแรก: วางปุ่มไว้ข้างป้าย ม.1 - ม.3
      var wrap = document.createElement('div');
      wrap.className = 'theme-nav-wrap';
      navPill.parentNode.insertBefore(wrap, navPill);
      wrap.appendChild(btn);
      wrap.appendChild(navPill);
    } else if (host) {
      host.insertBefore(btn, host.firstChild);
    } else {
      btn.classList.add('floating');
      document.body.appendChild(btn);
    }
    updateButton(root.getAttribute('data-theme'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }

  // ถ้ายังไม่เคยเลือกเอง ให้เปลี่ยนตามระบบปฏิบัติการอัตโนมัติ
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function () { if (!getStored()) apply(systemPref()); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  // ซิงก์ธีมข้ามแท็บ (เปิดหลายหน้าพร้อมกัน)
  window.addEventListener('storage', function (e) {
    if (e.key === KEY && (e.newValue === 'dark' || e.newValue === 'light')) apply(e.newValue);
  });
})();
