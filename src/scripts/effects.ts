// 背景エフェクト共通処理（index / works で共用）
// - ガイドの星：ビューポート中央付近の見出しへ追従
//   ※ rAF を常時回さず、scroll / resize をトリガーに補間 →
//     目標に収束したらループを自動停止する（省電力）。
//     「呼吸」の脈動は CSS アニメ（mn-breath）に移行済み。
// - カーソルトレイル：マウス軌跡に幾何学模様を描画（全消滅でループ停止）
// - fade-up：スクロール出現アニメ（汎用なのでここに集約）

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===== Star scroll guide =====
const star = document.querySelector<HTMLElement>('.mn-star');
if (star && !reduce) {
  const getAnchors = () =>
    [
      document.querySelector('.mn-name'),
      ...Array.from(document.querySelectorAll('.mn-section-num')),
    ].filter(Boolean) as HTMLElement[];
  let anchors = getAnchors();

  // ビューポート中央(42%)に最も近いアンカーの中心Yを目標とする
  const targetY = () => {
    const vc = window.innerHeight * 0.42;
    let best = window.innerHeight * 0.1;
    let bestDist = Infinity;
    for (const el of anchors) {
      const r = el.getBoundingClientRect();
      const c = r.top + r.height / 2;
      const d = Math.abs(c - vc);
      if (d < bestDist) { bestDist = d; best = c; }
    }
    return best;
  };

  let curY = targetY();
  star.style.top = curY + 'px';

  let raf = 0;
  const step = () => {
    const t = targetY();
    const d = t - curY;
    if (Math.abs(d) < 0.5) {
      // 収束したらループ停止（次の scroll / resize で再開）
      curY = t;
      star.style.top = curY + 'px';
      raf = 0;
      return;
    }
    curY += d * 0.085;
    star.style.top = curY + 'px';
    raf = requestAnimationFrame(step);
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(step);
  };

  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', () => { anchors = getAnchors(); kick(); });
  // フォント読み込みでレイアウトが動くことがあるため、ロード後にもう一度
  window.addEventListener('load', () => { anchors = getAnchors(); kick(); });
  kick();
}

// ===== Cursor trail (geometric) =====
// タッチ端末では mousemove が発生しないため初期化しない
const canvas = document.querySelector<HTMLCanvasElement>('.mn-trail-canvas');
const finePointer = window.matchMedia('(pointer: fine)').matches;
if (canvas && !reduce && finePointer) {
  const ctx = canvas.getContext('2d')!;
  let w = 0;
  let h = 0;
  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    // innerWidth はスクロールバーを含むため、canvas の実表示サイズを基準にする
    // （ズレるとカーソルと描画位置が水平方向に数px ずれる）
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  type Shape = { x: number; y: number; life: number; size: number; rotation: number; rotSpeed: number; type: string };
  let shapes: Shape[] = [];
  let running = false;
  const TYPES = ['diamond', 'triangle', 'square'];

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    shapes = shapes.filter((s) => s.life > 0);
    if (!shapes.length) { running = false; return; } // 全消滅でループ停止
    shapes.forEach((s) => {
      s.life -= 0.022;
      s.rotation += s.rotSpeed;
      if (s.life <= 0) return;
      const sz = s.size;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      ctx.globalAlpha = s.life * 0.75;
      ctx.strokeStyle = `rgba(255,255,255,${s.life})`;
      ctx.fillStyle = `rgba(255,255,255,${s.life * 0.12})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      if (s.type === 'diamond') {
        ctx.moveTo(0, -sz); ctx.lineTo(sz, 0); ctx.lineTo(0, sz); ctx.lineTo(-sz, 0); ctx.closePath();
      } else if (s.type === 'triangle') {
        ctx.moveTo(0, -sz); ctx.lineTo(sz * 0.866, sz * 0.5); ctx.lineTo(-sz * 0.866, sz * 0.5); ctx.closePath();
      } else {
        ctx.rect(-sz * 0.6, -sz * 0.6, sz * 1.2, sz * 1.2);
      }
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  };

  window.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.55) return;
    shapes.push({
      x: e.clientX, y: e.clientY, life: 1,
      size: 4 + Math.random() * 7,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.1,
      type: TYPES[Math.floor(Math.random() * TYPES.length)],
    });
    if (shapes.length > 40) shapes.shift();
    if (!running) { running = true; requestAnimationFrame(draw); }
  });
}

// ===== Fade-up on scroll（汎用） =====
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
  const fadeObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          fadeObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  fadeEls.forEach((el) => fadeObs.observe(el));
}
