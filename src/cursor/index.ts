/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-dupe-class-members */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-namespace */

type CursorSelection = Selection & {
  type: 'None' | 'Caret' | 'Range';
};

export namespace Input {
  export class TextArea {
    textarea: HTMLTextAreaElement;
    hook?: (e: KeyboardEvent) => void;
    constructor() {
      this.textarea = document.createElement('textarea');
      this.textarea.addEventListener('keyup', e => {
        if (this.hook) {
          this.hook(e);
        }
      });
    }

    // hook(e: KeyboardEvent, ...args: any) {
    //   // console.log('args', this, e, args);
    //   args.forEach((arg: any) => {
    //     this.textarea.addEventListener('keyup', arg.call(e));
    //     arg.call(e);
    //   });
    // }

    append(element: HTMLElement) {
      element.appendChild(this.textarea);
    }

    focus() {
      this.textarea.focus();
    }
  }
  export class Cursor {
    interval: ReturnType<typeof setInterval> | undefined;
    cursor: HTMLElement[];
    wrapper: HTMLElement;
    editor: HTMLElement;
    textarea: TextArea;
    ranges?: Ranges;
    constructor(editor: HTMLElement) {
      this.editor = editor;
      this.textarea = new TextArea();
      this.textarea.append(this.editor);
      this.ranges = new Ranges();
      this.textarea.hook = e => {
        console.log('e', e);
        if (e.key === 'ArrowRight') {
          console.log('this.ranges?.selection', this.ranges?.selection);
          this.ranges?.selection!.removeAllRanges();
          const range = new Range();
          console.log('this.ranges!.focusNode!', this.ranges!.focusNode!);
          // this.ranges!.focusNode!.textContent = '무야호';
          this.ranges!.focusNode!.nodeValue = 'asdf';
          // range.selectNode(this.ranges!.focusNode!);
          console.log('this.ranges!.nowRange!', this.ranges!.nowRange!);
          this.ranges?.selection!.collapse(this.ranges!.nowRange!.endContainer, this.ranges!.nowRange!.endOffset);
          const { rect, cloneRange } = this.ranges!.getPos();
          this.ranges!.range = cloneRange;
          this.setPosition(rect);
          this.textarea.focus();
          return false;
        }
        if (e.key === 'ArrowLeft') {
        }
        if (this.ranges) {
          // const { range, nowRange, Selection } = this.ranges;
          this.ranges?.range.setStart(this.ranges.range.startContainer, this.ranges.range.startOffset);
          this.ranges?.range.insertNode(document.createTextNode(e.key));
          // if (nowRange && Selection) {
          //   range.setStart(Selection.focusNode!, 0);
          //   range.setEnd(Selection.focusNode!, Selection.focusOffset);
          //   console.log('range', range);
          //   const pos = range.getBoundingClientRect();
          //   this.setPosition(pos);
          // }
        }
      };
      this.wrapper = document.createElement('div');
      this.cursor = [document.createElement('div')];
      this.editor.addEventListener('mouseup', e => {
        e.preventDefault();
        if (this.ranges) {
          const { rect, cloneRange } = this.ranges.getPos();
          this.ranges.range = cloneRange;
          this.setPosition(rect);
          this.textarea.focus();
        }
      });
      this.editor.addEventListener('keyup', e => {});
    }

    Position() {
      return this.ranges;
    }

    get editorPos() {
      return this.editor.getBoundingClientRect();
    }

    setPosition(pos: DOMRect) {
      clearInterval(this.interval);
      const { top, left } = this.editorPos;
      this.cursor[0].style.width = '2px';
      this.cursor[0].style.height = `${pos.height}px`;
      this.cursor[0].style.height = `21px`;
      this.cursor[0].style.position = 'absolute';
      this.cursor[0].style.top = `${pos.top - top}px`;
      this.cursor[0].style.left = `${pos.left + pos.width - left}px`;

      this.cursor[0].style.backgroundColor = '#000000';
      this.cursor[0].style.borderColor = '#000000';
      this.cursor[0].style.userSelect = 'none';
      this.editor.appendChild(this.cursor[0]);
      this.interval = setInterval(() => {
        this.cursor[0].style.visibility = this.cursor[0].style.visibility === 'hidden' ? 'inherit' : 'hidden';
      }, 500);
    }
  }

  export class Ranges {
    selection: Selection | null;
    type: CursorSelection['type'];
    range: globalThis.Range;
    nowRange?: globalThis.Range;
    focusNode?: Node;
    constructor() {
      this.selection = window.getSelection();
      this.type = (window.getSelection()?.type as never) || 'None';
      this.range = new globalThis.Range();
    }

    get isActive() {
      return false;
    }

    /**
     * 클릭한 노드의 텍스트
     * @returns
     */
    selectAllText() {
      const getRange = this.selection?.getRangeAt(0);
      return this.selection?.toString()
        ? this.selection.toString()
        : getRange?.commonAncestorContainer.textContent?.substring(getRange.endOffset, getRange.endOffset + 1);
    }

    selectText() {
      return this.selection?.getRangeAt(0);
    }

    getPos() {
      const cloneRange = this.selection!.getRangeAt(0).cloneRange();
      // this.focusNode = this.selection!;
      this.nowRange = cloneRange;
      const range = new globalThis.Range();
      if (this.type === 'Range' && this.selection) {
        range.setStart(this.selection.focusNode!, 0);
        range.setEnd(this.selection.focusNode!, this.selection.focusOffset);
        return {
          cloneRange,
          rect: range.getBoundingClientRect(),
        };
      }
      if (this.selection?.isCollapsed === true) {
        // range.setStart(cloneRange.startContainer, cloneRange.startOffset);
        // range.insertNode(document.createTextNode('안녕'));
        range.setStart(cloneRange.startContainer, 0);
        range.setEnd(cloneRange.startContainer, cloneRange.startOffset);
        return {
          cloneRange,
          rect: range.getBoundingClientRect(),
        };
      }
      range.setStart(cloneRange.startContainer, 0);
      range.setEnd(cloneRange.endContainer, cloneRange.endOffset);
      return {
        cloneRange,
        rect: range.getBoundingClientRect(),
      };
    }
  }
}
