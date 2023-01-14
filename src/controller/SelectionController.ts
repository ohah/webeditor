/* eslint-disable no-cond-assign */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */

import { CursorElement } from 'webcomponents';

import { ParseController } from './ParseController';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export type CursorSelection = 'None' | 'Caret' | 'Range';
export type SelectionType = Pick<
  InstanceType<typeof SelectionController>,
  'text' | 'type' | 'position' | 'col' | 'line'
>;

/**
 * Throughout, whitespace is defined as one of the characters
 *  "\t" TAB \u0009
 *  "\n" LF  \u000A
 *  "\r" CR  \u000D
 *  " "  SPC \u0020
 *
 * This does not use JavaScript's "\s" because that includes non-breaking
 * spaces (and also some other characters).
 */

/**
 * Determine whether a node's text content is entirely whitespace.
 *
 * @param nod  A node implementing the |CharacterData| interface (i.e.,
 *             a |Text|, |Comment|, or |CDATASection| node
 * @return     True if all of the text content of |nod| is whitespace,
 *             otherwise false.
 */
function is_all_ws(nod: any) {
  return !/[^\t\n\r ]/.test(nod.textContent);
}

/**
 * Determine if a node should be ignored by the iterator functions.
 *
 * @param nod  An object implementing the DOM1 |Node| interface.
 * @return     true if the node is:
 *                1) A |Text| node that is all whitespace
 *                2) A |Comment| node
 *             and otherwise false.
 */

function is_ignorable(nod: any) {
  return (
    nod.nodeType === 8 || // A comment node
    (nod.nodeType === 3 && is_all_ws(nod))
  ); // a text node, all ws
}

/**
 * Version of |previousSibling| that skips nodes that are entirely
 * whitespace or comments. (Normally |previousSibling| is a property
 * of all DOM nodes that gives the sibling node, the node that is
 * a child of the same parent, that occurs immediately before the
 * reference node.)
 *
 * @param sib  The reference node.
 * @return     Either:
 *               1) The closest previous sibling to |sib| that is not
 *                  ignorable according to |is_ignorable|, or
 *               2) null if no such node exists.
 */
function node_before(sib: any) {
  while ((sib = sib.previousSibling)) {
    if (!is_ignorable(sib)) {
      return sib;
    }
  }
  return null;
}

/**
 * Version of |nextSibling| that skips nodes that are entirely
 * whitespace or comments.
 *
 * @param sib  The reference node.
 * @return     Either:
 *               1) The closest next sibling to |sib| that is not
 *                  ignorable according to |is_ignorable|, or
 *               2) null if no such node exists.
 */
function node_after(sib: any) {
  while ((sib = sib.nextSibling)) {
    if (!is_ignorable(sib)) {
      return sib;
    }
  }
  return null;
}

/**
 * Version of |lastChild| that skips nodes that are entirely
 * whitespace or comments. (Normally |lastChild| is a property
 * of all DOM nodes that gives the last of the nodes contained
 * directly in the reference node.)
 *
 * @param sib  The reference node.
 * @return     Either:
 *               1) The last child of |sib| that is not
 *                  ignorable according to |is_ignorable|, or
 *               2) null if no such node exists.
 */
function last_child(par: any) {
  let res = par.lastChild;
  while (res) {
    if (!is_ignorable(res)) {
      return res;
    }
    res = res.previousSibling;
  }
  return null;
}

/**
 * Version of |firstChild| that skips nodes that are entirely
 * whitespace and comments.
 *
 * @param sib  The reference node.
 * @return     Either:
 *               1) The first child of |sib| that is not
 *                  ignorable according to |is_ignorable|, or
 *               2) null if no such node exists.
 */
function first_child(par: any) {
  let res = par.firstChild;
  while (res) {
    if (!is_ignorable(res)) {
      return res;
    }
    res = res.nextSibling;
  }
  return null;
}

/**
 * Version of |data| that doesn't include whitespace at the beginning
 * and end and normalizes all whitespace to a single space. (Normally
 * |data| is a property of text nodes that gives the text of the node.)
 *
 * @param txt  The text node whose data should be returned
 * @return     A string giving the contents of the text node with
 *             whitespace collapsed.
 */
function data_of(txt: any) {
  let data = txt.textContent;
  data = data.replace(/[\t\n\r ]+/g, ' ');
  if (data[0] === ' ') {
    data = data.substring(1, data.length);
  }
  if (data[data.length - 1] === ' ') {
    data = data.substring(0, data.length - 1);
  }
  return data;
}

export class SelectionController {
  selection: globalThis.Selection;
  text: string;
  type: CursorSelection;
  position: Pick<DOMRect, 'height' | 'top' | 'left'>;
  line: number;
  col: number;
  editor: Document;
  cloneRange?: globalThis.Range;
  range?: globalThis.Range;
  cursor: CursorElement;
  constructor(editor: Document) {
    this.cursor = document.createElement('editor-cursor') as CursorElement;
    this.editor = editor;
    this.line = 0;
    this.col = 0;
    this.selection = this.editor.getSelection()!;
    this.text = this.selection.toString();
    // this.cloneRange = this.editor.getSelection()?.getRangeAt(0).cloneRange();
    this.type = this.selection.type as CursorSelection;
    this.position = this.getPos();
    this.editor.addEventListener('keydown', e => {
      e.preventDefault();
      if (e.key === 'ArrowRight') {
        console.log('실행');
        this.Next();
      }
    });
  }

  change() {
    this.position = this.getPos();
    const { state } = this;
    const { position } = state;
    this.cursor.style.top = `${position.top}px`;
    this.cursor.style.left = `${position.left}px`;
    this.cursor.style.height = `${position.height}px`;
    this.editor.body.appendChild(this.cursor);
  }

  get state(): SelectionType {
    const state = JSON.parse(JSON.stringify(this));
    // console.log('state', state);
    delete state.editor;
    delete state.selection;
    delete state.state;
    return JSON.parse(JSON.stringify(this));
  }

  findNextNode(node: Node) {
    // let cur = first_child(this.editor.body);
    // console.log('cur', cur);
    // while (cur) {
    //   if (data_of(cur.firstChild) === node.textContent) {
    //     cur.className = 'magic';
    //     // cur.firstChild.textContent = 'This is the magic paragraph.';
    //   }
    //   cur = node_after(cur);
    // }
    // return cur;

    const walker = document.createTreeWalker(this.editor.documentElement, NodeFilter.SHOW_TEXT, null);
    // this.editor.documentElement.normalize();
    // console.log('walker', walker);
    // while (walker.nextNode()) {
    //   console.log('walker.nextNode', walker.currentNode);
    // }
    while (walker.nextNode()) {
      if (walker.currentNode === node) {
        const nextNode = walker.nextNode();
        if (nextNode?.nodeType === Node.TEXT_NODE) {
          console.log('node.textContent', nextNode?.textContent, nextNode?.textContent?.indexOf('\n'));
          // if (nextNode && nextNode.textContent?.indexOf('\n') !== -1) {
          // nextNode!.textContent! = nextNode?.textContent?.trim() || '';
          // }
        }
        console.log('next', nextNode?.nodeName, nextNode?.nodeValue, nextNode);
        // console.log('next', JSON.stringify(nextNode));
        return nextNode;
        // return walker.nextNode();
        // const nextNode = walker.nextNode();
        // console.log('walker.nextNode()?.textContent', nextNode?.textContent, node.nextSibling);
        // return NextNode(walker.nextNode()!);
        // console.log('섹', walker.nextNode()?.textContent!.trim());
        // let nextNode: ChildNode | Node | null = node.nextSibling;
        // while (nextNode!.nodeType !== 3) {
        //   nextNode = nextNode!.nextSibling;
        // }
        // console.log('node.nextSibling', node.nextSibling);
        // return nextNode!;
        // console.log(nextNode?.textContent);
        // while (nextNode!.textContent!.trim() === '\n') {
        //   nextNode = walker.nextNode();
        // }
        // return nextNode;
      }
    }
    return null;
  }

  Next() {
    // console.log('실행', this);
    if (this.range && this.cloneRange) {
      // console.log('??', this.range.END_TO_END + 1, this.range.endContainer);
      const length = this.range.endContainer.textContent?.length || -1;
      // console.log('this.range.toString()', this.range.toString(), this.cloneRange.endOffset);
      if (length === this.cloneRange.endOffset) {
        const node = this.findNextNode(this.range.endContainer)!;
        console.log('거기', node);
        // this.range.collapse(true);
        this.selection.removeAllRanges();
        this.range.setStartBefore(node);
        this.selection.addRange(this.range);
      } else {
        // console.log('요기?', length, this.cloneRange.endOffset);
        this.range.setStart(this.range.endContainer, this.range.endOffset + 1);
        this.range.collapse(true);
        this.selection.removeAllRanges();
        this.selection.addRange(this.range);
      }

      this.change();
    }
  }

  getPos() {
    const editorRect = this.editor.body.getBoundingClientRect();
    try {
      this.selection = this.editor.getSelection()!;
      this.cloneRange = this.editor.getSelection()!.getRangeAt(0).cloneRange();
      this.range = new globalThis.Range();
      this.type = this.selection.type as CursorSelection;
      if (this.type === 'Range' && this.editor.getSelection()) {
        // console.log('Range');
        this.range.setStart(this.selection.focusNode!, 0);
        this.range.setEnd(this.selection.focusNode!, this.selection.focusOffset);
      } else if (this.type === 'Caret') {
        this.range.setStart(this.cloneRange.startContainer, 0);
        // console.log('Caret', this.cloneRange);
        this.range.setEnd(this.cloneRange.startContainer, this.cloneRange.startOffset);
      } else {
        // console.log('None');
        this.range.setStart(this.cloneRange.startContainer, 0);
        this.range.setEnd(this.cloneRange.endContainer, this.cloneRange.endOffset);
      }

      const { height, top, left, width } = this.range.getBoundingClientRect();
      // this.range.collapsed === true
      //   ? (this.range.startContainer as HTMLElement).getBoundingClientRect()
      //   : this.range.getBoundingClientRect();

      // this.line = (top - editorRect.top) / height - (this.range.collapsed ? 1 : 0);
      const { line, col } = this.getCharactersCountUntilNode(this.cloneRange);
      this.col = col;
      this.line = line;

      return {
        height,
        top: top - editorRect.top,
        left: left + width - editorRect.left,
      };
    } catch (e) {
      return {
        height: 0,
        top: editorRect.top,
        left: editorRect.left,
      };
    }
  }

  getCharactersCountUntilNode(range: globalThis.Range) {
    const node = this.editor === range.endContainer ? range.startContainer : range.endContainer;
    const walker = document.createTreeWalker(this.editor, NodeFilter.SHOW_TEXT, null);
    let found = false;
    let chars = 0;
    let line = 1;
    while (walker.nextNode()) {
      if (walker.currentNode === node) {
        found = true;
        break;
      }
      if (walker.currentNode.textContent?.indexOf('\n')) line += 1;
      chars += walker.currentNode.textContent?.length || 0;
    }
    if (found) {
      return {
        col: range.endOffset + chars,
        line,
      };
    }
    return {
      col: -1,
      line: 1,
    };
  }
}
