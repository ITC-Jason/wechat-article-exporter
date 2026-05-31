export function parseProxyList(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map(line => line.trim())
    .filter(line => line.length > 0 && line.startsWith('http'));
}

export function resolveProxyList(envProxyList: string, privateProxyList: string[] = []): string[] {
  const fromEnv = parseProxyList(envProxyList);
  if (fromEnv.length > 0) {
    return fromEnv;
  }
  return privateProxyList;
}
