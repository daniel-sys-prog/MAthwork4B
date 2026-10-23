/* ============================================================
   APP.JS — Estatística ODS 18 (design herdado do site de Hipérboles)
   Interações: navbar fixa com glassmorphism, progresso,
   revelação scroll, painéis de detalhe, menu mobile.
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. BARRA DE PROGRESSO
  ---------------------------------------------------------- */
  function initProgress() {
    var bar = document.getElementById('progress');
    if (!bar) return;
    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      bar.style.width = pct + '%';
    }
    document.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ----------------------------------------------------------
     2. NAVBAR — shrink on scroll + active link
  ---------------------------------------------------------- */
  function initNavbar() {
    var navbar  = document.getElementById('navbar');
    var links   = document.querySelectorAll('.nav-link');
    var burger  = document.getElementById('navBurger');
    var mobileMenu = document.getElementById('mobileMenu');
    var mobileClose = document.getElementById('mobileClose');
    var mobileLinks = document.querySelectorAll('.mobile-menu__link');

    if (!navbar) return;

    /* Shrink on scroll */
    function onScroll() {
      if (window.scrollY > 60) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    }
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Active section tracking */
    var sections = Array.prototype.map.call(links, function (a) {
      return document.querySelector(a.getAttribute('href'));
    }).filter(Boolean);

    if (sections.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          links.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
          });
        });
      }, { rootMargin: '-40% 0px -40% 0px' });
      sections.forEach(function (s) { io.observe(s); });
    }

    /* Mobile menu */
    function openMenu() {
      mobileMenu.classList.add('is-open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileMenu.classList.remove('is-open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    if (burger) burger.addEventListener('click', function () {
      if (mobileMenu.classList.contains('is-open')) closeMenu();
      else openMenu();
    });

    if (mobileClose) mobileClose.addEventListener('click', closeMenu);

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ----------------------------------------------------------
     3. REVEAL AO SCROLL
  ---------------------------------------------------------- */
  function initReveal() {
    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

    targets.forEach(function (t) { io.observe(t); });
  }

  /* ----------------------------------------------------------
     4. PAINÉIS DE DETALHE — APLICAÇÕES
  ---------------------------------------------------------- */
  function initDetailPanels() {
    var openCards = document.querySelectorAll('[data-detail]');
    var lastFocused = null;

    function open(name) {
      var panel = document.getElementById('detail-' + name);
      if (!panel) return;
      lastFocused = document.activeElement;
      panel.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      panel.scrollTop = 0;
      var back = panel.querySelector('.detail__back');
      if (back) back.focus();
    }

    function close(name) {
      var panel = document.getElementById('detail-' + name);
      if (!panel) return;
      panel.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    openCards.forEach(function (card) {
      card.addEventListener('click', function () { open(card.dataset.detail); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card.dataset.detail); }
      });
    });

    document.querySelectorAll('[data-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { close(btn.dataset.close); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.detail.is-open').forEach(function (panel) {
        var id = panel.id.replace('detail-', '');
        close(id);
      });
    });
  }

  /* ----------------------------------------------------------
     5. SMOOTH SCROLL PARA LINKS INTERNOS
  ---------------------------------------------------------- */
  function initSmoothScroll() {
    var navbarHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 64;
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ----------------------------------------------------------
     6. CICLO PPDAC — abas interativas (seção Problema)
  ---------------------------------------------------------- */
  var PPDAC = {
    p1:     { t: '<strong>Problema</strong> — definição da pergunta de pesquisa: como se comparam pessoas brancas e pretas ou pardas nos indicadores educacionais do IBGE em 2025 e como isso evoluiu desde 2016?', l: '#problema', n: 'Ver Problema' },
    plano:  { t: '<strong>Plano</strong> — escolha das fontes (PNAD Contínua Educação 2025 e Censo 2022), das variáveis e das medidas estatísticas.', l: '#plano', n: 'Ver Plano e dados' },
    dados:  { t: '<strong>Dados</strong> — levantamento e organização das informações em planilha (formato longo: indicador, ano, grupo, valor, fonte), com conferência das somas.', l: '#plano', n: 'Ver tratamento dos dados' },
    analise:{ t: '<strong>Análise</strong> — tabelas, gráficos e medidas estatísticas (média, mediana, moda, amplitude, variância, desvio-padrão, CV, diferença em p.p. e razão).', l: '#alfabetizacao', n: 'Ver Análise dos dados' },
    concl:  { t: '<strong>Conclusões</strong> — resposta à pergunta, limitações e proposta de intervenção para a escola e a comunidade.', l: '#conclusoes', n: 'Ver Conclusões' }
  };
  function initPpdac() {
    var box = document.getElementById('ppdacText');
    var btns = document.querySelectorAll('#ppdacTabs .toggle-btn');
    if (!box || !btns.length) return;
    function show(k) {
      box.innerHTML = PPDAC[k].t + ' <a href="' + PPDAC[k].l + '" class="inline-link">' + PPDAC[k].n + ' →</a>';
      btns.forEach(function (b) { b.classList.toggle('is-active', b.dataset.step === k); });
      var a = box.querySelector('a');
      a.addEventListener('click', function (e) {
        var t = document.querySelector(a.getAttribute('href')); if (!t) return; e.preventDefault();
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' });
      });
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.step); }); });
    show('p1');
  }

  /* ----------------------------------------------------------
     7. SEQUÊNCIA DE INICIALIZAÇÃO
  ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    if (window.EST_CHARTS) window.EST_CHARTS.init();
    initPpdac();
    initProgress();
    initNavbar();
    initDetailPanels();
    initSmoothScroll();
    initReveal();
  });
})();
