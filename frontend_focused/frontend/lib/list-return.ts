// Remembers the last list URL (with its filters) during the session, so "Back to
// submissions" on the detail page returns to the same filtered view. Kept in a
// module variable: it only needs to survive client-side navigation, and a full
// reload falls back to the unfiltered list.
let lastListHref = '/submissions';

export function rememberListHref(href: string) {
  lastListHref = href;
}

export function getListHref() {
  return lastListHref;
}
