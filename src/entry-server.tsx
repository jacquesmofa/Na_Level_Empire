/* eslint-disable react-refresh/only-export-components -- build-time entry, never hot-reloaded */
/**
 * Server entry for prerendering (scripts/prerender.ts): renders one URL to
 * HTML and exposes the content the HTML head needs.
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import Root from './Root';

export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url} basename={__BASE_PATH__}>
        <Root />
      </StaticRouter>
    </StrictMode>,
  );
}

export { getCustomPages, getPage, getProjects, getSettings, LOCALES, PAGE_PATHS } from './content';
export { localizePath } from './lib/locale';
export { cld } from './lib/image';
