/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable array-callback-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-loop-func */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
import { IEditorComponent } from 'decorator/EditorComponent';
import { $getEditingNode } from 'utils';
import { BOLD } from 'utils/format';
import { isArrowDown, isArrowLeft, isArrowRight, isArrowUp } from 'utils/key';

export interface IData {
  root: EditorNode[];
}

export enum Tag {
  PARAGRAPH = 'paragraph',
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
}

export enum FormatTag {
  LINEBREAK = 'br',
  SPAN = 'span',
  BOLD = 'strong',
  UNDERLINE = 'u',
  ITALIC = 'em',
  STRIKETHROUGH = 'strike',
}

export const InnerFormatType = {
  bold: 'strong',
  italic: 'em',
  // 웹접근성 고려 안함
  underline: 'u',
  strikethrough: 'strike',
} as const;
export type formatType = keyof typeof InnerFormatType;
export type TagType = `${Tag}`;

export interface EditorNode {
  children?: EditorNode[];
  type?: string;
  tag?: TagType;
  format?: formatType[];
  text?: string;
  indent?: number;
  url?: string;
  target?: string;
}
const textInput = (e: Event) => {
  // console.log('textInput', e);
};

const input = (e: Event) => {
  // e.preventDefault();
  // console.log('input', e);
};
const beforeinput = (e: InputEvent, component: IEditorComponent) => {
  e.preventDefault();
  e.stopPropagation();
  const getTargetRanges = e.getTargetRanges()[0];
  console.log('getTargetRanges', getTargetRanges);
  // getTargetRanges
  console.log('beforeInput', e);
  const { inputType } = e;
  switch (inputType) {
    case 'insertFromYank':
    case 'insertFromDrop':
    case 'insertReplacementText': {
      break;
    }

    case 'insertFromComposition': {
      // This is the end of composition
      break;
    }

    case 'insertLineBreak': {
      // Used for Android
      break;
    }

    case 'insertParagraph': {
      break;
    }

    case 'insertFromPaste':
    case 'insertFromPasteAsQuotation': {
      // dispatchCommand(editor, PASTE_COMMAND, event);
      break;
    }

    case 'deleteByComposition': {
      break;
    }

    case 'deleteByDrag':
    case 'deleteByCut': {
      break;
    }

    case 'deleteContent': {
      break;
    }

    case 'deleteWordBackward': {
      break;
    }

    case 'deleteWordForward': {
      break;
    }

    case 'deleteHardLineBackward':
    case 'deleteSoftLineBackward': {
      break;
    }

    case 'deleteContentForward':
    case 'deleteHardLineForward':
    case 'deleteSoftLineForward': {
      break;
    }

    case 'formatStrikeThrough': {
      break;
    }

    case 'formatBold': {
      e.preventDefault();
      $getEditingNode(component);
      break;
    }

    case 'formatItalic': {
      break;
    }

    case 'formatUnderline': {
      break;
    }

    case 'historyUndo': {
      break;
    }

    case 'historyRedo': {
      break;
    }

    default:
    // NO-OP
  }
};
const keydown = (e: KeyboardEvent, editor: IEditorComponent) => {
  // e.preventDefault();
};

const compositionstart = (e: CompositionEvent) => {
  // console.log('compositionstart');
  // e.preventDefault();
};
const compositionupdate = (e: CompositionEvent) => {
  // console.log('compositionupdate');
  // e.preventDefault();
};
const compositionend = (e: CompositionEvent) => {
  // console.log('compositionend');
  // e.preventDefault();
};
const selection = (editor: EventController) => {
  const { document: shadowRootDocument, component } = editor;
  const { dispatchCommand } = component;
  return {
    change(e: Event) {},
  };
};
const observer = new MutationObserver(e => {
  // console.log('observer event');
});

export const keyState = {
  key: 0,
  increase() {
    return this.key++;
  },
};

export const convertDOM = (item: EditorNode, map: WeakMap<HTMLElement | Text, ReturnType<typeof EditorState>>) => {
  let element!: HTMLElement | Text;
  let children: any[] = [];
  const key = keyState.increase();
  if (item.type === 'paragraph') {
    element = document.createElement('p');
  } else if (item.type === 'heading') {
    element = document.createElement(item.tag!);
  } else if (item.type === 'text') {
    const span = document.createElement('span');
    // element = document.createTextNode(item.text || '');
    span.appendChild(document.createTextNode(item.text || ''));
    element = span;
  } else if (item.type === 'linebreak') {
    element = document.createElement('br');
  }
  if (item.children) {
    children = item.children.map(item => convertDOM(item, map));
    children.forEach(ele => {
      element?.appendChild(ele.element);
    });
  }
  const result = {
    key,
    element,
    children,
  };
  map.set(element, result);
  return result;
};

export const EditorState = (data: IData) => {
  const weakMap = new WeakMap<HTMLElement | Text, ReturnType<typeof EditorState>>();
  return {
    json: data,
    weakMap: weakMap,
    _data: data?.root?.map(item => convertDOM(item, weakMap)),
    toHtml() {
      const fragment = document.createDocumentFragment();
      this._data?.flatMap(item => {
        fragment.appendChild(item.element);
      });
      return fragment;
    },
  };
};

class EventController {
  component: IEditorComponent;
  document: Document;
  selectionchange: (e: Event) => void;
  beforeinput: (e: InputEvent) => void;
  keydown: (e: KeyboardEvent) => void;
  observer: MutationObserver;
  data: ReturnType<typeof EditorState>;
  constructor(component: IEditorComponent) {
    this.component = component;
    this.document = this.component.shadowRoot as never as Document;
    this.observer = observer;
    this.selectionchange = selection(this).change;
    this.beforeinput = e => beforeinput(e, this.component);
    this.keydown = e => keydown(e, this.component);
    this.initEvent();
    this.data = EditorState(this.component.data);
    this.component.editor.appendChild(this.data.toHtml());
  }

  initEvent() {
    this.component.editor.addEventListener('textInput', textInput);
    this.component.editor.addEventListener('input', input);
    this.component.editor.addEventListener('beforeinput', this.beforeinput);
    this.component.editor.addEventListener('keydown', this.keydown);
    this.component.editor.addEventListener('compositionstart', compositionstart);
    this.component.editor.addEventListener('compositionupdate', compositionupdate);
    this.component.editor.addEventListener('compositionend', compositionend);
    this.observer.observe(this.component.editor, { childList: true, subtree: true, characterData: true, attributes: true });
    document.addEventListener('selectionchange', this.selectionchange);
  }

  removeEvent() {
    this.component.editor.removeEventListener('textInput', textInput);
    this.component.editor.removeEventListener('input', input);
    this.component.editor.removeEventListener('beforeinput', this.beforeinput);
    this.component.editor.addEventListener('keydown', this.keydown);
    this.component.editor.removeEventListener('compositionstart', compositionstart);
    this.component.editor.removeEventListener('compositionupdate', compositionupdate);
    this.component.editor.removeEventListener('compositionend', compositionend);
    document.removeEventListener('selectionchange', this.selectionchange);
    this.observer.disconnect();
  }

  get selection() {
    const selection = this.document.getSelection();
    // console.log('selection', selection?.getRangeAt(0)?.cloneRange());
    return {
      selection,
      range: selection?.getRangeAt(0)?.cloneRange(),
      anchorNode: selection?.anchorNode,
      anchorOffset: selection?.anchorOffset,
      EditorState: this.data,
      type: selection?.type,
    };
  }
}

export default EventController;
