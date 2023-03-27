import './style.css';
import { IData } from 'controller/EventController';
import { $getSelection } from 'utils';
import { CursorElement, EditorElement } from 'webcomponents';
customElements.define('editor-cursor', CursorElement);

const data: IData = {
  root: [
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: 'paragraph',
          format: ['bold'],
        },
        { type: 'linebreak' },
        {
          type: 'text',
          text: '개행',
        },
      ],
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: '굵게',
          format: ['bold'],
        },
      ],
    },
    {
      type: 'heading',
      tag: 'h1',
      children: [
        {
          type: 'text',
          text: 'h1',
        },
      ],
    },
    {
      type: 'heading',
      tag: 'h2',
      children: [
        {
          type: 'text',
          text: 'h2',
        },
      ],
    },
    {
      type: 'heading',
      tag: 'h3',
      children: [
        {
          type: 'text',
          text: 'h3',
        },
      ],
    },
    {
      type: 'heading',
      tag: 'h4',
      children: [
        {
          type: 'text',
          text: 'h4',
        },
      ],
    },
    {
      type: 'heading',
      tag: 'h5',
      children: [
        {
          type: 'text',
          text: 'h5',
        },
      ],
    },
    {
      type: 'heading',
      tag: 'h6',
      children: [
        {
          type: 'text',
          text: 'h6',
        },
      ],
    },
  ],
};

const editor = new EditorElement();
editor.data = data;
document.body.appendChild(editor);
console.log('instance', editor.component.event);

const bold = document.getElementById('bold');
bold?.addEventListener('click', e => {
  e.preventDefault();
  editor.component.dispatchCommand('bold');
});
const selection = $getSelection(editor.component.shadowRoot);
console.log('selection', selection);
// console.log(editor.editor);

document.addEventListener('paste', event => {
  const paste = event.clipboardData?.getData('text/html');
  console.log('paste', paste);
  console.log('types', event.clipboardData?.types);
  // const reversed = Array.from(paste).reverse().join('');

  // const selection = window.getSelection();
  // if (!selection.rangeCount) return false;
  // selection.deleteFromDocument();
  // selection.getRangeAt(0).insertNode(document.createTextNode(reversed));

  event.preventDefault();
});

// console.log('adsf', getComputedStyle(document.createElement('div')));
