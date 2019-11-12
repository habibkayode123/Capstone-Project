const chai = require('chai');
const chaiHttp = require('chai-http');
const describe = require('mocha').describe;
const {app} = require('../server/app.js');

chai.use(chaiHttp);
chai.should();


describe('Endpoint prefix', () => {
    it('should return 400 http status', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
            email:"habib.kayod@yahoo.com",
            password:"Password123"
        })
        .end((request, response) => {
          response.body.should.have.property('status')
          .equal("success")
            
        });
      done();
    });
  });