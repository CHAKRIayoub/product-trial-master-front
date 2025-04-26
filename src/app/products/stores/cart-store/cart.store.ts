import { computed } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { Product } from 'app/products/data-access/product.model';

type ProductCart = {
  product : Product,
  quantity : number
}

type CartState = {
  cartProducts: Array<ProductCart>
};

const initialCartSate : CartState = {
  cartProducts: []
}

export const CartStore = signalStore(
  { providedIn: 'root' },

  withState(initialCartSate),

  withMethods((store) => ({ 

    addToCart: (product : Product) => {

      const cartProducts = store.cartProducts();
      const productCartIndex = cartProducts.findIndex((productCart : ProductCart) => productCart.product.id === product.id);

      if (productCartIndex > -1) {

        patchState( store, (state) => {
          
            return { 
              cartProducts: cartProducts.map((item)=>{
                if(item.product.id === product.id)
                  return {
                    product : item.product,
                    quantity : item.quantity + 1
                  }

                  return item
              })
            }

          }
        );

      } else {

        patchState(store, (state) => {
          return {
            cartProducts : [...cartProducts, {product:product, quantity:1}]
          }
        });

      }
    },

    removeFromCart: (id: number) => {
      patchState(store, (state) => ({ cartProducts: store.cartProducts().filter(item => item.product.id !== id) }));

    },

    clearCart: () => {
      patchState(store, (state) => ({ cartProducts: [] }));
    },

  })),

  withComputed((store) => ({
    cartCount: computed(() => {
      return store.cartProducts().reduce((acc, productCart)=>{
        return acc + productCart.quantity
      },0)
    })
  })),

 
);