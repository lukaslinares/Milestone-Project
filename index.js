class AudioController{
    constructor(){
        this.bgMusic = new Audio('Assets/Sounds/bg.mp3');
        this.flipSound = new Audio('Assets/Sounds/flip.wav');
        this.matchSound = new Audio('Assets/Sounds/match.mp3');
        this.victorySound = new Audio('Assets/Sounds/victory.wav');
        this.gameOverSound = new Audio('Assets/Sounds/gameOver.mp3');
        this.bgMusic.volume = 0.2;
        this.gameOverSound.volume = 0.3;
        this.victorySound.volume = 0.1;
    }
    startMusic(){
        this.bgMusic.play();
    }
    stopMusic(){
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip(){
        this.flipSound.play();
    }
    match(){
        this.matchSound.play();
    }
    victory(){
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver(){
        this.stopMusic();
        this.gameOverSound.play();
    }
}

class Nintendo{
    constructor(totalTime, cards){
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time');
        this.flipper = document.getElementById('flips');
        this.audioController = new AudioController();
    }
    startGame(){
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;
        setTimeout(()=>{
            this.audioController.startMusic();
            this.countDown = this.startCountdown();
            this.busy = false; 
        }, 500);
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.flipper.innerText = this.totalClicks;
    }
    hideCards(){
        this.cardsArray.forEach(card =>{
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
    flipCard(card){
        if(this.canFlipCard(card)){
            this.audioController.flip();
            this.totalClicks++;
            this.flipper.innerText = this.totalClicks;
            card.classList.add('visible');
            if(this.cardToCheck)
                this.checkForCardMatch(card)
                else
                    this.cardToCheck = card;
        }
    }
    checkForCardMatch(card){
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else 
            this.notAMatch(card, this.cardToCheck);
        this.cardToCheck = null;
    }
    cardMatch(card1, card2){
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }  
    notAMatch(card1, card2){
        this.busy = true;
        setTimeout(()=>{
            card1.classList.remove('visible')
            card2.classList.remove('visible')
            this.busy = false;
        }, 800);
    }
    getCardType(card){
        return card.getElementsByClassName('value')[0].src;
    }  
    startCountdown(){
        return setInterval(()=>{
            this.timeRemaining --;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0)
                this.gameOver();
        },1000);
    }
    victory(){
       clearInterval(this.countDown)
       this.audioController.victory();
       document.getElementById('victory-text').classList.add('visible') 
    }
    gameOver(){
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }
    canFlipCard(card){
        return true;
    }
}

function ready(){
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'))
    let game = new Nintendo(60, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () =>{
           overlay.classList.remove('visible'); 
           game.startGame();
            let audioController = new AudioController();
        });
    });
    cards.forEach(card =>{
        card.addEventListener('click',()=>{
            game.flipCard(card);
        });
    });
}
ready();