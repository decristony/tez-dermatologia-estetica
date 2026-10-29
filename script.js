(() => {
  const nav = document.querySelector('.nav');
  const onS = () => nav.classList.toggle('solid', scrollY > innerHeight * .7);
  addEventListener('scroll', onS, { passive: true }); onS();
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // lente de luz nas letras do hero
  const hero = document.querySelector('.hero');
  const words = [...document.querySelectorAll('.word')];
  let tx = .62, ty = .55, cx = tx, cy = ty, user = false, t0 = performance.now();
  function setLens(x, y) {
    words.forEach(w => {
      const r = w.getBoundingClientRect();
      w.style.setProperty('--lx', ((x - r.left) / r.width * 100) + '%');
      w.style.setProperty('--ly', ((y - r.top) / r.height * 100) + '%');
    });
  }
  hero.addEventListener('pointermove', e => { user = true; tx = e.clientX; ty = e.clientY; });
  hero.addEventListener('pointerleave', () => { user = false; });
  function loop(now) {
    const r = words[0].getBoundingClientRect();
    if (!user) {
      const k = (now - t0) / 1000;
      tx = r.left + r.width * (.5 + .42 * Math.sin(k * .45));
      ty = r.top + r.height * (.55 + .12 * Math.sin(k * .9));
    }
    cx += (tx - cx) * .12; cy += (ty - cy) * .12;
    setLens(cx, cy);
    if (!reduce) requestAnimationFrame(loop);
  }
  { const r = words[0].getBoundingClientRect(); cx = r.left + r.width * .6; cy = r.top + r.height * .55; }
  if (reduce) { const r = words[0].getBoundingClientRect(); setLens(r.left + r.width * .55, r.top + r.height * .5); }
  else requestAnimationFrame(loop);

  // mapa do rosto: lupa + regiões
  const frame = document.getElementById('mapFrame');
  const img = document.getElementById('mapImg');
  const loupe = document.getElementById('loupe');
  const Z = 2.4;
  if (matchMedia('(hover: hover)').matches) {
    frame.addEventListener('pointerenter', () => { frame.classList.add('on'); loupe.style.backgroundImage = `url(${img.currentSrc.includes('600') ? 'assets/mapa-rosto.webp' : img.currentSrc})`; });
    frame.addEventListener('pointerleave', () => frame.classList.remove('on'));
    frame.addEventListener('pointermove', e => {
      const r = frame.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      loupe.style.left = x + 'px'; loupe.style.top = y + 'px';
      // imagem coberta (object-fit: cover; object-position 50% 30%)
      const iw = img.naturalWidth || 999, ih = img.naturalHeight || 1680;
      const s = Math.max(r.width / iw, r.height / ih);
      const dw = iw * s, dh = ih * s, ox = (r.width - dw) * .5, oy = (r.height - dh) * .3;
      loupe.style.backgroundSize = `${dw * Z}px ${dh * Z}px`;
      loupe.style.backgroundPosition = `${-((x - ox) * Z - 95)}px ${-((y - oy) * Z - 95)}px`;
    });
  }
  const zones = [
    { t: 'Testa', d: 'Linhas de expressão horizontais e textura fina, que pioram com sol e com o hábito de franzir.', i: 'Toxina botulínica em dose baixa + laser fracionado leve', s: '1 de toxina, 3 de laser', v: '30 dias entre lasers' },
    { t: 'Pálpebra', d: 'Pele mais fina do rosto: flacidez leve, olheira de pigmento e linhas finas no canto dos olhos.', i: 'Radiofrequência de baixa energia + luz de LED', s: '4 a 6', v: '15 dias' },
    { t: 'Malar', d: 'Perda de volume e de firmeza na maçã do rosto, às vezes com manchas de sol e melasma.', i: 'Ultrassom microfocado e, no melasma, laser de baixa fluência', s: '1 de ultrassom, 4 de laser', v: '1 ano / 21 dias' },
    { t: 'Nariz', d: 'Poros dilatados, oleosidade e pequenos vasos aparentes nas laterais.', i: 'Peeling químico superficial + luz intensa pulsada', s: '3 a 4', v: '30 dias' },
    { t: 'Boca', d: 'Contorno menos definido, linhas verticais acima do lábio e ressecamento.', i: 'Bioestimulador em microdose + skinbooster', s: '2', v: '45 dias' }
  ];
  const panel = document.querySelector('.zone');
  const spots = [...document.querySelectorAll('.spot')];
  function pick(n) {
    spots.forEach((s, i) => s.classList.toggle('act', i === n));
    panel.classList.add('fade');
    setTimeout(() => {
      const z = zones[n];
      zT.textContent = z.t; zD.textContent = z.d; zI.textContent = z.i; zS.textContent = z.s; zV.textContent = z.v;
      panel.classList.remove('fade');
    }, 200);
  }
  spots.forEach(s => s.addEventListener('click', () => pick(+s.dataset.z)));
  spots[0].classList.add('act');
})();
