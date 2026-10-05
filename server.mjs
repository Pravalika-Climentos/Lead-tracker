import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml' };

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const candidate = normalize(join(root, relative));
    if (!candidate.startsWith(root)) throw new Error('Invalid path');
    const info = await stat(candidate);
    const file = info.isDirectory() ? join(candidate, 'index.html') : candidate;
    const body = await readFile(file);
    response.writeHead(200, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Content-Security-Policy': "default-src 'self'; connect-src 'self' http://localhost:8080 https:; style-src 'self'; script-src 'self'; img-src 'self' data:; frame-ancestors 'none'",
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-Robots-Tag': 'noindex, nofollow'
    });
    response.end(body);
  } catch {
    response.writeHead(404, { 'Content-Type':'text/plain; charset=utf-8', 'Cache-Control':'no-store' });
    response.end('Not found');
  }
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already being used. Open http://localhost:${port} if the tracker is already running, or stop the other application first.`);
    process.exitCode = 1;
    return;
  }
  console.error(`Unable to start the lead tracker: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, () => console.log(`Lead tracker available at http://localhost:${port}`));
