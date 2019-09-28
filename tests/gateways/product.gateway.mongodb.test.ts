import "reflect-metadata";
import * as chai from 'chai';
import { defaultTo } from "lodash";
import { ProductMongoGateway } from "../../src/gateways/product.gateway.mongodb";
import Product, {IProduct}  from "../../src/domains/product";
import {DbConnection} from "../../src/commons/mongodb.connection";
import { ProductNotFoundException } from "../../src/gateways/product.not.found.exception";

const expect = chai.expect;
const assert = chai.assert;
const gateway = new ProductMongoGateway();

describe("Products mongo gateway", async () => {
    
    before(async () => {
        await DbConnection.initConnection();
    });

    after(async () => {
        await DbConnection.disconnect();
    });

    // Before each method we need to truncate all products from db
    beforeEach(async () => {
        Product.deleteMany({}).then();
    });

    it("Should create a product sucessfully", async () => {

        // Given
        let dateCreation: Date = new Date();
        const productToCreate: any = newProduct(dateCreation);

        // When
        let productCreated: IProduct = await gateway.create(productToCreate).then((data: IProduct) => {
            return data;
        });
        
        // Then
        expect(productCreated._id).not.to.be.undefined;
        expect("P-001").to.be.eq(productCreated.code);
        expect("Product 01").to.be.eq(productCreated.name);
        expect(true).to.be.eq(productCreated.active);
        expect(10.50).to.be.eq(productCreated.price);
        expect(2).to.be.eq(productCreated.quantity);
        expect(dateCreation).to.be.eq(productCreated.dateCreation);
        expect(productCreated.dateModification).to.be.undefined;
    });

    it("Should update a product sucessfully", async () => {
        // Prepare
        let product = await gateway.create(newProduct(new Date())).then((data: IProduct) => {
            return data;
        });

        // Given
        let dateModification = new Date();
        product.name = "Product 02";
        product.dateModification = dateModification;

        // When
        let productUpdated: IProduct = await gateway.update(product).then((data: IProduct) => {
            return data;
        });
        
        // Then
        expect(productUpdated._id).not.to.be.eq(product._id);
        expect("P-001").to.be.eq(productUpdated.code);
        expect("Product 02").to.be.eq(productUpdated.name);
        expect(true).to.be.eq(productUpdated.active);
        expect(10.50).to.be.eq(productUpdated.price);
        expect(2).to.be.eq(productUpdated.quantity);
        expect(productUpdated.dateCreation).to.not.be.null;
        expect(productUpdated.dateModification).to.not.be.null;
    });

    it("Should delete a product by code sucessfully", async () => {
        // Prepare
        let product = await gateway.create(newProduct(new Date())).then((data: IProduct) => {
            return data;
        });

        // Given
        let code: string = product.code;

        // When
        await gateway.delete(code).then(() => {
            assert.isOk;
        });

        // Then
        await gateway.findByCode(code)
            .then((data: IProduct) => {
                assert.fail();
            })
            .catch((err: Error) => {
                assert.isOk;
                expect(err).instanceOf(ProductNotFoundException);
            });
    });

    it("Should get All products sucessfully", async () => {
        // Prepare
        await gateway.create(newProduct(new Date(), "1")).then((data: IProduct) => { });
        await gateway.create(newProduct(new Date(), "2")).then((data: IProduct) => { });
        await gateway.create(newProduct(new Date(), "3")).then((data: IProduct) => { });
        await gateway.create(newProduct(new Date(), "4")).then((data: IProduct) => { });

        // When
        let products: IProduct[] = await gateway.findAll().then((data: IProduct[]) => {
            return data;
        });

        // Then
        let codes: string[] = [];
        products.forEach(function(e){
            codes.push(e.code);
        });

        expect(products.length).to.be.eq(4);
        expect(codes).to.have.members(['1', '2', '3', '4']);
    });


    it("Should get a product by its code sucessfully", async () => {
        // Prepare
        await gateway.create(newProduct(new Date(), "1")).then((data: IProduct) => { });

        // When
        let product: IProduct = await gateway.findByCode("1").then((data: IProduct) => {
            return data;
        });

        // Then
        expect("1").to.be.eq(product.code);
        expect("Product 01").to.be.eq(product.name);
        expect(true).to.be.eq(product.active);
        expect(10.50).to.be.eq(product.price);
        expect(2).to.be.eq(product.quantity);
    });

    function newProduct(dateCreation: Date, code?: string): IProduct {

        return new Product({
            code: defaultTo(code, "P-001"),
            name: "Product 01",
            active: true,
            price: 10.50,
            quantity: 2,
            dateCreation: dateCreation
        });
    }

});