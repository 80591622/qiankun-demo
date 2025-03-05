export const fetchResource = url => {
  const res = fetch(url);
  res.text();
}