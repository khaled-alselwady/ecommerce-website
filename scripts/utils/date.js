// Importing the 'dayjs' library from a CDN (Content Delivery Network) URL.
// We use 'import dayjs from ...' instead of 'import { dayjs } from ...' because 'dayjs' is exported as the default export from the module.
// A default export means that the module only exports one thing, which can be imported directly without using curly braces {}.
// Each file can have only one default export. When a module has a default export, we can give it any name during import, but here we use 'dayjs' to match the library's name for clarity.
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export const Now = dayjs();

export function formatDate(date, format) {
  return date.format(format);
}
