var Card = require("../games/card");
var Deck = require("../games/deck");

describe("Deck", function() {
    describe("constructor", function() {
       it("constructs a new deck of 52 cards", function() {
            var d = new Deck();
            expect(d.cards.length).equal(52);
            expect(d.dealtCards.length).equal(0);
       }) ;
    });

    describe("shuffle", function() {
        /*
         * because the shuffle is "random", there isn't a good way to test
         * what the new ordering will be, so this just verifies that it is
         * different from the previous by creating two decks, leaving one
         * as the fresh ordering, shuffling the other, and verifying that the
         * two decks are not in the same order
         */
        var deck = new Deck();
        var lookup = new Deck();
        it("has a different ordering than a \"fresh\" deck", function() {
            var same = true;
            for ( var i=0; i < deck.cards.length; i++ ) {
                if ( !deck.cards[i].same(lookup.cards[i])) {
                    same = false;
                    break;
                }
            }
            expect(same).equal(true);

            deck.shuffle();
            same = true;
            for ( var i=0; i < deck.cards.length; i++ ) {
                if ( !deck.cards[i].same(lookup.cards[i])) {
                    same = false;
                    break;
                }
            }
            expect(same).equal(false);
            
        });
    });

    describe("deal", function() {
        var deck = new Deck();
        it("deals out the expected number of cards to the expected number of people", function() {
            expect(deck.cards.length).equal(52);
            expect(deck.dealtCards.length).equal(0);

            var hands = deck.deal(2,5);
            expect(deck.cards.length).equal(42);
            expect(deck.dealtCards.length).equal(10);
            expect(hands.length).equal(2);
            hands.forEach(function(h){
                expect(h.length).equal(5);
            });
        });
    });

    describe("draw", function() {
        var deck = new Deck();
        it("returns a card and moves the card from cards to dealtCards", function() {
            expect(deck.cards.length).equal(52);
            expect(deck.dealtCards.length).equal(0);

            var first = deck.cards[0];
            var card = deck.draw();
            expect(first.same(card)).equal(true);
            expect(deck.dealtCards[0].same(card)).equal(true);
            expect(deck.cards.length).equal(51);
            expect(deck.dealtCards.length).equal(1);
        });
    });

    describe("discard", function() {
        var deck = new Deck();
        var hands = deck.deal(2,5);
        it("finds the card in the dealtCards array and moves it to the cards array", function() {
            expect(deck.cards.length).equal(42);
            expect(deck.dealtCards.length).equal(10);

            deck.discard(hands[0][2]);

            expect(deck.cards.length).equal(43);
            expect(deck.dealtCards.length).equal(9);
        });
    });

    describe("reset", function() {
        var deck = new Deck();
        var hands = deck.deal(2,5);
        it("puts all cards in cards array (in \"fresh\" order)", function() {
            expect(deck.cards.length).equal(42);
            expect(deck.dealtCards.length).equal(10);

            deck.reset();

            expect(deck.cards.length).equal(52);
            expect(deck.dealtCards.length).equal(0);
        });
    });
});