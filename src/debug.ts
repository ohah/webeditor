export function logging(target: any, name: any, descriptor: any) {
  const originMethod = descriptor.value;
  descriptor.value = function (...args: any) {
    const res = originMethod.apply(this, args);
    console.log(`${name} method arguments: `, args);
    console.log(`${name} method return: `, res);
    return res;
  };
}
