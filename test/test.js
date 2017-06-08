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

	describe('/download', function() {
		it('downloaded pdf file', function(done) {
			chai.request('http://127.0.0.1:8080')
			.post('/download')
			.send({filename: 'okp.pdf'})
			.end(function(err, res) {
				res.should.have.status(200);
				res.should.have.header('Content-Type', 'application/pdf');
				done();
			});
		});

		it('downloaded jpg file', function(done) {
			chai.request('http://127.0.0.1:8080')
			.post('/download')
			.send({filename: 'murat.jpg'})
			.end(function(err, res) {
				res.should.have.status(200);
				res.should.have.header('Content-Type', 'image/jpeg');
				done();
			});
		});

		it('downloaded wrong request', function(done) {
			chai.request('http://127.0.0.1:8080')
			.post('/download')
			.send({filenam: 'murat.jpg'})
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('reason', 'Wrong request');
				done();
			});
		});

		it('download non-existing file', function(done) {
			chai.request('http://127.0.0.1:8080')
			.post('/download')
			.send({filename: 'bad.png'})
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('reason', 'File not exist');
				done();
			});
		});

		it('download strange file', function(done) {
			chai.request('http://127.0.0.1:8080')
			.post('/download')
			.send({filename: '../server.go'})
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.should.have.property('reason', 'Wrong request');
				done();
			});
		});
	});

	describe('/list', function() {
		it('list files', function(done) {
			chai.request('http://127.0.0.1:8080')
			.get('/list')
			.end(function(err, res) {
				res.should.have.status(200);
				res.body.files.should.be.deep.equal(['murat.jpg','okp.pdf']);
				done();
			});
		});
	});
});
