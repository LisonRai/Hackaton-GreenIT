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

let backgroundImage;
let money = 0;
let ecoScore = 0.5; 
let moneyPerClick = 1; 
let moneyPerSecond = 0;
let ecoMultiplier = 1; 

let upgrade1Button, upgrade2Button;

let upgrades = [
    { name: "upgrade1", cost: 20, ecoImpact: -0.1, profit: 0, addClick: 2},
    { name: "upgrade2", cost: 30, ecoImpact: 0.05, profit: 0 , addClick: 1},
    { name: "upgrade3", cost: 150, ecoImpact: -0.3, profit: 5 , addClick: 0},
    { name: "upgrade4", cost: 200, ecoImpact: 0.1, profit: 3 , addClick: 0}
];

// UI elements
let moneyText, ecoScoreText;
let buildingTween;

let gameOverScreen;
let introScreen;

let cursor;

function init() {}

function preload() {
    this.load.image('building', './assets/images/building.png');

    this.load.image('gameover', './assets/images/gameover.png');
    this.load.image('intro', './assets/images/intro.png');

    this.load.image('upgrade1', './assets/images/upgrade1.png');
    this.load.image('upgrade2', './assets/images/upgrade2.png');
    this.load.image('upgrade3', './assets/images/upgrade3.png');
    this.load.image('upgrade4', './assets/images/upgrade4.png');

    this.load.image('bg0', './assets/images/bg0.png');
    this.load.image('bg25', './assets/images/bg25.png');
    this.load.image('bg50', './assets/images/bg50.png');
    this.load.image('bg75', './assets/images/bg75.png');
    this.load.image('bg100', './assets/images/bg100.png');

    this.load.image('cursor', './assets/images/cursor.png');
}

function create() {

    backgroundImage = this.add.image(0, 0, 'bg50');
    backgroundImage.setOrigin(0, 0);

    let buildingButton = this.add.image(84+53, 60+100, 'building').setInteractive();
    buildingButton.setOrigin(0.5,0.5)
    buildingButton.on('pointerdown', clickBuilding);

    // Create and assign upgrade buttons
    upgrade1Button = this.add.image(100, 250, 'upgrade1').setInteractive();
    upgrade1Button.on('pointerdown', () => purchaseUpgrade(upgrades[0]));
    upgrades[0].button = upgrade1Button; 

    upgrade2Button = this.add.image(200, 250, 'upgrade2').setInteractive();
    upgrade2Button.on('pointerdown', () => purchaseUpgrade(upgrades[1]));
    upgrades[1].button = upgrade2Button;

    upgrade3Button = this.add.image(300, 250, 'upgrade3').setInteractive();
    upgrade3Button.on('pointerdown', () => purchaseUpgrade(upgrades[2]));
    upgrades[2].button = upgrade3Button;

    upgrade4Button = this.add.image(400, 250, 'upgrade4').setInteractive();
    upgrade4Button.on('pointerdown', () => purchaseUpgrade(upgrades[3]));
    upgrades[3].button = upgrade4Button;

    moneyText = this.add.text(10, 10, 'Money: $0', { fontSize: '16px', fill: '#fff' });
    ecoScoreText = this.add.text(10, 30, 'Eco Score: 50%', { fontSize: '16px', fill: '#fff' });

    buildingTween = this.tweens.add({ 
        targets: buildingButton,    
        scaleX: 1.03,            
        scaleY: 1.12,            
        duration: 50,                 
        ease: 'Power2',    
        paused: true,      
        yoyo: true,      
        loop: 0
    });

    upgrades.forEach((upgrade, index) => {
        upgrade.tween = this.tweens.add({
            targets: upgrade.button,
            scale: 1.2,
            duration: 50,
            ease: 'Power2',
            yoyo: true,
            loop: 0,
            paused: true,  
        });
        upgrade.active = true;
    });

    cursor = this.add.image(174,39, 'cursor'); 
    cursor.setOrigin(0,0);

    introScreen = this.add.image(0, 0, 'intro').setInteractive(); 
    introScreen.on('pointerdown',startGame)
    introScreen.setOrigin(0,0);
    introScreen.alpha = 0.8;
    introScreen.setVisible(true);

    gameOverScreen = this.add.image(0, 0, 'gameover'); 
    gameOverScreen.setOrigin(0,0);
    gameOverScreen.setVisible(false);

    
    updateBackground();
    updateButtonAlpha(); // Initial check to set button transparency
}

function update(time, delta) {
    money += (moneyPerSecond * delta) / 1000;
    updateUI();
    updateBackground();
    updateButtonAlpha(); // Continuously check button alpha as money changes
    checkGameOver()
    checkButtonActive();
    adjustCursor(this);
}

function clickBuilding() {
    money += moneyPerClick;
    buildingTween.play();
    updateUI();
}

function purchaseUpgrade(upgrade) {
    upgrade.tween.play();

    if (money >= upgrade.cost) {
        money -= upgrade.cost;

        moneyPerSecond += upgrade.profit; 
        moneyPerClick += upgrade.addClick;
        ecoScore = Math.max(0, Math.min(1, ecoScore + upgrade.ecoImpact));
        
        updateUI();
        checkGameOver();  
        console.log("Upgrade purchased successfully.");
    } else {
        console.log("Not enough money to purchase this upgrade.");
    }
}

// Update UI text
function updateUI() {
    moneyText.setText('Money: $' + Math.floor(money));
    ecoScoreText.setText('Eco Score: ' + Math.floor(ecoScore * 100) + '%');
}

// Update button alpha based on whether the player can afford the upgrade
function updateButtonAlpha() {
    upgrades.forEach(upgrade => {
        if (money >= upgrade.cost) {
            upgrade.button.alpha = 1;  // Fully visible if the player can afford it
        } else {
            upgrade.button.alpha = 0.1; // Dimmed if the player cannot afford it
        }
    });
}

// Function to update the background based on ecoScore
function updateBackground() {
    let ecoScorePercentage = ecoScore * 100;

    if (ecoScorePercentage < 25) {
        backgroundImage.setTexture('bg0');
    } else if (ecoScorePercentage < 50) {
        backgroundImage.setTexture('bg25');
    } else if (ecoScorePercentage < 75) {
        backgroundImage.setTexture('bg50');
    } else if (ecoScorePercentage < 90) {
        backgroundImage.setTexture('bg75');
    } else {
        backgroundImage.setTexture('bg100');
    }
}

function startGame(){
    introScreen.setVisible(false);
}

function checkGameOver(){
    if (ecoScore <= 0.001) {
        gameOverScreen.setVisible(true);
        upgrades.forEach((upgrade, index) => {
            upgrade.active = false;
        });    }
}

function checkButtonActive(){
    upgrades.forEach((upgrade, index) => {
        if(upgrade.active == false){
            upgrade.button.disableInteractive()
        };
    });    
}

function adjustCursor(scene) {
    const targetX = 124 + ecoScore * 100;

    // Check if the tween already exists
    if (cursor.tween) {
        // Update the tween target and play again
        cursor.tween.updateTo('x', targetX, true);
        cursor.tween.restart();
    } else {
        // Create the tween for the first time
        cursor.tween = scene.tweens.add({
            targets: cursor,
            x: targetX,
            duration: 500,  // Adjust the duration for smoothness
            ease: 'Power2',
            yoyo: false,
            loop: 0
        });
    }
}
