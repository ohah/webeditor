/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-dupe-class-members */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable class-methods-use-this */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import EventController, { IData } from 'controller/EventController';
import 'reflect-metadata';
import { BOLD } from 'utils/format';

export type EditorSelection = {
  selection: globalThis.Selection;
  selectNode: Node;
  offset: number;
  key: number;
  state: EditorState;
};

export interface EditorState {
  nodeName: string;
  style: string | null;
  text: string | null;
  children: EditorState[];
  dom: ChildNode;
  select: boolean;
  offset: undefined;
  key: number;
}
export interface State {
  root: any[];
  selection: EditorSelection;
  editorState: EditorState;
}

export abstract class AbstractEditorComponent {
  state!: State;
  shadowRoot!: ShadowRoot;
  editor!: HTMLDivElement;
  component!: IEditorComponent;
  data?: IData;
  componentUpdate(_selection?: globalThis.Selection) {}
  componentDidMount() {}
  componentWillUnmount() {}
  componentAdoptedCallback() {}
  componentAttributeChangedCallback(_name: string, _oldvalue: any, _newValue: any) {}
}

export interface IEditorComponent extends EditorElementConstructor {
  editor: HTMLDivElement;
  shadowRoot: ShadowRoot;
  event?: EventController;
  dispatchCommand: (command: string) => {};
}
export interface EditorElementConstructor {
  new (...params: any[]): HTMLElement;
  componentUpdate?: (selection?: globalThis.Selection | null) => void;
  componentDidMount?: () => void;
  componentWillUnmount?: () => void;
  componentAdoptedCallback?: () => void;
  componentAttributeChangedCallback?: (name: any, oldvalue: any, newValue: any) => void;
  [x: string]: any;
}

export interface EditorElementConfig {
  tagName: string;
  style?: string;
  css?: string;
}

function findSubArray(treeArray: EditorState, editorSelection: EditorSelection): any {
  const { selectNode, selection } = editorSelection;
  for (let i = 0; i < treeArray.children.length; i++) {
    const node = treeArray.children[i];
    if (node.dom.isEqualNode(selection.focusNode)) {
      return {
        ...node,
        offset: editorSelection.selection.focusOffset,
        key: node.key,
      };
    }
    if (node.dom.isEqualNode(selectNode)) {
      return {
        ...node,
        offset: editorSelection.selection.focusOffset,
        key: node.key,
      };
    }
    if (node.children) {
      const result = findSubArray(node, editorSelection);
      if (result) {
        return {
          ...result,
          offset: selection.focusOffset,
          key: node.key,
        };
      }
    }
  }
  // console.log('왜 이게?실행?');
  return null;
}

export const updateHandler: ProxyHandler<any> = {
  apply(target, thisArg, argArray) {
    console.log(target, thisArg, argArray);
    return target;
  },
  get(target, p, receiver) {
    console.log('get', target, p, receiver);
    // return Reflect.get(...arguments);
  },
  set(target, p, newValue, _receiver) {
    // console.log('p', p);
    if (p === 'selection') {
      console.log('newValue', newValue);
      const selection = newValue as EditorSelection;
      // target.editorState.find();
      const value = findSubArray(target.editorState, selection);
      console.log('result', value);
      target.selection = value;
      // target.editorState = ;
    }
    console.log('target', target);
    return true;
  },
};

const validateSelector = (selector: string) => {
  if (selector.indexOf('-') <= 0) {
    throw new Error('You need at least 1 dash in the custom element name!');
  }
};

export const dispatchCommand = (component: IEditorComponent, command: string) => {
  const { event } = component;
  // const selection = $getSelection(component.shadowRoot);
  if (event) {
    switch (command) {
      case BOLD:
        component.editor.dispatchEvent(
          new InputEvent('beforeinput', {
            inputType: 'formatBold',
          }),
        );
        break;
      default:
        break;
    }
  }
};

export const EditorComponent = (config: EditorElementConfig) => (cls: EditorElementConstructor) => {
  validateSelector(config.tagName);
  const content = document.createElement('div');
  content.contentEditable = 'true';
  // const connectedCallback = cls.prototype.connectedCallback || ()=>{};
  // const disconnectedCallback = cls.prototype.disconnectedCallback || ()=>{};
  // const Parser = new ParseController();
  // const key = 0;
  cls.prototype.connectedCallback = function () {
    const shadow = this.attachShadow({ mode: 'open' });
    // console.log('config', config);
    if (config.css) {
      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = config.css;
      (<Document>shadow).append(link);
    }
    // <Document>shadow;
    const Dom = new DOMParser().parseFromString(this.innerHTML, 'text/html');
    const domBody = Dom.documentElement.querySelector('body')!;
    const fragment = document.createDocumentFragment();
    fragment.appendChild(domBody);
    content.append(...domBody.childNodes);
    // console.log('shadow', shadow);
    this.shadowRoot = shadow;
    this.dispatchCommand = (command: string) => {
      dispatchCommand(this, command);
    };
    // this.innerHTML = '';
    // this.appendChild(content);
    this.editor = content;
    // this.editor.appendChild(content);
    shadow.appendChild(content);
    if (content) {
      this.event = new EventController(this);
      // this._event = new EventController(this);
      // this.selection = new SelectionController(this);
    }

    this.EditorHandler = () => {
      console.log('this', this.selection);
    };

    if (this.componentWillMount) {
      this.componentWillMount();
    }
    // connectedCallback.call(this);
    if (this.componentDidMount) {
      this.componentDidMount();
    }
    this.component = this;
  };

  cls.prototype.disconnectedCallback = function () {
    if (this.componentWillUnmount) {
      this.componentWillUnmount();
    }
    // disconnectedCallback.call(this);
    if (this.componentDidUnmount) {
      this.componentDidUnmount();
    }
  };
  cls.prototype.adoptedCallback = function () {
    if (this.componentAdoptedCallback) {
      this.componentAdoptedCallback();
    }
  };

  cls.prototype.attributeChangedCallback = function (name: any, oldValue: any, newValue: any) {
    if (this.componentAttributeChangedCallback) {
      this.componentAttributeChangedCallback(name, oldValue, newValue);
    }
  };

  window.customElements.define(config.tagName, cls);
};
