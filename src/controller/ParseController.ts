/* eslint-disable no-fallthrough */
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
  format?: formatType[];
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
type formatType = keyof typeof InnerFormatType;
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

// 자식노드의 자식이 왔을때 평탄화 작업이랑 여러개의 포맷이 적용 되었을 때 처리

export const HtmlMerge = (element: Node): Element => {
  let child = element.firstChild;
  while (child) {
    const that = child.previousSibling;
    if (
      that &&
      that.nodeType === Node.ELEMENT_NODE &&
      that.nodeName === child.nodeName &&
      ['span', 'strong', 'i', 'em'].includes(child.nodeName.toLowerCase())
    ) {
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
export const HtmlFilter = (data: string) => {
  const fragment = document.createDocumentFragment();
  const parser = new DOMParser();
  data = data.replace(/\n\s*/g, '');
  const dom = parser.parseFromString(data, 'text/html');
  if (!dom.body) {
    throw Error('html parsing error');
  }

  let element = <Element>dom.body;
  fragment.appendChild(element);
  element.innerHTML = element.innerHTML.replace(/\n/g, '').replace(/<div[^/>]*>([^<]*)<\/div>/g, '<p>$1</p>');
  element.normalize();
  const textWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (
        ['span', 'strong', 'em', 'i'].includes(node.parentNode?.nodeName.toLowerCase() || '') === false &&
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
  // const t = element.cloneNode(true);
  // console.log(t);
  element.normalize();
  const res: Element[] = [];
  let cnt = 0;
  Array.from(element.children).forEach(child => {
    // 최적화해야할 부분
    // child.textContent = child.textContent?.trimEnd() || '';
    child = HtmlMerge(child);
    child.normalize();
    if (
      ['p', 'ul', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'quote', 'code'].includes(
        child.nodeName.toLowerCase() || '',
      ) === false
    ) {
      if (!res[cnt]) {
        res[cnt] = document.createElement('p');
        res[cnt].innerHTML = (<Element>child).outerHTML;
      } else {
        res[cnt].innerHTML += (<Element>child).outerHTML;
      }
    } else {
      res.push(<Element>child);
      cnt = res.length - 1;
    }
  });
  const Vdom = document.createDocumentFragment();
  const result = document.createElement('div');
  Vdom.appendChild(result);
  res.map(res => {
    getFormat(res.children);
    console.log('res', getComputedStyle(res).fontWeight);
    result.appendChild(res.cloneNode(true));
  });
  console.log('result', result);
  return result;
};

export const getFormat = (node: HTMLCollection): any => {
  Array.from(node).forEach(child => {
    const clone = child.cloneNode(true) as Element;
    document.body.appendChild(clone);
    const { fontWeight, textDecoration, fontStyle, textDecorationLine } = getComputedStyle(clone);
    console.log('style', clone.textContent, fontWeight, textDecoration, fontStyle, textDecorationLine);
    clone.remove();
    // console.log(child, fontWeight, textDecoration, fontStyle, textDecorationLine);
    if (child.childElementCount > 0) {
      getFormat(child.children);
    }
  });
  // return <Element>node;
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

  toJSON(data: string): IData {
    // parent.innerHTML = data.replace(/\n+s/g, '')
    const convert = HtmlFilter(data);
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
        const format: formatType[] = [];
        while (childWalker.nextNode()) {
          const childTagName = childWalker.currentNode.nodeName.toLowerCase();
          switch (childTagName) {
            case 'br':
              attr.push({ linebreak: true });
              break;
            case 'span':
            default:
              if (childTagName === 'strong') {
                format.push('bold');
              }
              if (childTagName === 'i') {
                format.push('italic');
              }
              if (childTagName === 'underline') {
                format.push('underline');
              }
              const data: JSONAttr = { text: childWalker.currentNode.textContent || '' };
              if (format.length > 0) {
                data.format = [...format];
                format.splice(0, format.length);
              }
              attr.push(data);
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
    return {
      root: result,
    };
  }
}
