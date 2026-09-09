// Custom yarn-ball cursor. Follows mouse, scales on hover, rotates slowly like rolling yarn.
const { useEffect, useRef, useState } = React;

function CrochetCursor() {
  const ref = useRef(null);
  const trailRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    let mx = -100, my = -100, tx = -100, ty = -100;
    let raf;
    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      const target = e.target;
      const isInteractive = target.closest && target.closest('[data-cursor="grab"], a, button, .creature-card, [data-cursor-hover]');
      setHover(!!isInteractive);
    };
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    const tick = () => {
      tx += (mx - tx) * 0.22;
      ty += (my - ty) * 0.22;
      if (ref.current) {
        ref.current.style.transform = `translate(${mx}px, ${my}px)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Cores da logo: novelo magenta com brilho osso.
  const ink = '#000000';
  const yarn = '#fe0190';
  const yarnDark = '#9c0059';
  const highlight = '#ff86c4';

  const size = 36;
  const half = size / 2;

  return (
    <>
      <div ref={trailRef} className="cursor-trail" style={{
        position: 'fixed', left: -14, top: -14, width: 28, height: 28, pointerEvents: 'none',
        zIndex: 9998, mixBlendMode: 'screen',
        opacity: hover ? 0.55 : 0.22, transition: 'opacity .3s',
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: '50%',
          background: `radial-gradient(circle, ${yarnDark}66 0%, transparent 70%)`,
        }}></div>
      </div>
      <div ref={ref} className="cursor-yarn" style={{
        position: 'fixed', left: 0, top: 0, width: size, height: size, pointerEvents: 'none',
        zIndex: 9999, marginLeft: -half, marginTop: -half,
        transition: 'opacity .2s',
      }}>
        <div style={{
          width: '100%', height: '100%',
          transform: `scale(${clicking ? 0.82 : hover ? 1.18 : 1})`,
          transition: 'transform .15s cubic-bezier(.34,1.56,.64,1)',
        }}>
          <svg viewBox="0 0 40 40" width={size} height={size} style={{ overflow: 'visible', display: 'block' }}>
            <defs>
              <radialGradient id="yarnBall" cx="38%" cy="34%" r="68%">
                <stop offset="0%" stopColor={highlight} />
                <stop offset="55%" stopColor={yarn} />
                <stop offset="100%" stopColor={yarnDark} />
              </radialGradient>
              <clipPath id="yarnClip">
                <circle cx="20" cy="20" r="14" />
              </clipPath>
            </defs>
            {/* loose strand trailing off (does not rotate visually because parent rotates too — that's fine, it whips around) */}
            <path
              d="M20 20 Q30 24 34 30 Q36 33 33 35"
              stroke={yarnDark}
              strokeWidth="1.3"
              fill="none"
              strokeLinecap="round"
              opacity="0.9"
            />
            {/* ball body */}
            <circle cx="20" cy="20" r="14" fill="url(#yarnBall)" stroke={ink} strokeWidth="0.8" opacity="0.95" />
            {/* yarn windings — strokes clipped to the ball */}
            <g clipPath="url(#yarnClip)" fill="none" stroke={yarnDark} strokeWidth="0.9" strokeLinecap="round" opacity="0.7">
              <path d="M6 14 Q20 6 34 14" />
              <path d="M6 20 Q20 12 34 20" />
              <path d="M6 26 Q20 18 34 26" />
              <path d="M6 30 Q20 22 34 30" />
              <path d="M10 8 Q22 14 30 32" />
              <path d="M14 6 Q26 16 32 30" />
              <path d="M8 10 Q18 18 24 34" />
              <path d="M28 8 Q22 18 14 34" />
            </g>
            {/* subtle highlight pop */}
            <ellipse cx="15" cy="14" rx="3.2" ry="2.1" fill={highlight} opacity="0.55" />
            {/* hover: extra loop forming */}
            {hover && (
              <circle cx="34" cy="34" r="2.6" fill="none" stroke={yarnDark} strokeWidth="1.1" opacity="0.9" />
            )}
          </svg>
        </div>
      </div>
    </>
  );
}

window.CrochetCursor = CrochetCursor;
