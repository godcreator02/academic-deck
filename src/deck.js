/* ==========================================================================
   deck.js — 约 60 行，零依赖：自适应缩放 + 键盘翻页 + 页码 + 全屏
   用法：页面里放 .stage > .slide（多页选一 .is-active，单页加 .is-solo），
        可选 .hud 显示页码。打印走 CSS @page，与本文件无关。
   ========================================================================== */
(function () {
  'use strict';

  var stage = document.querySelector('.stage');
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  if (!stage || !slides.length) return;

  var hud = document.querySelector('.hud');
  var solo = slides.length === 1;
  var cur = 0;
  slides.forEach(function (s, n) { if (s.classList.contains('is-active')) cur = n; });

  /* ---- 缩放：整台 stage 等比缩放居中，保证 canvas 内部坐标永远是 1280×720 ---- */
  function fit() {
    var pad = 40;
    var k = Math.min((innerWidth - pad) / 1280, (innerHeight - pad) / 720);
    stage.style.setProperty('--fit', Math.max(k, 0.1));
  }

  function show(n) {
    if (solo) return;
    cur = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach(function (s, i) { s.classList.toggle('is-active', i === cur); });
    if (hud) hud.innerHTML = (cur + 1) + '<span class="hud__sep">/</span>' + slides.length;
    if (history.replaceState) history.replaceState(null, '', '#' + (cur + 1));
  }

  function go(d) { show(cur + d); }

  document.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ') { e.preventDefault(); go(1); }
    else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); go(-1); }
    else if (k === 'Home') { e.preventDefault(); show(0); }
    else if (k === 'End') { e.preventDefault(); show(slides.length - 1); }
    else if (k === 'f' || k === 'F') {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
    }
  });

  /* ---- 触屏/鼠标：点右半下一页、左半上一页 ---- */
  stage.addEventListener('click', function (e) {
    if (e.target.closest('a')) return;
    go(e.clientX < innerWidth / 2 ? -1 : 1);
  });

  addEventListener('resize', fit);
  fit();
  if (!solo) show(/^#\d+$/.test(location.hash) ? parseInt(location.hash.slice(1), 10) - 1 : cur);
  else if (hud) hud.style.display = 'none';
})();
