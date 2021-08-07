export function jsonToQueryString<T = unknown>(json: T) {
  return Object.keys(json)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(json[key]))
    .join('&');
}
