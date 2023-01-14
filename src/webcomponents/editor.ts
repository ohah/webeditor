/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import { ParseController } from 'controller/ParseController';
import { SelectionController, SelectionType } from 'controller/SelectionController';
import { CursorElement, WebComponent } from 'webcomponents';

/* eslint-disable no-useless-constructor */
class EditorElement extends HTMLElement implements WebComponent {
  content: HTMLIFrameElement;
  textarea: HTMLTextAreaElement;
  isFocus: boolean;
  shadowRoot: ShadowRoot;
  selection: SelectionController;
  static get observedAttributes() {
    return ['c', 'l'];
  }

  constructor() {
    super();
    this.isFocus = false;
    this.content = document.createElement('iframe');
    this.content.style.position = 'relative';
    this.content.style.height = '300px';
    this.content.style.margin = '0px';
    this.content.tabIndex = -1;
    this.textarea = document.createElement('textarea');
    // this.placeholder = '시발롬아';
    this.shadowRoot = this.attachShadow({ mode: 'open' });
    // this.content.innerHTML = this.innerHTML;
    this.shadowRoot.appendChild(this.content);
    this.shadowRoot.appendChild(this.textarea);
    // console.log(this.innerHTML.replace(/\n\s+/g, ''));
    this.content.contentDocument!.body.innerHTML = this.innerHTML;
    this.content.contentDocument!.body.style.margin = '0';
    // const style = document.createElement('style');
    // style.innerText = 'p{margin:0;padding:0}';
    // this.content.contentDocument!.head.appendChild(style);
    // const style = document.adds;
    this.selection = new SelectionController(this.content.contentDocument!);
    // console.log('this.content.contentDocument?.body', this.content.contentDocument instanceof HTMLElement);
    // const parse = new ParseController(this.content.contentDocument!.body);
    this.content.style.border = '0px';
    this.innerHTML = '';
  }

  private selectionchange(e: Event) {
    console.log('e', e);
    // console.log('line', e.detail.line);
    // console.log('col', e.detail.col);
    // document.addEventListener(shadow.eventName, () => {
    //   console.log(shadow.getRange(this.shadowRoot));
    // });
    // this.shadowRoot.dispatchEvent(
    //   new CustomEvent<SelectionType>(shadow.eventName, {
    //     ...e,
    //     detail: state,
    //   }),
    // );
  }

  private render() {}

  public connectedCallback(): void {
    this.content.contentDocument?.addEventListener('selectionchange', this.selection.change.bind(this.selection));
    // throw new Error('Method not implemented.');
  }

  public disconnectedCallback(): void {
    this.content.contentDocument?.removeEventListener('selectionchange', this.selection.change.bind(this.selection));
    // throw new Error('Method not implemented.');
  }

  public adoptedCallback(): void {
    // console.log('??');
    // throw new Error('Method not implemented.');
  }

  public attributeChangedCallback(name: any, oldValue: any, newValue: any): void {
    // console.log('콜백섹스');
    // throw new Error('Method not implemented.');
  }
}
export default EditorElement;
