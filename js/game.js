let config = {
    type: Phaser.AUTO,
    width: 480,
    height: 320,
    physics: {
        default: 'arcade'
    },
    scene: {
        init: init,
        preload: preload,
        create: create,
        update: update
    },
    autoCenter: true
};

let game = new Phaser.Game(config);



let money = 0;
let ecoScore = 0;
let moneyPerClick = 1;

// //Coûts et bénéfices initiaux des achats polluants et écologiques
// let upgradeCostPolluting = 20;
// let upgradeCostEco = 30;

// //Impacts sur la jauge écologique
// let pollutingPenalty = 6; //Diminution de l'écoresponsabilité pour les choix polluants
// let ecoBonus = 4; //Augmentation de l'écoresponsabilité pour les choix

// //Ajouts  du shop
// let shopPollutinItems = [];
// let shopEcoItems =[];

// //UI elements
// let scoreText, ecoGaucheText, clickButton, shopButton;
// let choiceAvailable = false;// Empêcher d'acheter plusieurs fois avant d'avoir l'argent

let upgrade1 = {cost : 20, ecoImpact : -20, profit: 20, available : false }
let upgrade1Button;

function init(){

}

function preload() {
    this.load.image('building' , './assets/images/building.png');
    this.load.image('tempButton' , './assets/images/temp.png');
}

function create() {
    let upgrade1Button = this.add.image(0, 0, 'tempButton').setInteractive();
    upgrade1Button.on('pointerdown', () => upgradeButtonDown(upgrade1));  // Pass a function reference

    let buildingButton = this.add.image(150, 150, 'building').setInteractive();
    buildingButton.on('pointerdown', clickBuilding);

}
function update(){

}

function upgradeButtonDown(upgrade){
    console.log("click upgrade");
}

function clickBuilding(){
    console.log("click building");
}