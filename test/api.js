process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let Company = require('../models/CompanyModel');
let should = chai.should();
let fs = require('fs');

chai.use(chaiHttp);


describe('Empty Company Collection before every test started', function() {

    it('should empty Company Collection before test started', function() {
        beforeEach(function(done){
            let newCompany = new Company({
                name:'Zapier',
                type: 'Web Service'
            });

            newCompany.save(function (err) {
                done();
            })
        });
    });
});

describe('Empty Company Collection after every test finished', function() {

    it('should empty Company Collection after test finished', function() {
        afterEach(function(done){
            Company.collection.drop();
            done();
        });
    });
});

describe('Test Company RESTful API', function() {
    this.timeout(10000);

    it('should list all companies on /api/companies GET', function (done) {
        chai.request(server)
            .get('/api/companies')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('name');
                res.body[0].should.have.property('type');
                res.body[0].name.should.equal('Zapier');
                res.body[0].type.should.equal('Web Service');
                done();
            });
    });

    it('should get a company with ID on /api/companies/:id get', function (done) {
        let newCompany = new Company({
            name: 'Google Inc',
            type: 'Search Engine'
        });
        newCompany.save(function (err, data) {
            chai.request(server)
                .get('/api/companies/' + data._id)
                .end(function (err, res) {
                    //console.log(res);
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('name');
                    res.body.name.should.equal('Google Inc');
                    res.body.should.have.property('type');
                    res.body.type.should.equal('Search Engine');
                    res.body.should.not.have.property('logo');
                    done();
                });
        })

    });

    it('should create a company on /api/companies POST', function (done) {
        chai.request(server)
            .post('/api/companies')
            .field('name', 'Yahoo')
            .field('type', 'News')
            .attach('logo', fs.readFileSync('./test/image/pp.jpg'), 'logo.jpg')
            .end(function (err, res) {
                //console.log(res);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('_id');
                res.body.should.have.property('name');
                res.body.name.should.equal('Yahoo');
                res.body.should.have.property('type');
                res.body.type.should.equal('News');
                res.body.should.have.property('logo');
                res.body.should.have.property('logo_path');
                res.body.logo_path.should.be.a('string');
                res.body.logo_path.should.equal('public/images/logos/thumb/');
                done();
            });
    });

    it('should update a single company on /api/companies/:id PUT', function (done) {
        chai.request(server)
            .get('/api/companies')
            .end(function (err, res) {
                chai.request(server)
                    .put('/api/companies/' + res.body[0]._id)
                    .field('name', 'Zappi')
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.should.have.property('ok');
                        res.body.ok.should.equal(1);
                        res.body.should.have.property('nModified');
                        res.body.nModified.should.equal(1);
                        res.body.should.have.property('n');
                        res.body.n.should.equal(1);
                        done();
                    });
            });
    });
});