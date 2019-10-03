import "reflect-metadata";
import * as chai from 'chai';
import { defaultTo } from "lodash";
import { ObjectID } from "mongodb";
import { ProductMongoGateway } from "../../src/gateways/product.gateway.mongodb";
import Product, {IProduct}  from "../../src/domains/product";
import { mock, instance, when, verify } from 'ts-mockito';
import { IProductGateway } from "../../src/gateways/product.gateway";
import { ProductService } from "../../src/usecases/product.service";

const expect = chai.expect;
const assert = chai.assert;
const objectId = new ObjectID();

describe("Unit test to cover Product UC.", async () => {

    let gateway: IProductGateway;
    let productService: ProductService;

    beforeEach(() => {
        gateway = mock(ProductMongoGateway);
        productService = new ProductService(instance(gateway));
    });
    
    it("Should create a product sucessfully", async () => {
        // Given
        let product: IProduct = newProduct();

        // Prepare
        let productMock: IProduct = newProductInserted(product);
        when(gateway.create(product)).thenResolve(productMock);

        // When
        let productinserted: IProduct = await productService.create(product).then((data: IProduct) => { return data; });

        // Then
        expect(objectId).to.be.eq(productinserted._id);
        expect("P-001").to.be.eq(productinserted.code);
        expect("Product 01").to.be.eq(productinserted.name);
        expect(true).to.be.eq(productinserted.active);
        expect(10.50).to.be.eq(productinserted.price);
        expect(2).to.be.eq(productinserted.quantity);
        expect(productinserted.dateCreation).to.not.be.null;
        expect(productinserted.dateModification).to.be.undefined;
        verify(gateway.create(product)).once();
    });

    it("Should update a product sucessfully", async () => {
        // Given
        let product: IProduct = newProductInserted(newProduct());

        // Prepare
        let productMock: IProduct = newProductUpdated(product);
        productMock.name = "Product 01 - Updated";
        when(gateway.update(product)).thenResolve(productMock);
        
        // When
        let productUpdated: IProduct = await productService.update(product).then((data: IProduct) => { return data; });

        // Then
        expect(objectId).to.be.eq(productUpdated._id);
        expect("P-001").to.be.eq(productUpdated.code);
        expect("Product 01 - Updated").to.be.eq(productUpdated.name);
        expect(true).to.be.eq(productUpdated.active);
        expect(10.50).to.be.eq(productUpdated.price);
        expect(2).to.be.eq(productUpdated.quantity);
        expect(productUpdated.dateCreation).to.not.be.null;
        expect(productUpdated.dateModification).to.not.be.null;
        verify(gateway.update(product)).once();
        verify(gateway.findByCode(product.code)).never();
    });

    it("Should delete a product sucessfully", async () => {
        // Given
        let product: IProduct = newProductInserted(newProduct());

        // Prepare
        when(gateway.delete(product.code)).thenResolve();
        
        // When
        await productService.delete(product.code).then(() => {
            assert.ok;
        });

        // Then
        verify(gateway.delete(product.code)).once();
        verify(gateway.findByCode(product.code)).never();
    });

    it("Should get a all active products sucessfully", async () => {
        // Given
        let product1: IProduct = newProductInserted(newProduct(), "P-001");
        let product2: IProduct = newProductInserted(newProduct(), "P-002");
        let product3: IProduct = newProductInserted(newProduct(), "P-003");
        let product4: IProduct = newProductInserted(newProduct(), "P-004");
        product4.active = false;

        // Prepare
        when(gateway.findAll()).thenResolve([product1, product2, product3, product4]);
        
        // When
        let products: IProduct[] = await productService.getAll().then((data: IProduct[]) => {
            return data;
        });

        // Then
        let codes: string[] = [];
        products.forEach(function(e){
            codes.push(e.code);
        });

        expect(products).to.have.lengthOf(3);
        expect(codes).to.have.members(['P-001', 'P-002', 'P-003']);
        verify(gateway.findAll()).once();
    });

    function newProductUpdated(product: IProduct): IProduct {
        let productUpdated: IProduct = newProductInserted(product);
        productUpdated.dateModification = new Date();

        return productUpdated;
    }

    function newProductInserted(product: IProduct, code?: string): IProduct {
        return new Product({
            _id: objectId,
            code: defaultTo(code, product.code),
            name: product.name,
            active: product.active,
            price: product.price,
            quantity: product.quantity,
            dateCreation: new Date()
        });
    }

    function newProduct(code?: string): IProduct {
        return new Product({
            code: defaultTo(code, "P-001"),
            name: "Product 01",
            active: true,
            price: 10.50,
            quantity: 2
        });
    }

});