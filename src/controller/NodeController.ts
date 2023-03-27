/* eslint-disable no-throw-literal */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */

import { SelectionController } from 'controller/SelectionController';

export const CaretHandeler: ProxyHandler<SelectionController> = {
  apply(target, thisArg, argArray) {
    console.log(target, thisArg, argArray);
    return 'asdf';
  },
  get(target, p, receiver) {
    console.log('get', target, p, receiver);
  },
  set(target, p, newValue, receiver) {
    console.log('set', target, p, newValue, receiver);
    return true;
  },
};

export class NodeController {
  private static instance: NodeController;

  #queue: Node[];
  // proxy:NodeController;

  constructor() {
    this.#queue = [];
    const proxy = new Proxy(this, {
      get: (obj, prop) => {
        return Reflect.get(obj, prop);
      },
      set: (obj: any, prop: any, value: any) => {
        Reflect.set(obj, prop, value);
        return true;
      },
    });
  }

  public static getInstance() {
    return this.instance || new this();
  }
}
