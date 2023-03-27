/* eslint-disable func-names */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
const toState = (node: ChildNode) => {
  let key = 0;
  return () => {
    if (node.nodeValue && node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim() !== '') {
      return {
        nodeName: node.nodeName,
        style: null,
        text: node.textContent,
        children: [],
        dom: node,
        select: false,
        offset: undefined,
        key: key++,
      };
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const { children } = <Element>node;
      const nodeObj = {
        nodeName: node.nodeName,
        style: node instanceof HTMLElement ? node.style.cssText : null,
        text: node instanceof Text ? node.textContent : null,
        children: new Array(children.length),
        dom: node,
        select: false,
        offset: undefined,
        key: key++,
      };
      if (children.length > 0) {
        Array.from(children).forEach((node, i) => {
          nodeObj.children[i] = toState(node);
        });
      } else if (node.hasChildNodes()) {
        Array.from(node.childNodes).forEach((node, i) => {
          nodeObj.children[i] = toState(node);
        });
      }
      return nodeObj;
    }
  };
};
export default toState;
