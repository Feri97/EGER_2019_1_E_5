//globális változók
var gameState;
var codeArr = Array(4);
var textOutArr = [];

window.onload = function WindowLoad(event) {
	//gamestate a játék állapotának nyomonkövetésére
	var gameStateJSON = window.localStorage.getItem("mastermindGameState"); 
	if (gameStateJSON) { 
		gameState = JSON.parse(gameStateJSON);
		codeArr = gameState['codeArr'];
		newGame();
	}
	else {
	
		newGame();
	}


}

function autotab(current,to) //tovább lépteti a kurzort a következő mezőbe, ha abba már irtak
{
    if (current.getAttribute && 
      current.value.length==current.getAttribute("maxlength")) {
        to.focus() 
        }
}

function clear() //mezők tartalmának törlése azután, ha tipp el lett küldve.
{
	document.getElementById("txtGuessPosn0").value = "";
	document.getElementById("txtGuessPosn1").value = "";
	document.getElementById("txtGuessPosn2").value = "";
	document.getElementById("txtGuessPosn3").value = "";

}

//új játékkor új kód generálása random számokkal
function newGame() {
	textOutArr = [];
	for (var i = 0; i < 4; i++) {
		var rnd = Math.floor(Math.random() * 10);
		var isMatching = codeArr.indexOf(rnd); //megnézzük szerepel-e már a kódban az adott szám
		if(isMatching == -1){
			codeArr[i] = rnd; 
		}
		else{
			i--;
		}
	}
	console.log(codeArr); //teszteléshez consoleban kiíródik a kód
	gameState = { "codeArr": codeArr, "codeNotBroken": 1, "guessCount": 0 };

	localStorage.setItem('mastermindGameState', JSON.stringify(gameState));

	var textOut = document.getElementById("txaOutputWindow");
	textOut.value = "";
	document.getElementById("txtGuessPosn0").value = "";
	document.getElementById("txtGuessPosn1").value = "";
	document.getElementById("txtGuessPosn2").value = "";
	document.getElementById("txtGuessPosn3").value = "";
}

function processGuess(guessArr) {
	
	var rightPlaceCount = 0;
	var wrongPlaceCount = 0;
	var i;
	//segéd tömb a rosz helyen lévő számokhoz
	var searchArr = [];
	
	//Ha a szám nincs a helyén hozzáadjuk a segéd tömbhöz
	for (i = 0; i < 4; i++) {
		if (guessArr[i] == codeArr[i]) {
			rightPlaceCount++;
		}
		else {
			searchArr[i] = guessArr[i];
		}
	}
	//ha nem találtuk el a kódot ellenőrzi, hogy az általunk adott kód számai benne vannak e a kódban más helyen
	//(ahol még nem találtuk el az adott számot)
	if (rightPlaceCount != 4) {
		var j;
		for (i = 0; i < codeArr.length; i++) {
			for(j = 0; j < searchArr.length; j++){
				if(codeArr[i] == searchArr[j]){
					wrongPlaceCount++;
					searchArr[j] = null;
				}
			}
		}
	}
	//visszatérünk az aktuális gamestate-el
	return { "rightPlaceCount": rightPlaceCount, "wrongPlaceCount": wrongPlaceCount };
}

function parse() {
	
	//növeli a próbálkozások értékét és újra kezdi a játékot ha túlment a maxon
	gameState['guessCount'] = Number(gameState['guessCount']) + 1;
 
	if ((gameState['guessCount'] == 16) || (gameState['codeNotBroken'] == 0)) {
		newGame();
		return;
	}

	var textOut = document.getElementById("txaOutputWindow");

	//feltőlti a próbálkozás tömböt az input mezőkből
	var guessArr = [ document.getElementById("txtGuessPosn0").value
		, document.getElementById("txtGuessPosn1").value
		, document.getElementById("txtGuessPosn2").value
		, document.getElementById("txtGuessPosn3").value
	];
	
	var newStateArray = processGuess(guessArr);
	

	//kiírja az aktuális állapotot az outputra
	textOutArr.unshift("Tipp #" + gameState['guessCount'] + ": " 
    + guessArr[0] 
    + guessArr[1] 
    + guessArr[2] 
    + guessArr[3] 
    + "\njó helyen van: " + newStateArray['rightPlaceCount'] 
    + ", rossz helyen van: " + newStateArray['wrongPlaceCount'] 
    + "\n\n");
		
	//győzelem esetén
	if (newStateArray['rightPlaceCount'] == 4) {
		gameState['codeNotBroken'] = 0;
		textOutArr.unshift( "Gratulálok!!\nNyertél!!\n");
    	
	}
	//túl sok próba esetén
	else if (gameState['guessCount'] == 15) {
    	
		gameState['codeNotBroken'] = 0;
		textOutArr.unshift( "Elfogytak a lehetőségek!\n\nA helyes kód: "
			+ codeArr[0] 
			+ codeArr[1]
			+ codeArr[2] 
			+ codeArr[3] 
			+ "\n\nTöltsd újra az oldalt egy új játékhoz\n\n");
		
	}
	
	textOut.value = "";
	
	for(var i = 0; i < textOutArr.length; i++){
		textOut.value += textOutArr[i];
		
	}
	
	localStorage.setItem('mastermindGameState', JSON.stringify(gameState));
	clear();
}