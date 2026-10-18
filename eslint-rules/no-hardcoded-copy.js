/**
 * Keeps copy and media out of components: everything visible must come from
 * src/content/ so editors can change it in the CMS.
 *
 * Flags, in files under src/blocks, src/components and src/router:
 *   - JSX text containing letters (e.g. <p>Hello</p>)
 *   - string literals for visible attributes: alt, title, placeholder, aria-label
 *   - any string starting with http:// or https:// (image or page URLs)
 */
const VISIBLE_ATTRS = new Set(['alt', 'title', 'placeholder', 'aria-label', 'label']);
const LETTERS = /\p{L}/u;
const URL = /^https?:\/\//;

export default {
  rules: {
    'no-hardcoded-copy': {
      meta: {
        type: 'problem',
        docs: { description: 'Disallow hard-coded copy and URLs in components; use src/content instead.' },
        schema: [],
        messages: {
          text: 'Hard-coded text "{{text}}": move it to src/content/ so editors can change it.',
          attr: 'Hard-coded {{name}}="{{text}}": move it to src/content/.',
          url: 'Hard-coded URL "{{text}}": URLs belong in src/content/ (or src/lib for service endpoints).',
        },
      },
      create(context) {
        const short = (s) => (s.length > 40 ? `${s.slice(0, 37)}...` : s);
        return {
          JSXText(node) {
            const text = node.value.trim();
            if (text && LETTERS.test(text)) context.report({ node, messageId: 'text', data: { text: short(text) } });
          },
          JSXAttribute(node) {
            const name = node.name && node.name.name;
            if (!VISIBLE_ATTRS.has(name) || !node.value) return;
            const v = node.value.type === 'Literal' ? node.value : node.value.expression;
            if (v && v.type === 'Literal' && typeof v.value === 'string' && LETTERS.test(v.value)) {
              context.report({ node, messageId: 'attr', data: { name, text: short(v.value) } });
            }
          },
          Literal(node) {
            if (typeof node.value === 'string' && URL.test(node.value)) {
              context.report({ node, messageId: 'url', data: { text: short(node.value) } });
            }
          },
          TemplateElement(node) {
            if (URL.test(node.value.cooked ?? '')) context.report({ node, messageId: 'url', data: { text: short(node.value.cooked) } });
          },
        };
      },
    },
  },
};
