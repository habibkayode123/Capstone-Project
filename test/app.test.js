const chai = require('chai');
const chaiHttp = require('chai-http');
const describe = require('mocha').describe;
const {
  app
} = require('../server/app.js');

chai.use(chaiHttp);
chai.should();


describe('All POST route', () => {
  it('Employee or Admin should be able to sign in', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: "habib.kayod@yahoo.com",
        password: "Password123"
      })
      .end((request, response) => {
        response.body.should.have.property('status').equal("success")
        response.should.have.status(200)
        response.body.should.have.property('token')
        
      });
    done();
  });

  it('Admin should be able to create new employee', () => {
    chai.request(app)
      .post('/api/v1/auth/create-use')
      .set('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNocGFzc3dvcmQiOiIkMmIkMTAkTXBteTVrTG4wRmNWWi9zVGp4Y2guZWxzWVJRcFJ4NWwyaVZZY3M3ajgzOU1hWGZ1MEdLZVciLCJlbWFpbCI6ImhhYmlia2F5b2RlbmV3QGdtYWlsLmNvbSIsImpvYnJvbGUiOiJhZG1pbiIsInVzZXJpZCI6MSwiaWF0IjoxNTczMDUxMTg3fQ.0Zq2FC8vS0ZoE63ha9bw8isrMQypTSbEY0SqeF866Y8")
      .send({
        email: "ability@gmail.com",
        password: "Password123",
        firstname: "ability",
        lastname: "unknown",
        jobrole: "teacher",
        address: "diade",
        gender: "female",
        department: "teaching"
      })
      .end((req, res) => {
  
        res.should.have.status(200)
      })
  })

  it("user should be able to post article", () => {
    chai.request(app)
      .post('/api/v1/auth/articles')
      .set('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNocGFzc3dvcmQiOiIkMmIkMTAkV0dFQU9JdkV1a0Rldm1xb0d3eUxjLjhkc0E0aEtVdGlCWTl1TWcudTcxRXdva3NIREIzU1MiLCJlbWFpbCI6ImJpc2lham9rZUBnbWFpbGNvbSIsImpvYnJvbGUiOiJ0ZWFjaGVyIiwidXNlcmlkIjoxMCwiaWF0IjoxNTczMDY4NTQxfQ.MxEl19o74BYAjeRK7oQZceeJVlAyTsGjGaJGPLZ3d8M")
      .send({
        tittle: "using testing framework",
        article: "using the framework hope it work well shall"
      })
      .end((req,res) =>{
        res.should.have.status(200)
        
      })
  })
});