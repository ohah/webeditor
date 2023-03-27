import { KeyboardEventKey } from '@types';

export const isAlt = (e: KeyboardEvent) => {
  return e.getModifierState('Alt');
};

export const isCtrl = (e: KeyboardEvent) => {
  return e.getModifierState('Control');
};

export const isCapsLock = (e: KeyboardEvent) => {
  return e.getModifierState('CapsLock');
};

export const isArrowDown = (e: KeyboardEvent) => {
  return <KeyboardEventKey>e.key === 'ArrowDown';
};

export const isArrowRight = (e: KeyboardEvent) => {
  return <KeyboardEventKey>e.key === 'ArrowRight';
};

export const isArrowLeft = (e: KeyboardEvent) => {
  return <KeyboardEventKey>e.key === 'ArrowLeft';
};

export const isArrowUp = (e: KeyboardEvent) => {
  return <KeyboardEventKey>e.key === 'ArrowUp';
};
