/* eslint-disable class-methods-use-this */
import { WebComponent } from 'webcomponents';

/* eslint-disable no-useless-constructor */
class CursorElement extends HTMLElement implements WebComponent {
  interval: ReturnType<typeof setInterval> | undefined;
  constructor() {
    super();
  }

  connectedCallback(): void {
    // console.log('Custom square element added to page.');
    this.style.width = '2px';
    // this.style.height = `21px`;
    this.style.position = 'absolute';
    this.style.backgroundColor = '#000000';
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
