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
        ['span', 'strong', 'em', 'i', 'b'].includes(node.parentNode?.nodeName.toLowerCase() || '') === false &&
        node.nodeName === '#text'
      ) {
        return NodeFilter.FILTER_ACCEPT;
      }
      if (node.nodeName === '#text') {
        console.log('일치', node.textContent);
      }
      if ((node.nodeName === '#text' && node.nextSibling) || (node.nodeName === '#text' && node.previousSibling)) {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_SKIP;
    },
  });
  // 단순한 텍스트 노드의 경우 span으로 감싸준다.
  while (textWalker.nextNode()) {
    const spanEl = document.createElement('span');
    (textWalker.currentNode as Element).replaceWith(spanEl);
    console.log('textWalker.currentNode', textWalker.currentNode.cloneNode(true));
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
  // Vdom.appendChild(result);
  res.map(res => {
    document.appendChild(res);
    // const JSON = JSONParser();
    FormatParser(getFormat(res.children)).map(row => {
      console.log('row', row);
      if (row) result.appendChild(row);
    });
    // res.remove();
    // result.appendChild(res.cloneNode(true));
  });
  console.log('result', result);
  return result;
};

export const getFormat = (node: HTMLCollection, style?: CSSStyleDeclaration): any[] => {
  return Array.from(node)
    .map(child => {
      const clone = child;
      // console.log('getStyle', clone.tagName, clone.getAttribute('style'));
      style = style || getComputedStyle(clone);
      // const style = Object.entries(getComputedStyle(clone)).map(item => {
      //   const attribute = (<HTMLElement>clone).style[item[0] as never];
      //   if (!item[1] && attribute) {
      //     console.log('font-style', attribute);
      //     return {
      //       [item[0]]: attribute,
      //     };
      //   }
      //   return {
      //     [item[0]]: [item[1]],
      //   };
      // }) as never as CSSStyleDeclaration;
      const { fontWeight, textDecoration, fontStyle, textDecorationLine } = style;
      console.log('style', style);
      // console.log('fontStyle', fontStyle);
      // console.log('fontWeight', clone, clone.getAttribute('style'), fontWeight);
      //  as never as CSSStyleDeclaration;
      // const style = {
      //   ...getComputedStyle(clone),
      //   ...(<HTMLElement>clone).style,
      // };
      // console.log('style', style);
      // console.log('cssText', getComputedStyle(clone));
      // console.log('style', getComputedStyle(clone).fontWeight, getComputedStyle(clone));
      // clone.set
      //
      clone.remove();
      let childFormat = [];
      if (child.childElementCount > 0) {
        childFormat = getFormat(child.children).flat(1);
      } else {
        const formats: formatType[] = [];

        if (fontWeight === 'bold' || ['600', '700', '800'].includes(fontWeight)) {
          formats.push('bold');
        }
        if (textDecoration === 'underline' || textDecorationLine === 'underline') {
          formats.push('underline');
        }
        if (fontStyle === 'italic') {
          console.log('italic');

          formats.push('italic');
        }
        return [{ text: child.textContent || '', format: formats }];
      }
      return childFormat;
    })
    .flat(1);
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

const FormatParser = (data: JSONAttr[]) => {
  return data.map(data => {
    let ele: HTMLElement | undefined;
    if (data.format?.length === 0) {
      ele = document.createElement('span');
    }
    if (data.format && data.format?.length === 1 && data.format?.includes('bold')) {
      ele = document.createElement('strong');
    } else if (data.format && data.format?.length === 1) {
      ele = document.createElement('em');
    }
    data.format?.map(format => {
      ele?.classList.add(format);
    });
    ele!.textContent = data.text || '';
    return ele;
  });
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

const TextNodeToWrapSpan = (element: Node | Element) => {
  const t = Array.from((<Node>element).childNodes).map(node => {
    if (node.parentElement === element && Node.TEXT_NODE === node.nodeType && node.textContent?.trim() !== '') {
      const spanEl = document.createElement('span');
      node.replaceWith(spanEl);
      spanEl.append(node);
      return spanEl;
    }
    if ((<Element>node).childElementCount) {
      TextNodeToWrapSpan(node);
    }
    return node;
  });
  console.log('t', t);
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

  toTest(data: string) {
    const fragment = document.createDocumentFragment();
    const parser = new DOMParser();
    data = data.replace(/\n\s*/g, '');
    const dom = parser.parseFromString(data, 'text/html');
    if (!dom.body) {
      throw Error('html parsing error');
    }

    let element = <Element>dom.body;
    fragment.appendChild(element);
    // element.innerHTML = element.innerHTML.replace(/\n/g, '').replace(/<div[^/>]*>([^<]*)<\/div>/g, '<p>$1</p>');
    element.normalize();
    TextNodeToWrapSpan(element);
    // 부모가 p, h2 등이 아니면 부모태그에 스타일을 넣어주고 태그 제거
    console.log('element', element.innerHTML);
    const depsWalker = document.createTreeWalker(element, NodeFilter.SHOW_ALL, null);
    while (depsWalker.nextNode()) {
      console.log(depsWalker.currentNode.nodeName);
      // depsWalker.currentNode.parentNode
    }
    // const textWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    //   acceptNode(node) {
    //     if (
    //       ['span', 'strong', 'em', 'i', 'b'].includes(node.parentNode?.nodeName.toLowerCase() || '') === false &&
    //       node.nodeName === '#text'
    //     ) {
    //       return NodeFilter.FILTER_ACCEPT;
    //     }
    //     if ((node.nodeName === '#text' && node.nextSibling) || (node.nodeName === '#text' && node.previousSibling)) {
    //       return NodeFilter.FILTER_ACCEPT;
    //     }
    //     return NodeFilter.FILTER_SKIP;
    //   },
    // });
    // // 단순한 텍스트 노드의 경우 span으로 감싸준다.
    // while (textWalker.nextNode()) {
    //   const spanEl = document.createElement('span');
    //   (textWalker.currentNode as Element).replaceWith(spanEl);
    //   spanEl.append(textWalker.currentNode);
    // }
    // //형제 span을 합친다.
    // element = HtmlMerge(element);
    // element.normalize();
    const res: Element[] = [];
    let cnt = 0;
    // Array.from(element.children).forEach(child => {
    //   // 최적화해야할 부분
    //   // child.textContent = child.textContent?.trimEnd() || '';
    //   child = HtmlMerge(child);
    //   child.normalize();
    //   if (
    //     ['p', 'ul', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code', 'quote', 'code'].includes(
    //       child.nodeName.toLowerCase() || '',
    //     ) === false
    //   ) {
    //     if (!res[cnt]) {
    //       res[cnt] = document.createElement('p');
    //       res[cnt].innerHTML = (<Element>child).outerHTML;
    //     } else {
    //       res[cnt].innerHTML += (<Element>child).outerHTML;
    //     }
    //   } else {
    //     res.push(<Element>child);
    //     cnt = res.length - 1;
    //   }
    // });
    Array.from(element.children).forEach(child => {
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

    // const jsonWalker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, null);
    // while (jsonWalker.nextNode()) {
    //   const parentStyle = (<Element>jsonWalker.currentNode.parentElement).getAttribute('style');
    //   if (parentStyle) {
    //     const style = (<Element>jsonWalker.currentNode).getAttribute('style');
    //     (<Element>jsonWalker.currentNode).setAttribute('style', `${style || ''}${parentStyle}`);
    //   }
    // }
    const result = document.createElement('div');
    const Vdom = document.createDocumentFragment();
    Vdom.appendChild(result);
    // console.log('element', element.innerHTML);
    // res.map(res => {
    //   // const JSON = JSONParser();
    //   console.log('getFormat(res.children))', getFormat(res.children));
    //   FormatParser(getFormat(res.children)).map(row => {
    //     console.log('row', row);
    //     if (row) result.appendChild(row);
    //   });
    //   // result.appendChild(res.cloneNode(true));
    // });
    // console.log('result', result.innerHTML);
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
