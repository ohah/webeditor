import './style.css';
import { ParseController } from 'controller/ParseController';
import { Editor } from 'editor';
import { CursorElement, EditorElement } from 'webcomponents';
customElements.define('editor-cursor', CursorElement);
customElements.define('simple-editor', EditorElement);

// const editor = document.getElementById('editor');
// editor?.setAttribute('c', 'sex');
// editor?.setAttribute('1', 'sex');

// const editor = new Editor({
//   element: '#app',
// });

const parse = new ParseController();
// const app = document.getElementById('app');
// app!.innerHTML =
//   '<h1>안녕</h1><strong>strong</strong><br>text<br><p>p-text<span>span</span></p><div>div</div><div>div2</div>';
// const json = parse.toJSON(app!.innerHTML);
// console.log('json', json);
// // convertHtml(app!);

// const data: IData = {
//   root: [
//     {
//       paragraph: [{ text: 'paragraph', format: ['bold'] }, { linebreak: true }, { text: '무야호' }],
//     },
//     {
//       paragraph: [{ text: 'paragraph', format: ['bold'] }, { linebreak: true }, { text: '무야호' }],
//     },
//     {
//       h1: [{ text: 'h1' }, { text: 'h1(2)' }],
//     },
//     {
//       h2: [{ text: 'h2' }],
//     },
//     {
//       h3: [{ text: 'h3' }],
//     },
//     {
//       h4: [{ text: 'h4' }],
//     },
//     {
//       h5: [{ text: 'h5' }],
//     },
//     {
//       h6: [{ text: 'h6' }],
//     },
//   ],
// };
// console.log(
//   'result',
//   parse.toJSON('일반텍스트<span> 테스트 </span><p> 테스트 </p><p>노자식<span> 자식</span></p>'),
//   // parse.toJSON(
//   //   '최상위텍스트<span> 스팬 </span><p> 노스팬P </p><p>노스팬P2<span>정상SPAN</span></p><span>마지막스팬</span>',
//   // ),
//   parse.toJSON(
//     '<span>텍스트</span><strong>굵게</strong><em>기울임</em><p><strong>스트롱</strong><span>일반</span></p><strong>마지막</strong>',
//   ),
// );
console.log(
  'test',
  // parse.toJSON(`<p><span> 안녕 </span> <span> <u style="font-weight:bold">야<i>asgd</i></u> <b>싶다</b></span>
  parse.toTest(
    `asdf<p><span> 안녕 </span> <span> <u style="font-weight:bold">야<i>as<em>gd</em></i></u> <b>싶다</b></span></p>`,
  ),
);
document.addEventListener('paste', event => {
  const paste = event.clipboardData?.getData('text/html');
  console.log('paste', paste);
  console.log('types', event.clipboardData?.types);
  // const reversed = Array.from(paste).reverse().join('');

  // const selection = window.getSelection();
  // if (!selection.rangeCount) return false;
  // selection.deleteFromDocument();
  // selection.getRangeAt(0).insertNode(document.createTextNode(reversed));

  event.preventDefault();
});

console.log('adsf', getComputedStyle(document.createElement('div')));
