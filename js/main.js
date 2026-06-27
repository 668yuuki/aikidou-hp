/* ============================================================
   氣心館 合気道道場 — インタラクション
   ============================================================ */
(function () {
  'use strict';

  /* ---------- ヘッダー: スクロールで背景付与 ---------- */
  var header = document.getElementById('header');
  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- モバイル: ハンバーガーメニュー ---------- */
  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('nav');

  function closeMenu() {
    nav.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'メニューを開く');
  }
  function toggleMenu() {
    var open = nav.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  }
  hamburger.addEventListener('click', toggleMenu);

  // ナビ内リンククリックでメニューを閉じる
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });
  // Escキーで閉じる
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- FAQ: アコーディオン ---------- */
  var faqButtons = document.querySelectorAll('.faq__q');
  faqButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq__item');
      var answer = item.querySelector('.faq__a');
      var isOpen = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
      answer.style.maxHeight = isOpen ? answer.scrollHeight + 'px' : null;
    });
  });
  // リサイズ時に開いているFAQの高さを再計算
  window.addEventListener('resize', function () {
    document.querySelectorAll('.faq__item.is-open .faq__a').forEach(function (a) {
      a.style.maxHeight = a.scrollHeight + 'px';
    });
  });

  /* ---------- スクロール連動フェードイン ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  function forceRevealAll() {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  if ('IntersectionObserver' in window) {
    var observedCount = 0;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
          observedCount++;
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });

    /* プレビュー環境など Observer が発火しない場合のフォールバック */
    setTimeout(function () {
      if (observedCount === 0) forceRevealAll();
    }, 400);
  } else {
    forceRevealAll();
  }

  /* ---------- 擬似フォーム: バリデーション + 完了表示 ---------- */
  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');

  function setError(name, message) {
    var input = form.querySelector('[name="' + name + '"]');
    var errorEl = form.querySelector('.form__error[data-for="' + name + '"]');
    if (errorEl) errorEl.textContent = message || '';
    if (input) input.classList.toggle('is-invalid', !!message);
  }

  function validate() {
    var ok = true;
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();

    if (!name) { setError('name', 'お名前を入力してください。'); ok = false; }
    else { setError('name', ''); }

    if (!email) { setError('email', 'メールアドレスを入力してください。'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('email', 'メールアドレスの形式が正しくありません。'); ok = false; }
    else { setError('email', ''); }

    if (!message) { setError('message', 'お問い合わせ内容を入力してください。'); ok = false; }
    else { setError('message', ''); }

    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // 実送信なし（デモ）
    if (!validate()) {
      var firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    form.querySelectorAll('.form__row').forEach(function (row) { row.hidden = true; });
    form.querySelector('button[type="submit"]').hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* ---------- フッター: 年号 ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
