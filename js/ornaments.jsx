// Ornamentos da casa — aranhas, teias e fios.
// Tudo traçado com curvas de bézier e uma assimetria proposital: nada de formas
// geométricas empilhadas. As larguras variam ao longo do traço (pernas afinam
// até a ponta, fios afinam nas beiradas) porque teia de verdade não tem calibre.

// Ruído determinístico — mesma semente, mesmo desenho em todo carregamento.
function noise(seed) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}
function jitter(seed, amount) {
  return (noise(seed) - 0.5) * 2 * amount;
}

// Amostra um bézier cúbico e devolve o contorno de um traço que afina.
// É assim que as pernas da aranha ganham ponta sem precisar de gradiente.
function taperedStroke(p0, c1, c2, p3, wStart, wEnd, steps = 18) {
  const left = [];
  const right = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const u = 1 - t;
    const x = u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p3[0];
    const y = u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p3[1];
    const dx = 3 * u * u * (c1[0] - p0[0]) + 6 * u * t * (c2[0] - c1[0]) + 3 * t * t * (p3[0] - c2[0]);
    const dy = 3 * u * u * (c1[1] - p0[1]) + 6 * u * t * (c2[1] - c1[1]) + 3 * t * t * (p3[1] - c2[1]);
    const len = Math.hypot(dx, dy) || 1;
    const w = (wStart + (wEnd - wStart) * t) / 2;
    left.push([x - (dy / len) * w, y + (dx / len) * w]);
    right.push([x + (dy / len) * w, y - (dx / len) * w]);
  }
  const fmt = (p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;
  const out = left.map((p, i) => (i ? 'L' : 'M') + fmt(p)).join(' ');
  const back = right.reverse().map((p) => 'L' + fmt(p)).join(' ');
  return `${out} ${back} Z`;
}

// ============ ARANHA ============
// Corpo em duas bolhas (abdômen em gota, cefalotórax menor) e oito pernas que
// sobem alto antes de descer — o gesto da logo, só que curvo.
function Spider({ size = 120, color = 'var(--void)', accent = 'var(--pink)', eyes = true, seed = 3, className, style }) {
  const legs = [
    { kneeX: 26, kneeY: 44, tipX: 40, tipY: 104, w: 4.6 },
    { kneeX: 38, kneeY: 30, tipX: 58, tipY: 112, w: 5.0 },
    { kneeX: 46, kneeY: 32, tipX: 68, tipY: 122, w: 4.8 },
    { kneeX: 48, kneeY: 46, tipX: 62, tipY: 130, w: 4.2 },
  ];

  const paths = [];
  [-1, 1].forEach((side, s) => {
    legs.forEach((leg, i) => {
      const k = seed + s * 10 + i;
      const attachX = 60 + side * 6;
      const attachY = 66 + i * 3.5;
      const kneeX = 60 + side * (leg.kneeX + jitter(k, 3));
      const kneeY = leg.kneeY + jitter(k + 0.3, 4);
      const tipX = 60 + side * (leg.tipX + jitter(k + 0.6, 4));
      const tipY = leg.tipY + jitter(k + 0.9, 5);
      paths.push(
        taperedStroke(
          [attachX, attachY],
          [attachX + side * 14, attachY - 14],
          [kneeX - side * 4, kneeY - 6],
          [kneeX, kneeY],
          leg.w,
          leg.w * 0.78
        )
      );
      paths.push(
        taperedStroke(
          [kneeX, kneeY],
          [kneeX + side * 8, kneeY + 16],
          [tipX + side * 2, tipY - 34],
          [tipX, tipY],
          leg.w * 0.78,
          0.9
        )
      );
    });
  });

  return (
    <svg
      viewBox="0 0 120 140"
      width={size}
      height={size * (140 / 120)}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false">
      <g fill={color}>
        {paths.map((d, i) => <path key={i} d={d} />)}
        {/* abdômen — gota levemente torta */}
        <path d="M60 60 C78 60 88 74 88 90 C88 108 76 120 60 120 C44 120 32 108 32 90 C32 74 42 60 60 60 Z" />
        {/* cefalotórax */}
        <path d="M60 50 C71 50 77 57 77 64 C77 71 70 76 60 76 C50 76 43 71 43 64 C43 57 49 50 60 50 Z" />
      </g>
      {eyes && (
        <g>
          <ellipse cx="54.5" cy="62" rx="2.6" ry="3.1" fill={accent} />
          <ellipse cx="65.5" cy="62" rx="2.6" ry="3.1" fill={accent} />
          <circle cx="55.2" cy="61" r="0.9" fill="#fff" opacity="0.9" />
          <circle cx="66.2" cy="61" r="0.9" fill="#fff" opacity="0.9" />
        </g>
      )}
      {/* brilho no abdômen, do lado que pega luz */}
      <path d="M48 78 C46 86 47 95 52 102" stroke={accent} strokeWidth="1.6" fill="none" opacity="0.35" strokeLinecap="round" />
    </svg>
  );
}

// ============ TEIA DE CANTO ============
// Raios levemente tortos e espirais que cedem entre um raio e outro, com alguns
// vãos rasgados — teia perfeita é teia de clipart.
function WebCorner({ size = 260, corner = 'tl', color = 'var(--silk)', seed = 7, className, style }) {
  const R = 100;
  const rays = 8;
  const angles = [];
  for (let i = 0; i < rays; i++) {
    angles.push((i / (rays - 1)) * 88 + 1 + jitter(seed + i, 3));
  }
  const pt = (angle, radius) => {
    const rad = (angle * Math.PI) / 180;
    return [Math.cos(rad) * radius, Math.sin(rad) * radius];
  };

  // Os raios afinam até sumir na ponta — traço de cibersigilismo, que é o
  // parente direto do blackletter da marca. Fio de teia não tem calibre.
  const rayPaths = angles.map((a, i) => {
    const end = pt(a, R + jitter(seed + i * 2, 8));
    const mid = pt(a + jitter(seed + i * 3, 5), R * 0.55);
    const c1 = [(2 / 3) * mid[0], (2 / 3) * mid[1]];
    const c2 = [end[0] + (2 / 3) * (mid[0] - end[0]), end[1] + (2 / 3) * (mid[1] - end[1])];
    return taperedStroke([0, 0], c1, c2, end, 1.9, 0.12, 14);
  });

  const rings = [0.22, 0.38, 0.55, 0.72, 0.9];
  const ringPaths = [];
  rings.forEach((ring, r) => {
    let d = '';
    for (let i = 0; i < angles.length - 1; i++) {
      // um vão de vez em quando: a teia está velha
      if (noise(seed + r * 5 + i) > 0.86) { d += ''; continue; }
      const radius = R * ring * (1 + jitter(seed + r + i, 0.06));
      const a0 = pt(angles[i], radius);
      const a1 = pt(angles[i + 1], radius * (1 + jitter(seed + r + i + 0.5, 0.05)));
      const midAngle = (angles[i] + angles[i + 1]) / 2;
      const sag = pt(midAngle, radius * 0.86);
      d += `M${a0[0].toFixed(1)} ${a0[1].toFixed(1)} Q${sag[0].toFixed(1)} ${sag[1].toFixed(1)} ${a1[0].toFixed(1)} ${a1[1].toFixed(1)} `;
    }
    ringPaths.push(d);
  });

  const flip = { tl: '', tr: 'scale(-1,1)', bl: 'scale(1,-1)', br: 'scale(-1,-1)' }[corner] || '';

  return (
    <svg viewBox="0 0 110 110" width={size} height={size} className={className} style={style} aria-hidden="true" focusable="false">
      <g transform={`translate(${corner === 'tr' || corner === 'br' ? 110 : 0}, ${corner === 'bl' || corner === 'br' ? 110 : 0}) ${flip}`}>
        <g fill={color}>
          {rayPaths.map((d, i) => <path key={`r${i}`} d={d} />)}
        </g>
        <g fill="none" stroke={color} strokeLinecap="round">
          {ringPaths.map((d, i) => <path key={`c${i}`} d={d} strokeWidth="0.55" opacity={0.9 - i * 0.08} />)}
        </g>
      </g>
    </svg>
  );
}

// ============ FIO ENTRE SEÇÕES ============
// Um fio que cede no meio, com gotas de orvalho e, às vezes, alguém pendurado.
function ThreadDivider({ color = 'var(--silk)', drop = false, seed = 2 }) {
  const sag = 26 + jitter(seed, 4);
  return (
    <div className="thread-divider" aria-hidden="true">
      <svg viewBox="0 0 1200 70" preserveAspectRatio="none" width="100%" height="70">
        <path
          d={`M0 12 C220 ${12 + sag} 380 ${18 + sag} 600 ${16 + sag} C820 ${14 + sag} 980 ${12 + sag} 1200 10`}
          fill="none"
          stroke={color}
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="330" cy={20 + sag} r="2.4" fill={color} vectorEffect="non-scaling-stroke" />
        <circle cx="860" cy={19 + sag} r="1.8" fill={color} vectorEffect="non-scaling-stroke" />
      </svg>
      {drop && (
        <div className="thread-drop">
          <span className="thread-drop-line"></span>
          <Spider size={26} color="var(--bone)" accent="var(--pink)" seed={9} />
        </div>
      )}
    </div>
  );
}

// ============ ETIQUETA PENDURADA ============
// Etiqueta de papel presa por um fio, no lugar do retângulo recortado de antes.
function HangTag({ label, prefix }) {
  const text = typeof label === 'number' ? `R$ ${label}+` : label;
  const w = Math.max(78, text.length * 9.4 + 34);
  return (
    <div className="hang-tag">
      {prefix && <span className="hang-tag-prefix">{prefix}</span>}
      <svg viewBox={`0 0 ${w} 34`} width={w} height="34" role="img" aria-label={prefix ? `${prefix} ${text}` : text}>
        <path
          d={`M13 3 C9 5 5 10 4 16 C3.4 19 4.6 22 7 25 C9 27.6 11 30 15 30.6 L${w - 8} 31 C${w - 3} 31 ${w - 2} 29 ${w - 2.4} 25 L${w - 3} 9 C${w - 3} 5 ${w - 5} 3 ${w - 9} 3 Z`}
          fill="var(--tag-bg, transparent)"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <circle cx="11" cy="16.5" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.1" />
        <path d="M9 15 C5 12 3 9 5.5 6.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.75" />
        <text x={w / 2 + 5} y="22.5" textAnchor="middle" className="hang-tag-text" fill="currentColor">{text}</text>
      </svg>
    </div>
  );
}

// ============ BRILHO DE 4 PONTAS ============
// O mesmo brilho que já está na logo — curvo, não losango.
function Sparkle({ size = 14, color = 'currentColor', className, style }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" focusable="false">
      <path
        d="M12 0 C12.8 7.2 16.8 11.2 24 12 C16.8 12.8 12.8 16.8 12 24 C11.2 16.8 7.2 12.8 0 12 C7.2 11.2 11.2 7.2 12 0 Z"
        fill={color}
      />
    </svg>
  );
}

// Coração levemente torto, desenhado de um traço só.
function Heart({ size = 14, color = 'currentColor', style }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" focusable="false">
      <path
        d="M12 21.5 C5 16.4 2 12.6 2 8.6 C2 5.4 4.4 3 7.4 3 C9.4 3 11.1 4.1 12 5.9 C12.9 4.1 14.6 3 16.6 3 C19.6 3 22 5.4 22 8.6 C22 12.6 19 16.4 12 21.5 Z"
        fill={color}
      />
    </svg>
  );
}

// ============ ROSÁCEA / DOILY ============
// Doily e rosácea gótica têm a mesma construção: anel central, rodadas
// concêntricas, simetria radial de N pontas e borda com cúspides. Um desenho
// serve às duas referências — que é exatamente o cruzamento desta marca.
// Nunca aparece inteira: entra cortada pela viewport, como luz de estrutura.
function Rosette({ size = 900, points = 12, accentBand = 2, seed = 5, className, style }) {
  const C = 200;
  const bands = [58, 100, 143, 184];
  const pt = (angle, radius) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return [C + Math.cos(rad) * radius, C + Math.sin(rad) * radius];
  };
  const fmt = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  const step = 360 / points;

  // raios: do anel central até a borda, afinando
  const spokes = [];
  for (let i = 0; i < points; i++) {
    const a = i * step + jitter(seed + i, 0.8);
    const p0 = pt(a, bands[0]);
    const p3 = pt(a, bands[3] + 6);
    const mid = pt(a + jitter(seed + i * 2, 1.2), (bands[0] + bands[3]) / 2);
    spokes.push(taperedStroke(p0, mid, mid, p3, 1.5, 0.5, 10));
  }

  // festões: entre um raio e outro, um arco que cede pra dentro e forma cúspide
  const festoons = bands.map((r, b) => {
    let d = '';
    for (let i = 0; i < points; i++) {
      const a0 = i * step;
      const a1 = (i + 1) * step;
      const sag = pt((a0 + a1) / 2, r * (0.82 + jitter(seed + b + i, 0.03)));
      d += `M${fmt(pt(a0, r))} Q${fmt(sag)} ${fmt(pt(a1, r))} `;
    }
    return d;
  });

  // ogivas na banda externa: dois arcos que se encontram numa ponta
  let arches = '';
  for (let i = 0; i < points; i++) {
    const a0 = i * step;
    const a1 = (i + 1) * step;
    const tip = pt((a0 + a1) / 2, bands[3] + 14);
    const base0 = pt(a0, bands[2]);
    const base1 = pt(a1, bands[2]);
    arches += `M${fmt(base0)} Q${fmt(pt(a0 + step * 0.18, bands[3]))} ${fmt(tip)} `;
    arches += `M${fmt(base1)} Q${fmt(pt(a1 - step * 0.18, bands[3]))} ${fmt(tip)} `;
  }

  return (
    <svg viewBox="0 0 400 400" width={size} height={size} className={className} style={style} aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round">
        {festoons.map((d, i) => (
          <path key={`f${i}`} d={d} className={i === accentBand ? 'rosette-accent' : undefined} />
        ))}
        <path d={arches} strokeWidth="0.6" opacity="0.8" />
        <circle cx={C} cy={C} r={bands[0] * 0.42} strokeWidth="0.7" />
        <circle cx={C} cy={C} r={bands[3] + 20} strokeWidth="0.5" opacity="0.55" />
      </g>
      <g fill="currentColor" opacity="0.85">
        {spokes.map((d, i) => <path key={`s${i}`} d={d} />)}
        {/* a cadeia de círculos tangentes que fecha a rosácea */}
        {Array.from({ length: points }).map((_, i) => {
          const p = pt(i * step + step / 2, bands[2]);
          return <circle key={`o${i}`} cx={p[0]} cy={p[1]} r={2.2 + jitter(seed + i, 0.6)} />;
        })}
      </g>
    </svg>
  );
}

// ============ CAMPO DE FILET CROCHÊ ============
// Filet é corrente + ponto alto formando blocos cheios e vazios: um bitmap de
// 1 bit, herdado do lacis do séc. XIV. A treliça vem do CSS (barata); aqui só
// entram os blocos cheios, que à distância resolvem numa aranha.
// Em filet, diagonal se faz com blocos que se tocam pelo canto — é assim que a
// técnica desenha perna de aranha.
const FILET_SPIDER = [
  '#..#.....#..#',
  '.#..#...#..#.',
  '..#..#.#..#..',
  '...#..#..#...',
  '....#####....',
  '...#######...',
  '...#######...',
  '....#####....',
  '...#..#..#...',
  '..#..#.#..#..',
  '.#..#...#..#.',
  '#..#.....#..#',
];

function FiletField({ cell = 34, motif = FILET_SPIDER, className, style }) {
  const cols = motif[0].length;
  const rows = motif.length;
  const blocks = [];
  motif.forEach((line, y) => {
    line.split('').forEach((ch, x) => {
      if (ch === '#') blocks.push([x, y]);
    });
  });

  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      width={cols * cell}
      height={rows * cell}
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false">
      {blocks.map(([x, y], i) => (
        <rect key={i} x={x + 0.08} y={y + 0.08} width="0.84" height="0.84" fill="currentColor" />
      ))}
    </svg>
  );
}

// ============ ORVALHO / POEIRA DE ESTRELAS ============
// Opacidade estratificada em três faixas é o que cria profundidade; opacidade
// uniforme lê como poeira na tela. Sobre preto é a profundidade mais barata que existe.
function SparkleField({ count = 90, stars = 9, seed = 31, className }) {
  const dust = Array.from({ length: count }, (_, i) => {
    const band = i % 3;
    return {
      left: noise(seed + i) * 100,
      top: noise(seed + i + 0.37) * 100,
      size: 1 + band * 0.5,
      opacity: [0.16, 0.26, 0.4][band],
    };
  });
  const big = Array.from({ length: stars }, (_, i) => ({
    left: noise(seed + 200 + i) * 100,
    top: noise(seed + 200 + i + 0.53) * 100,
    size: 7 + noise(seed + 300 + i) * 9,
    pink: noise(seed + 400 + i) > 0.62,
    delay: (noise(seed + 500 + i) * 9).toFixed(2),
    duration: (7 + noise(seed + 600 + i) * 9).toFixed(2),
  }));

  return (
    <div className={`sparkle-field ${className || ''}`} aria-hidden="true">
      {dust.map((d, i) => (
        <span
          key={`d${i}`}
          className="dew"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size, opacity: d.opacity }}
        />
      ))}
      {big.map((s, i) => (
        <span
          key={`s${i}`}
          className="dew-star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            color: s.pink ? 'var(--pink)' : 'var(--bone)',
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}>
          <Sparkle size={s.size} />
        </span>
      ))}
    </div>
  );
}

Object.assign(window, {
  Spider, WebCorner, ThreadDivider, HangTag, Sparkle, Heart,
  Rosette, FiletField, SparkleField, FILET_SPIDER,
  taperedStroke, noise, jitter,
});
