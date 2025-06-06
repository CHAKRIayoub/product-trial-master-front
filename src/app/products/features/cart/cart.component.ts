import { Component, inject } from '@angular/core';
import { Product } from 'app/products/data-access/product.model';
import { CartStore } from 'app/products/stores/cart-store/cart.store';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [BadgeModule, OverlayPanelModule, TableModule, ButtonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {

  public readonly cart = inject(CartStore);

  public deleteFromCart(product: Product) {

    this.cart.removeFromCart(product.id)
  
  }

}