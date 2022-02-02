let suits = ['heart', 'club', 'diamond', 'spade'];
let values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

let textArea = document.getElementById('text-area');
let newGameButton = document.getElementById('new-game-button');
let hitButton = document.getElementById('hit-button');
let standButton = document.getElementById('stand-button');

var dealercardimage = new Array(5);
var playercardimage = new Array(5);

hitButton.style.display = 'none';
standButton.style.display = 'none';

let gameStart = false,
  gameOver = false,
  playWon = false,
  dealerCards = [],
  playerCards = [],
  dealerScore = 0,
  playerScore = 0,
  deck = [];

newGameButton.addEventListener('click', function() {
  gameStarted = true;
  gameOver = false;
  playerWon = false;

  deck = createDeck();
  shuffleDeck(deck);
  for ( var i = 0; i < 5; ++i )
   {
      dealercardimage[ i ] = document.getElementById( "dealer" + (i + 1) );
	  playercardimage[ i ] = document.getElementById( "player" + (i + 1) );
	  playercardimage[i].setAttribute( "src", "poker/blank.png");
	  dealercardimage[i].setAttribute( "src", "poker/blank.png");
   }
  dealerCards = [getNextCard(), getNextCard()];
  playerCards = [getNextCard(), getNextCard()];
  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  standButton.style.display = 'inline';
  showStatus();
})

function createDeck() {
  let deck = []
  for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
    for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
      let card = {
        suit: suits[suitIdx],
        value: values[valueIdx]
      }
      deck.push(card);
    }
  }
  return deck;
}

function shuffleDeck(deck){
  for(let i=0; i<deck.length; i++)
  {
    let swapIdx = Math.trunc(Math.random() *deck.length);
    let tmp = deck[swapIdx];
    deck[swapIdx] = deck[i];
    deck[i] = tmp; 
  }
}

hitButton.addEventListener('click', function(){
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

standButton.addEventListener('click', function(){
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});

function checkForEndOfGame(){
  updateScores();
  
  if(gameOver){
    while(dealerScore<playerScore &&
          playerScore <=21 &&
          dealerScore <=21){
            dealerCards.push(getNextCard());
            updateScores();
    }
  }
    
    if(playerScore>21){
      playerWon=false;
      gameOver = true;
    }
    
    else if(dealerScore>21){
      playerWon = true;
      gameOver = true;
    }
    
    else if(gameOver){
      if(playerScore>dealerScore){
        playerWon = true;
      }
      else{
        playerWon = false;
      }
    }
}

function getCardString(card) {
  return card.value + " of " + card.suit;
}

function getCardImage(card) {
  return "poker/" + card.suit + "_" + card.value + ".png";
}



function showStatus()
{
  if(!gameStarted)
  {
    textArea.innerText = 'Welcome to Blackjack!';
    return; 
  }
  
  let dealerCardString = '';
  for(let i=0; i<dealerCards.length; i++)
  {
    dealerCardString += getCardString(dealerCards[i]) + '\n';
	dealercardimage[i].setAttribute( "src", getCardImage(dealerCards[i]));
  }
  let playerCardString='';
  for(let i=0; i<playerCards.length; i++)
  {
    playerCardString += getCardString(playerCards[i]) + '\n';
	playercardimage[i].setAttribute( "src", getCardImage(playerCards[i]));
  }
  
  updateScores();
  
  textArea.innerText = 'Dealer has:\n' +
                        dealerCardString + 
                        '(score: ' + dealerScore + ')\n\n' +
                        
                        'Player has:\n' +
                        playerCardString + 
                        '(score: ' + playerScore + ')\n\n';
                        
  if(gameOver){
    if(playerWon)
    {
      textArea.innerText += "YOU WIN!";
    }
    else{
      textArea.innerText += "DEALER WINS";
    }
    newGameButton.style.display = 'inline';
    hitButton.style.display = 'none';
    standButton.style.display = 'none';
    
  }
}

function getScore(cardArray){
  var score = 0;
  var acecounter = 0;
  var hasAce = false;
  for(var i=0; i<cardArray.length; i++){
    var card = cardArray[i];
    score += Math.min(10, card.value);
    if(card.value == '1'){
      hasAce = true;
    }
    if(hasAce){
		if (score + 10 <= 21) {
			score += 10;
			acecounter++;
			}
		if (acecounter > 0 && score > 21){
			score -= 10;
			acecounter--;
		}
	  }
    }
	
	return score; 
  }
   


function updateScores(){
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards); 
}


function getNextCard() {
  return deck.shift();
}
