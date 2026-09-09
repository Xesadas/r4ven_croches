// Fios de Aracne — página única.
const { useState, useEffect, useRef } = React;

const D = window.MM_DATA;
const prefersStill = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Marca pequena: a aranha e o nome, como aparece na logo.
function Wordmark({ spiderSize = 22 }) {
  return (
    <span className="wordmark">
      <Spider size={spiderSize} color="currentColor" accent="var(--pink)" eyes={false} seed={5} />
      <span className="wordmark-text">Fios de Aracne</span>
    </span>
  );
}

function IgIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function WaIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M20.5 12a8.5 8.5 0 0 1-12.7 7.4L3 21l1.6-4.7A8.5 8.5 0 1 1 20.5 12z" strokeLinejoin="round" />
      <path d="M8.6 9.6c.4 2 2.4 4 4.4 4.5l1.4-1.3 2.4 1.2-.5 1.9-1.9.3c-3.4-.3-6.3-3.2-6.6-6.6l.3-1.9 1.9-.5 1.2 2.4-1.4 1.3z" />
    </svg>
  );
}

// ============ HEADER ============
function Header({ onNav }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-inner">
        <a href="#topo" className="brand" onClick={(e) => { e.preventDefault(); onNav('topo'); }} data-cursor-hover>
          <Wordmark />
        </a>
        <nav className="main-nav">
          {[
            ['sobre', 'a artesã'],
            ['catalogo', 'o catálogo'],
            ['feitico', 'o feitiço'],
            ['contato', 'invocar'],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); onNav(id); }} data-cursor-hover>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-right">
          <a href={D.artist.igUrl} target="_blank" rel="noreferrer" className="icon-btn" aria-label="Instagram" data-cursor-hover>
            <IgIcon />
          </a>
          <a href={D.artist.waUrl} target="_blank" rel="noreferrer" className="icon-btn" aria-label="WhatsApp" data-cursor-hover>
            <WaIcon />
          </a>
        </div>
      </div>
    </header>
  );
}

// ============ FIO LATERAL ============
// A aranha desce por um fio ao longo de toda a página: entra no carregamento e
// depois acompanha o scroll. É o único movimento não pedido pela pessoa.
function SilkSpine() {
  const spiderRef = useRef(null);
  const threadRef = useRef(null);

  useEffect(() => {
    if (prefersStill) return;
    let raf = null;
    const update = () => {
      raf = null;
      const max = document.body.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const travel = window.innerHeight - 190;
      const y = 70 + p * travel;
      if (spiderRef.current) spiderRef.current.style.transform = `translateY(${y}px)`;
      if (threadRef.current) threadRef.current.style.height = `${y}px`;
    };
    const onScroll = () => { if (raf === null) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="silk-spine" aria-hidden="true">
      <span className="silk-spine-thread" ref={threadRef}></span>
      <span className="silk-spine-spider" ref={spiderRef}>
        <span className="spider-swing">
          <Spider size={34} color="var(--bone)" accent="var(--pink)" seed={11} />
        </span>
      </span>
    </div>
  );
}

// ============ HERO ============
function Hero({ onPoke }) {
  return (
    <section id="topo" className="hero">
      {/* Rosácea-doily: entra cortada pela viewport, nunca inteira. */}
      <Rosette size={1080} points={12} className="hero-rosette" seed={5} />
      <WebCorner corner="tl" size={300} className="hero-web hero-web-tl" />
      <WebCorner corner="br" size={220} className="hero-web hero-web-br" seed={13} />
      <SparkleField count={70} stars={8} seed={31} className="hero-sparkles" />
      {/* O risco anamórfico sai do brilho do pôster — luz precisa de origem. */}
      <span className="hero-streak" aria-hidden="true"></span>

      <div className="hero-inner">
        <div className="hero-left">
          <p className="hero-signature">feito com amor</p>
          <h1 className="hero-title">
            <span className="line">tudo que eu faço</span>
            <span className="line shadowed">nasce de um fio só</span>
          </h1>
          <p className="hero-sub">
            amigurumis, toucas, tops e broches de crochê — feitos à mão em Goiânia por Raven,
            estudante de arte no IFG. cada peça sai daqui com um pedacinho de mim.
          </p>
          <div className="hero-cta">
            <a href={D.artist.waUrl} target="_blank" rel="noreferrer" className="btn-solid" data-cursor-hover>
              <Heart size={15} />
              encomendar uma peça
            </a>
            <a href="#catalogo" className="btn-line" data-cursor-hover
              onClick={(e) => { e.preventDefault(); const el = document.getElementById('catalogo'); if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' }); }}>
              ver o catálogo
            </a>
          </div>
          <dl className="hero-stats">
            {D.stats.map((s) => (
              <div key={s.label}>
                <dt>{s.value}</dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero-right">
          <figure className="poster" data-cursor-hover>
            <img src="assets/logo-fios-de-aracne.jpg" alt="Fios de Aracne — logo da marca, uma aranha preta sobre rosa" width="1200" height="1200" />
            <button className="poster-poke" onClick={onPoke} aria-label="cutucar a aranha">
              <Sparkle size={14} />
            </button>
          </figure>
        </div>
      </div>
    </section>
  );
}

// ============ SOBRE ============
function Sobre() {
  return (
    <section id="sobre" className="sobre">
      {/* A técnica da própria artesã virada papel de parede: a treliça do filet
          vem do CSS, os blocos cheios resolvem numa aranha só à distância. */}
      <div className="filet-wall" aria-hidden="true">
        <FiletField cell={38} className="filet-motif" />
      </div>
      <div className="section-head">
        <span className="section-num">1</span>
        <h2 className="section-title">a artesã</h2>
        <p className="section-deck">a alma por trás do fio</p>
      </div>

      <div className="sobre-grid">
        <div className="sobre-photo">
          <figure className="photo-frame">
            <img src="assets/raven-muro.jpg" alt="Raven, de cabelo rosa, encostada num muro grafitado, segurando um passarinho de crochê azul" className="photo-img" width="1200" height="1600" />
            <span className="photo-tape tape-1"></span>
            <span className="photo-tape tape-2"></span>
          </figure>
          <figcaption className="photo-caption">eu, num muro de lambes — fio, tinta e atitude</figcaption>
        </div>
        <div className="sobre-text">
          <p className="lead">
            <span className="drop">R</span>aven — 17 anos, estudante do <strong>IFG</strong>,
            apaixonada por transformar linha em coisa viva, com um pezinho no sombrio e outro no delicado.
          </p>
          <p>
            Aprendi crochê sozinha aos 14 anos, perdida entre vídeos, pausas, fios embolados
            e aquela teimosia bonita de quem queria entender com as próprias mãos. Não tinha
            professora nem receita perfeita, só curiosidade e vontade de criar.
          </p>
          <p>
            Com o tempo, o crochê virou mais do que hobby. Virou linguagem. Cada peça que nasce
            aqui carrega detalhe, textura e personalidade, feita ponto por ponto com cuidado e intenção.
          </p>
          <p>
            Trabalho com encomendas e criações personalizadas. Você traz referência, ideia ou
            só uma vibe perdida no Pinterest. A gente conversa, ajusta e transforma tudo em algo
            que pareça ter saído direto da imaginação.
          </p>
          <ul className="obsessoes">
            {D.obsessions.map((o) => (
              <li key={o}><Sparkle size={11} color="var(--pink)" /> {o}</li>
            ))}
          </ul>
        </div>
      </div>
      <ThreadDivider drop seed={4} />
    </section>
  );
}

// ============ CATÁLOGO ============
function Catalogo({ onSelect }) {
  return (
    <section id="catalogo" className="catalogo">
      <div className="section-head">
        <span className="section-num">2</span>
        <h2 className="section-title">o catálogo</h2>
        <p className="section-deck">cada uma com seu nome, sua sina</p>
        <p className="pricing-note">
          <strong>{D.pricing.formula}.</strong> {D.pricing.note}
        </p>
      </div>

      <div className="pieces-grid">
        {D.pieces.map((c) => (
          <article
            key={c.id}
            className={`piece ${c.isCustom ? 'piece--custom' : ''}`}
            onClick={() => onSelect(c)}
            data-cursor="grab">
            <div className="piece-art">
              {c.photo ? (
                <img src={c.photo} alt={c.name} className="piece-photo" loading="lazy" />
              ) : (
                <span className="piece-spider"><Spider size={130} color="var(--bone)" accent="var(--pink)" seed={17} /></span>
              )}
              <span className="piece-tag">
                <HangTag label={c.priceFrom ? c.priceFrom : 'sob medida'} />
              </span>
            </div>
            <div className="piece-meta">
              <h3 className="piece-name">{c.name}</h3>
              <p className="piece-kind">{c.kind}</p>
              <p className="piece-note">{c.note}</p>
              <span className="piece-cta">{c.isCustom ? 'me chama' : 'ver a peça'}</span>
            </div>
          </article>
        ))}
      </div>

      <p className="catalogo-foot">não viu o seu? me chama no direct, a gente desenha do zero</p>
      <ThreadDivider seed={6} />
    </section>
  );
}

// ============ FEITIÇO ============
function Feitico() {
  return (
    <section id="feitico" className="feitico">
      <div className="section-head">
        <span className="section-num">3</span>
        <h2 className="section-title">o feitiço</h2>
        <p className="section-deck">do direct ao pacotinho na sua porta</p>
      </div>

      <ol className="steps">
        {D.process.map((p) => (
          <li key={p.n} className="step">
            <span className="step-num">{p.n}</span>
            <h3 className="step-title">{p.title}</h3>
            <p className="step-text">{p.text}</p>
          </li>
        ))}
      </ol>

      <p className="feitico-note">
        <strong>orçamento:</strong> R$15/hora + custo da linha &nbsp;·&nbsp;
        <strong>envio:</strong> Correios pra todo Brasil &nbsp;·&nbsp;
        <strong>entrega em mãos:</strong> Goiânia e Aparecida, combinamos no direct
      </p>
    </section>
  );
}

// ============ CONTATO ============
// Campo magenta cheio: a composição da logo virada do avesso.
function Contato() {
  return (
    <section id="contato" className="contato">
      {/* O campo rosa também não pode ficar chapado: a mesma gramática, invertida. */}
      <Rosette size={760} points={10} className="contato-rosette" seed={23} />
      <WebCorner corner="tr" size={240} color="rgba(0,0,0,0.30)" className="contato-web" seed={19} />
      <div className="contato-inner">
        <p className="contato-pre">vamos invocar algo juntas?</p>
        <h2 className="contato-title">
          <span className="line">me chama</span>
          <span className="line indent">no direct</span>
        </h2>
        <p className="contato-sub">
          encomendas pelo Instagram ou WhatsApp. respondo na ordem que chega, quase sempre no mesmo dia.
        </p>

        <div className="contato-buttons">
          <a href={D.artist.igUrl} target="_blank" rel="noreferrer" className="channel" data-cursor-hover>
            <span className="channel-icon"><IgIcon size={26} /></span>
            <span className="channel-text">
              <strong>{D.artist.handle}</strong>
              <em>manda a sua ideia no direct</em>
            </span>
          </a>
          <a href={D.artist.waUrl} target="_blank" rel="noreferrer" className="channel" data-cursor-hover>
            <span className="channel-icon"><WaIcon size={26} /></span>
            <span className="channel-text">
              <strong>conversar no WhatsApp</strong>
              <em>respondo no mesmo dia</em>
            </span>
          </a>
        </div>

        <p className="contato-bottom">não trabalho com formulário — gosto de conversar</p>
      </div>
    </section>
  );
}

// ============ RODAPÉ ============
function Footer() {
  return (
    <footer className="site-footer">
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>Fios de Aracne &nbsp;✦&nbsp; feito com amor &nbsp;✦&nbsp; amigurumis e crochê &nbsp;✦&nbsp; Goiânia, GO &nbsp;✦&nbsp;</span>
          ))}
        </div>
      </div>
      <div className="footer-inner">
        <a href="#topo" className="footer-brand" data-cursor-hover>
          <Wordmark spiderSize={28} />
        </a>
        <nav className="footer-links">
          <a href={D.artist.igUrl} target="_blank" rel="noreferrer">{D.artist.handle}</a>
          <a href={D.artist.waUrl} target="_blank" rel="noreferrer">WhatsApp</a>
        </nav>
        <p className="footer-fine">
          © 2026 — todos os bichinhos têm direitos autorais e sonhos próprios.
          <br />
          site feito com café preto, fio rosa e um pouco de feitiço.
        </p>
      </div>
    </footer>
  );
}

// ============ MODAL DA PEÇA ============
function PieceModal({ piece, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!piece) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    if (closeRef.current) closeRef.current.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [piece, onClose]);

  if (!piece) return null;

  const base = D.artist.waUrl.split('?')[0];
  const msg = piece.isCustom
    ? 'Oi Raven! Queria encomendar algo sob medida ✦'
    : `Oi Raven! Queria encomendar a peça ${piece.name} ✦`;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={piece.name}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} ref={closeRef} aria-label="fechar" data-cursor-hover>✕</button>
        <div className="modal-art">
          {piece.photo
            ? <img src={piece.photo} alt={piece.name} className="modal-photo" />
            : <Spider size={200} color="var(--bone)" accent="var(--pink)" seed={23} />}
        </div>
        <div className="modal-info">
          <p className="modal-kicker">{piece.isCustom ? 'sua própria peça' : 'peça do catálogo'}</p>
          <h3 className="modal-name">{piece.name}</h3>
          <p className="modal-kind">{piece.kind}</p>
          <p className="modal-note">{piece.note}</p>
          {piece.desc && <p className="modal-desc">{piece.desc}</p>}
          <dl className="modal-meta">
            <div><dt>preço</dt><dd>{piece.priceFrom ? `a partir de R$ ${piece.priceFrom}` : 'sob medida'}</dd></div>
            <div><dt>tempo</dt><dd>{piece.hours}</dd></div>
            <div><dt>tamanho</dt><dd>{piece.size}</dd></div>
            <div><dt>fio</dt><dd>{piece.yarn}</dd></div>
          </dl>
          <div className="modal-cta">
            <a href={`${base}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noreferrer" className="btn-solid big" data-cursor-hover>
              {piece.isCustom ? 'começar a conversa' : `encomendar a ${piece.name}`}
            </a>
            <small>R$15/hora + linha ✦ orçamento sem compromisso</small>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ EASTER EGG ============
function EasterEgg({ onClose }) {
  return (
    <div className="egg-overlay" onClick={onClose}>
      <div className="egg-inner" onClick={(e) => e.stopPropagation()}>
        <span className="egg-thread"></span>
        <Spider size={120} color="var(--bone)" accent="var(--pink)" seed={29} />
        <h3>você achou a Carlota</h3>
        <p>
          cupom secreto pra quem cutucou a aranha três vezes:
          <strong className="egg-code">ARACNE10</strong>
          10% off na sua primeira encomenda. sem prazo, porque eu esqueci de colocar.
        </p>
        <button onClick={onClose} className="btn-line" data-cursor-hover>obrigada, Carlota</button>
      </div>
    </div>
  );
}

// ============ APP ============
function App() {
  const [selected, setSelected] = useState(null);
  const [egg, setEgg] = useState(false);
  const [pokes, setPokes] = useState(0);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: id === 'topo' ? 0 : el.offsetTop - 60, behavior: 'smooth' });
  };

  const onPoke = () => {
    const n = pokes + 1;
    setPokes(n);
    if (n >= 3) { setEgg(true); setPokes(0); }
  };

  // Revelação das seções: só opacidade, sem deslizar.
  useEffect(() => {
    const els = document.querySelectorAll('[data-fade]');
    if (prefersStill) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="site">
      {/* Único brilho que se mexe: só transform, e só onde cruza os estáticos. */}
      <div className="bg-drift" aria-hidden="true"></div>
      <CrochetCursor />
      <SilkSpine />
      <Header onNav={scrollTo} />
      <main>
        <Hero onPoke={onPoke} />
        <div data-fade><Sobre /></div>
        <div data-fade><Catalogo onSelect={setSelected} /></div>
        <div data-fade><Feitico /></div>
        <div data-fade><Contato /></div>
      </main>
      <Footer />
      <PieceModal piece={selected} onClose={() => setSelected(null)} />
      {egg && <EasterEgg onClose={() => setEgg(false)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
