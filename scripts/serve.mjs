import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const host = "127.0.0.1";
const port = Number(process.env.PORT || 8000);

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

function sendError(res, statusCode, message) {
  res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(message);
}

function resolveRequestPath(urlPath) {
  const pathname = decodeURIComponent((urlPath || "/").split("?")[0]);
  const candidate = pathname === "/" ? "/index.html" : pathname;
  const resolved = path.resolve(root, `.${candidate}`);

  if (!resolved.startsWith(root)) {
    return null;
  }

  if (existsSync(resolved) && statSync(resolved).isDirectory()) {
    const nestedIndex = path.join(resolved, "index.html");
    if (existsSync(nestedIndex)) return nestedIndex;
  }

  return resolved;
}

const server = createServer((req, res) => {
  const filePath = resolveRequestPath(req.url || "/");
  if (!filePath) {
    sendError(res, 403, "Acesso negado.");
    return;
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    sendError(res, 404, "Arquivo nao encontrado.");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": contentType });
  createReadStream(filePath).pipe(res);
});

server.listen(port, host, () => {
  console.log(`Servidor local ativo em http://${host}:${port}`);
  console.log(`Pasta servida: ${root}`);
});

server.on("error", (error) => {
  console.error("Falha ao iniciar o servidor:", error.message);
  process.exit(1);
});
