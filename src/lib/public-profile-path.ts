const reservedNames = new Set(["mypage", "stats", "_next", "api", "404", "favicon.ico", "robots.txt", "sitemap.xml"]);

export function publicUsername(value: string) {
  const name = value.toLowerCase();
  return /^[a-z0-9][a-z0-9._-]{0,39}$/.test(name) && !reservedNames.has(name) ? name : "";
}

export function publicProfilePath(username: string) {
  return "/" + encodeURIComponent(username);
}
