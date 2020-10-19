const chai = require('chai')
const chaiHttp = require('chai-http');

const app = require('../../index')
const expect = chai.expect

chai.use(chaiHttp);

describe('test summary service routes', () => {
    
    it('test for summary by country - India', (done) => {
        chai.request(app)
            .get('/summary/country/in')
            .end( (err, res) => {
                res.should.have.status(200)
                expect(res.body.countryCode).to.exist
                expect(res.body.countryCode).to.eql('IN')
                res.body.countryName.should.be.eql('India')
                done()
            })
    })

    it('test for summary by state - Kerala', (done) => {
        chai.request(app)
            .get('/summary/state/kl')
            .end( (err, res) => {
                res.should.have.status(200)
                expect(res.body.stateCode).to.exist
                expect(res.body.stateCode).to.eql('KL')
                const deltaAvailable = res.body.deltaAvailable
                if(deltaAvailable){
                    expect( res.body.confirmedToday ).to.exist
                    expect( res.body.recoveredToday ).to.exist
                    expect( res.body.deceasedToday ).to.exist
                }
                done()
            })
    })

})