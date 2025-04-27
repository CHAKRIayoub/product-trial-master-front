import { computed } from '@angular/core';
import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { Product } from 'app/products/data-access/product.model';

export type ProductCart = {
  product : Product,
  quantity : number
}

export type CartState = {
  cartProducts: Map<number, ProductCart>
};

const initialCartSate : CartState = {
  cartProducts: new Map()
}

export const CartStore = signalStore(

  { providedIn: 'root' },

  withState(initialCartSate),
  withMethods((store) => ({ 

    addToCart: (product : Product) => {

      let cartProducts : Map<number, ProductCart> = new Map(store.cartProducts())
      let p : ProductCart | undefined = cartProducts.get(product.id)

      cartProducts.set( product.id,  { product: product, quantity : (p) ? p.quantity + 1 : 1})

      patchState(store, (state) => {
          
        return { 
          cartProducts: cartProducts
        }

      });

    },

    removeFromCart: (id: number) => {

      let cartProducts : Map<number, ProductCart> = store.cartProducts()

      cartProducts.delete(id)

      patchState(store, (state) => {
          
        return { 
          cartProducts: cartProducts
        }

      });

    },

    clearCart: () => {
      patchState(store, (state) => {
          
        return { 
          cartProducts: new Map
        }

      });
    },

  })),

  withComputed((store) => ({

    cartCount: computed(() => {

      let cartProductsArray = Array.from(store.cartProducts().values())
      return cartProductsArray.reduce((acc, productCart)=>{
        return acc + productCart.quantity
      },0)

    }),

  })),

 
);