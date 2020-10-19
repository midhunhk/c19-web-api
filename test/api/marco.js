const chai = require('chai')
const chaiHttp = require('chai-http');
//const request = require('supertest')

const app = require('../../index')

const expect = chai.expect()
const should = chai.should()

chai.use(chaiHttp);

describe('test static routes', () => {
    
    it('testing marco', (done) => {
        chai.request(app)
            .get('/marco')
            .end( (err, res) => {
                res.should.have.status(200)
                res.text.should.be.eql('polo')
                done()
            })
    })

    it('testing about', (done) => {
        chai.request(app)
            .get('/about')
            .end( (err, res) => {
                res.should.have.status(200)
                res.text.should.contain('C19 Web API')
                done()
            })
    })

})