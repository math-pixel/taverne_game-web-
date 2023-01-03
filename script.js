
	//init var
	let ReferenceGride = [];

	let score = 0;
	let nbClick = 0;
	let maxClick = 0;
	let level = 0;

	let canUpdateGraphic = true;
	let canChangePositionBall = true;
	let canclick = true;

	//display Home
	function openMenuHome(){
		return document.getElementById("popup").style.display = "flex";
	}
	function closeMenuHome(){
		return document.getElementById("popup").style.display = "none";
	}

	//display parameter
	function openParameterMenu(){
		return document.getElementById("parameterMenu").style.display = "flex";
	}
	function closeParameterMenu(){
		return document.getElementById("parameterMenu").style.display = "none";
	}
	
	

	//display ScoreBoard
	function openScoreBoard(){
		return document.getElementById("popupScoreBoard").style.display = "flex";
	}

	function closeScoreBoard(){
		return document.getElementById("popupScoreBoard").style.display = "none";
	}

	//set ScoreBoard
	function setScoreBoard(isWin){
		if (isWin) {
			document.getElementById("result").innerHTML = "Felicitation vous avez gagnez <br>avec " + nbClick + " clicks";
		}else{
			document.getElementById("result").innerHTML = "Dommage la prochaine fois c'est la bonne !!!";
		}
		openScoreBoard();
	}

	function displayText(){

		//display nb de click
		document.getElementById("click").innerHTML = "Clicks = " + nbClick;
		

		//display max click and description in function of level
		let description = document.getElementById("description");
		let max_click_div = document.getElementById("max_click_div");
		if(level == 0) {
			max_click_div.innerHTML = "Max clicks = /";
			description.innerHTML = "Level : " + level + "<br>Easy win";
		}else if(level == 1) {
			max_click_div.innerHTML = "Max clicks = " + maxClick;
			description.innerHTML = "Level : " + level + "<br>Tu a " + maxClick + " essaies !!!";
		}else if(level == 2) {
			max_click_div.innerHTML = "Max clicks = " + maxClick;
			description.innerHTML = "Level : " + level + "<br>Tu a " + maxClick + " essaies mais la boule rouge change de place toute les 5 secs !!!";
		}else if(level == 3) {
			max_click_div.innerHTML = "Max clicks = " + maxClick;
			description.innerHTML = "Level : " + level + "<br>Tu n' a plus que " + maxClick + " essaies !!! <br>La boule rouge change de place toute les 2 secs";
		}
	}


	//update graphic
	function updateGraphic(){
		createGrid();
		displayText();
	}

	//animate Mascotte for the end
	function animatePuffle(frame){

		setTimeout(() => {
			document.getElementById("puffle").src = "./images/new_gif/" + frame + ".png";
			if(frame + 1 <= 78){
				animatePuffle(frame + 1);
			}else{
				setTimeout(() => {
					document.getElementById("puffle").style.opacity = 0;
					setScoreBoard(true);
				}, 1000);
				
			}
		}, 50);
	};

	//animate Smoke 
	function animateSmoke(frame, elmt){

		setTimeout(() => {
			elmt.style.backgroundImage = "url(\"./images/fumer/" + frame + ".png \")";
			if(frame + 1 < 10){
				animateSmoke(frame + 1, elmt);
			}else{
				elmt.style.opacity = 0;
				if (canUpdateGraphic) {
					updateGraphic();
				}
				
			}
			
		}, 10);
	}

	function changePositionBall(nSeconde){
		setTimeout(()=>{

			if (canChangePositionBall) {
				//reset actual position of the ball
				let indexActualBall = ReferenceGride.findIndex(index => index===1);
				ReferenceGride[indexActualBall] = 0;

				//loop for comparaison ( if the gobelet is already click )
				let iteration = true;
				while(iteration){
					random_place = Math.floor(Math.random() * ReferenceGride.length -1);
					if(ReferenceGride[random_place] != 2){

						//set new place to the ball
						ReferenceGride[random_place] = 1;
						iteration = false;
					}
				}
				updateGraphic();
			}
			
			changePositionBall(nSeconde);

		}, nSeconde);
	}

	function AnimationEnd(){
		const parent = document.getElementById('container_gride');

		ReferenceGride.forEach((elmt , index) => {

			if (elmt === 1) {
				ReferenceGride[index] = 3;
			}	
		});

	}

	function ActionOnClick(object_finding , element, index){

		hitAudio.play();
		canChangePositionBall = false;
		ReferenceGride[index] = 2;
		canclick = false;

		//animation
		animateSmoke(1,element);
		
		console.log(element);
		
		//verification of win
		nbClick += 1;

		if (object_finding === 1) {
			//win
			//creation puffle ( end animation)
			canUpdateGraphic = false;

			winAudio.play();

			let gobelet_hight = element.getBoundingClientRect();
			let puffle = document.createElement("img");
			puffle.src = "./images/new_gif/1.png";
			puffle.id = "puffle";
			puffle.style['pointer-events'] = 'none';
			puffle.style.position = "absolute";
			puffle.style.top = gobelet_hight.y - 50 + "px";
			puffle.style.left = gobelet_hight.x - 100 + "px";
			document.body.appendChild(puffle);

			animatePuffle(1);

		}else{
			canChangePositionBall = true;
			canclick = true;
			if (level != 0) {
				maxClick -= 1;
				
				if (maxClick == 0) {
					canChangePositionBall = false;
					canclick = false;


					console.log("perdu");
					
					console.log(element.style);

					AnimationEnd();
					updateGraphic();
					
					
					setTimeout(() => {
						setScoreBoard(false);
					}, 2000);
					
					
					
				}
			}
		}

	}


	function createGrid(){

		//delete previous grid
		if (document.body.contains(document.getElementById("container_gride"))) {
			document.getElementById("container_gride").remove();	
		}
		if (document.body.contains(document.getElementById("puffle"))) {
			document.getElementById("puffle").remove();	
		}

		//create html part
		let parent = document.body;
		let container = document.createElement("div");
		container.classList.add("container_gride");
		container.id = "container_gride";
		parent.appendChild(container);

		//create div for every item of grid reference	
		ReferenceGride.forEach((elmt , index) => {

			//css
			let div = document.createElement("div");
			div.style.width = "80px";
			div.style.backgroundImage = "url(./images/baril.png)";
			div.style.backgroundSize = "contain";
			div.style.backgroundRepeat = "no-repeat";
			//if the element have been already click
			if(elmt === 2){
				div.style.opacity = 0;
			}

			// if (elmt === 1) {
			//  	div.style.backgroundColor = "blue";
			// // 	// use only for reveal at the end of game
			//  }

			if (elmt === 3) {// if player doenst find the intru
				div.style.backgroundImage = "url(./images/puffle_end.png)";
			}

			container.appendChild(div);

			//action on click
			div.addEventListener("click", (event) => {	

				if(canclick && ReferenceGride[index] != 2){// canclick for end animation and referencegrid condition for element have been already click
					ActionOnClick(elmt, event.target, index);
				}
				
			});
		});
	}

	//initialisation of variable for new game
	function initialisation(){
		
		canUpdateGraphic = true;
		canChangePositionBall = true;
		canclick = true;


		ReferenceGride = [];
		nbClick = 0;
		score = 0;

		//init grid Logic with full "0" and one "1"
		for (let i = 0; i < 64; i++) {
			ReferenceGride.push(0);
		}
		let random_place = Math.floor(Math.random() * ReferenceGride.length - 1);
		ReferenceGride[random_place] = 1;


		//set max click / level
		if (level == 0) {
			maxClick = 0;
		}if (level == 1) {
			maxClick = 20;
		}if (level == 2) {
			maxClick = 20;
			changePositionBall(5000);
		}if (level == 3) {
			maxClick = 10;
			changePositionBall(2000);
		}

		//update graphic
		updateGraphic();
	
	}


//####################################### assignement event #############################################

//open pop up ( home img )
document.getElementById("home").addEventListener("click", () => {
	clickAudio.play();
  openMenuHome();
});

document.getElementById("parameter").addEventListener("click", () => {
	clickAudio.play();
	openParameterMenu();
});

//close parameter menu
document.getElementById("closeParameterMenu").addEventListener("click", () => {
	clickAudio.play();
	closeParameterMenu();
});

//Start game in popup
document.getElementById("start").addEventListener("click", () => {
	ambianceSound.play();
	clickAudio.play();
	initialisation();
  	closeMenuHome();
});
//evite de fermer la fenetre en cliquant au centre 
document.getElementById("popUpCenter").addEventListener("click", (e) => {
  e.stopPropagation();
});


document.getElementById("replay").addEventListener("click", () => {
	clickAudio.play();
	closeScoreBoard();
  initialisation();
});
document.getElementById("level").addEventListener("click", () => {
	clickAudio.play();
	closeScoreBoard();
  	openMenuHome();
});


document.getElementById("selected_level").addEventListener('change', () => {
	clickAudio.play();
	level = document.getElementById("selected_level").value;
});

//##################################### audio parametre #################################

// ambiance sound
document.getElementById("buttonSoundActivated1").addEventListener('click', () => {
	ambianceSound.muted = !ambianceSound.muted;
	if (ambianceSound.muted === true) {
		document.getElementById("buttonSoundActivated1").style.backgroundImage = 'url("./images/soundOff.png")';
	}else{
		document.getElementById("buttonSoundActivated1").style.backgroundImage = 'url("./images/soundOn.png")';
	}
});
document.getElementById("buttonSoundAdd1").addEventListener('click', () => {
	if (ambianceSound.volume < 0.9) {
		ambianceSound.volume += 0.1;
		console.log(ambianceSound.volume);
	}else{
		maxAudio.play();
	}
});
document.getElementById("buttonSoundRemove1").addEventListener('click', () => {
	if (ambianceSound.volume > 0.15) {
		ambianceSound.volume -= 0.1;
		console.log(ambianceSound.volume);
	}else{
		maxAudio.play();
	}
});

// FX sound
document.getElementById("buttonSoundActivated2").addEventListener('click', () => {
	hitAudio.muted = !hitAudio.muted;
	if (hitAudio.muted === true) {
		document.getElementById("buttonSoundActivated2").style.backgroundImage = 'url("./images/soundOn.png")';
	}else{
		document.getElementById("buttonSoundActivated2").style.backgroundImage = 'url("./images/soundOff.png")';
	}
	console.log("ta mere")
});
document.getElementById("buttonSoundAdd2").addEventListener('click', () => {
	if (hitAudio.volume < 1) {
		hitAudio.volume += 0.1;
		hitAudio.play();
	}else{
		maxAudio.play();
	}
});
document.getElementById("buttonSoundRemove2").addEventListener('click', () => {
	if (hitAudio.volume > 0.15) {
		hitAudio.volume -= 0.1;
		hitAudio.play();
	}else{
		maxAudio.play();
	}
});




//start for the first time
openMenuHome();


//music hit
var hitAudio = document.createElement("audio");
hitAudio.src = "music/paf.wav";

//ambiance
var ambianceSound = document.createElement("audio");
ambianceSound.src = "music/taverne.mp3";
ambianceSound.loop = true;
//hitAudio.muted = true;

// out of music level
var maxAudio = document.createElement("audio");
maxAudio.src = "music/error.mp3";

//win music
var winAudio = document.createElement("audio");
winAudio.src = "music/sonic.mp3";

//button click sound
var clickAudio = document.createElement("audio");
clickAudio.src = "music/click.wav";
clickAudio.volume = 0.5;