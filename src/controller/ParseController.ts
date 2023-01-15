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

export const HtmlMerge = (element: Node): Element => {
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
  return <Element>element;
};

/**
 * 무작위한 text/html 데이터를 원하는 html 태그 형태로 바꾼다.
 * @param data {string}
 * @returns HTML
 */
export const HtmlFilter = (element: Element) => {
  element.normalize();
  const textWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (
        ['span', 'strong', 'em', 'i', 'ul'].includes(node.parentNode?.nodeName.toLowerCase() || '') === false &&
        node.nodeName === '#text'
      ) {
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
  element = HtmlMerge(element);
  element.normalize();
  //부모가 없는 span을 구한다.
  const formats = element.querySelectorAll(':not(p)');
  const children = Array.from(element.childNodes);
  const res: ChildNode[][] = [];
  let cnt = 0;
  children.forEach(child => {
    if (child.nodeName !== 'P') {
      // console.log('child', child.nodeName);
      if (!res[cnt]) res[cnt] = [child];
      else res[cnt].push(child);
    } else {
      res[++cnt] = [child];
      cnt++;
      // console.log('child', child.nodeName);
    }
  });
  console.log('res', res);
  // console.log(children);
  const regx = /(.+?)(<p>)/g;
  const test = element.innerHTML.match(regx);
  console.log('test', test);
  // const fragment = document.createDocumentFragment();
  // let currentP = document.createElement('p');
  // fragment.appendChild(currentP);
  // let 연속 = false;
  // children.forEach(child => {
  //   if (
  //     ['span', 'strong', 'em', 'i', 'ul'].includes(child.nodeName.toLowerCase() || '') === false &&
  //     ['span', 'strong', 'em', 'i', 'ul', 'div'].includes(child.parentElement?.nodeName.toLowerCase() || '')
  //   ) {
  //     // currentP = child;
  //     연속 = true;
  //     fragment.appendChild(child);
  //   } else {
  //     연속 = false;
  //     // currentP.appendChild(child);
  //     // currentP = document.createElement('p');
  //     // fragment.cloneNode()
  //     // while (fragment.firstChild) {
  //     //   fragment.removeChild(fragment.firstChild);
  //     // }
  //   }
  // });
  // element.appendChild(fragment);
  console.log('element', element);
  // let child = element.firstChild;
  // while (child) {
  //   const that = child.previousSibling;
  //   if (
  //     // that &&
  //     // that.nodeType === Node.ELEMENT_NODE &&
  //     child.nodeType === Node.ELEMENT_NODE &&
  //     ['p'].includes(child.parentElement?.nodeName.toLowerCase() || '') === false
  //     // Array.from(formats.values()).includes(<Element>that) === Array.from(formats.values()).includes(<Element>child)
  //   ) {
  //     const node = document.createElement('p');
  //     // while (that.firstChild) {
  //     // node.appendChild(that);
  //     // }
  //     // while (child.firstChild) {
  //     node.appendChild(child);
  //     element.append(node);
  //     // element.insertBefore(node, child.nextSibling);
  //     // element.be
  //     // }
  //     // element.removeChild(that);
  //     // element.removeChild(child);
  //   }

  //   child = child.nextSibling;
  // }

  // while (walker.nextNode()) {
  //   if (Array.from(formats.values()).includes(<Element>walker.currentNode)) {
  //     p.appendChild(formats.item(formatCursor++).cloneNode(true));
  //     // console.log('sib', walker.currentNode.nextSibling, p);
  //     if (Array.from(formats.values()).includes(<Element>walker.currentNode.nextSibling) === false) {
  //       console.log('p', p);
  //       p = document.createElement('p');
  //       // walker.currentNode.insertBefore(p, walker.currentNode);
  //     }
  //   }
  //   // result.appendChild(walker.currentNode.cloneNode(true));
  //   console.log('wal', walker.currentNode);
  // }
  // console.log('formatCursor', formatCursor);
  // const spans = (<Element>result).querySelectorAll('span:not(p span)');
  console.log('html', element, formats);

  // spans.forEach(span => {
  //   if (span.parentNode?.nodeName !== 'p' || span.parentNode?.nodeName.toLowerCase() !== 'p') {
  //     let p = document.createElement('p');
  //     console.log(span);
  //     span.parentNode?.insertBefore(p, span);
  //     p.appendChild(span);
  //   }
  // });
  // console.log('result', result);
  // const parentTags = (<Element>result).querySelectorAll('p, h1, h2, h3, h4, h5');
  // parentTags.forEach(parent => {
  //   HtmlMerge(parent);
  // });

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
    // console.log('convert', convert.innerHTML);
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
