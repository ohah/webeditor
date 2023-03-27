/* eslint-disable prefer-rest-params */
import { IData } from 'controller/ParseController';

/* eslint-disable no-restricted-syntax */
const jsonHandler: ProxyHandler<IData> = {
  apply(target, thisArg, argArray) {
    console.log(target, thisArg, argArray);
    return target;
  },
  get(target, property, receiver) {
    console.log('get', target, property, receiver);
    return Reflect.get(...arguments);
  },
  set(target, property, newValue, receiver) {
    console.log('target', target);
    return true;
  },
};

export default jsonHandler;
