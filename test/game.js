var expect  = require("chai").expect;
var request = require("request");


describe("Bigwin game loader", function() {

  describe("Home page", function() {

    var url = "http://localhost:8125";

    it("returns status 200", function(done) {
      request(url, function(error, response, body) {
      	expect(response.statusCode).to.equal(200);
      	done();
      });
    });

    it("returns the game", function(done) {
    	request(url, function(error, response, body) {
      	expect(body).to.include("app-container");
      	expect(body).to.include("page");
      	expect(body).to.include("spinner-container");
      	expect(body).to.include("button-container");
      	done();
      });
    });
  });
});