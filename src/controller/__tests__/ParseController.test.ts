import { IData, ParseController, wrap } from 'controller/ParseController';

describe('Parse', () => {
  test('wrap text', () => {
    expect(wrap('span', 'text').outerHTML).toBe('<span>text</span>');
  });
  test('default tag render check', () => {
    const parse = new ParseController();
    const data: IData = {
      root: [
        {
          paragraph: [{ text: 'paragraph', format: ['bold'] }, { linebreak: true }, { text: '개행' }],
        },
        {
          paragraph: [{ text: '굵게', format: ['bold'] }],
        },
        {
          h1: [{ text: 'h1' }, { text: 'h1(2)', format: ['underline'] }],
        },
        {
          h2: [{ text: 'h2' }],
        },
        {
          h3: [{ text: 'h3' }],
        },
        {
          h4: [{ text: 'h4' }],
        },
        {
          h5: [{ text: 'h5' }],
        },
        {
          h6: [{ text: 'h6' }],
        },
      ],
    };
    const result = document.createElement('div');
    result.innerHTML = parse.toHTML(data);
    document.body.appendChild(result);
    const p = result.querySelector('p');
    expect(p).toBeInTheDocument();
    const h1 = result.querySelector('h1');
    expect(h1).toBeInTheDocument();
    expect(h1?.textContent).toBe('h1h1(2)');
    const h2 = result.querySelector('h2');
    expect(h2).toBeInTheDocument();
    expect(h2?.textContent).toBe('h2');
    const h3 = result.querySelector('h3');
    expect(h3).toBeInTheDocument();
    expect(h3?.textContent).toBe('h3');
    const h4 = result.querySelector('h4');
    expect(h4).toBeInTheDocument();
    expect(h4?.textContent).toBe('h4');
    const h5 = result.querySelector('h5');
    expect(h5).toBeInTheDocument();
    expect(h5?.textContent).toBe('h5');
    const h6 = result.querySelector('h6');
    expect(h6).toBeInTheDocument();
    expect(h6?.textContent).toBe('h6');
    const span = p!.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span?.textContent).toBe('paragraph');
  });

  test.only('toJSON', () => {
    const parse = new ParseController();
    expect(parse.toJSON('일반텍스트<span> 테스트 </span><p> 테스트 </p><p>노자식<span> 자식</span></p>')).toStrictEqual({
      root: [{ paragraph: [{ text: '일반텍스트 테스트 ' }] }, { paragraph: [{ text: ' 테스트 ' }] }, { paragraph: [{ text: '노자식 자식' }] }],
    });
    expect(parse.toJSON('일반텍스트<span> 테스트 </span>')).toStrictEqual({
      root: [{ paragraph: [{ text: '일반텍스트 테스트 ' }] }],
    });
    expect(parse.toJSON('일반<strong>텍스</strong>트<span> 테스트 </span>')).toStrictEqual({
      root: [
        {
          paragraph: [{ text: '일반' }, { text: '텍스', format: ['bold'] }, { text: '트 테스트 ' }],
        },
      ],
    });
    expect(
      parse.toJSON(`<br>첫번째
    <br>두번째
    <p>문단<span> 문단스팬 </span></p>
    <div>div</div>
    <div>div2</div>
    <p>asdf</p>`),
    ).toStrictEqual({
      root: [
        {
          paragraph: [{ linebreak: true }, { text: '첫번째' }, { linebreak: true }, { text: '두번째' }],
        },
        {
          paragraph: [{ text: '문단 문단스팬 ' }],
        },
        {
          paragraph: [{ text: 'divdiv2' }],
        },
        {
          paragraph: [{ text: 'asdf' }],
        },
      ],
    });
  });
});
