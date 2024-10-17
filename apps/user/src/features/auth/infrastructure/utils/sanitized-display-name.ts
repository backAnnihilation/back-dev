export const sanitizedDisplayName = (name: string) => {
  let sanitized = name
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 30);

  while (sanitized.length < 6) {
    sanitized += '_';
  }

  return sanitized;
};
