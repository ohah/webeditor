/* eslint-disable class-methods-use-this */
import { WebComponent } from 'webcomponents';

export const EditorCursorElement = ({ color }: { color: string }) => {
  const cursor = document.createElement('div');
  cursor.style.width = '5px';
  cursor.style.position = 'absolute';
  cursor.style.backgroundColor = color;
  cursor.style.borderColor = '#000000';
  cursor.style.userSelect = 'none';
  return cursor;
};

/* eslint-disable no-useless-constructor */
class CursorElement extends HTMLElement implements WebComponent {
  interval: ReturnType<typeof setInterval> | undefined;
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['width', 'l'];
  }

  connectedCallback(): void {
    // console.log('Custom square element added to page.');
    this.style.width = '5px';
    // this.style.height = `21px`;
    this.style.position = 'absolute';
    this.style.backgroundColor = 'rgba(100,100,100,0.75)';
    this.style.borderColor = '#000000';
    this.style.userSelect = 'none';
    // this.interval = setInterval(() => {
    //   this.style.visibility = this.style.visibility === 'hidden' ? 'inherit' : 'hidden';
    // }, 500);
  }

  disconnectedCallback(): void {
    // console.log('Custom square element removed from page.');
    clearInterval(this.interval);
  }

  adoptedCallback(): void {
    // console.log('Custom square element moved to new page.');
  }

  attributeChangedCallback(name: any, oldValue: any, newValue: any): void {
    console.log(name, oldValue, newValue);
    // console.log('Custom square element attributes changed.');
  }
}
// customElements.define('editor-cursor', CursorElement);
export default CursorElement;
