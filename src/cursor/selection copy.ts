import 'reflect-metadata';

export function Selection<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    selection = window.getSelection();
  };
}
const formatMetadataKey = Symbol('format');
export function format(formatString: string) {
  return Reflect.metadata(formatMetadataKey, formatString);
}

export function getFormat(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}
