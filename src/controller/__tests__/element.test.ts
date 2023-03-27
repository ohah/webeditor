import { IData } from 'controller/EventController';
import { screen, debug } from 'shadow-dom-testing-library';
import * as sa from 'shadow-dom-testing-library';
import { $getSelection } from 'utils';
import { EditorElement } from 'webcomponents';

const data: IData = {
  root: [
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: 'paragraph',
          format: ['bold'],
        },
        { type: 'linebreak' },
        {
          type: 'text',
          text: '개행',
        },
      ],
    },
    {
      type: 'paragraph',
      children: [
        {
          type: 'text',
          text: '굵게',
          format: ['bold'],
        },
      ],
    },
    {
      type: 'heading',
      tag: 'h1',
      children: [
        {
          type: 'text',
          text: 'h1',
        },
      ],
    },
    {
      type: 'heading',
      tag: 'h2',
      children: [
        {
          type: 'text',
          text: 'h2',
        },
      ],
    },
    {
      type: 'heading',
      tag: 'h3',
      children: [
        {
          type: 'text',
          text: 'h3',
        },
      ],
    },
    {
      type: 'heading',
      tag: 'h4',
      children: [
        {
          type: 'text',
          text: 'h4',
        },
      ],
    },
    {
      type: 'heading',
      tag: 'h5',
      children: [
        {
          type: 'text',
          text: 'h5',
        },
      ],
    },
    {
      type: 'heading',
      tag: 'h6',
      children: [
        {
          type: 'text',
          text: 'h6',
        },
      ],
    },
  ],
};
/* eslint-disable consistent-return */
function $findTextNode(node: Node): Node | undefined {
  if (node.nodeType === Node.TEXT_NODE) {
    return node;
  }
  for (let i = 0; i < node.childNodes.length; i += 1) {
    const childNode = node.childNodes[i];
    const foundTextNode = $findTextNode(childNode);
    if (foundTextNode) {
      return foundTextNode;
    }
  }
  return undefined;
}
describe('형제 노드 테스트', () => {
  test('wrap text', () => {
    const div = document.createElement('div');
    div.innerHTML =
      '<p><span id="test">paragraph</span><br><span>개행</span></p><p><span>굵게</span></p><h1><span>h1</span></h1><h2><span>h2</span></h2><h3><span>h3</span></h3><h4><span>h4</span></h4><h5><span>h5</span></h5><h6><span>h6</span></h6></div>';
    const test = div.querySelector('#test');
    const nextTag = test?.nextSibling;
    expect((nextTag as Element).tagName).toBe('BR');
    const toNext = nextTag?.nextSibling;
    expect((toNext as Element).tagName).toBe('SPAN');
    // console.log('next', toNext?.nextSibling);
    // console.log('this.currentNode?.parentElement?.nextElementSibling', toNext?.parentElement?.nextElementSibling);
    // console.log('ChildNodes', Array.from(toNext!.parentElement!.nextElementSibling!.childNodes));
    const node = $findTextNode(toNext?.parentElement?.nextElementSibling as Node);
    console.log('node', node);
    // console.log('findTextNode', $findTextNode(toNext?.parentElement?.nextElementSibling as Node));
  });

  test.only('셀렉션 테스트', async () => {
    // window.getSelection = jest.fn();
    const editor = new EditorElement();
    editor.data = data;
    // render(editor);
    document.body.appendChild(editor);
    expect(screen.getByShadowText(/paragraph/i)).toBeInTheDocument();
    // debug();
    const range = new Range();
    // console.log('editor.component.event?.data._data[0].children[0].element', editor.component.event?.data._data[0].children[0].element.textContent);
    range.setStart(editor.component.event?.data._data[0].children[0].element.firstChild, 5);
    range.setEnd(editor.component.event?.data._data[1].children[0].element.firstChild, 1);
    console.log('editor.component.shadowRoot', editor.component.shadowRoot.host);
    // const t = (editor.component.shadowRoot as any as Document).getSelection();
    // console.log('t');
    // const selection = $getSelection(editor.component.shadowRoot);
    // console.log('selection', selection);

    // expect(screen.getByText(/paragraph/i)).toBeInTheDocument();
    // const selection = window.getSelection();
    // console.log('SElection', selection);
    // selection?.addRange(range);
    // // console.log('range', range.cloneContents());
    // console.log('test', selection);
    // // range.setStart()
    // console.log('editor', editor.component.editor.innerHTML);
    // console.log(editor.component.event?.data._data);
  });
});
