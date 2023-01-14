/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { SelectionController, SelectionType } from 'controller/SelectionController';
import { CursorElement } from 'webcomponents';
// declare global {
//   interface WindowEventMap {
//     selectionchange: CustomEvent<selectionEvent>;
//   }
// }

export class CursorController {
  selection: globalThis.Selection;
  range: globalThis.Range;
  cursor: CursorElement;
  isFocus: boolean;
  editor: HTMLElement;
  #selState: SelectionType;
  constructor(editor: HTMLElement) {
    this.isFocus = false;
    this.editor = editor;
    this.#selState = {} as SelectionType;
    this.selection = globalThis.getSelection()!;
    this.range = new globalThis.Range();
    this.cursor = document.createElement('editor-cursor') as CursorElement;
    // console.log(this.cursor, this.cursor);
    editor.tabIndex = -1;
    editor.style.contain = 'strict';
    // this.selectionChange(editor);
    // editor.addEventListener('focus', e => {
    //   this.isFocus = true;
    //   document.body.style.userSelect = 'none';
    //   editor.style.userSelect = 'text';
    // });
    // editor.addEventListener('keydown', e => {
    //   e.preventDefault();
    //   const { key } = e;
    //   console.log('야 좃댓어', key);
    //   if (key === 'ArrowRight') {
    //     if (typeof this.selState.col === 'number') {
    //       console.log('this', this.selState);
    //       this.selState = {
    //         ...this.selState,
    //         col: this.selState.col + 1,
    //       };
    //       console.log('asdf');
    //     }
    //   }
    // });
    // // editor.addEventListener('keyup', e => {

    // //   return false;
    // // });
    // editor.addEventListener('focusout', e => {
    //   this.isFocus = false;
    //   document.body.style.userSelect = '';
    //   editor.style.userSelect = 'none';
    // });
    // editor.addEventListener('selectionchange', (e: CustomEventInit<SelectionType>) => {
    //   // console.log('selectionchange');
    //   if (e.detail) {
    //     this.#selState = e.detail;
    //     console.log('line', e.detail.line);
    //     console.log('col', e.detail.col);
    //     const { position } = e.detail;
    //     editor.appendChild(this.cursor);
    //     this.cursor.style.top = `${position.top}px`;
    //     this.cursor.style.left = `${position.left}px`;
    //     this.cursor.style.height = `${position.height}px`;
    //   }
    // });
  }

  set selState(data: SelectionType) {
    console.log('set selState');
    this.#selState = {
      ...data,
    };
    const { position } = this.#selState;
    this.editor.appendChild(this.cursor);
    this.cursor.style.top = `${position.top}px`;
    this.cursor.style.left = `${position.left}px`;
    this.cursor.style.height = `${position.height}px`;
  }

  get selState() {
    return this.#selState;
  }

  // selectionChange(editor: HTMLElement) {
  //   document.addEventListener('selectionchange', e => {
  //     if (this.isFocus === true) {
  //       editor.dispatchEvent(
  //         new CustomEvent<SelectionType>('selectionchange', {
  //           ...e,
  //           detail: new SelectionController(editor).state,
  //         }),
  //       );
  //     }
  //   });
  // }

  // initialization() {}
}
