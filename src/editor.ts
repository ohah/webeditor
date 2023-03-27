/* eslint-disable no-new */
import { CursorController } from 'controller/CursorController';
import { Input } from 'cursor';
import { logging } from 'debug';

export class Editor {
  public editor: HTMLElement;
  // public input: HTMLTextAreaElement;
  // public cursor: Input.Cursor;
  public interval: ReturnType<typeof setInterval> | undefined;

  constructor(options: any) {
    // this.greeting = '시바';
    this.editor = document.querySelector(options.element);
    this.editor.style.position = 'relative';
    this.editor.style.height = '300px';
    this.editor.classList.add('none');
    // this.editor.style.userSelect = 'none';
    // this.selection = window.getSelection();
    this.editor.innerHTML = '<span class="none">1.asdf</span>';
    this.editor.innerHTML += '<span class="none">2.qwer</span>';
    this.editor.innerHTML += '<span class="none">3.zxcv</span>';
    this.editor.innerHTML += '<span class="none">4.zxcv</span>';
    this.editor.innerHTML += '<div class="none">5.zxcv</div>';
    this.editor.innerHTML += '<span class="none">6.1561891981</span>';
    // this.editor.innerHTML += '<img src="야수.jpg">';
    // this.editor.appendChild(div);
    // new CursorController(this.editor);
    // this.cursor = new Input.Cursor(this.editor);
    // this.editor.innerHTML += '<span>a</span>';
    // this.editor.innerHTML += '<span>A</span>';
    // this.input = document.createElement('textarea');

    // this.input.className = 'o-editor';

    // this.editor.appendChild(this.input);
  }
}
