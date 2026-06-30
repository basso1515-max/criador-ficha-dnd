import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const ENV_FILE_CANDIDATES = [".env.local", ".env"];
let didLoadLocalEnv = false;

export function loadLocalEnvOnce(root = process.cwd()) {
  if (didLoadLocalEnv) return;
  didLoadLocalEnv = true;

  for (const fileName of ENV_FILE_CANDIDATES) {
    const filePath = path.resolve(root, fileName);
    if (!existsSync(filePath)) continue;

    try {
      const contents = readFileSync(filePath, "utf8");
      parseEnvFile(contents).forEach(([name, value]) => {
        if (!process.env[name]) {
          process.env[name] = value;
        }
      });
    } catch {
      // Local env loading is best-effort. API handlers still report missing config.
    }
  }
}

function parseEnvFile(contents) {
  return String(contents || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map(parseEnvLine)
    .filter(Boolean);
}

function parseEnvLine(line) {
  const normalizedLine = line.startsWith("export ") ? line.slice("export ".length).trim() : line;
  const separatorIndex = normalizedLine.indexOf("=");
  if (separatorIndex <= 0) return null;

  const name = normalizedLine.slice(0, separatorIndex).trim();
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) return null;

  return [name, stripEnvQuotes(normalizedLine.slice(separatorIndex + 1).trim())];
}

function stripEnvQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"'))
    || (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
