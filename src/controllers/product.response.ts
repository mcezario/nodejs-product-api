import { IProduct } from "../domains/product";

export class ProductResponse {

  name: string;
  price: number;

  constructor(product: IProduct) {
    this.name = product.name;
    this.price = product.price;
  }
}
