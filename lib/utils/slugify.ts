export function slugify(title: string): string {
  const words = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  return words.slice(0, 3).join('-');
}
