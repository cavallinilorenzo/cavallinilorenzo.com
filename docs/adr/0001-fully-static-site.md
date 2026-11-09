# Fully static site

Every page is prerendered at build time and the site runs no server-side code: no route handlers, server actions, ISR, proxy/middleware, or Vercel-only services. We host on Vercel Hobby, whose non-commercial terms the Freelance page arguably breaches; staying static keeps a move to Cloudflare (`output: 'export'` plus `_redirects`) a one-day job. A feature that needs a server is rejected or done in the browser. `redirects()` in `next.config.ts` is dropped under `output: 'export'`, so a Cloudflare move needs an equivalent `_redirects` file and its own redirect test.
