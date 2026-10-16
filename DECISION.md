I want to build an HTML, CSS, JS landing page for my resume parser, where I should be able to upload an PDF and get the score out of it. Here I just want to see the score, what skills are present, and what skills are missing. And I'm gonna call this as 0 to shipped resume parser. This is gonna be a mock design, so just build html css is fine, no back-end server is needed

I want to convert this entire project in to react project

## Converting to React

- Tooling: Vite + `@vitejs/plugin-react`, plain JavaScript (no TypeScript) to stay close to the original files.
- The single `app.js` script became one component per section of the page under `src/components/`.
- The mock parser moved to `src/lib/parseResume.js` — still the one function to replace when a real parser exists.
- DOM manipulation (`getElementById`, `classList`, `innerHTML`) became React state in `App.jsx`. `styles.css` is unchanged, only moved next to the code that imports it.
- `index.html` is now just the Vite entry point; the old markup and `app.js` are gone.