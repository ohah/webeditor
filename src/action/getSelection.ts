/* eslint-disable no-throw-literal */

import toState from 'action/toState';

/* eslint-disable no-restricted-syntax */
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

const $getSelection = (document: Document) => {
  const selection = document.getSelection();
  if (!selection) throw 'Not Selection';
  const cloneRange = selection?.getRangeAt(0).cloneRange();
  return {
    focusNode: selection?.focusNode,
    focusOffset: selection?.focusOffset,
    type: selection?.type,
    selection,
    cloneRange: cloneRange,
  };
};

const $findNode = (state: ReturnType<typeof toState>) => {
  console.log('ta', state);
};

// function $findNode(treeArray: EditorState, editorSelection: ReturnType<typeof $getSelection>): any {
//   const { focusNode, selection } = editorSelection;
//   for (let i = 0; i < treeArray.children.length; i++) {
//     const node = treeArray.children[i];
//     if (node.dom.isEqualNode(selection.focusNode)) {
//       return {
//         ...node,
//         offset: editorSelection.selection.focusOffset,
//         key: node.key,
//       };
//     }
//     if (node.dom.isEqualNode(selectNode)) {
//       return {
//         ...node,
//         offset: editorSelection.selection.focusOffset,
//         key: node.key,
//       };
//     }
//     if (node.children) {
//       const result = findSubArray(node, editorSelection);
//       if (result) {
//         return {
//           ...result,
//           offset: selection.focusOffset,
//           key: node.key,
//         };
//       }
//     }
//   }
//   // console.log('왜 이게?실행?');
//   return null;
// }

export default $getSelection;
