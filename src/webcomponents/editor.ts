/* eslint-disable max-classes-per-file */
/* eslint-disable constructor-super */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-useless-constructor */

import { IData } from 'controller/EventController';
import { AbstractEditorComponent, EditorComponent, IEditorComponent, State } from 'decorator/EditorComponent';

@EditorComponent({
  tagName: 'simple-editor',
  // style: '<style>으아</style>',
  css: '/src/css/editor.css',
})
class EditorElement extends HTMLElement implements AbstractEditorComponent {
  state!: State;
  editor!: HTMLDivElement;
  shadowRoot!: ShadowRoot;
  component!: IEditorComponent;
  data?: IData;
  constructor() {
    super();
  }

  componentUpdate(selection?: Selection | undefined): void {
    // throw new Error('Method not implemented.');
    console.log('selection', selection);
  }

  componentDidMount(): void {
    // throw new Error('Method not implemented.');
  }

  componentWillUnmount(): void {
    // throw new Error('Method not implemented.');
  }

  componentAdoptedCallback(): void {
    // throw new Error('Method not implemented.');
  }

  componentAttributeChangedCallback(_name: string, _oldvalue: any, _newValue: any): void {
    // throw new Error('Method not implemented.');
  }

  static get observedAttributes() {
    return ['c', 'l'];
  }
}
export default EditorElement;
