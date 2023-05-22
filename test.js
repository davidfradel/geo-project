const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../geo-project');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Routes API', () => {
    it('should GET all the routes', (done) => {
        chai.request(server)
            .get('/routes')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                done();
            });
    });

    it(`should GET a specific route with id 287631248083171e9d577634`, (done) => {
        chai.request(server)
            .get(`/routes/287631248083171e9d577634`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                done();
            });
    });
    

    it('should return 404 for non-existing route id', (done) => {
        chai.request(server)
            .get('/routes/non_existing_id')
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should GET the total distance within a time range', (done) => {
        const start = '2022-01-01T00:00:00Z'; 
        const end = '2022-12-31T23:59:59Z';
        chai.request(server)
            .get(`/distance?start=${start}&end=${end}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('totalDistance');
                done();
            });
    });

    it('should return zero distance for non-matching time range', (done) => {
        const start = '2030-01-01T00:00:00Z'; 
        const end = '2030-12-31T23:59:59Z';
        chai.request(server)
            .get(`/distance?start=${start}&end=${end}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('totalDistance').that.equals(0);
                done();
            });
    });
});

describe('Routes API Extended Tests', () => {
    it('should return 404 for POST method on /routes', (done) => {
        chai.request(server)
            .post('/routes')
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should return 404 for DELETE method on /routes', (done) => {
        chai.request(server)
            .delete('/routes')
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should return 400 for missing start date', (done) => {
        const end = '2022-12-31T23:59:59Z';
        chai.request(server)
            .get(`/distance?end=${end}`)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return 400 for missing end date', (done) => {
        const start = '2022-01-01T00:00:00Z'; 
        chai.request(server)
            .get(`/distance?start=${start}`)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return 400 for invalid start date', (done) => {
        const start = 'invalid_date'; 
        const end = '2022-12-31T23:59:59Z';
        chai.request(server)
            .get(`/distance?start=${start}&end=${end}`)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return 400 for invalid end date', (done) => {
        const start = '2022-01-01T00:00:00Z'; 
        const end = 'invalid_date';
        chai.request(server)
            .get(`/distance?start=${start}&end=${end}`)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should return 400 for end date before start date', (done) => {
        const start = '2022-12-31T23:59:59Z'; 
        const end = '2022-01-01T00:00:00Z';
        chai.request(server)
            .get(`/distance?start=${start}&end=${end}`)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });
});

describe('Routes API Additional Tests', () => {
    it('should return 400 for start date later than current date', (done) => {
        const start = new Date().toISOString();
        const end = '2022-01-01T00:00:00Z';
        chai.request(server)
            .get(`/distance?start=${start}&end=${end}`)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should handle high load', (done) => {
        const promises = [];
        for (let i = 0; i < 100; i++) {
            promises.push(chai.request(server).get('/routes'));
        }

        Promise.all(promises)
            .then((responses) => {
                responses.forEach(res => expect(res).to.have.status(200));
                done();
            })
            .catch(err => done(err));
    });

    it('should handle high concurrency', (done) => {
        let completedRequests = 0;

        for (let i = 0; i < 100; i++) {
            chai.request(server)
                .get('/routes')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    completedRequests++;
                    if (completedRequests === 100) done();
                });
        }
    });
});


