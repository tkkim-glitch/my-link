export function readLinkForm(form: HTMLFormElement) {
  const data = new FormData(form);
  const title = String(data.get("title") ?? "").trim();
  const address = String(data.get("url") ?? "").trim();

  if (!title) {
    window.alert("제목을 입력해주세요");
    return null;
  }

  if (!address) {
    window.alert("주소를 입력해주세요");
    return null;
  }

  let url: URL;
  try {
    url = new URL(address);
  } catch {
    window.alert("올바른 링크 주소를 입력해 주세요.");
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    window.alert("http:// 또는 https://로 시작하는 주소를 입력해 주세요.");
    return null;
  }

  return { title, url: url.href };
}
