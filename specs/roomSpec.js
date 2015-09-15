var Room = require("../utils/room");
var Player = require("../utils/player");
var sinon = require("sinon");


describe("Room", function() {
    sinon.stub(Player.prototype, "send", function(type, message) { return; });
    sinon.stub(Player.prototype, "join", function(name, callback) { return; });
    sinon.stub(Player.prototype, "leave", function(name, callback) { return; });

    var owner = new Player("Steinbrenner", {id:0});
    describe("constructor", function() {
        var r = new Room(undefined, owner, "Yankees", "redsucks");
        it("should create a room with the owner as a player", function() {
            expect(r.owner).equal(owner);
            expect(r.people.length).equal(1);
            expect(r.name).equal("Yankees");
            expect(r.password).equal("redsucks"); 
        });
    });

    describe("nameTaken", function() {
        var r = new Room(undefined, owner, "Yankees", "redsucks");            

        it("should return true if a player with the name is in the room", function() {
            expect(r.nameTaken("Steinbrenner")).equal(true);
        });

        it("should return false if no player in the room has the name", function() {
            expect(r.nameTaken("Henry")).equal(false);
        });
    });

    describe("addPlayer", function() {
        var r = new Room(undefined, owner, "Yankees", "redsucks");
        
        it("should fail if the password is incorrect", function() {
            var henry = new Player("Henry", {id:1});
            var joined = r.addPlayer(henry, "redrocks");
            expect(joined).equal(false);
        });

        it("should fail if there is already a player in the room with name", function() {
            var jr = new Player("Steinbrenner", {id:2});
            var joined = r.addPlayer(jr, "myteam");
            expect(joined).equal(false);
        });

        it("should succeed when fail conditions are not met", function() {
            var babe = new Player("Babe", {id:3});
            var joined = r.addPlayer(babe, "redsucks");
            expect(joined).equal(true);
            expect(r.people.length).equal(2);
        });

        it("should fail if there are too many players already in the room", function() {
            var joe = new Player("Joe", {id:4});
            var joined = r.addPlayer(joe, "counttherings");
            expect(joined).equal(false);
        });
    });

    describe("removePlayer", function() {
        it("should remove the player from the room", function() {
            var r = new Room(undefined, owner, "Yankees", "redsucks");
            var jr = new Player("Steinbrenner", {id:2});
            r.people.push(jr);
            expect(r.people.length).equal(2);
            var removed = r.removePlayer(2);
            expect(removed).equal(true);
            expect(r.people.length).equal(1);
        });

        it("should assign a new owner if the owner leaves", function() {
            var r = new Room(undefined, owner, "Yankees", "redsucks");
            var jr = new Player("Steinbrenner", {id:2});
            r.people.push(jr);
            var removed = r.removePlayer(0);
            expect(removed).equal(true);
            expect(r.people.length).equal(1);
            expect(r.owner).equal(jr);
        });
    });

    describe("checkPlayers", function() {
        // do nothing for now
    });

    describe("shouldDelete", function() {
        var r = new Room(undefined, owner, "Yankees", "redsucks");
        it("shouldn't delete the room when there are players present", function() {
            expect(r.people.length).equal(1);
            expect(r.shouldDelete()).equal(false);
        });
        it("should delete the room when there are no players", function() {
            r.removePlayer(0);
            expect(r.people.length).equal(0);
            expect(r.shouldDelete()).equal(true);
        });
    });
});

