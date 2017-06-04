var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

describe('RestApi', function() {
	describe('/', function() {
		it('should ping', function(done) {
			chai.request('http://127.0.0.1:8080')
			.get('/')
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('text', 'IU4 Ping');
				done();
			});
		});
	});
});
