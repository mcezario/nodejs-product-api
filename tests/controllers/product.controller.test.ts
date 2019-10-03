import * as chai from 'chai';
import app from '../../src/index'
import Product, {IProduct} from "../../src/domains/product";
import { ProductRequest } from "../../src/controllers/product.request";
import ChaiHttp = require('chai-http');

chai.use(ChaiHttp);
const expect = chai.expect;
const assert = chai.assert;

let jwtToken: string = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjEyMzQ1NiJ9.gqTdtCgGoqr1ZIB-l_otn2rmO3wKot5LMBL9mBGLKJQ";

describe('Product Controller Tests', function() {

     // Before each method we need to truncate all products from db
     beforeEach(async () => {
        Product.deleteMany({}).then();

        const products: IProduct[] = require('../mocks/products.json');
        Product.insertMany(products).then();
    });

    it('should return all active products.', async() => {
        
        // When
        await chai.request(app).get('/api/products').send().then((res) => {

            // Then
            expect(res.status).to.be.eq(200);
            expect(res.body.length).to.be.eq(3);

            expect(res.body[0].code).to.be.eq('P-001');
            expect(res.body[0].name).to.be.eq('Product 01');
            expect(res.body[0].price).to.be.eq(2.22);
            expect(res.body[0].quantity).to.be.eq(2);

            expect(res.body[1].code).to.be.eq('P-002');
            expect(res.body[1].name).to.be.eq('Product 02');
            expect(res.body[1].price).to.be.eq(87.90);
            expect(res.body[1].quantity).to.be.eq(99);

            expect(res.body[2].code).to.be.eq('P-003');
            expect(res.body[2].name).to.be.eq('Product 03');
            expect(res.body[2].price).to.be.eq(213.99);
            expect(res.body[2].quantity).to.be.eq(1);
        }).catch((err) => {

            // Then
            assert.fail();
        });
        
    });

    it('should create a product successfully.', async() => {
        // Give
        let request: ProductRequest = require('../mocks/product-05.json');

        // When
        await chai.request(app)
            .post('/api/products')
            .set('authorization', jwtToken)
            .send(request).then((res) => {

            // Then
            expect(res.status).to.be.eq(201);
            expect(res.body).to.be.empty;
           
        }).catch((err) => {

            // Then
            assert.fail();
        });
        
    });

    it('should validate the creation of a new product that already exists in the database.', async() => {
        // Give
        let request: ProductRequest = require('../mocks/product-01.json');

        // When
        await chai.request(app)
            .post('/api/products')
            .set('authorization', jwtToken)
            .send(request).then((res) => {

            // Then
            expect(res.status).to.be.eq(422);
            expect(res.body[0].code).to.be.eq('C-001');
            expect(res.body[0].message).to.be.eq('The product has already been registered.');

        }).catch((err) => {
            
            // Then
            assert.fail();

        });
        
    });

    it('should update a product successfully.', async() => {
        // Give
        let request: ProductRequest = require('../mocks/product-01.json');
        request.name = "Product 01 - Update";

        // When
        await chai.request(app)
            .put('/api/products')
            .set('authorization', jwtToken)
            .send(request).then((res) => {

            // Then
            expect(res.status).to.be.eq(204);
            expect(res.body).to.be.empty;
           
        }).catch((err) => {

            // Then
            assert.fail();
        });
        
    });

    it('should delete a product successfully.', async() => {
        // Give
        let request: ProductRequest = require('../mocks/product-01.json');

        // When
        await chai.request(app)
            .delete('/api/products/' + request.code)
            .set('authorization', jwtToken)
            .send(request).then((res) => {

            // Then
            expect(res.status).to.be.eq(204);
            expect(res.body).to.be.empty;
           
        }).catch((err) => {

            // Then
            assert.fail();
        });
        
    });

});