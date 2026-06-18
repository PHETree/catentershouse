(function(){
		 var $ = function (id) {return document.getElementById(id); }

		 window.onload = function OnLoad() 
		 {
			window.scrollTo(0,1);
		 }     
	 
}());

	// ********************************** An Interactive TOUCH game ************************************** //
	 
	// Game summary:  Match the sentence with the picture. Fill in the correct verb tense in the sentence.  Mar. 31/26
	 
	// Adding touchmove function. First, experiment with moving the house by touch.   Apr. 2 
	
	// Add answer buttons to the right of the image, e.g. 'went' 'is going', 'has gone'. Click on the Button
	// you think is the correct answer.   Apr. 9
    // DOWN ARROW has been removed in this version.  And 'draggable' property has been removed.  Apr. 10
	// It is time to move the clicked on answer to the blank space in the sentence.   Apr. 17
	// Setup the second scene. The cat 'went' or 'has gone' into the house   Apr. 24
	// Determine the players' score and display   May 13
	// It is time for the player to type in his or her answer attempts  May 20
	// WRT the above intention, the player now chooses the words to appear in the answer sentence. This task completed on June 4th
    // Check the players answer at the end of the game.  June 9
   
(function () {
	var $$ = function (id) {return document.querySelector(id); }

	 /* var $ = function (id) {return document.getElementById(id); } */


	Execute();
		
	function Execute()
	{	
		var LOADING = 0;
		var PLAY = 1;
		var TYPING = 3;
		var gameState = LOADING;

	// Arrays for game objects
	var assetsToLoad = [], assetsLoaded = 0;
	 
	// Sprite object. Chatgpt says this is the professional way
	function createSprite() {
	  return {
		srcX: 0,
		srcY: 0,
		srcWdth: 114,
		srcHigh: 145,
		x: 0,
		y: 0,
		width: 70,    // 70 
		height: 93,    // 93
		visible: true,
		direction: 1,
		vx: 0,
		vy: 0,
		Id: 0,
		//Getters to define the left, top, bottom and right sides
			left: function()
			{
				return this.x;
			},
			right: function()
			{
				return this.x + this.width;
			},
			top: function()
			{
				return this.y;
			},
			bottom: function()
			{
				return this.y + this.height;
			},
			
			// Getters for vectors to determine if two circles are touching
			centerX : function()
			{
				return this.x + (this.width / 2);
			},
			centerY: function()
			{
				return this.y + (this.height / 2);
			},
			halfWidth: function()
			{
				return this.width / 2;
			},
			halfHeight: function()
			{
				return this.height / 2;
			}
	  };
	} 

  // Some arrays and variables
	var sprites = [];
	var answerCodes = [4,9,10,11];   // isgoing, hasgone, went and went
	var plyrsAnsCodes = [];
	var dotAnswers = []; dtAnsIndx = 0;
    var renderTxt = 0;  
	
    var sceneNum = 0;    // 0 is entering  1 went has gone 2 went 	
	var count = 0;    // used in shake the house routine
	var ansSents = ["The cat is going into the house.", "The cat went into the house.", "The cat has gone into the house.", "The cat went into the house."];
 	
	// this array will store the original x and y coords of the words along with it's Id
	var plyrIds = [];
	
	// these are the  coords for the player's answer. Each x,y for a word in the sentence
 	var coordsHolder = [];
	
	// These X coords determine the position of the green words at the bottom of the screen when the player makes a sentence
	var FINwordsX = [[59,0],[119,0],[179,0],[239,0],[299,0],[359,0],[419,0],[479,0],[539,0],[599,0],[659,0]];
	var FINwordsXORG = [[59,0],[119,0],[179,0],[239,0],[299,0],[359,0],[419,0],[479,0],[539,0],[599,0],[659,0]];
	
 	var wrdCntr = 0;
  	
	// boolean vars
	var goesBtn = false;
	var isgoingBtn = false;
	var wentBtn = false;
	var hasgoneBtn = false;
	var finalAnsBtn = false;
	var scoreClickBtn = false;
	var doScoreFlag = false;
	
	var theFlgFin = false;
	var catFlgFin = false;
	var goesFlgFin = false;
	var isgoingFlgFin = false;
	var hasgoneFlgFin = false;
	var wentFlgFin = false;
	var intoFlgFin = false;
	var the2FlgFin = false;
	var houseFlgFin = false;
	var wordThudInc = 0;
		
	var bakground = createSprite();
	bakground.Id = 0;
	bakground.srcX = 1;
	bakground.srcY = 1;
	bakground.srcWdth = 799;
	bakground.srcHigh = 570;
	bakground.width = 300;    
	bakground.height = 190;     
	bakground.x = 20;
	bakground.y = 20;
	bakground.visible = true;
 	sprites.push(bakground);

	var cat = createSprite();
	cat.Id = 1;
	cat.srcX = 1;
	cat.srcY = 573;
	cat.srcWdth = 266;
	cat.srcHigh = 285;
	cat.width = 60;    
	cat.height = 35;     
	cat.x = 20;
	cat.y = 128;
	cat.vx = 0;
	cat.visible = false;
	sprites.push(cat);

 	var house1 = createSprite();
	house1.Id = 2;
	house1.srcX = 804;
	house1.srcY = 0;
	house1.srcWdth = 476;
	house1.srcHigh = 370;
	house1.width = 145;    
	house1.height = 180;     
	house1.x = 180;
	house1.y = 38;
	house1.vy = 0;
	house1.vx = 0;
 	sprites.push(house1);
	
	var twoLadies1 = createSprite();
	twoLadies1.Id = 2;
	twoLadies1.srcX = 25;
	twoLadies1.srcY = 868;
	twoLadies1.srcWdth = 738;
	twoLadies1.srcHigh = 700;
	twoLadies1.width = 270;    
	twoLadies1.height = 180;     
	twoLadies1.x = 0;
	twoLadies1.y = 20;
	twoLadies1.visible = false;
	twoLadies1.COLOR = 1;
	twoLadies1.GRAY = 0;
	twoLadies1.state = twoLadies1.GRAY;
	twoLadies1.update = function()
	{
	   if (this.state)
	   {
		  twoLadies1.srcX = 787;
          twoLadies1.srcY = 869;
	   }
	}
 	sprites.push(twoLadies1);
	
	
	var catHead = createSprite();
	catHead.Id = 14;
	catHead.srcX = 1777;
	catHead.srcY = 17;
	catHead.srcWdth = 100;
	catHead.srcHigh = 95;
	catHead.width = 50;    
	catHead.height = 50;     
	catHead.x = 216;
	catHead.y = 50;
	catHead.visible = false;
	sprites.push(catHead);
		
	// the first target sentence is "The cat (      ) into the house."
	var targetSent = createSprite();
	targetSent.Id = 3;
	targetSent.srcX = 912;
	targetSent.srcY = 558;
	targetSent.srcWdth = 820;
	targetSent.srcHigh = 78;
	targetSent.width = 215;    
	targetSent.height = 35;     
	targetSent.x = 335;
	targetSent.y = 92;
	targetSent.ONE = [0];
	targetSent.TWO = [1];
    targetSent.state = targetSent.ONE;
    targetSent.update = function()
	{
       targetSent.srcX = this.state[0] * 1487;   // 1316
       targetSent.srcY = this.state[0] * 686;     // 396
	   targetSent.srcWdth = 1045;
	   targetSent.width = 300;
	   targetSent.x = 331;
	   targetSent.height = 32;
	   targetSent.y = 94;
 	}	   
 	sprites.push(targetSent);
		
	var goes = createSprite();
	goes.Id = 4;
	goes.srcX = 811;
	goes.srcY = 394;
	goes.srcWdth = 235;
	goes.srcHigh = 62;
	goes.width = 60;    
	goes.height = 25;     
	goes.x = 330;
	goes.y = 25;
	goes.visible = false;
	goes.enabled = true;
	goes.NORMAL = [0,0];
	goes.PUSHED = [1,1];
    goes.state = goes.NORMAL;
    goes.update = function()
	{
       goes.srcX = this.state[0] * 1316;   // 1316
       goes.srcY = this.state[1] * 394;     // 396
        setTimeout(() => { goes.srcX = 811; goes.srcY = 394;}, 300);
	}	   
 	sprites.push(goes);
	
	
	var isgoing = createSprite();
	isgoing.Id = 9;
	isgoing.srcX = 1059;
	isgoing.srcY = 394;
	isgoing.srcWdth = 235;
	isgoing.srcHigh = 62;
	isgoing.width = 60;    
	isgoing.height = 25;     
	isgoing.x = 400;
	isgoing.y = 25;
	isgoing.visible = false;
	isgoing.enabled = true;
	isgoing.NORMAL = [0,0];
	isgoing.PUSHED = [1,1];
    isgoing.state = isgoing.NORMAL;
    isgoing.update = function()
	{
       isgoing.srcX = this.state[0] * 1562;
       isgoing.srcY = this.state[1] * 394;
        setTimeout(() => { isgoing.srcX = 1059; isgoing.srcY = 394;}, 300);
	}
 	sprites.push(isgoing);
	
	var hasgone = createSprite();
	hasgone.Id = 10;
	hasgone.srcX = 812;
	hasgone.srcY = 482;
	hasgone.srcWdth = 237;
	hasgone.srcHigh = 62;
	hasgone.width = 60;    
	hasgone.height = 25;     
	hasgone.x = 330;
	hasgone.y = 55;
	hasgone.enabled = true;
	hasgone.visible = false;
	hasgone.NORMAL = [0,0];
	hasgone.PUSHED = [1,1];
    hasgone.state = hasgone.NORMAL;
    hasgone.update = function()
	{
       hasgone.srcX = this.state[0] * 1316;    
       hasgone.srcY = this.state[1] * 482;     
       setTimeout(() => { hasgone.srcX = 812; hasgone.srcY = 482;}, 300);
	}	
 	sprites.push(hasgone);
	
	var went = createSprite();
	went.Id = 11;
	went.srcX = 1059;
	went.srcY = 482;
	went.srcWdth = 237;
	went.srcHigh = 62;
	went.width = 60;    
	went.height = 25;     
	went.x = 400;
	went.y = 55;
	went.visible = false;
	went.enabled = true;
	went.NORMAL = [0,0];
	went.PUSHED = [1,1];
    went.state = goes.NORMAL;
    went.update = function()
	{
       went.srcX = this.state[0] * 1563;   // 1316
       went.srcY = this.state[1] * 482;     // 396
       setTimeout(() => { went.srcX = 1059; went.srcY = 482;}, 300);
	}	
 	sprites.push(went);
	
	
	var goesGreen = createSprite();
	goesGreen.Id = 5;
	goesGreen.srcX = 1316;
	goesGreen.srcY = 394;
	goesGreen.srcWdth = 235;
	goesGreen.srcHigh = 62;
	goesGreen.width = 55;    
	goesGreen.height = 24;     
	goesGreen.x = 387;;
	goesGreen.y = 97;
	goesGreen.visible = false;
  	sprites.push(goesGreen);
	
	var isgoingGreen = createSprite();
	isgoingGreen.Id = 6;
	isgoingGreen.srcX = 1559;
	isgoingGreen.srcY = 394;
	isgoingGreen.srcWdth = 235;
	isgoingGreen.srcHigh = 62;
	isgoingGreen.width = 55;    
	isgoingGreen.height = 24;     
	isgoingGreen.x = 387;;     // the x position of the blank space in the sentence
	isgoingGreen.y = 97;
	isgoingGreen.visible = false;
  	sprites.push(isgoingGreen);
	
 	var hasgoneGreen = createSprite();
	hasgoneGreen.Id = 7;
	hasgoneGreen.srcX = 1316;
	hasgoneGreen.srcY = 482;
	hasgoneGreen.srcWdth = 235;
	hasgoneGreen.srcHigh = 62;
	hasgoneGreen.width = 55;    
	hasgoneGreen.height = 24;     
	hasgoneGreen.x = 387;
	hasgoneGreen.y = 97;
	hasgoneGreen.visible = false;
  	sprites.push(hasgoneGreen);
	
	var wentGreen = createSprite();
	wentGreen.Id = 8;
	wentGreen.srcX = 1559;
	wentGreen.srcY = 482;
	wentGreen.srcWdth = 235;
	wentGreen.srcHigh = 62;
	wentGreen.width = 55;    
	wentGreen.height = 24;     
	wentGreen.x = 387;
	wentGreen.y = 97;
	wentGreen.visible = false;
  	sprites.push(wentGreen);
	
	var goesBlue = createSprite();
	goesBlue.Id = 14;
	goesBlue.srcX = 956;
	goesBlue.srcY = 664;
	goesBlue.srcWdth = 237;
	goesBlue.srcHigh = 62;
	goesBlue.width = 60;    
	goesBlue.height = 25;     
	goesBlue.x = 400;
	goesBlue.y = 55;
	goesBlue.visible = false;
	sprites.push(goesBlue);
	
	var isgoingBlue = createSprite();
	isgoingBlue.Id = 15;
	isgoingBlue.srcX = 1204;
	isgoingBlue.srcY = 664;
	isgoingBlue.srcWdth = 237;
	isgoingBlue.srcHigh = 62;
	isgoingBlue.width = 60;    
	isgoingBlue.height = 25;     
	isgoingBlue.x = 400;
	isgoingBlue.y = 55;
	isgoingBlue.visible = false;
 	sprites.push(isgoingBlue);
	
	var wentBlue = createSprite();
	wentBlue.Id = 16;
	wentBlue.srcX = 1204;
	wentBlue.srcY = 752;
	wentBlue.srcWdth = 237;
	wentBlue.srcHigh = 62;
	wentBlue.width = 60;    
	wentBlue.height = 25;     
	wentBlue.x = 400;
	wentBlue.y = 55;
	wentBlue.visible = false;
  	sprites.push(wentBlue);
	
	var hasgoneBlue = createSprite();
	hasgoneBlue.Id = 17;
	hasgoneBlue.srcX = 956;
	hasgoneBlue.srcY = 752
	hasgoneBlue.srcWdth = 237;
	hasgoneBlue.srcHigh = 62;
	hasgoneBlue.width = 60;    
	hasgoneBlue.height = 25;     
	hasgoneBlue.x = 400;
	hasgoneBlue.y = 55;
	hasgoneBlue.visible = false;
 	sprites.push(hasgoneBlue);
	
	var No1dot = createSprite();
	No1dot.Id = 12;
	No1dot.srcX = 720;
	No1dot.srcY = 584;
	No1dot.srcWdth = 65;
	No1dot.srcHigh = 63;
	No1dot.width = 15;    
	No1dot.height = 15;     
	No1dot.x = 328;
	No1dot.y = 145
	No1dot.visible = false;
	sprites.push(No1dot);
	
	var No2dot = createSprite();
	No2dot.Id = 12;
	No2dot.srcX = 785;
	No2dot.srcY = 584;
	No2dot.srcWdth = 65;
	No2dot.srcHigh = 63;
	No2dot.width = 15;    
	No2dot.height = 15;     
	No2dot.x = 328;
	No2dot.y = 170;
	No2dot.visible = false;
	sprites.push(No2dot);
	
	var No3dot = createSprite();
	No3dot.Id = 12;
	No3dot.srcX = 847;
	No3dot.srcY = 584;
	No3dot.srcWdth = 65;
	No3dot.srcHigh = 63;
	No3dot.width = 15;    
	No3dot.height = 15;     
	No3dot.x = 328;
	No3dot.y = 195;
	No3dot.visible = false;
	sprites.push(No3dot);
	
	var finalAns = createSprite();
	finalAns.Id = 13;
	finalAns.srcX = 543;
	finalAns.srcY = 652;
	finalAns.srcWdth = 212;
	finalAns.srcHigh = 218
	finalAns.width = 46;    
	finalAns.height = 46;     
	finalAns.x = 460;
	finalAns.y = 128;
 	finalAns.visible = true;
	finalAns.enabled = false;
	sprites.push(finalAns);

    var lastOKbtn = createSprite();
	lastOKbtn.Id = 77;
	lastOKbtn.srcX = 776;
	lastOKbtn.srcY = 652;
	lastOKbtn.srcWdth = 155;
	lastOKbtn.srcHigh = 132;
	lastOKbtn.width = 41;    
	lastOKbtn.height = 41;     
	lastOKbtn.x = 520;
	lastOKbtn.y = 220;
 	lastOKbtn.visible = false;
	lastOKbtn.enabled = false;
	sprites.push(lastOKbtn);

    var gn;  // This var switches the numbers 1, 2, 3 onto the screen when the player selects what word goes into the blank

	var gameNos = createSprite();
	gameNos.Id = 16;
	gameNos.width = 70;    
	gameNos.height = 50;     
	gameNos.x = 130;
	gameNos.y = 90;
	gameNos.vx = 0;
	gameNos.vy = 0;
	gameNos.visible = false;
	gameNos.update = function(gn)
	{
	  switch (gn)
		{
			case 1:
				gameNos.srcX = 1540;
				gameNos.srcY = 826;
				gameNos.srcWdth = 277;
				gameNos.srcHigh = 140;
 			    break;
			case 2:
				gameNos.srcX = 1541
	            gameNos.srcY = 979;
				gameNos.srcWdth = 287;
				gameNos.srcHigh = 162;
	            break;
			case 3:
				gameNos.srcX = 1546;
	            gameNos.srcY = 1165;
				gameNos.srcWdth = 290;
				gameNos.srcHigh = 153;
	            break;
		}
	}
	
	gameNos.update(1);
 	sprites.push(gameNos);
	 
	var XorCheck1 = createSprite();
	XorCheck1.Id = 15;
	XorCheck1.srcX = 1571;
	XorCheck1.srcY = 1356;
	XorCheck1.srcWdth = 80;
	XorCheck1.srcHigh = 80;
	XorCheck1.width = 20;    
	XorCheck1.height = 20;     
	XorCheck1.x = 427;
	XorCheck1.y = 143;
	XorCheck1.visible = false;
    sprites.push(XorCheck1);		 	
  	
    var XorCheck2 = createSprite();
	XorCheck2.Id = 15;
	XorCheck2.srcX = 1656;
	XorCheck2.srcY = 1356;
	XorCheck2.srcWdth = 80;
	XorCheck2.srcHigh = 80;
	XorCheck2.width = 20;    
	XorCheck2.height = 20;     
	XorCheck2.x = 427;
	XorCheck2.y = 143;
	XorCheck2.visible = false;
    sprites.push(XorCheck2);		 	

    var XorCheck3 = createSprite();
	XorCheck3.Id = 15;
	XorCheck3.srcX = 1571;
	XorCheck3.srcY = 1440;
	XorCheck3.srcWdth = 80;
	XorCheck3.srcHigh = 80;
	XorCheck3.width = 20;    
	XorCheck3.height = 20;     
	XorCheck3.x = 427;
	XorCheck3.y = 167;
	XorCheck3.visible = false;
    sprites.push(XorCheck3);		 	

 	var XorCheck4 = createSprite();
	XorCheck4.Id = 15;
	XorCheck4.srcX = 1658;
	XorCheck4.srcY = 1440;
	XorCheck4.srcWdth = 80;
	XorCheck4.srcHigh = 80;
	XorCheck4.width = 20;    
	XorCheck4.height = 20;     
	XorCheck4.x = 427;
	XorCheck4.y = 167;
	XorCheck4.visible = false;
    sprites.push(XorCheck4);		 	

 	var XorCheck5 = createSprite();
	XorCheck5.Id = 15;
	XorCheck5.srcX = 1571;
	XorCheck5.srcY = 1527;
	XorCheck5.srcWdth = 80;
	XorCheck5.srcHigh = 80;
	XorCheck5.width = 20;    
	XorCheck5.height = 20;     
	XorCheck5.x = 427;
	XorCheck5.y = 193;
	XorCheck5.visible = false;
    sprites.push(XorCheck5);		 	

 	var XorCheck6 = createSprite();
	XorCheck6.Id = 15;
	XorCheck6.srcX = 1658;
	XorCheck6.srcY = 1527;
	XorCheck6.srcWdth = 80;
	XorCheck6.srcHigh = 80;
	XorCheck6.width = 20;    
	XorCheck6.height = 20;     
	XorCheck6.x = 427;
	XorCheck6.y = 193;
	XorCheck6.visible = false;
    sprites.push(XorCheck6);		 	

 	var NishoFScore = createSprite();
	NishoFScore.Id = 15;
	NishoFScore.srcX = 1852;
	NishoFScore.srcY =  796;
	NishoFScore.srcWdth = 324;
	NishoFScore.srcHigh = 391;
	NishoFScore.width = 110;    
	NishoFScore.height = 140;     
	NishoFScore.x = 50;
	NishoFScore.y = 80;
 	NishoFScore.visible = false;
	sprites.push(NishoFScore);
	
	var nishioBubble = createSprite();
	nishioBubble.Id = 16;
	nishioBubble.srcX = 2196;
	nishioBubble.srcY =  773;
	nishioBubble.srcWdth = 347;
	nishioBubble.srcHigh = 267;
	nishioBubble.width = 150;    
	nishioBubble.height = 100;     
	nishioBubble.x = 130;
	nishioBubble.y = 30;
 	nishioBubble.visible = false;
	sprites.push(nishioBubble);
	
	var clickHereBtn = createSprite();
	clickHereBtn.Id = 16;
	clickHereBtn.srcX = 1874;
	clickHereBtn.srcY =  1191;
	clickHereBtn.srcWdth = 275;
	clickHereBtn.srcHigh = 150;
	clickHereBtn.width = 75;    
	clickHereBtn.height = 45;     
	clickHereBtn.x = 140;
	clickHereBtn.y = 175;
 	clickHereBtn.visible = false;
	sprites.push(clickHereBtn);
	
	var plyrScene1 = createSprite();
	plyrScene1.Id = 16;
	plyrScene1.srcX = 2112;
	plyrScene1.srcY =  4;
	plyrScene1.srcWdth = 431;
	plyrScene1.srcHigh = 297;
	plyrScene1.width = 300;   
	plyrScene1.height = 190;   
	plyrScene1.x = 20;
	plyrScene1.y = 20;
	plyrScene1.enabled = false;
 	plyrScene1.visible = false;
	sprites.push(plyrScene1);
	
	var plyrScene2 = createSprite();
	plyrScene2.Id = 16;
	plyrScene2.srcX = 2135;
	plyrScene2.srcY =  316;
	plyrScene2.srcWdth = 377;
	plyrScene2.srcHigh = 237;
	plyrScene2.width = 300;    
	plyrScene2.height = 190;    
	plyrScene2.x = 20;
	plyrScene2.y = 20;
	plyrScene2.enabled = false;
 	plyrScene2.visible = false;
	sprites.push(plyrScene2);
	
	var plyrScene3 = createSprite();
	plyrScene3.Id = 16;
	plyrScene3.srcX = 833;
	plyrScene3.srcY =  869;
	plyrScene3.srcWdth = 690;
	plyrScene3.srcHigh = 651;
	plyrScene3.width = 300;   
	plyrScene3.height = 190;    
	plyrScene3.x = 20;
	plyrScene3.y = 20;
	plyrScene3.enabled = false;
 	plyrScene3.visible = false;
	sprites.push(plyrScene3);
		
	var nextBtn = createSprite();
	nextBtn.Id = 16;
	nextBtn.srcX = 1936;
	nextBtn.srcY =  14;
	nextBtn.srcWdth = 172;
	nextBtn.srcHigh = 107;
	nextBtn.width = 75;    
	nextBtn.height = 45;     
	nextBtn.x = 460;
	nextBtn.y = 170;
	nextBtn.enabled = false;
 	nextBtn.visible = false;
	sprites.push(nextBtn);
		
 	// The following sprites are the words the player chooses to make a sentence for each picture-situation
	var plyrThe = createSprite();
	plyrThe.Id = 50;
	plyrThe.srcX = 2166;
	plyrThe.srcY =  1181;
	plyrThe.srcWdth = 238;
	plyrThe.srcHigh = 65;
	plyrThe.width = 60;   
	plyrThe.height = 25; 
	plyrThe.x = 330;
	plyrThe.y = 50;
	plyrThe.enabled = false;
 	plyrThe.visible = false;
	sprites.push(plyrThe);
	plyrIds.push([plyrThe.Id]);
 	
	var plyrCat = createSprite();
	plyrCat.Id = 51;
	plyrCat.srcX = 2421;
	plyrCat.srcY = 1181;
	plyrCat.srcWdth = 238;
	plyrCat.srcHigh = 62
	plyrCat.width = 60;    
	plyrCat.height = 25;     
	plyrCat.x = 330;
	plyrCat.y = 20
	plyrCat.enabled = false;
 	plyrCat.visible = false;
	sprites.push(plyrCat);
	plyrIds.push([plyrCat.Id]);
	
	var plyrIsgoing = createSprite();
	plyrIsgoing.Id = 52;
	plyrIsgoing.srcX = 2166;
	plyrIsgoing.srcY =  1263;
	plyrIsgoing.srcWdth = 238;
	plyrIsgoing.srcHigh = 68;
	plyrIsgoing.width = 60;    
	plyrIsgoing.height = 25;     
	plyrIsgoing.x = 330;
	plyrIsgoing.y = 80;
	plyrIsgoing.enabled = false;
 	plyrIsgoing.visible = false;
	sprites.push(plyrIsgoing);        
	plyrIds.push([plyrIsgoing.Id]);
	
	
	var plyrGoes = createSprite();
	plyrGoes.Id = 53;
	plyrGoes.srcX = 2677;
	plyrGoes.srcY =  1181;
	plyrGoes.srcWdth = 238;
	plyrGoes.srcHigh = 66;
	plyrGoes.width = 60;    
	plyrGoes.height = 25;     
	plyrGoes.x = 470;
	plyrGoes.y = 50;
	plyrGoes.enabled = false;
 	plyrGoes.visible = false;
	sprites.push(plyrGoes);
	plyrIds.push([plyrGoes.Id]);
	
	
 	var plyrHasgone = createSprite();
	plyrHasgone.Id = 54;
	plyrHasgone.srcX = 2421;
	plyrHasgone.srcY =  1263;
	plyrHasgone.srcWdth = 238;
	plyrHasgone.srcHigh = 68;
	plyrHasgone.width = 60;    
	plyrHasgone.height = 25;     
	plyrHasgone.x = 400;
	plyrHasgone.y = 110;
	plyrHasgone.enabled = false;
 	plyrHasgone.visible = false;
	sprites.push(plyrHasgone);
	plyrIds.push([plyrHasgone.Id]);  
		                                
	var plyrWent = createSprite();
	plyrWent.Id = 55;
	plyrWent.srcX = 2677;
	plyrWent.srcY =  1263;
	plyrWent.srcWdth = 238;
	plyrWent.srcHigh = 68;
	plyrWent.width = 60;    
	plyrWent.height = 25;     
	plyrWent.x = 330;
	plyrWent.y = 109;
	plyrWent.enabled = false;
 	plyrWent.visible = false;
	sprites.push(plyrWent);
	plyrIds.push([plyrWent.Id]);
		
	var plyrInto = createSprite();
	plyrInto.Id = 56;
	plyrInto.srcX = 2169;
	plyrInto.srcY =  1345;
	plyrInto.srcWdth = 238;
	plyrInto.srcHigh = 66;
	plyrInto.width = 60;    
	plyrInto.height = 25;     
	plyrInto.x = 400;
	plyrInto.y = 22;
	plyrInto.enabled = false;
 	plyrInto.visible = false;      
	sprites.push(plyrInto);
	plyrIds.push([plyrInto.Id]);    
		
	var plyrthe2 = createSprite();
	plyrthe2.Id = 57;
	plyrthe2.srcX = 2423;
	plyrthe2.srcY =  1345;
	plyrthe2.srcWdth = 238;
	plyrthe2.srcHigh = 66;
	plyrthe2.width = 60;    
	plyrthe2.height = 25;     
	plyrthe2.x = 400;
	plyrthe2.y = 80;
	plyrthe2.enabled = false;
 	plyrthe2.visible = false;
	sprites.push(plyrthe2);
	plyrIds.push([plyrthe2.Id]);
		
	var plyrHouse = createSprite();
	plyrHouse.Id = 58;
	plyrHouse.srcX = 2679;
	plyrHouse.srcY =  1345;
	plyrHouse.srcWdth = 238;
	plyrHouse.srcHigh = 68;
	plyrHouse.width = 60;    
	plyrHouse.height = 25;     
	plyrHouse.x = 400;
	plyrHouse.y = 50;
	plyrHouse.enabled = false;    
 	plyrHouse.visible = false;
	sprites.push(plyrHouse);
	plyrIds.push([plyrHouse.Id]);
	
	var plyrLstWeek = createSprite();
	plyrLstWeek.Id = 59;
	plyrLstWeek.srcX = 2170;
	plyrLstWeek.srcY = 1421;
	plyrLstWeek.srcWdth = 238;
	plyrLstWeek.srcHigh = 68;
	plyrLstWeek.width = 60;    
	plyrLstWeek.height = 25;     
	plyrLstWeek.x = 470;
	plyrLstWeek.y = 80;
	plyrLstWeek.enabled = false;
 	plyrLstWeek.visible = false;
	sprites.push(plyrLstWeek);
	plyrIds.push([plyrLstWeek.Id]);
		
	var plyrPeriod = createSprite();
	plyrPeriod.Id = 60;
	plyrPeriod.srcX = 2423;
	plyrPeriod.srcY =  1421;
	plyrPeriod.srcWdth = 238;
	plyrPeriod.srcHigh = 66;
	plyrPeriod.width = 60;    
	plyrPeriod.height = 25;     
	plyrPeriod.x = 470;
	plyrPeriod.y = 22;
	plyrPeriod.enabled = false;
 	plyrPeriod.visible = false;       
	sprites.push(plyrPeriod);
	plyrIds.push([plyrPeriod.Id]);
	
	// THESE are the FINAL words waiting to be displayed once the player has chosen each one	
  	var plyrTheFIN = createSprite();
	plyrTheFIN.Id = 150;
	plyrTheFIN.srcX = 9;
	plyrTheFIN.srcY =  1648;
	plyrTheFIN.srcWdth = 239;
	plyrTheFIN.srcHigh = 63;
	plyrTheFIN.width = 58;   
	plyrTheFIN.height = 23; 
	plyrTheFIN.x = 59;
	plyrTheFIN.y = 220; 
 	plyrTheFIN.enabled = false;
 	plyrTheFIN.visible = false;
	sprites.push(plyrTheFIN);
	plyrIds.push([plyrTheFIN.Id]);
	 			
	var plyrCatFIN = createSprite();
	plyrCatFIN.Id = 151;
	plyrCatFIN.srcX = 256;
	plyrCatFIN.srcY = 1648;
	plyrCatFIN.srcWdth = 239;
	plyrCatFIN.srcHigh = 63;
	plyrCatFIN.width = 58;    
	plyrCatFIN.height = 23;     
	plyrCatFIN.x = 149;
	plyrCatFIN.y = 220;  
 	plyrCatFIN.enabled = false;
 	plyrCatFIN.visible = false;
	sprites.push(plyrCatFIN);
	plyrIds.push([plyrCatFIN.Id]);
		 
	var plyrIsgoingFIN = createSprite();
	plyrIsgoingFIN.Id = 152;
	plyrIsgoingFIN.srcX = 503;
	plyrIsgoingFIN.srcY =  1648;
	plyrIsgoingFIN.srcWdth = 239;
	plyrIsgoingFIN.srcHigh = 63;
	plyrIsgoingFIN.width = 58;    
	plyrIsgoingFIN.height = 23;     
	plyrIsgoingFIN.x = 209;
	plyrIsgoingFIN.y = 220;
 	plyrIsgoingFIN.enabled = false;
 	plyrIsgoingFIN.visible = false;
	sprites.push(plyrIsgoingFIN);
	plyrIds.push([plyrIsgoingFIN.Id]);
	 
	var plyrGoesFIN = createSprite();
	plyrGoesFIN.Id = 153;
	plyrGoesFIN.srcX = 753;
	plyrGoesFIN.srcY =  1648;
	plyrGoesFIN.srcWdth = 239;
	plyrGoesFIN.srcHigh = 63;
	plyrGoesFIN.width = 58;    
	plyrGoesFIN.height = 23;     
	plyrGoesFIN.x = 269;
	plyrGoesFIN.y = 220;
	plyrGoesFIN.enabled = false;
 	plyrGoesFIN.visible = false;
	sprites.push(plyrGoesFIN);
	plyrIds.push([plyrGoesFIN.Id]);
 
 	 	
	var plyrHasgoneFIN = createSprite();
	plyrHasgoneFIN.Id = 154;
	plyrHasgoneFIN.srcX = 999;
	plyrHasgoneFIN.srcY =  1648;
	plyrHasgoneFIN.srcWdth = 239;
	plyrHasgoneFIN.srcHigh = 63;
	plyrHasgoneFIN.width = 58;    
	plyrHasgoneFIN.height = 23;     
	plyrHasgoneFIN.x = 329;
	plyrHasgoneFIN.y = 220;
	plyrHasgoneFIN.enabled = false;
 	plyrHasgoneFIN.visible = false;
	sprites.push(plyrHasgoneFIN);
	plyrIds.push([plyrHasgoneFIN.Id]);
 
	var plyrWentFIN = createSprite();
	plyrWentFIN.Id = 155;
	plyrWentFIN.srcX = 1249;
	plyrWentFIN.srcY =  1648;
	plyrWentFIN.srcWdth = 239;
	plyrWentFIN.srcHigh = 63;
	plyrWentFIN.width = 58;    
	plyrWentFIN.height = 23;     
	plyrWentFIN.x = 389;
	plyrWentFIN.y = 220;
	plyrWentFIN.enabled = false;
 	plyrWentFIN.visible = false;
	sprites.push(plyrWentFIN);
	plyrIds.push([plyrWentFIN.Id]);
 			
	var plyrIntoFIN = createSprite();
	plyrIntoFIN.Id = 156;
	plyrIntoFIN.srcX = 1500;
	plyrIntoFIN.srcY =  1648;
	plyrIntoFIN.srcWdth = 239;
	plyrIntoFIN.srcHigh = 63;
	plyrIntoFIN.width = 58;    
	plyrIntoFIN.height = 23;     
	plyrIntoFIN.x = 449;
	plyrIntoFIN.y = 220;
	plyrIntoFIN.enabled = false;
 	plyrIntoFIN.visible = false;
	sprites.push(plyrIntoFIN);
	plyrIds.push([plyrIntoFIN.Id]);
 		
	var plyrthe2FIN = createSprite();
	plyrthe2FIN.Id = 157;
	plyrthe2FIN.srcX = 1750;
	plyrthe2FIN.srcY =  1648;
	plyrthe2FIN.srcWdth = 239;
	plyrthe2FIN.srcHigh = 63;
	plyrthe2FIN.width = 58;    
	plyrthe2FIN.height = 23;     
	plyrthe2FIN.x = 509;
	plyrthe2FIN.y = 220;
	plyrthe2FIN.enabled = false;
 	plyrthe2FIN.visible = false;
	sprites.push(plyrthe2FIN);
	plyrIds.push([plyrthe2FIN.Id]);
 		
	var plyrHouseFIN = createSprite();
	plyrHouseFIN.Id = 158;
	plyrHouseFIN.srcX = 1998;
	plyrHouseFIN.srcY =  1648;
	plyrHouseFIN.srcWdth = 239;
	plyrHouseFIN.srcHigh = 63;
	plyrHouseFIN.width = 58;    
	plyrHouseFIN.height = 23;     
	plyrHouseFIN.x = 569;
	plyrHouseFIN.y = 220;
	plyrHouseFIN.enabled = false;
 	plyrHouseFIN.visible = false;
	sprites.push(plyrHouseFIN);
	plyrIds.push([plyrHouseFIN.Id]);
 	
	var plyrLstWeekFIN = createSprite();
	plyrLstWeekFIN.Id = 159;
	plyrLstWeekFIN.srcX = 2248;
	plyrLstWeekFIN.srcY = 1648;
	plyrLstWeekFIN.srcWdth = 239;
	plyrLstWeekFIN.srcHigh = 63;
	plyrLstWeekFIN.width = 58;    
	plyrLstWeekFIN.height = 23;     
	plyrLstWeekFIN.x = 629;
	plyrLstWeekFIN.y = 220;
	plyrLstWeekFIN.enabled = false;
 	plyrLstWeekFIN.visible = false;
	sprites.push(plyrLstWeekFIN);
	plyrIds.push([plyrLstWeekFIN.Id]);
 		
	var plyrPeriodFIN = createSprite();
	plyrPeriodFIN.Id = 160;
	plyrPeriodFIN.srcX = 2494;
	plyrPeriodFIN.srcY =  1648;
	plyrPeriodFIN.srcWdth = 239;
	plyrPeriodFIN.srcHigh = 63;
	plyrPeriodFIN.width = 58;    
	plyrPeriodFIN.height = 23;     
	plyrPeriodFIN.x = 689;
	plyrPeriodFIN.y = 220;
	plyrPeriodFIN.enabled = false;
 	plyrPeriodFIN.visible = false;
	sprites.push(plyrPeriodFIN);
	plyrIds.push([plyrPeriodFIN.Id]);
	
	// 50 51 52 56 57 58 60
	
	// Display the static line under the answer with little guides for the words
	var plyrUnderlineFIN = createSprite();
	plyrUnderlineFIN.Id = 170;
	plyrUnderlineFIN.srcX = 10
	plyrUnderlineFIN.srcY =  1732;
	plyrUnderlineFIN.srcWdth = 1810;
	plyrUnderlineFIN.srcHigh = 42;
	plyrUnderlineFIN.width = 470;    
	plyrUnderlineFIN.height = 20;     
	plyrUnderlineFIN.x = 56;
	plyrUnderlineFIN.y = 238;
	plyrUnderlineFIN.enabled = false;
 	plyrUnderlineFIN.visible = false;
	sprites.push(plyrUnderlineFIN);

 	// canvas
	var canvas = document.querySelector("canvas");
	var drawingSurface = canvas.getContext("2d");
	 
	// load the tilesheet  
	var image = new Image();
	image.addEventListener("load", loadHandler, false);
	image.src = "../imgs/tilesheets/tilesheet11.png";
	assetsToLoad.push(image);

	// Store finger's pos  
	var touchX = 0;
	var touchY = 0;
	var playersFinalAns = 0;
	  
	// A variable to store the current sprite being dragged
	var dragSprite = null;
	
	// Load sounds
	var btnClick = document.querySelector("#BtnClik");
	btnClick.addEventListener("canplaythrough", loadHandler,false);
	btnClick.load();
	assetsToLoad.push(btnClick);
	var meow1 = document.querySelector("#meow");
	meow1.addEventListener("canplaythrough", loadHandler,false);
	meow.load();
	assetsToLoad.push(meow1);
    var ding = document.querySelector("#ding");
	ding.addEventListener("canplaythrough", loadHandler,false);
	ding.load();
	assetsToLoad.push(ding);
    var squak = document.querySelector("#squak");
	squak.addEventListener("canplaythrough", loadHandler,false);
	squak.load();
	assetsToLoad.push(squak);
    var trumpet = document.querySelector("#trumpet");
	trumpet.addEventListener("canplaythrough", loadHandler,false);
	trumpet.load();
	assetsToLoad.push(trumpet);
    var damnit = document.querySelector("#damn");
	damnit.addEventListener("canplaythrough", loadHandler,false);
	damnit.load();
	assetsToLoad.push(damnit);
    var grrr = document.querySelector("#grunt");
	grrr.addEventListener("canplaythrough", loadHandler,false);
	grrr.load();
	assetsToLoad.push(grrr);
	var tadaaa = document.querySelector("#tadaaa");
	tadaaa.addEventListener("canplaythrough", loadHandler,false);
	tadaaa.load();
	assetsToLoad.push(tadaaa);
	var thud = document.querySelector("#thud");
	thud.addEventListener("canplaythrough", loadHandler,false);
	thud.load();
	assetsToLoad.push(thud);

 	canvas.addEventListener("touchstart", touchstartHandler, false);
  	window.addEventListener("touchend", touchendHandler, false);
 
	function touchstartHandler(event)
	{
 	   event.preventDefault();
	   let touchX = event.touches[0].pageX - canvas.offsetLeft;
       let touchY = event.touches[0].pageY - canvas.offsetTop;
 
       // conditional for 'goes' button
	   if (goes.enabled) {
		   if ((touchX > goes.x && (touchX < goes.x + 60)) && (touchY > goes.y && touchY < (goes.y + 25)))
		   {
			   goesBtn = true;
		   } 
	   }
 	   
	   // conditional for 'is going' button
	   if (isgoing.enabled) {
		   if ((touchX > isgoing.x && (touchX < isgoing.x + 60)) && (touchY > isgoing.y && touchY < (isgoing.y + 25)))
		   {
			   isgoingBtn = true;
		   } 
	   }
	   
	   // conditional for 'has gone' button
	   if (hasgone.enabled) {
		   if ((touchX > hasgone.x && (touchX < hasgone.x + 60)) && (touchY > hasgone.y && touchY < (hasgone.y + 25)))
		   {
			   hasgoneBtn = true;
		   } 
	  }
	   
	   // conditional for 'went' button
	   if (went.enabled) {
		   if ((touchX > went.x && (touchX < went.x + 60)) && (touchY > went.y && touchY < (went.y + 25)))
		   {
			   wentBtn = true;
		   } 
	   }
	   
	   // finalAns? button pushed
	   if (finalAns.enabled) {
		   if ((touchX > finalAns.x && (touchX < finalAns.x + 46)) && (touchY > finalAns.y && touchY < (finalAns.y + 46)))
		   {
				if (playersFinalAns != 0)
				{				
					finalAnsBtn = true;
				}         
		   } 
	   }
	   
	   if (scoreClickBtn == true) 
	   {
 		   if ((touchX > clickHereBtn.x && (touchX < clickHereBtn.x + 75)) && (touchY > clickHereBtn.y && touchY < (clickHereBtn.y + 45)))
		   {
                dispXorChkmark(plyrsAnsCodes);
		   }
	   }
	 
	    if (nextBtn.enabled) 
	   {
 		   if ((touchX > nextBtn.x && (touchX < nextBtn.x + 75)) && (touchY > nextBtn.y && touchY < (nextBtn.y + 45)))
		   {
                clearScreenforTyping();
				plyrScene1.visible = true;
		   }
	   }
	
	   //  *****************************************************************************************************
	   //  *****************************************************************************************************
	   
	   if (plyrThe.enabled) 
	   {
 		   if ((touchX > plyrThe.x && (touchX < plyrThe.x + 58)) && (touchY > plyrThe.y && touchY < (plyrThe.y + 23)))
		   {
			   if (wrdCntr < 7)
			   {
				   plyrThe.enabled = false;
				   plyrThe.visible = false;
				   plyrTheFIN.enabled = true;
				   
				   let cc;
				   // cc gets the word's Id 
				   cc = plyrIds[0][0];
				   plyrCreateSent(cc);
				   wrdCntr++;    
			   }
			   else
			   {
				   alert ("You cannot have more than 7 words in the answer sentence");
			   }
		 }
	   }
	   
	   if (plyrTheFIN.enabled) 
	   {
 		   if ((touchX > plyrTheFIN.x && (touchX < plyrTheFIN.x + 58)) && (touchY > 230 && touchY < (253)))
		   { 
 	           plyrThe.enabled = true;
			   plyrThe.visible = true;
			   plyrTheFIN.visible = false;  plyrTheFIN.enabled = false;
			
			   
			   let Ex = plyrTheFIN.x;
			   for (var p = 0; p < FINwordsX.length; p++)
			   {
				   if (FINwordsX[p][0] == Ex)
				   {
						FINwordsX[p][1] = 0;
						wrdCntr--;  
						break;
				   }
			   }
		   }
	   }
	   
       if (plyrCat.enabled) 
	   {
 		   if ((touchX > plyrCat.x && (touchX < plyrCat.x + 58)) && (touchY > plyrCat.y && touchY < (plyrCat.y + 23)))
		   { 
   			   if (wrdCntr < 7)
			   {
				   plyrCat.enabled = false;
				   plyrCat.visible = false;
				   plyrCatFIN.enabled = true;
				   let cc;
				   // cc gets the word's Id 
				   cc = plyrIds[1][0];
				   plyrCreateSent(cc);
				   wrdCntr++;  console.log ("wordCNt is  " + wrdCntr);
			   }
			   else
			   {
				   alert ("You cannot have more than 7 words in the answer sentence");
			   }
	       }
	   }
	   if (plyrCatFIN.enabled) 
	   {
 		   if ((touchX > plyrCatFIN.x && (touchX < plyrCatFIN.x + 58)) && (touchY > 230 && touchY < (253)))
		   { 
 	           plyrCat.enabled = true;
			   plyrCat.visible = true;
			   plyrCatFIN.visible = false;  plyrCatFIN.enabled = false;
			     
   			   let Ex = plyrCatFIN.x;
			   for (var p = 0; p < FINwordsX.length; p++)
			   {
				   if (FINwordsX[p][0] == Ex)
				   {
						FINwordsX[p][1] = 0;
						wrdCntr--; console.log ("wrdCntr -- is " + wrdCntr);
						break;
				   }
			   }
		   }
	   }
	
       if (plyrIsgoing.enabled) 
	   {
 		   if ((touchX > plyrIsgoing.x && (touchX < plyrIsgoing.x + 60)) && (touchY > plyrIsgoing.y && touchY < (plyrIsgoing.y + 25)))
		   {
   			   if (wrdCntr < 7)
			   {
				   plyrIsgoing.enabled = false;
				   plyrIsgoing.visible = false;
				   plyrIsgoingFIN.enabled = true;
				   let cc;
				   cc = plyrIds[2][0];
				   plyrCreateSent(cc);
				   wrdCntr++;  console.log ("wordCNt is  " + wrdCntr);
			   }
			   else
			   {
				   alert ("You cannot have more than 7 words in the answer sentence");
			   }
	      }
	   }
	   
	   if (plyrIsgoingFIN.enabled) 
	   {
 		   if ((touchX > plyrIsgoingFIN.x && (touchX < plyrIsgoingFIN.x + 58)) && (touchY > 230 && touchY < (253)))
		   { 
 	           plyrIsgoing.enabled = true;
			   plyrIsgoing.visible = true;
			   plyrIsgoingFIN.visible = false;  plyrIsgoingFIN.enabled = false;
			
			    
			   let Ex = plyrIsgoingFIN.x;
			   for (var p = 0; p < FINwordsX.length; p++)
			   {
				   if (FINwordsX[p][0] == Ex)
				   {
						FINwordsX[p][1] = 0;
						wrdCntr--; console.log ("wrdCntr -- is " + wrdCntr);
						break;
				   }
			   }
		   }
	   }
	   
	   if (plyrGoes.enabled) 
	   {
 		   if ((touchX > plyrGoes.x && (touchX < plyrGoes.x + 60)) && (touchY > plyrGoes.y && touchY < (plyrGoes.y + 25)))
		   {
  			   if (wrdCntr < 7)
			   {
				   plyrGoes.enabled = false;
				   plyrGoes.visible = false;
				   plyrGoesFIN.enabled = true;
				   let cc;
				   cc = plyrIds[3][0];
				   plyrCreateSent(cc);
				   wrdCntr++;  console.log ("wordCNt is  " + wrdCntr);
			   }
			   else
			   {
				   alert ("You cannot have more than 7 words in the answer sentence");
			   }
		   }
	   }
	
       if (plyrGoesFIN.enabled) 
	   {
 		   if ((touchX > plyrGoesFIN.x && (touchX < plyrGoesFIN.x + 58)) && (touchY > 230 && touchY < (253)))
		   { 
 	           plyrGoes.enabled = true;
			   plyrGoes.visible = true;
			   plyrGoesFIN.visible = false;  plyrGoesFIN.enabled = false;
			
			    
			   let Ex = plyrGoesFIN.x;
			   for (var p = 0; p < FINwordsX.length; p++)
			   {
				   if (FINwordsX[p][0] == Ex)
				   {
						FINwordsX[p][1] = 0;
						wrdCntr--; console.log ("wrdCntr -- is " + wrdCntr);
						break;
				   }
			   }
		   }
	   }
	   if (plyrHasgone.enabled) 
	   {
 		   if ((touchX > plyrHasgone.x && (touchX < plyrHasgone.x + 60)) && (touchY > plyrHasgone.y && touchY < (plyrHasgone.y + 25)))
		   {
   			   if (wrdCntr < 7)
               {
				   plyrHasgone.enabled = false;
				   plyrHasgone.visible = false;
				   plyrHasgoneFIN.enabled = true;
				   let cc;
				   cc = plyrIds[4][0];
				   plyrCreateSent(cc);
				   wrdCntr++;  console.log ("wordCNt is  " + wrdCntr);
			   }
			   else
			   {
				   alert ("You cannot have more than 7 words in the answer sentence");
			   }
		   }
	   }
	   
	   if (plyrHasgoneFIN.enabled) 
	   {
 		   if ((touchX > plyrHasgoneFIN.x && (touchX < plyrHasgoneFIN.x + 58)) && (touchY > 230 && touchY < (253)))
		   { 
 	           plyrHasgone.enabled = true;
			   plyrHasgone.visible = true;
			   plyrHasgoneFIN.visible = false;  plyrHasgoneFIN.enabled = false;
			      
			   let Ex = plyrHasgoneFIN.x;
			   for (var p = 0; p < FINwordsX.length; p++)
			   {
				   if (FINwordsX[p][0] == Ex)
				   {
						FINwordsX[p][1] = 0;
						wrdCntr--; console.log ("wrdCntr -- is " + wrdCntr);
						break;
				   }
			   }
		   }
	   }
	   
	   if (plyrWent.enabled) 
	   {
 		   if ((touchX > plyrWent.x && (touchX < plyrWent.x + 60)) && (touchY > plyrWent.y && touchY < (plyrWent.y + 25)))
		   {
   			   if (wrdCntr < 7)
			   {
				   plyrWent.enabled = false;
				   plyrWent.visible = false;
				   plyrWentFIN.enabled = true;
				   let cc;
				   cc = plyrIds[5][0];
				   plyrCreateSent(cc);	
				   wrdCntr++;  console.log ("wordCNt is  " + wrdCntr);
			   }
			   else
			   {
				   alert ("You cannot have more than 7 words in the answer sentence");
			   }
	       }
	   }
	
       if (plyrWentFIN.enabled) 
	   {
 		   if ((touchX > plyrWentFIN.x && (touchX < plyrWentFIN.x + 58)) && (touchY > 230 && touchY < (253)))
		   { 
 	           plyrWent.enabled = true;
			   plyrWent.visible = true;
			   plyrWentFIN.visible = false;  plyrWentFIN.enabled = false;
			     
			   let Ex = plyrWentFIN.x;
			   for (var p = 0; p < FINwordsX.length; p++)
			   {
				   if (FINwordsX[p][0] == Ex)
				   {
						FINwordsX[p][1] = 0;
						wrdCntr--; console.log ("wrdCntr -- is " + wrdCntr);
						break;
				   }
			   }
		   }
	   }
	   
	   if (plyrInto.enabled) 
	   {
 		   if ((touchX > plyrInto.x && (touchX < plyrInto.x + 60)) && (touchY > plyrInto.y && touchY < (plyrInto.y + 25)))
		   {
			   if (wrdCntr < 7)
			   {
				   plyrInto.enabled = false;
				   plyrInto.visible = false;
				   plyrIntoFIN.enabled = true;
				   let cc;
				   cc = plyrIds[6][0];
				   plyrCreateSent(cc);
				   wrdCntr++;  console.log ("wordCNt is  " + wrdCntr);
		       }
			   else
			   {
				   alert ("You cannot have more than 7 words in the answer sentence");
			   }
		   }
	   }
	  
       if (plyrIntoFIN.enabled) 
	   {
 		   if ((touchX > plyrIntoFIN.x && (touchX < plyrIntoFIN.x + 58)) && (touchY > 230 && touchY < (253)))
		   { 
 	           plyrInto.enabled = true;
			   plyrInto.visible = true;
			   plyrIntoFIN.visible = false;  plyrIntoFIN.enabled = false;
			     
			   let Ex = plyrIntoFIN.x;
			   for (var p = 0; p < FINwordsX.length; p++)
			   {
				   if (FINwordsX[p][0] == Ex)
				   {
						FINwordsX[p][1] = 0;
						wrdCntr--; console.log ("wrdCntr -- is " + wrdCntr);
						break;
				   }
			   }
		   }
	   }
	   
 	   if (plyrthe2.enabled) 
	   {
 		   if ((touchX > plyrthe2.x && (touchX < plyrthe2.x + 60)) && (touchY > plyrthe2.y && touchY < (plyrthe2.y + 25)))
		   {
			   if ( wrdCntr < 7)
			   {
				   plyrthe2.enabled = false;
				   plyrthe2.visible = false;
				   plyrthe2FIN.enabled = true;
				   let cc;
				   cc = plyrIds[7][0];
				   plyrCreateSent(cc);
				   wrdCntr++;  console.log ("wordCNt is  " + wrdCntr);
			   }
			   else
			   {
				  alert ("You cannot have more than 7 words in the answer sentence");
			   }
		   }
	   }
	   
	   if (plyrthe2FIN.enabled) 
	   {
 		   if ((touchX > plyrthe2FIN.x && (touchX < plyrthe2FIN.x + 58)) && (touchY > 230 && touchY < (253)))
		   { 
 	           plyrthe2.enabled = true;
			   plyrthe2.visible = true;
			   plyrthe2FIN.visible = false;  plyrthe2FIN.enabled = false;
			     
			   let Ex = plyrthe2FIN.x;
			   for (var p = 0; p < FINwordsX.length; p++)
			   {
				   if (FINwordsX[p][0] == Ex)
				   {
						FINwordsX[p][1] = 0;
						wrdCntr--; console.log ("wrdCntr -- is " + wrdCntr);
						break;
				   }
			   }
		   }
	   }
	   
	   if (plyrHouse.enabled) 
	   {
 		   if ((touchX > plyrHouse.x && (touchX < plyrHouse.x + 60)) && (touchY > plyrHouse.y && touchY < (plyrHouse.y + 25)))
		   {
			   if ( wrdCntr < 7)
			   {
				   plyrHouse.enabled = false;
				   plyrHouse.visible = false;
				   plyrHouseFIN.enabled = true;
				   let cc;
				   cc = plyrIds[8][0];
				   plyrCreateSent(cc);
				   wrdCntr++;  console.log ("wordCNt is  " + wrdCntr);
			   }
			   else
			   {
				   alert ("You cannot have more than 7 words in the answer sentence");
			   }
	       }
	   }
	 
       if (plyrHouseFIN.enabled) 
	   {
 		   if ((touchX > plyrHouseFIN.x && (touchX < plyrHouseFIN.x + 58)) && (touchY > 230 && touchY < (253)))
		   { 
 	           plyrHouse.enabled = true;
			   plyrHouse.visible = true;
			   plyrHouseFIN.visible = false;  plyrHouseFIN.enabled = false;
			     
			   let Ex = plyrHouseFIN.x;
			   for (var p = 0; p < FINwordsX.length; p++)
			   {
				   if (FINwordsX[p][0] == Ex)
				   {
						FINwordsX[p][1] = 0;
						wrdCntr--; console.log ("wrdCntr -- is " + wrdCntr);
						break;
				   }
			   }
		   }
	   }
	   if (plyrLstWeek.enabled) 
	   {
 		   if ((touchX > plyrLstWeek.x && (touchX < plyrLstWeek.x + 60)) && (touchY > plyrLstWeek.y && touchY < (plyrLstWeek.y + 25)))
		   {
			   if (wrdCntr < 8)
			   {
				   plyrLstWeek.enabled = false;
				   plyrLstWeek.visible = false;
				   plyrLstWeekFIN.enabled = true;
				   let cc;
				   cc = plyrIds[9][0];
				   plyrCreateSent(cc);
				   wrdCntr++;  console.log ("wordCNt is  " + wrdCntr);
			   }
			   else
			   {
    			   alert ("You cannot have more than 8 words in the answer sentence");
			   }
		   }
	   }
	   
	   if (plyrLstWeekFIN.enabled) 
	   {
 		   if ((touchX > plyrLstWeekFIN.x && (touchX < plyrLstWeekFIN.x + 58)) && (touchY > 230 && touchY < (253)))
		   { 
 	           plyrLstWeek.enabled = true;
			   plyrLstWeek.visible = true;
			   plyrLstWeekFIN.visible = false;  plyrLstWeekFIN.enabled = false;
			     
			   let Ex = plyrLstWeekFIN.x;
			   for (var p = 0; p < FINwordsX.length; p++)
			   {
				   if (FINwordsX[p][0] == Ex)
				   {
						FINwordsX[p][1] = 0;
						wrdCntr--; console.log ("wrdCntr -- is " + wrdCntr);
						break;
				   }
			   }
		   }
	   }
       if (plyrPeriod.enabled) 
	   {
 		   if ((touchX > plyrPeriod.x && (touchX < plyrPeriod.x + 60)) && (touchY > plyrPeriod.y && touchY < (plyrPeriod.y + 25)))
		   {   if (wrdCntr < 7) 
			   {
				   ding.play();
				   plyrPeriod.enabled = false;
				   plyrPeriod.visible = false;
				   plyrPeriodFIN.enabled = true;
				   lastOKbtn.visible = true;
			       lastOKbtn.enabled = true;
			       let cc;
				   cc = plyrIds[10][0];
				   plyrCreateSent(cc);	
				   wrdCntr++;  console.log ("wordCNt is  " + wrdCntr);
			   }			   
		       else 
			   {
 				   alert ("You cannot have more than 7 words in the answer sentence");
			   }
		   }
	   }
	   
	   if (plyrPeriodFIN.enabled) 
	   {
 		   if ((touchX > plyrPeriodFIN.x && (touchX < plyrPeriodFIN.x + 58)) && (touchY > 230 && touchY < (253)))
		   { 
 	           plyrPeriod.enabled = true;
			   plyrPeriod.visible = true;
			   plyrPeriodFIN.visible = false;  plyrPeriodFIN.enabled = false;
			   lastOKbtn.visible = false;
			   lastOKbtn.enabled = false;
			   let Ex = plyrPeriodFIN.x;
			   for (var p = 0; p < FINwordsX.length; p++)
			   {
				   if (FINwordsX[p][0] == Ex)
				   {
						FINwordsX[p][1] = 0;
						wrdCntr--; console.log ("wrdCntr -- is " + wrdCntr);
						break;
				   }
			   }
		   }
	   }
	   
 	   if (lastOKbtn.enabled) 
	   {
 		   if ((touchX > lastOKbtn.x && (touchX < lastOKbtn.x + 41)) && (touchY > lastOKbtn.y && touchY < (lastOKbtn.y + 41)))
		   {      
                if (plyrScene1.visible)
				{
 					// Do the sentence check 
					let Id;
					let ansIdstr = " ";
					const idString = " 150 151 152 156 157 158 160 0 0 0 0 ";
					 
					// make a string with the  array elements 
					for (var z = 0; z < FINwordsX.length; z++)
					{
						Id = FINwordsX[z][1];
					    Id = Id.toString();	
						ansIdstr = ansIdstr + Id + " ";
              		}
					// and compare player with correct string
				    if (ansIdstr == idString) { 
					   console.log ("Success1");
					   tadaaa.volume = 0.3;
					   tadaaa.play();
					   plyrScene1.visible = false;
 					   plyrScene2.visible = true;
					}
			        else 
					{
 						grunt.play();
					}
					 lastOKbtn.visible = false;
					 lastOKbtn.enabled = false;
					 clearScreenforTyping();
					 clearFINwords();
					 var sourceClone = FINwordsXORG.map(row => [...row]);
					 FINwordsX.splice(0, FINwordsX.length, ...sourceClone);					
					 wrdCntr = 0;
	             }
              	 else if (plyrScene2.visible)
				 {
					// Do the sentence check 
					let Id;
					let ansIdstr = " ";
					const idString1 = " 150 151 154 156 157 158 160 0 0 0 0 ";
					const idString2 = " 150 151 155 156 157 158 160 0 0 0 0 ";
									 
					// make a string with the  array elements 
					for (var z = 0; z < FINwordsX.length; z++)
					{
						Id = FINwordsX[z][1];
					    Id = Id.toString();	
						ansIdstr = ansIdstr + Id + " ";
              		}
					// and compare player with correct string
				    if (ansIdstr == idString1 || ansIdstr == idString2) 
					{ 
 					   tadaaa.volume = 0.3;
					   tadaaa.play();
 					   plyrScene2.visible = false;
					   plyrScene3.visible = true;
                    }
			        else 
					{
  						grunt.play();
  					    wordsGoThud();
				    }
					lastOKbtn.visible = false;
					lastOKbtn.enabled = false;
					clearScreenforTyping();
					clearFINwords();
                    var sourceClone = FINwordsXORG.map(row => [...row]);
 					FINwordsX.splice(0, FINwordsX.length, ...sourceClone);					
 					wrdCntr = 0;
				 }
				  else if (plyrScene3.visible)
				 {
					// Do the sentence check 
					let Id;
					let ansIdstr = " ";
 					const idString1 = " 150 151 155 156 157 158 160 0 0 0 0 ";
									 
					// make a string with the  array elements 
					for (var z = 0; z < FINwordsX.length; z++)
					{
						Id = FINwordsX[z][1];
					    Id = Id.toString();	
						ansIdstr = ansIdstr + Id + " ";
              		}
					// and compare player with correct string
				    if (ansIdstr == idString1) 
					{ 
				console.log ("SUCCESS 3");
 					   tadaaa.volume = 0.3;
					   tadaaa.play();
 					   plyrScene2.visible = false;
					   plyrScene3.visible = true;
                    }
			        else 
					{
  						grunt.play();
  					    wordsGoThud();
				    }
					lastOKbtn.visible = false;
					lastOKbtn.enabled = false;
					clearScreenforTyping();
					clearFINwords();
                    var sourceClone = FINwordsXORG.map(row => [...row]);
 					FINwordsX.splice(0, FINwordsX.length, ...sourceClone);					
 					wrdCntr = 0;
				 }
	         }
		}
	   
   
	   // Loop thru all sprites to find out if mouse is over any of them 
	   for (var i = sprites.length - 1; i > -1; i--)
	   {
		   sprite = sprites[i];
		 
    	   if (hitTestPoint(touchX, touchY, sprite) && sprite.draggable )
		   {
			 	   dragSprite = sprite;
				   sprites.push(dragSprite);
				   sprites.splice(i, 1);
                   break;
		   }			   
       }
   }  // end of touchstartHandler
   
  	function touchendHandler(event)
	{  console.log ("touchendHandler is entered" );
		event.preventDefault();

         if (goesBtn)
		 {  
			 goesBtn = false;
			 goes.state = goes.PUSHED;
			 btnClick.play();
			 goes.update();
			 playersFinalAns = goes.Id;    // 4 9 10 11
 			 // move goes box to the sentence's blank space
			 isgoingGreen.visible = false; hasgoneGreen.visible = false; wentGreen.visible = false;
			 goesGreen.visible = true;
			 finalAns.visible = true;
			 finalAns.enabled = true;
	 	 }
		 if (isgoingBtn)
		 {
			 isgoingBtn = false;
			 isgoing.state = isgoing.PUSHED;
			 btnClick.play();
			 isgoing.update();
			 playersFinalAns = isgoing.Id;
			 goesGreen.visible = false; hasgoneGreen.visible = false; wentGreen.visible = false;
			 isgoingGreen.visible = true;
			 finalAns.visible = true;
			 finalAns.enabled = true;
		 }
		 
		 if (hasgoneBtn)
		 {
			 hasgoneBtn = false;
			 hasgone.state = hasgone.PUSHED;
			 btnClick.play();
			 hasgone.update();
			 playersFinalAns = hasgone.Id;
 			 goesGreen.visible = false; isgoingGreen.visible = false; wentGreen.visible = false;
			 hasgoneGreen.visible = true;
 			 finalAns.visible = true;
 			 finalAns.enabled = true;
		 }
		 
		 if (wentBtn)
		 {
			 wentBtn = false;
			 went.state = went.PUSHED;
			 btnClick.play();
			 went.update();
			 playersFinalAns = went.Id;
 			 goesGreen.visible = false; hasgoneGreen.visible = false; isgoingGreen.visible = false;
			 wentGreen.visible = true;
			 finalAns.visible = true;
			 finalAns.enabled = true;
		 }
		 
		 if (finalAnsBtn)
		 {   
  			 plyrsAnsCodes[sceneNum] = playersFinalAns;
			 newcatScene();
			 console.log ("players answers so far are " + plyrsAnsCodes);
		 }
 	}
	
	// display your answer choice in dotAnswers[] next to No 1, 2 or 3 and invoke the new cat scene, sceneNum++
	function newcatScene()
	{ 
  	    if (sceneNum == 0) // Cat is in the house and sticks  head out of the window 
		{
	        isgoingGreen.visible = false; hasgoneGreen.visible = false; wentGreen.visible = false; goesGreen.visible = false;
			cat.x = 180;
			meow.volume = 0.3;
		    setTimeout(() => { meow.play(); }, 3600);
            No1dot.visible = true;
 		}
        if (sceneNum == 1) 
		{
            isgoingGreen.visible = false; hasgoneGreen.visible = false; wentGreen.visible = false; goesGreen.visible = false;
	        No2dot.visible = true;
 		}
		if (sceneNum == 2) 
		{
		    isgoingGreen.visible = false; hasgoneGreen.visible = false; wentGreen.visible = false; goesGreen.visible = false;
            No3dot.visible = true;
 		}
		
		// Ids are 4 9 10 11
		if (playersFinalAns == 10 ) {  dotAnswers[sceneNum] = "has gone"; }
	    if (playersFinalAns == 11 ) {  dotAnswers[sceneNum] = "went";}
		if (playersFinalAns == 4 )  {  dotAnswers[sceneNum] = "goes"; }
		if (playersFinalAns == 9 )  {  dotAnswers[sceneNum] = "is going"; }
		
		renderTxt = 1;
 		finalAnsBtn = false;
		playersFinalAns = 0;
 	 	sceneNum++;
		event.preventDefault();
 	}
 	
	function hitTestPoint(fingerX, fingerY, sprite)
	{ 
      	return fingerX > sprite.left() && fingerX < sprite.right() 
		&& fingerY > sprite.top() && fingerY < sprite.bottom();
	}

  // ************************************************************************
  // ************************************************************************
  // ************************************************************************
  // ************************************************************************

	// Set initial size
	resizeCanvas();

	// Add event listener to resize canvas when the window size changes
	window.addEventListener('resize', resizeCanvas);

	function resizeCanvas() 
	{
	  // Get the display size of the canvas in CSS pixels
	  const clientWidth = canvas.clientWidth;
	  const clientHeight = canvas.clientHeight;
	  
	  // Get the device pixel ratio, falling back to 1.
	  const dpr = window.devicePixelRatio || 1;
	  
	  // Set the canvas's internal buffer size to the display size multiplied by the device pixel ratio
	  canvas.width = Math.round(clientWidth * dpr);
	  canvas.height = Math.round(clientHeight * dpr);
	  
	  // Scale the context so drawing commands use the CSS pixel size
	  drawingSurface.scale(dpr, dpr);
	}

  // ***********************************************************************************
  // ***********************************************************************************
  // ***********************************************************************************

	function update()
	{
		// the animation loop
		requestAnimationFrame(update, canvas);
		
 		switch (gameState)
		{
			case LOADING:
				console.log ("dropping a load");
				break;
			case PLAY:
				 playGame(sceneNum);
				 break;
			case TYPING:
				 gameStateType();
				 break;
		}	
		// render animation
		
 		render(renderTxt, dotAnswers, sceneNum);
	}
				
	function playGame(scene) 
	{
		switch (scene)
		{
			case 0:
			   	isgoingin();
				break;
			case 1:
			    // the cat has entered the house
 				wenthasgone();
 				break;
			case 2:
	    		// the cat went into the house Yesterday  
				wentInside();
				break;
			case 3:
			    // display Nisan saying "So. what is my score?" AND sets the scoreGameBtn = true so 
				// touchstartHandler can use it to check the answers
 			    showNishio();
			    break;
		    case 4:		
			    wordsMoving();
			    break;
		}
	}	
		
	function isgoingin()
	{	
	    setTimeout(() => { gn = 1; gameNos.update(gn); }, 400);
		setTimeout(() => { gameNos.visible = false; }, 1500);	
		setTimeout(() => { moveCats();}, 3000);
		setTimeout(() => {  goes.visible = true;
                            isgoing.visible = true;
                            hasgone.visible = true;
	                    	went.visible = true; }, 4300);	
	    cat.visible = true; 

		function moveCats() 
		{
		   cat.srcX = 266;
		   cat.vx = 2;
		   if (cat.x < 145)       // 240
		   {
		  	   cat.x += cat.vx;
		 	   if (cat.x > 80) 
			   {
			 	   house1.srcX = 1277;
			   }
			   if (cat.x > 217) 
			   {
				   house1.srcX = 804;
			   }
		   }
		}
 	}
	
	function wenthasgone() 
	{
		gameNos.visible = true;
		gameNos.update(2);
	
        cat.visible = true;
        cat.vx = 0.01;
		gameNos.vx = 0.008;
		
		for (var g = 0; g < 200; g++)
		{
			// game TWO sign moves off the screen towards the left
			gameNos.x -= gameNos.vx;
 		}
        setTimeout(() => {
        for (var m = 0; m <  200; m++)
		{
			  if (cat.x < 240)       // 240
			  {
				  cat.x += cat.vx;
			  }
		}
  	    if (count < 3000)
	    {
		  // SHAKE this house. THE cat is In the house
		  const timer = setInterval(() => {
		  let intensity = 0.27; // Shake strength in pixels
				
		  let offsetX = (Math.random() - 0.5) * intensity * 2;
		  let offsetY = (Math.random() - 0.5) * intensity * 2;
		  house1.x += offsetX;
		  house1.y += offsetY;
		  count++;
		  if (count > 2500) {
			  clearInterval(timer);
			  count = 3001;
		     }	
	      }, 0);
 	    }
	    setTimeout(() => { catHeadOut();}, 1300); }, 2500);
		
 	}  // wenthasgone 
	
	function catHeadOut()
	{
		catHead.visible = true;
 		house1.y = 38;
		house1.x = 180;
 	}
	
	function wentInside() 
	{
		cat.visible = false;
		catHead.visible = false;
		house1.visible = false;
		bakground.visible = false;
		twoLadies1.visible = true;
		targetSent.state = targetSent.TWO;
		targetSent.update();
 	 	gameNos.update(3);
		gameNos.x = 100;
 		gameNos.vy = 0.008;
		setTimeout (() => { for (var g = 0; g < 200; g++)
		                    {			
			                    gameNos.y -= gameNos.vy;
		                    }}, 1100);
		
		// change the two ladies scene from GRAY to COLOURFUL
		setTimeout (() => { twoLadies1.state = twoLadies1.COLOR; twoLadies1.update(); }, 3400);
	}
	
	function showNishio() 
	{
 		twoLadies1.visible = false;
		finalAns.visible = false;
		NishoFScore.visible = true;
		nishioBubble.visible = true;
 		clickHereBtn.visible = true;
        // set the flag used in touchstartHandler to activate Click Here button
        scoreClickBtn = true;
		isgoing.enabled = false;
		hasgone.enabled = false;
		went.enabled = false;
		goes.enabled = false;
		finalAnsBtn = false;
 	}
	
	function dispXorChkmark(plyrsAns) 
	{ 
	    let tally = 0;
 		// correct answers are : 9, 10 or 11, 11
        if (plyrsAns[0] == 9)
        {
             XorCheck1.visible = true;
			 tally++;
		}
		else {
		     XorCheck2.visible = true;
		}
		if (plyrsAns[1] == 10 || plyrsAns[1] == 11)
        {
           XorCheck3.visible = true;
		   tally++;
		}
		else {
		   XorCheck4.visible = true;
		}
        if (plyrsAns[2] == 11)
        {
           XorCheck5.visible = true;
		   tally++;
		}
		else {
		   XorCheck6.visible = true;
		}
		 
		if (tally == 3) { ding.play(); }
		else { trumpet.play(); }
		
		scoreClickBtn = false;
		/* sceneNum++; */
		gameState = TYPING;
 	}
	
	function  gameStateType() 
	{
 		nextBtn.visible = true;
		nextBtn.enabled = true;
  	    canvas.addEventListener("touchstart", touchstartHandler, false);
    }
	
	// Clear the screen for the final stage where the player makes the sentences
	// AND make visible all the words (in blue) that the player uses
	function clearScreenforTyping()
	{     
		console.log ("now in clearScreenforTyping");
		isgoing.visible = false;
		goes.visible = false;
		hasgone.visible = false;
		went.visible = false;
		targetSent.visible = false;
		nishioBubble.visible = false;
		NishoFScore.visible = false;
        No1dot.visible = false;
		No2dot.visible = false;
		No3dot.visible = false;
		clickHereBtn.visible = false;
		clickHereBtn.enabled = false;
		XorCheck1.visible = false;
		XorCheck2.visible = false;
		XorCheck3.visible = false;
		XorCheck4.visible = false;
		XorCheck5.visible = false;
		XorCheck6.visible = false;
	    dotAnswers = ["","","",""];
 		catHead.visible = false;
		 nextBtn.visible = false;
		 nextBtn.enabled = false;
         plyrCat.visible = true;
		 plyrCat.enabled = true;
		 plyrGoes.visible = true;
		 plyrGoes.enabled = true;
		 plyrHasgone.visible = true;
		 plyrHasgone.enabled = true;
		 plyrHouse.visible = true;
		 plyrHouse.enabled = true;
		 plyrInto.visible = true;
		 plyrInto.enabled = true;
         plyrIsgoing.visible = true;
		 plyrIsgoing.enabled = true;
		 plyrLstWeek.visible = true;
		 plyrLstWeek.enabled = true;
		 plyrPeriod.visible = true;
		 plyrPeriod.enabled = true;
         plyrThe.visible = true;
		 plyrThe.enabled = true;
         plyrthe2.visible = true;
         plyrthe2.enabled = true;		 
         plyrWent.visible = true;
		 plyrWent.enabled = true;
 		 plyrUnderlineFIN.visible = true;
		renderTxt = 0;
		gameState = PLAY;
 		// gameState is PLAY however let us break out of the loop by setting sceneNum = -1
		sceneNum = -1;
     }
	 
	 function clearFINwords()
	 {
		 console.log ("inside clearFinwords");
	     plyrCatFIN.visible = false;
		 plyrCatFIN.enabled = false;
		 plyrGoesFIN.visible = false;
		 plyrGoesFIN.enabled = false;
		 plyrHasgoneFIN.visible = false;
		 plyrHasgoneFIN.enabled = false;
		 plyrHouseFIN.visible = false;
		 plyrHouseFIN.enabled = false;
		 plyrIntoFIN.visible = false;
		 plyrIntoFIN.enabled = false;
         plyrIsgoingFIN.visible = false;
		 plyrIsgoingFIN.enabled = false;
		 plyrLstWeekFIN.visible = false;
		 plyrLstWeekFIN.enabled = false;
		 plyrPeriodFIN.visible = false;
		 plyrPeriodFIN.enabled = false;
         plyrTheFIN.visible = false;
		 plyrTheFIN.enabled = false;
         plyrthe2FIN.visible = false;
         plyrthe2FIN.enabled = false;		 
         plyrWentFIN.visible = false;
		 plyrWentFIN.enabled = false;
   	 }
	 
	 
	function plyrCreateSent(wordOutId) 
    {
	   let Xpos;
	   let IdFin;
	   IdFin = wordOutId + 100;  // The FINword's Id
		 	  
	   for (var p = 0; p < FINwordsX.length; p++)
	   {
		   if (FINwordsX[p][1] == 0)
		   {
		      Xpos = FINwordsX[p][0];
			  FINwordsX[p][1] = IdFin;   // * IMPORTANT: assign wordId to the array  *
			  break;
		   }
	   }
    
	   if (sprites.length !== 0)
	   {
			for (var i = 0; i < sprites.length; i++)
			{
				 var spriteMe = sprites[i];
				 if (spriteMe.Id == IdFin)
				 {	
                      spriteMe.visible = true;
					  spriteMe.y = 220;
 					  spriteMe.x = Xpos;
				 }
			}
	   }
    }
	
	function wordsGoThud()
	{
	     plyrCat.y += 14;
 		 plyrGoes.y += 14;
 		 plyrHasgone.y += 14;
 		 plyrHouse.y += 14;
 		 plyrInto.y += 14;
         plyrIsgoing.y += 14;
 		 plyrLstWeek.y += 14;
 		 plyrPeriod.y += 14;
         plyrThe.y += 14;
         plyrthe2.y += 14;
         plyrWent.y += 14;
   		 plyrScene1.y += 14;
	}
					 
	//  Use the Fisher-Yates shuffle to change the order of the values
	//  which determine the X coords of balloons
	function shuffleArray(targetsXvals)
	{
		for ( var i = targetsXvals.length - 1; i > 0; i-- )
		{
			var j = Math.floor(Math.random() * (i + 1));
			var temp = targetsXvals[i];
			
			targetsXvals[i] = targetsXvals[j];
			targetsXvals[j] = temp;
		}
		return targetsXvals;
	}
	
	
	// LoadHandler  
	function loadHandler()
	{ 
	   assetsLoaded++;
	   //Remove the load handlers
 	   if (assetsLoaded === assetsToLoad.length - 1 )
	   {
 		  //Remove the load event listeners
		  btnClick.removeEventListener("canplaythrough", loadHandler, false);
 		  meow1.removeEventListener("canplaythrough", loadHandler, false);
 		  ding.removeEventListener("canplaythrough", loadHandler, false);
 		  squak.removeEventListener("canplaythrough", loadHandler, false);
 		  trumpet.removeEventListener("canplaythrough", loadHandler, false);
 		  damnit.removeEventListener("canplaythrough", loadHandler, false);
 		  grrr.removeEventListener("canplaythrough", loadHandler, false);
 		  tadaaa.removeEventListener("canplaythrough", loadHandler, false);
 		  thud.removeEventListener("canplaythrough", loadHandler, false);
		  image.removeEventListener("load", loadHandler, false);
		  gameState = PLAY;
 		  update();
	   }
	}

	function render(textOut, dotAns, dtIndx)
	{
		// clear
		drawingSurface.clearRect(0,0,canvas.width, canvas.height);
           			
			// Loop thru all sprites
			if (sprites.length !== 0)
			{
 				for (var i = 0; i < sprites.length; i++)
				{
					 var sprite = sprites[i];
					 if (sprite.visible == true)
					 {					 
						drawingSurface.drawImage
							(
								image,
								sprite.srcX, sprite.srcY,
								sprite.srcWdth, sprite.srcHigh,
								Math.floor(sprite.x), Math.floor(sprite.y),sprite.width, sprite.height
							);
					}	
				}
			}
			if (textOut == 1 && dotAns[dtIndx] !== "" ) 
			{     
  		         let posY = 157;
                 for (var c = 0; c < dtIndx ; c++) 
				 {		
                     drawingSurface.fillStyle = "cyan"; // Background color
                     drawingSurface.fillRect(347, posY - 15, 69, 22);
					 drawingSurface.fillStyle = 'black';
					 drawingSurface.font = "14px Arial";  console.log ("dotAns[c] is        " + dotAns[c]);
					 drawingSurface.fillText(dotAns[c], 352, posY); 
					 posY += 24;
	             }
 		}
	}  // end render
 }   //  end of Execute 
}());
 
 
       