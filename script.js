const suits = [ 'heart', 'club', 'diamond', 'spade' ];
const values = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13' ];
let textArea = document.getElementById( 'text-area' );
let textArea2 = document.getElementById( 'text-area2' );
let newGameButton = document.getElementById( 'new-game-button' );
let hitButton = document.getElementById( 'hit-button' );
let standButton = document.getElementById( 'stand-button' );
let resetButton = document.getElementById( 'reset-button' );

let dealercardimage = new Array(5);
let playercardimage = new Array(5);

hitButton.style.display = 'none';
standButton.style.display = 'none';

let	gameStart = false,
	gameOver = false,
	playerWon = false,
	playerTie = false,
	playerBust = false,
	dealerBust = false,
	blackjack = false,
	fivecard = false,
	dealerCards = new Array(5),
	playerCards = new Array(5),
	dealerScore = 0,
	playerScore = 0,
	winsCount,
	losesCount,
	deck = [];

newGameButton.addEventListener( 'click', function(){
	gameStarted = true;
	gameOver = false;
	playerWon = false;
	playerTie = false;
	playerBust = false;
	dealerBust = false;
	blackjack = false;
	fivecard = false;
	deck = createDeck();
	shuffleDeck(deck);
	//重置參數至初始狀態及做洗牌動作
	for ( var i = 0; i < 5; ++i )
	{
		dealercardimage[i] = document.getElementById( "dealer" + (i + 1) );
		playercardimage[i] = document.getElementById( "player" + (i + 1) );
		playercardimage[i].setAttribute( "src", "poker/blank.png");
		dealercardimage[i].setAttribute( "src", "poker/blank.png");
	}
	//把全部牌做清空的表現
	dealerCards = [ getNextCard(), getNextCard() ];
	playerCards = [ getNextCard(), getNextCard() ];	//派2張牌給莊家及玩家
	newGameButton.style.display = 'none';
	hitButton.style.display = 'inline';
	standButton.style.display = 'inline';
	checkForEndOfGame();	//判斷遊戲是否結束
	showStatus();			//顯示牌面和結果文字狀態
})

hitButton.addEventListener( 'click', function(){
	playerCards.push( getNextCard() );
	checkForEndOfGame();
	showStatus();
});

standButton.addEventListener( 'click', function(){
	gameOver = true;
	checkForEndOfGame();
	showStatus();
});

function createDeck()	//構築卡牌，由4個花色和1～13的數字陣列組成52張牌
{
	let deck = []
	for ( let suitIdx = 0; suitIdx < suits.length; suitIdx++ ) 
	{
		for ( let valueIdx = 0; valueIdx < values.length; valueIdx++ ) 
		{
			let card = { suit: suits[suitIdx],value: values[valueIdx] }
			deck.push(card);
		}
	}
  return deck;
}

function shuffleDeck(deck)	//洗牌
{
	for( let i=0; i<deck.length; i++ )
	{
		let swapIdx = Math.trunc( Math.random() *deck.length );
		let tmp = deck[swapIdx];
		deck[swapIdx] = deck[i];
		deck[i] = tmp; 
	}
}

function checkForEndOfGame()	//判斷遊戲結束條件
{
	updateScores();
  
	if( dealerScore == 21 && dealerCards.length == 2 )
	{
		blackjack = true;
		playerWon = false;
		gameOver = true;
	}
	if( playerScore==21 && playerCards.length == 2 )
	{
		blackjack = true;
		playerWon = true;
		gameOver = true;
	}
	if( dealerScore==21 && dealerCards.length == 2 && playerScore==21 && playerCards.length == 2 )
	{
		blackjack = false;
		playerWon = false;
		playerTie = true;
		gameOver = true;
	}
	if( playerCards.length == 5 )
	{
		fivecard = true;
		if ( playerScore<=21 ) 
		{
			playerWon = true;
		}
		else 
		{
			playerWon = false;
		}
		gameOver = true;
	}
  
	if( gameOver && blackjack==false && fivecard == false && dealerCards.length < 5 )
	{
		while( dealerScore<playerScore && playerScore <=21 && dealerScore <=21 && dealerCards.length < 5 )
		{
			dealerCards.push(getNextCard());
			updateScores();
		}
	}
  
	if( dealerCards.length == 5 )
	{
		fivecard = true;
		if (dealerScore<=21) 
		{
			playerWon = false;
		}
		else 
		{
			playerWon = true;
		}
		gameOver = true;
	}
	
	if( playerScore>21 )
	{
		playerWon=false;
		playerBust=true;
		gameOver = true;
	}
    else if( dealerScore>21 )
	{
		playerWon = true;
		dealerBust = true;
		gameOver = true;
	}
    else if( gameOver )
	{
		if( playerScore>dealerScore && dealerCards.length != 5 )
		{
			playerWon = true;
		}
		else if( playerScore == dealerScore )
		{
			playerTie = true;
			if( fivecard )
			{
				playerTie = false;
			}
		}
		else if( playerScore <= 21 && playerCards.length == 5 )
		{
			playerWon = true;
		}
		else
		{
			playerWon = false;
		}
	}
}

function getCardString(card) 
{
	return card.value + " of " + card.suit;
}

function getCardImage(card)		//抓取圖片檔案
{
	return "poker/" + card.suit + "_" + card.value + ".png";
}

function showStatus()	//顯示牌面和結果文字狀態
{
  if( !gameStarted )
	{
		textArea.innerText = 'Welcome to Blackjack!';
		return; 
	}
  
	for( let i=0; i<dealerCards.length; i++ )
	{
		dealercardimage[i].setAttribute( "src", getCardImage( dealerCards[i ] ) );
	}
  
	for( let i=0; i<playerCards.length; i++ )
	{
		playercardimage[i].setAttribute( "src", getCardImage( playerCards[i] ) );
	}
  
	if ( gameOver == false )
	{
		dealercardimage[0].setAttribute( "src", "poker/cover.png" );
	}
  
	checkForEndOfGame();
	textArea.innerText =  'You have ' + playerScore + '. Hit or Stand?';

  if( gameOver )
	{
		textArea.innerText = '';
		if( playerWon )
		{
			if( blackjack )
			{
				textArea.innerText += "You get a BLACKJACK. ";
			}
			if( dealerBust )
			{
				textArea.innerText += "Dealer BUSTED. ";
			}
			if( fivecard && playerCards.length == 5 )
			{
				textArea.innerText += "You get FIVECARDS without busting. ";
			}
			textArea.innerText += "YOU WIN!";
			localStorage.winsCount = Number( localStorage.winsCount ) + 1;
			updateWL();
		}
		else if( playerTie )
		{
			textArea.innerText += "Both of you have same points.It is a TIE."
		}
		else
		{
			if( blackjack )
			{
				textArea.innerText += "Dealer get a BLACKJACK. ";
			}
			if( playerBust )
			{
				textArea.innerText += "You BUSTED. ";
			}
			if( fivecard && dealerCards.length == 5 )
			{
				textArea.innerText += "Dealer get FIVECARDS without busting. ";
			}
			if( playerScore <= 21 && dealerScore <= 21 && blackjack == false && fivecard == false)
			{
				textArea.innerText += "You have " + playerScore + " and dealer has " + dealerScore + ". ";
			}
			textArea.innerText += "DEALER WINS.";
			localStorage.losesCount = Number( localStorage.losesCount ) + 1;
			updateWL();
		}
		newGameButton.style.display = 'inline';
		hitButton.style.display = 'none';
		standButton.style.display = 'none';
	}
}

function getScore( cardArray )	//點數計算
{
	var score = 0;
	var acecounter = 0;
	var hasAce = false;
	for( var i = 0; i < cardArray.length; i++ )
	{
		var card = cardArray[i];
		score += Math.min( 10, card.value );	//J,Q,K都是以數字11～13表示，將11～13調整成10點
		if(card.value == '1')
		{
			hasAce = true;
		}
		if( hasAce )	//用於控制Ace的點數，將1點調整成11點
		{
			if ( score + 10 <= 21 )
			{
				score += 10;
				acecounter++;
			}
			if ( acecounter > 0 && score > 21 )		//考慮到因為計算為11點會爆牌時調整回1點
			{
				score -= 10;
				acecounter--;
			}
		}
    }
	return score; 
}
   
function updateScores()
{
	dealerScore = getScore( dealerCards );
	playerScore = getScore( playerCards ); 
}

function getNextCard()
{
	return deck.shift();
}

function resetWL()	//重置勝敗記錄
{
	localStorage.setItem( "winsCount", "0" );
	localStorage.setItem( "losesCount", "0" );
	textArea2.innerText = 'Wins:' + localStorage.getItem( "winsCount" ) + ' Loses:' + localStorage.getItem( "losesCount" );
}

function updateWL()	//更新勝敗記錄
{
	textArea2.innerText = 'Wins:' + localStorage.getItem( "winsCount" ) + ' Loses:' + localStorage.getItem( "losesCount" );
}

function start()	//使用LocalStorage記錄勝敗
{
	if ( !window.sessionStorage.getItem( "herePreviously" ) )
	{
		sessionStorage.setItem( "herePreviously", "true" );
		localStorage.setItem( "winsCount", "0" );
		localStorage.setItem( "losesCount", "0" );
	}
	resetButton.addEventListener( "click", resetWL, false );
	textArea2.innerText = 'Wins:' + localStorage.getItem( "winsCount" ) + ' Loses:' + localStorage.getItem( "losesCount" );
}

window.addEventListener( "load", start, false );