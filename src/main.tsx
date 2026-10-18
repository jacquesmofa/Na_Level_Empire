import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
// Brand fonts, served from this site (no Google Fonts request). Only the weights in use.
import '@fontsource/bebas-neue/400.css';
import '@fontsource/syne/400.css';
import '@fontsource/syne/600.css';
import '@fontsource/syne/700.css';
import '@fontsource/syne/800.css';
import '@fontsource/dm-sans/300.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import './index.css';
import App from './App.tsx';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
// Pages are prerendered to HTML at build time; React takes over that HTML
// when it was made for this address (the shared 404 page is drawn fresh).
const path = window.location.pathname.replace(/\/+$/, '') || '/';
if (root.hasChildNodes() && root.dataset.path === path) hydrateRoot(root, app);
else {
  root.replaceChildren();
  createRoot(root).render(app);
}
