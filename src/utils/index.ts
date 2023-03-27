/* eslint-disable react/destructuring-assignment */
import { EditorState } from 'controller/EventController';
import { IEditorComponent } from 'decorator/EditorComponent';
import { $setTextStyle } from 'utils/format';

/* eslint-disable @typescript-eslint/no-unused-vars */
export function createUID(): string {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5);
}

/**
 * @param root ShadowRoot
 * @returns { Selection } Selection
 */
export const $getSelection = (root: ShadowRoot | Document): Selection => {
  return (root as Document).getSelection()!;
};

export function $findTextNode(node: Node): Node | null {
  if ((node && node.nodeType === Node.TEXT_NODE) || (node && (node as Element).tagName === 'BR')) {
    return node;
  }

  for (let i = 0; i < node?.childNodes.length; i += 1) {
    const childNode = node?.childNodes[i];
    const foundTextNode = $findTextNode(childNode);
    if (foundTextNode) {
      return foundTextNode;
    }
  }

  return null;
}

class $getRangeNode {
  startContainer: Node | null;
  endContainer: Node | null;
  currentNode: Node | null;
  max = 0;
  constructor(startContainer: Node | null, endContainer: Node | null) {
    this.startContainer = startContainer;
    this.endContainer = endContainer;
    this.currentNode = null;
  }

  getAllNode() {
    const allNode: Text[] = [];
    while (!this.currentNode?.isEqualNode(this.endContainer)) {
      if (this.currentNode === null) {
        this.currentNode = this.startContainer;
      } else if ((<Element>this.currentNode).tagName === 'BR' && this.currentNode.nextSibling) {
        this.currentNode = $findTextNode(this.currentNode.nextSibling);
      } else if (this.currentNode?.parentElement?.nextSibling) {
        this.currentNode = $findTextNode(this.currentNode.parentElement?.nextSibling);
      } else if (this.currentNode?.parentElement?.parentElement?.nextElementSibling) {
        this.currentNode = $findTextNode(this.currentNode.parentElement.parentElement.nextElementSibling);
      }
      if (this.currentNode?.nodeType === Node.TEXT_NODE) {
        allNode.push(this.currentNode as Text);
      }
    }
    this.currentNode = null;
    return allNode;
  }

  nextNode() {
    const result = !this.currentNode?.isEqualNode(this.endContainer);
    if (this.currentNode === null) {
      this.currentNode = this.startContainer;
      return true;
    }

    if ((<Element>this.currentNode).tagName === 'BR' && this.currentNode.nextSibling) {
      this.currentNode = $findTextNode(this.currentNode.nextSibling);
    } else if (this.currentNode?.parentElement?.nextSibling) {
      this.currentNode = $findTextNode(this.currentNode.parentElement?.nextSibling);
    } else if (this.currentNode?.parentElement?.parentElement?.nextElementSibling) {
      this.currentNode = $findTextNode(this.currentNode.parentElement.parentElement.nextElementSibling);
    }

    // this.max += 1;
    // if (this.max === 1000) {
    //   return false;
    // }
    return result;
  }

  firstNode() {
    return this.currentNode?.isEqualNode(this.startContainer);
  }

  lastNode() {
    return this.currentNode?.isEqualNode(this.endContainer);
  }
}

export const $getEditingNode = (component: IEditorComponent) => {
  const selection = $getSelection(component.shadowRoot);
  const range = selection.getRangeAt(0).cloneRange();
  const { commonAncestorContainer, endContainer, startContainer, endOffset, startOffset } = range;
  const map = component.event?.data.weakMap as WeakMap<HTMLElement | Text | Node, ReturnType<typeof EditorState>>;
  const start = map.get(startContainer);
  const end = map.get(endContainer);
  // $getRangeJSON(component, startContainer, endContainer);
  // const node: ChildNode | null | undefined | Node = startContainer;
  const selectNode = new $getRangeNode(startContainer, endContainer);
  const nodes = selectNode.getAllNode();
  $setTextStyle(nodes, 'bold', startContainer);
  // console.log('endContainer', endContainer);
  // const nodeSearch = selectNode;
  // const changeNode: { node: Text; offset?: number }[] = [];
  // while (selectNode.nextNode()) {
  //   if (selectNode.firstNode()) {
  //     changeNode.push({ node: selectNode.currentNode as Text, offset: startOffset });
  //     // $setTextStyle(selectNode.currentNode as Text, 'bold', startOffset);
  //   } else if (selectNode.lastNode()) {
  //     changeNode.push({ node: selectNode.currentNode as Text, offset: endOffset });
  //   } else {
  //     changeNode.push({ node: selectNode.currentNode as Text });
  //   }
  // }
};

export function getRangeNode(range: Range) {
  const { commonAncestorContainer, endContainer, startContainer, endOffset, startOffset } = range;
  let isStart = false;
  const tree = document.createTreeWalker(commonAncestorContainer, NodeFilter.SHOW_TEXT, null);
  const clone = range.cloneContents();
  const cloneTree = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (node.childNodes.length === 1) {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_SKIP;
    },
  });
  while (cloneTree.nextNode()) {
    console.log('cloneTree', cloneTree.currentNode);
  }
  console.log(clone);
  // range.deleteContents();
  while (tree.nextNode()) {
    if (isStart) {
      // const strong = document.createElement('strong');
      // tree.currentNode.parentElement?.replaceWith(strong);
      // strong.appendChild(tree.currentNode);
    }

    if (startContainer.isEqualNode(tree.currentNode)) {
      isStart = true;
      // const split = tree.currentNode.textContent?.substring(0, startOffset);
      // const last = tree.currentNode.textContent?.substring(startOffset);
      // const element = tree.currentNode.parentElement;
      // element?.remove();
      // element?.appendChild(document.createTextNode(split || ''));

      // const strong = document.createElement('strong');
      // strong.appendChild(document.createTextNode(last || ''));
      // element?.parentElement?.appendChild(strong);
    }

    if (endContainer.isEqualNode(tree.currentNode)) break;
  }
}
