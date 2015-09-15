import {game as TicTacToe} from "../server/games/tictactoe";
import exceptions from "../server/games/exceptions";
import Player from "../server/utils/player";
import sinon from "sinon";

describe("TicTacToe", function() {
    describe("constructor", function() {
        var one = new Player("one", {id:1});
        var two = new Player("two", {id:2});
        var three = new Player("three", {id:3});
        var game = new TicTacToe([one, two]);

        it("throws an error if players.length is not 2", function() {
            assert.throws(function(){
                let game = new TicTacToe([one]);
            }, exceptions.UserCount, "expected 2 players, got 1");

            assert.throws(function(){
                let game = new TicTacToe([one, two, three]);
            }, exceptions.UserCount, "expected 2 players, got 3");
        });
    });
});