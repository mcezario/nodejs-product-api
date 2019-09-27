import * as chai from 'chai';
import app from '../../src/index'
import ChaiHttp = require('chai-http');

chai.use(ChaiHttp);
const expect = chai.expect;

describe('Product Controller Tests', function() {

    it('should return a list of products.', () => {

        return chai.request(app).get('/api/products')
        .send().then((res) => {
            expect(res.status).equal(200);
        }).catch((err)=>{
            console.log("ERROR: " + err);
        });
        
    });

});