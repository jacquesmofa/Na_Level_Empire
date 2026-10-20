import { HONEYPOT_FIELD } from '@/lib/forms';

/**
 * Spam trap: a checkbox moved off-screen with a plain-looking class (not
 * display:none, which many bots skip). People never see or reach it; bots
 * tick every box, and the form then pretends to send without sending.
 *
 * It must stay a CHECKBOX. A text field here gets filled by browser autofill
 * and password managers (Chrome ignores autocomplete="off"), which silently
 * dropped real visitors' messages. Browsers never tick checkboxes on their own.
 */
export default function Honeypot() {
  return (
    <div className="hp-guard" aria-hidden="true">
      <input type="checkbox" name={HONEYPOT_FIELD} value="1" tabIndex={-1} autoComplete="off" defaultChecked={false} />
    </div>
  );
}
