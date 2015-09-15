import Player from "../server/utils/player";

describe("Player", function(){
    describe("constructor", function(){
        it("should create a player", function() {
            var p = new Player("Example", {id:0});
            expect(p.name).equal("Example");
            expect(p.ready).equal(false);
        });
    });

    describe("description", function() {
        it("should return an object representing a player", function() {
            var p = new Player("Example", {id:0});
            var desc = p.description();
            expect(desc.name).equal("Example")
            expect(desc.ready).equal(false);
            p.ready = true;
            var readyDesc = p.description();
            expect(readyDesc.ready).equal(true);
        });
    });

    describe("is", function() {
        it("should return true if the socket id matches the test id", function() {
            var p = new Player("Example", {id:0});
            expect(p.is(0)).equal(true);
            expect(p.is(1)).equal(false);
        })
    })
});