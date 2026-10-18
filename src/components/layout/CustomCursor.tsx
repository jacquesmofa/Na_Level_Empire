import { useEffect, useRef, useState } from 'react';

/** Gold cursor follower: only for a mouse (not touch) and only when the visitor allows motion. */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(fine.matches && !reduce.matches);
    update();
    fine.addEventListener('change', update);
    reduce.addEventListener('change', update);
    return () => {
      fine.removeEventListener('change', update);
      reduce.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let mx = 0, my = 0, rx = 0, ry = 0;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove);
    let raf: number;
    const animate = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={dotRef} aria-hidden="true" className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]" style={{ background: '#C8922A', boxShadow: '0 0 8px rgba(200,146,42,0.8)' }} />
      <div ref={ringRef} aria-hidden="true" className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9998]" style={{ border: '1.5px solid rgba(200,146,42,0.5)' }} />
    </>
  );
}
