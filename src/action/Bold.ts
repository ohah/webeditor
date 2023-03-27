/* eslint-disable no-restricted-syntax */
const Bold = (document: DocumentFragment) => {
  const spans = document.querySelectorAll('span');
  for (const span of spans) {
    span.replaceWith(`<strong>${span.textContent}</strong>`);
  }
  return document;
};

export default Bold;
