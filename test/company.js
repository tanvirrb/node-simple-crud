process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let Company = require('../models/CompanyModel');
let should = chai.should();

chai.use(chaiHttp);


describe('Empty Company Collection before testing started', function() {
    it('should empty company collection', function(done) {
        Company.collection.drop();
        done();
    });
});

describe('Test Company RESTful API', function() {
    this.timeout(10000);
    it('should list all companies on /api/companies GET', function(done) {
        chai.request(server)
            .get('/api/companies')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                done();
            });
    });

    it('should create a company on /api/companies POST', function(done) {
        chai.request(server)
            .post('/api/companies')
            .field('name', 'Facebook')
            .field('type', 'Social Network')
            .end(function(err, res){
                //console.log(res);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.name.should.equal('Facebook');
                res.body.should.have.property('type');
                res.body.type.should.equal('Social Network');
                res.body.should.not.have.property('logo');
                done();
            });
    });
});