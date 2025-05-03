import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { CartStore, ProductCart } from '../../stores/cart-store/cart.store'

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [CommonModule, TagModule, DataViewModule, CardModule, ButtonModule, DialogModule, ProductFormComponent],
})
export class ProductListComponent implements OnInit {

  private readonly productsService = inject(ProductsService);
  private readonly cart = inject(CartStore);

  public readonly products = this.productsService.products;

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  readonly ProductCartList = computed(() => {

      let productCartList : Array<ProductCart> = [] 
      this.cart.cartProducts().forEach((value, key)=>{
        productCartList[key] = value
      })
      return productCartList

    }
  );

  ngOnInit() {

    this.productsService.get().subscribe();

  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe();
  }

  public addToCart(product: Product) {
    this.cart.addToCart(product)
  }

  public deleteFromCart(product: Product) {
    this.cart.removeFromCart(product.id)
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe();
    } else {
      this.productsService.update(product).subscribe();
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }

  



  

}
