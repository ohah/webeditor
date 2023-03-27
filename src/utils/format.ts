export const BOLD = 'bold';
export const ITALIC = 'italic';
export const UNDERLINE = 'underline';
export const STRIKETHROUGH = 'strikethrough';

export const $setTextStyle = (node: Text[], format: string, offset?: number) => {
  const first = node.shift();
  const last = node.pop();
  // const [first, ...rest] = node;
  node.forEach(text => {
    // const bold = text.splitText(offset);
    const span = document.createElement('span');
    span.appendChild(text);
    text.parentElement?.insertAdjacentElement('afterend', span);
    console.log('span', span);
    span.classList.add('bold');
  });
  // if (offset && node) {

  //   // node.parentElement?.classList.toggle('bold');
  // } else if (node && node.nodeType === Node.TEXT_NODE) {
  //   node.parentElement?.classList.toggle('bold');
  // }
};
