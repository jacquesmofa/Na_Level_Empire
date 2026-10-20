import { HONEYPOT_FIELD } from '@/lib/forms';

/**
 * Spam trap. Moved off-screen with a plain-looking class (not display:none,
 * which many bots skip). People never see or reach it; bots fill it, and
 * the form then pretends to send without sending anything.
 */
export default function Honeypot() {
  return (
    <div className="hp-guard" aria-hidden="true">
      <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}
