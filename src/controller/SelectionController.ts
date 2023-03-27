import { $getSelection, Bold, toState } from 'action';
import { IEditorComponent } from 'decorator/EditorComponent';

const KEY = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Backspace', 'Delete'];
export class SelectionController {
  component: IEditorComponent;
  // state: 'focus' | 'focusin' | 'focusout';
  node?: Node;
  document: Document;
  state: ReturnType<typeof toState>;
  constructor(component: IEditorComponent) {
    this.component = component;
    this.state = toState(this.component.editor);
    const observer = new MutationObserver(e => {
      // console.log(e, this.component.editor);
      this.node = this.component.editor.cloneNode(true);
    });
    observer.observe(this.component.editor, { childList: true, subtree: true, characterData: true, attributes: true });
    this.document = this.component.shadowRoot as never as Document;
    this.component.editor.addEventListener('compositionstart', e => {
      console.log('compositionstart');
    });
    this.component.editor.addEventListener('compositionupdate', e => {
      console.log('compositionupdate');
    });
    this.component.editor.addEventListener('compositionend', e => {
      console.log('compositionend');
    });
    this.component.editor.addEventListener('keydown', async e => {
      e.preventDefault();
      console.log('호출');
      this.state = toState(this.component.editor);
      console.log(this.state());
      const { key, isComposing } = e;
      const { focusNode, focusOffset, type } = $getSelection(this.document);
      if (type === 'Creat') {
      }

      if (isComposing) e.preventDefault();
      // if (e.key === 'Backspace' && this.node?.childNodes.length === 2 && this.node.textContent?.length === 0) {
      //   e.preventDefault();
      // }
      // if (KEY.includes(key)) {
      //   e.preventDefault();
      //   this.document.getSelection()?.modify('move', 'forward', 'character');
      // }
      // if (e.key === 'Backspace') {
      //   shadowDocument.getSelection()?.getRangeAt(0).cloneRange().insertNode(document.createElement('br'));
      // }
      // console.log(e.key, this.component.editor.textContent);
      // console.log(key);
      // if (key === 'Backspace') {
      // }
    });
    document.addEventListener('selectionchange', e => {
      // console.log('shadowDocument.getSelection()', this.document.getSelection());
    });
  }
}
