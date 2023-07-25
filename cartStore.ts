import { StateCreator, create } from 'zustand';

import { ProductProps } from 'components/product/Product';
import { PersistOptions, persist } from 'zustand/middleware';

import { ICoupons } from 'mocks/handlers';

export interface CartData extends ProductProps {
  stock: number;
  check: boolean;
}

export interface setCartResponse {
  carts: CartData[];
  type: 'error' | 'success';
  status?: string;
  message: string;
}

export interface CartState {
  carts: CartData[];
  coupons?: ICoupons;
  actions: {
    setCart: (product: ProductProps) => Promise<setCartResponse>;
    update: (carts: CartData[]) => Promise<CartData[]>;
    carts: () => { carts: CartData[]; count: number; checkCarts: CartData[] };
    isCarts: (item_no: number) => boolean;
    remove: (item_no: number) => void;
  };
}

type CartPersist = (
  config: StateCreator<CartState>,
  options: PersistOptions<CartState, { carts: CartData[] }>,
) => StateCreator<CartState>;

const useCartStore = create<CartState>()(
  (persist as CartPersist)(
    (set, get) => ({
      carts: [],
      actions: {
        carts: () => {
          return {
            carts: get().carts,
            coupons: get().coupons,
            count: get().carts.length,
            checkCarts: get().carts.filter(item => item.check),
          };
        },
        isCarts: (item_no: number) => {
          return get().carts?.findIndex(item => item.item_no === item_no) !== -1;
        },
        remove: (item_no: number) => {
          set(state => {
            return {
              ...state,
              carts: state.carts.filter(item => item.item_no !== item_no),
            };
          });
        },
        update: carts => {
          return new Promise((reoslve: (value: CartData[]) => void, reject: (value: setCartResponse) => void) => {
            set(state => {
              reoslve(get().carts.filter(item => item.check));
              if (carts.length === 0) {
                reject({
                  carts: state.carts,
                  type: 'error',
                  status: 'limit',
                  message: '빈 배열은 넣을 수 없습니다.',
                });
              }
              return {
                ...state,
                carts,
              };
            });
          });
        },
        setCart: async product => {
          return new Promise((reoslve: (value: setCartResponse) => void, reject: (value: setCartResponse) => void) => {
            set(state => {
              const isCart = state.carts.findIndex(item => item.item_no === product.item_no);
              if (isCart !== -1) {
                reject({
                  carts: state.carts,
                  type: 'error',
                  status: 'isCarts',
                  message: '이미 장바구니에 담겨있는 상품입니다.\n 삭제하시겠습니까?',
                });
              } else if (state.carts.length >= 3) {
                reject({
                  carts: state.carts,
                  type: 'error',
                  status: 'limit',
                  message: '3개 이상 담을 수 없습니다',
                });
                return state;
              } else {
                const newCart = {
                  ...product,
                  stock: 1,
                  check: false,
                };
                state.carts.push(newCart);
                reoslve({
                  carts: state.carts,
                  type: 'success',
                  message: '상품을 장바구니에 담는데 성공하였습니다!',
                });
              }
              return {
                ...state,
              };
            });
          });
        },
      },
    }),
    {
      name: 'musinsa-carts',
      partialize: state => ({ carts: state.carts }),
    },
  ),
);

// export const useCarts = () => useCartStore(state => state.carts);
export const useCarts = () => useCartStore(state => state.actions.carts());

export const useIsCarts = (item_no: number) => useCartStore(state => state.actions.isCarts(item_no));

export const useCartActions = () => useCartStore(state => state.actions);
