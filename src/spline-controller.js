// Real Spline export, isolated HTML controls, no idle animation loop.
const base = new URL(document.body.dataset.base || './', location.href);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const compact = matchMedia('(max-width: 740px)');
const manual = reduced.matches || compact.matches || navigator.connection?.saveData;
for (const stage of document.querySelectorAll('[data-spline]')) {
  const viewport = stage.querySelector('.spline-viewport');
  const canvas = stage.querySelector('canvas');
  const start = stage.querySelector('.spline-start');
  const loading = stage.querySelector('.spline-loading');
  let app, loadingPromise, inView = false, failed = false, renderFrame = 0, renderUntil = 0;
  function renderFor(ms = 1400) {
    renderUntil = Math.max(renderUntil, performance.now() + ms);
    if (renderFrame || !app || !inView || document.hidden) return;
    const tick = now => {
      renderFrame = 0;
      if (!app || !inView || document.hidden) return;
      app.requestRender();
      if (now < renderUntil) renderFrame = requestAnimationFrame(tick);
    };
    renderFrame = requestAnimationFrame(tick);
  }
  // A bounded render burst covers orbit damping and the 850 ms module transition.
  ['pointerdown','pointermove','pointerup','wheel','keydown'].forEach(type => stage.addEventListener(type, () => renderFor(), {passive:true}));
  const resizeObserver = new ResizeObserver(() => renderFor(500));
  resizeObserver.observe(viewport);
  let pendingMode = stage.dataset.mode || 'system';
  const sendMode = () => viewport.querySelector('iframe')?.contentWindow?.postMessage({type:'edge-spline:set-mode',mode:pendingMode}, '*');
  const onMessage = e => {
    if (e.source !== viewport.querySelector('iframe')?.contentWindow) return;
    if (e.data?.type === 'edge-spline:ready') sendMode();
    if (e.data?.type === 'edge-spline:interacting') renderFor();
    if (e.data?.type === 'edge-spline:mode') { renderFor(); stage.dataset.activeMode = e.data.mode; const hero = stage.closest('.v2-hero'); if (hero) hero.dataset.activeMode = e.data.mode; }
  };
  window.addEventListener('message', onMessage);
  async function load() {
    if (loadingPromise) return loadingPromise;
    start.hidden = true;
    loading.hidden = false;
    failed = false;
    loadingPromise = (async () => {
      try {
        const {Application} = await import('@splinetool/runtime');
        app = new Application(canvas, {renderMode:'manual', htmlContentMode:'sandbox'});
        await app.load(new URL('assets/spline/infrastructure.splinecode?v=light-studio', base).href);
        if (!app.findObjectByName('Infrastructure')) throw new Error('Incomplete scene');
        app.setBackgroundColor(getComputedStyle(stage).backgroundColor);
        renderFor(2400);
        app.setZoom(compact.matches ? .96 : 1.16);
        // The export compiles materials asynchronously. Keep the poster during first paint.
        await new Promise(resolve => setTimeout(resolve, 1100));
        stage.classList.add('spline-ready');
        stage.querySelector('.spline-poster').setAttribute('aria-hidden','true');
        const overlay = viewport.querySelector('iframe');
        if (overlay) overlay.title = 'Интерактивная инфраструктура: облако, CDN и защита';
        stage.dataset.status = 'ready';
        loading.hidden = true;
        sendMode();
        if (!inView || document.hidden) app.stop();
      } catch (error) {
        console.warn('Spline preview could not load', error);
        failed = true;
        app?.dispose(); app = null;
        loading.hidden = true;
        start.hidden = false;
        start.textContent = 'Повторить загрузку 3D';
        stage.dataset.status = 'fallback';
      }
    })();
    await loadingPromise;
    if (failed) loadingPromise = null;
  }
  if (manual) { loading.hidden = true; start.hidden = false; stage.dataset.status = 'poster'; }
  start.addEventListener('click', load);
  const observer = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    if (inView) { if (!manual && !failed) load(); if (!document.hidden) { app?.play(); renderFor(); } }
    else app?.stop();
  }, {rootMargin:'120px'});
  observer.observe(stage);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden || !inView) app?.stop(); else { app?.play(); renderFor(); }
  });
  // An explicit button can also be used by a product story section.
  document.querySelectorAll('[data-show-module]').forEach(button => button.addEventListener('click', () => {
    pendingMode = button.dataset.showModule;
    load().then(sendMode);
    stage.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'center'});
  }));
  window.addEventListener('pagehide', () => { observer.disconnect(); resizeObserver.disconnect(); cancelAnimationFrame(renderFrame); app?.dispose(); window.removeEventListener('message', onMessage); }, {once:true});
}
