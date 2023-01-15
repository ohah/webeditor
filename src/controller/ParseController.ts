/* eslint-disable no-case-declarations */
/* eslint-disable prefer-const */
/* eslint-disable no-multi-assign */
/* eslint-disable no-continue */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-cond-assign */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

// type Data = HTMLElement | Record<string, string>;
type Data = HTMLElement;

export interface JSONAttr {
  text?: string;
  linebreak?: boolean;
  format?: (keyof typeof InnerFormatType)[];
}

export type JSONFormat = {
  [key in Tag]?: JSONAttr[];
};
// type NodeName = string;
export interface IData {
  root: JSONFormat[];
}
enum Tag {
  PARAGRAPH = 'paragraph',
  p = 'p',
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
}
enum FormatTag {
  LINEBREAK = 'br',
  SPAN = 'span',
  BOLD = 'strong',
  UNDERLINE = 'u',
  ITALIC = 'em',
  STRIKETHROUGH = 'strike',
}
type TagType = `${Tag}`;
type useTagType = `${Tag | FormatTag}`;
// const OuterFormatType = {
//   code: 'code',
//   subscript: 'sub',
//   superscript: 'sup',
// } as const;
const InnerFormatType = {
  bold: 'strong',
  italic: 'em',
  // 웹접근성 고려 안함
  underline: 'u',
  strikethrough: 'strike',
} as const;
// type FormatType = `${keyof typeof Format}`;
// enum Format {
//   BOLD = 'strong',
//   ITALIC = 'italic',
//   UNDERLINE = 'em',
//   linebreak = 'br',
// }

export const HtmlMerge = (element: Node) => {
  let child = element.firstChild;
  while (child) {
    const that = child.previousSibling;
    if (that && that.nodeType === Node.ELEMENT_NODE && that.nodeName === child.nodeName) {
      const node = document.createElement(child.nodeName);
      while (that.firstChild) {
        node.appendChild(that.firstChild);
      }
      while (child.firstChild) {
        node.appendChild(child.firstChild);
      }
      element.insertBefore(node, child.nextSibling);
      element.removeChild(that);
      element.removeChild(child);
    }

    child = child.nextSibling;
  }
  return element;
};

/**
 * 무작위한 text/html 데이터를 원하는 html 태그 형태로 바꾼다.
 * @param data {string}
 * @returns HTML
 */
export const HtmlFilter = (element: Element) => {
  // const result = document.createElement('div');
  element.normalize();
  // div.innerHTML = data;
  const textWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (['span'].includes(node.parentNode?.nodeName.toLowerCase() || '') === false && node.nodeName === '#text') {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_SKIP;
    },
  });
  // 단순한 텍스트 노드의 경우 span으로 감싸준다.
  while (textWalker.nextNode()) {
    const spanEl = document.createElement('span');
    (textWalker.currentNode as Element).replaceWith(spanEl);
    spanEl.append(textWalker.currentNode);
  }
  //형제 span을 합친다.
  const result = HtmlMerge(element);
  result.normalize();
  //부모가 없는 span을 구한다.
  const spans = (<Element>result).querySelectorAll('span:not(p span)');
  spans.forEach(span => {
    if (span.parentNode?.nodeName !== 'p' || span.parentNode?.nodeName.toLowerCase() !== 'p') {
      let p = document.createElement('p');
      span.parentNode?.insertBefore(p, span);
      p.appendChild(span);
    }
  });
  const parentTags = (<Element>result).querySelectorAll('p, h1, h2, h3, h4, h5');
  parentTags.forEach(parent => {
    HtmlMerge(parent);
  });

  return result;
};

// consvert json to dom
export const toDOM = (obj: any) => {
  if (typeof obj === 'string') {
    obj = JSON.parse(obj);
  }
  let node,
    { nodeType } = obj;
  switch (nodeType) {
    case 1: //ELEMENT_NODE
      node = document.createElement(obj.tagName);
      const attributes = obj.attributes || [];
      for (let i = 0, len = attributes.length; i < len; i++) {
        const attr = attributes[i];
        node.setAttribute(attr[0], attr[1]);
      }
      break;
    case 3: //TEXT_NODE
      // eslint-disable-next-line no-undef
      node = document.createTextNode(obj.nodeValue);
      break;
    case 8: //COMMENT_NODE
      node = document.createComment(obj.nodeValue);
      break;
    case 9: //DOCUMENT_NODE
      node = document.implementation.createDocument(null, null, null);
      break;
    case 10: //DOCUMENT_TYPE_NODE
      node = document.implementation.createDocumentType(obj.nodeName, '', '');
      break;
    case 11: //DOCUMENT_FRAGMENT_NODE
      node = document.createDocumentFragment();
      break;
    default:
      return node;
  }
  if (nodeType === 1 || nodeType === 11) {
    const childNodes = obj.childNodes || [];
    for (let i = 0, len = childNodes.length; i < len; i++) {
      node.appendChild(toDOM(childNodes[i]));
    }
  }
  return node;
};

// convert to json
export const toJSON = (node: Node, deps = 0) => {
  node = node || this;
  const obj: any = {
    nodeType: node.nodeType,
    deps,
  };
  if ((node as any).tagName) {
    obj.nodeName = (node as Element).tagName.toLowerCase();
  } else if (node.nodeName) {
    obj.nodeName = node.nodeName;
  }
  if (node.nodeValue) {
    obj.nodeValue = node.nodeValue;
  }
  const attrs = (node as any).attributes;

  const { childNodes } = node;
  let length;
  let arr;
  if (attrs) {
    length = attrs.length;
    arr = obj.attributes = new Array(length);
    for (let i = 0; i < length; i++) {
      const attr = attrs[i];
      arr[i] = [attr.nodeName, attr.nodeValue];
    }
  }
  if (childNodes) {
    length = childNodes.length;
    arr = obj.childNodes = new Array(length);
    deps++;
    for (let i = 0; i < length; i++) {
      arr[i] = toJSON(childNodes[i], deps);
    }
  }
  return obj;
};

/**
 * @description tag를 에디터에서 해석 가능한 html 태그로 변경한다.
 * @param element
 * @returns {Element}
 */
export const wrapElement = (element: Element) => {
  const passTag = ['span', 'i', 'b', 'a', 'div', 'strong'];
  const parentPassTag = ['p', 'ul', 'li', 'code', 'quote'];
  const collection = element.childNodes;
  if (element.nodeName === '#text') {
    element.replaceWith(wrap('span', element.textContent || ''));
    return element;
  }
  // format 파싱 제대로 못함.
  if (collection.length > 0) {
    for (let i = 0; i < collection.length; i++) {
      const tagName = collection[i].nodeName.toLowerCase();
      if (passTag.includes(tagName)) {
        if (
          collection[i].parentElement === element &&
          !parentPassTag.includes(collection[i].parentElement!.nodeName.toLowerCase())
        ) {
          //단순한 텍스트 노드가 아닐때(서식이 있을때)
          if (collection[i].childNodes.length > 0) {
            for (let k = 0; k < collection[i].childNodes.length; k++) {
              //   if (collection[i].childNodes[k].nodeName !== '#text') {
              //     console.log('#text', collection[i].childNodes[k].textContent);
              //     element.appendChild(collection[i].childNodes[k]);
              //   }
              element.appendChild(collection[i].childNodes[k]);
            }
          } else {
            collection[i] = wrap('paragraph', wrap(tagName as never, collection[i].textContent || ''));
          }
        }
        if (tagName === 'div') {
          collection[i] = wrap('paragraph', wrap('span', collection[i].textContent || ''));
        }
      } else {
        wrapElement(collection[i] as Element);
      }
    }
  }
  return element;
};
/**
 * @param {useTagType} tagName
 * @param {HTMLElement | string} wrap
 * @returns {HTMLElement}
 */
export const wrap = (tagName: useTagType, wrap: HTMLElement[] | HTMLElement | string): HTMLElement => {
  if (wrap instanceof HTMLElement) {
    wrap = [wrap];
  }
  const convertTagName = tagName === 'paragraph' ? 'p' : tagName;
  const wrapper = document.createElement(convertTagName);
  // console.log(tagName);
  if (typeof wrap === 'string') {
    wrapper.append(wrap);
  } else {
    wrapper.append(...wrap);
  }

  return wrapper;
};

export const convertHtml = (element: Element) => {
  const result = document.createElement('div');
  const p = document.createElement('p');
  const parentTag = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'li'];
  element.innerHTML = element.innerHTML.replace(/>\s+</g, '');
  const convert = wrapElement(element);
  const walker = document.createTreeWalker(convert, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (parentTag.includes(node.parentNode?.nodeName.toLowerCase() || '')) {
        return NodeFilter.FILTER_SKIP;
      }
      if (element === node.parentElement) {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_SKIP;
    },
  });
  while (walker.nextNode()) {
    console.log('walker', walker.currentNode);
    if (parentTag.includes(walker.currentNode.nodeName.toLowerCase() || '')) {
      // 만약 부모태그가 없는 경우 p태그를 부모로 해줌.
      if (p.childElementCount > 0) {
        result.appendChild(p.cloneNode(true));
        p.innerHTML = '';
      }
      result.appendChild(walker.currentNode.cloneNode(true));
    } else {
      // 부모태그가 없는 경우 p 태그에 더해준다.
      p.appendChild(walker.currentNode.cloneNode(true));
    }
  }
  // 만약 부모태그가 없는 경우 p태그를 부모로 해줌.
  if (p.childElementCount > 0) {
    result.appendChild(p.cloneNode(true));
    p.innerHTML = '';
  }
  return result;
};

const JSONParser = (data: JSONFormat) => {
  const keys = Object.keys(data) as unknown as TagType[];
  const result = keys.map(key => {
    const res = data[key]?.map(res => {
      if (res.text) return wrap('span', res.text);
      return document.createElement('br');
    });
    if (res) return wrap(key, res).outerHTML;
    return '';
  });
  return result;
};

export class ParseController {
  #data?: Data;
  constructor(data?: Data) {
    this.#data = data;
  }

  dummy() {
    return this.#data;
  }

  toHTML(data: IData): string {
    const { root } = data;
    const result = root
      .map(data => {
        return JSONParser(data);
      })
      .join('');
    return result;
  }

  toJSON(data: string): JSONFormat[] {
    const parent = document.createElement('div');
    parent.innerHTML = data;
    const convert = HtmlFilter(parent);
    console.log('convert', convert.innerHTML);
    const result: JSONFormat[] = [];
    const parentTag = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul'];
    const walker = document.createTreeWalker(convert, NodeFilter.SHOW_ELEMENT, {
      acceptNode(node) {
        if (parentTag.includes(node.nodeName.toLowerCase())) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      },
    });
    // 하위노드 처리 안함.);
    while (walker.nextNode()) {
      if (parentTag.includes(walker.currentNode.nodeName.toLowerCase())) {
        const tagName = walker.currentNode.nodeName.toLowerCase();
        const childWalker = document.createTreeWalker(walker.currentNode, NodeFilter.SHOW_ELEMENT, null);
        const attr: JSONAttr[] = [];
        // console.log('childWalker', childWalker.currentNode);
        while (childWalker.nextNode()) {
          const childTagName = childWalker.currentNode.nodeName.toLowerCase();
          switch (childTagName) {
            case 'br':
              attr.push({ linebreak: true });
              break;
            case 'span':
            default:
              // console.log('test', childWalker.currentNode);
              //서식 노드 넣어줘야함.
              attr.push({ text: childWalker.currentNode.textContent || '' });
              break;
          }
        }
        if (tagName === 'p') {
          result.push({
            paragraph: [...attr],
          });
        } else {
          result.push({
            [tagName]: [...attr],
          });
        }
      }
    }
    return result;
  }
}
