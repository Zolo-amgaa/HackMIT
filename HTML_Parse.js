//Make the command just fetch; convenient
const fetch = require("node-fetch");

//Method to make the fetch call; waits appropriately
async function fetchWordString() {
  //await the response of the fetch call
  let response = await fetch('http://www.mieliestronk.com/corncob_lowercase.txt');
  //proceed once the first promise is resolved
  let data = await response.text();
  //proceed once the second promise is resolved
  return data;
}

//'Main' zone
(async function(){
  //Fetch list of words
  var wordString = await fetchWordString()
  var wordList = wordString.split('\n')

  //Split list of words into 3 tiers
  //console.log(wordList[0])
  var wordListAlpha = new Array();
  var wordListBeta = new Array();
  var wordListGamma = new Array();

  for (i = 0; i < wordList.length; i++) {
    if(wordList[i].length<5) { 
      wordListAlpha.push(wordList[i]) //1-3 letter words
    }else if(wordList[i].length<9) { 
      wordListBeta.push(wordList[i]) //4-7 letter words
    }else { 
      wordListGamma.push(wordList[i]) //7+ letter words
    }
  }

  console.log('Alpha', wordListAlpha[0]);
  console.log('Beta', wordListBeta[0]);
  console.log('Gamma', wordListGamma[0]);

})()