var Card = require("./card");

function Deck() {
  this.cards = freshDeck();
  // cards that have been dealt (and so shouldn't be shuffled/redealt)
  this.dealtCards = [];
}

/*
 * Fisher Yates shuffle
 */
Deck.prototype.shuffle = function() {
  var temp;
  var rand;

  for (var i=this.cards.length-1; i > 0; i--) {
    rand = Math.floor(Math.random() * i);
    temp = this.cards[i];
    this.cards[i] = this.cards[rand];
    this.cards[rand] = temp;
  }
};

/*
 * Deal people*cards number of cards to the players. If shuffleFirst is true,
 * the card will be shuffled prior to dealing. Thd dealt cards will be removed
 * from the cards array and added to the dealtCards array. If there are fewer
 * cards left in the deck than people*cards, all of the cards will be dealt and
 * some players will not get a full hand.
 */
Deck.prototype.deal = function(people, cards, shuffleFirst) {
  if ( shuffleFirst ) {
    this.shuffle();
  }
  var dealCount = Math.min(people * cards, this.cards.length);
  var dealtCards = this.cards.splice(0, people*cards);
  this.dealtCards = this.dealtCards.concat(dealtCards);
  var hands = []
  for ( var i=0; i<people; i++ ) {
    hands.push(i);
  }
  return hands.map(function(index){
    var cards = [];
    for ( var pos=index; pos < dealCount; pos += people ) {
      cards.push(dealtCards[pos]);
    }
    return cards;
  });
};

/*
 * Returns the 0 index card in the deck. That card is moved from this.cards
 * to this.dealtCards
 */
Deck.prototype.draw = function() {
  var card = this.cards.shift();
  this.dealtCards.push(card);
  return card;
};

/*
 * A discarded card is located in the dealtCards array and moved to the cards
 * array.
 */
Deck.prototype.discard = function(card){
  // find the card in the
  var index = -1;
  this.dealtCards.some(function(c, i){
    if ( c.same(card) ) {
      index = i;
      return true;
    }
  });
  if ( index !== -1 ) {
    var returnedCard = this.dealtCards.splice(index, 1);
    this.cards.push(returnedCard);
  }
};

Deck.prototype.reset = function() {
  this.cards = freshDeck();
  this.dealtCards = [];
};

/*
 * UTILITY FUNCTIONS
 */

function freshDeck() {
  var deck = [];
  var cards = [2,3,4,5,6,7,8,9,10,"Jack","Queen","King","Ace"];
  var suits = ["Diamonds", "Hearts", "Spades", "Clubs"];
  return deck.concat.apply(deck, suits.map(function(suit){
    return cards.map(function(value) {
      return new Card(suit, value);
    });
  }));
}

module.exports = Deck;
