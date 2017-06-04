var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var fs = require('fs');

chai.use(chaiHttp);

describe('RestApi', function() {
	describe('/wrong_url', function() {
		it('page do not exist', function(done) {
			chai.request('http://127.0.0.1:8080')
			.get('/wrong_url')
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('reason', 'Page do not exist');
				done();
			});
		});
	});

	describe('/ping', function() {
		it('ping with get', function(done) {
			chai.request('http://127.0.0.1:8080')
			.get('/ping')
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('text', 'IU4 Ping');
				done();
			});
		});

		it('ping with post', function(done) {
			chai.request('http://127.0.0.1:8080')
			.post('/ping')
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('text', 'IU4 Ping');
				done();
			});
		});
	});

	describe('/upload', function() {
		it('upload jpg file', function(done) {
			chai.request('http://127.0.0.1:8080')
			.post('/upload')
			.attach('payload', 'test/murat.jpg')
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('filename', 'murat.jpg');
				res.body.should.have.property('mimetype', 'image/jpeg');
				done();
			});
		});

		it('upload pdf file', function(done) {
			chai.request('http://127.0.0.1:8080')
			.post('/upload')
			.attach('payload', 'test/okp.pdf')
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('filename', 'okp.pdf');
				res.body.should.have.property('mimetype', 'application/pdf');
				done();
			});
		});

		it('upload not with POST', function(done) {
			chai.request('http://127.0.0.1:8080')
			.get('/upload')
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('reason', 'Wrong method');
				done();
			});
		});

		it('upload file with invalid field name', function(done) {
			chai.request('http://127.0.0.1:8080')
			.post('/upload')
			.attach('invalid_filed_name', 'test/okp.pdf')
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('reason', 'Upload failed');
				done();
			});
		});

		it('upload too big file', function(done) {
			chai.request('http://127.0.0.1:8080')
			.post('/upload')
			.attach('payload', 'test/large.exe')
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('reason', 'File too big');
				done();
			});
		});
	});
});
