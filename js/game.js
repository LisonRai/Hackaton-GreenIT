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
    { name: "upgrade1", cost: 20, ecoImpact: -0.5, profit: 2 },
    { name: "upgrade2", cost: 30, ecoImpact: 0.3, profit: 1 }
];

// UI elements
let moneyText, ecoScoreText;
let buildingTween;

function init() {}

function preload() {
    this.load.image('building', './assets/images/building.png');
    this.load.image('temp1', './assets/images/temp1.png');
    this.load.image('temp2', './assets/images/temp2.png');
    this.load.image('bg0', './assets/images/bg0.png');
    this.load.image('bg25', './assets/images/bg25.png');
    this.load.image('bg50', './assets/images/bg50.png');
    this.load.image('bg75', './assets/images/bg75.png');
    this.load.image('bg100', './assets/images/bg100.png');
}

function create() {

    backgroundImage = this.add.image(0, 0, 'bg50');
    backgroundImage.setOrigin(0, 0);

    let buildingButton = this.add.image(150, 150, 'building').setInteractive();
    buildingButton.on('pointerdown', clickBuilding);

    // Create and assign upgrade buttons
    upgrade1Button = this.add.image(100, 250, 'temp1').setInteractive();
    upgrade1Button.on('pointerdown', () => purchaseUpgrade(upgrades[0]));
    upgrades[0].button = upgrade1Button; 

    upgrade2Button = this.add.image(300, 250, 'temp2').setInteractive();
    upgrade2Button.on('pointerdown', () => purchaseUpgrade(upgrades[1]));
    upgrades[1].button = upgrade2Button;

    moneyText = this.add.text(10, 10, 'Money: $0', { fontSize: '16px', fill: '#fff' });
    ecoScoreText = this.add.text(10, 30, 'Eco Score: 50%', { fontSize: '16px', fill: '#fff' });

    buildingTween = this.tweens.add({ 
        targets: buildingButton,    
        scale: 1.2,            
        duration: 50,                 
        ease: 'Power2',          
        yoyo: true,      
        loop: 0
    });

    updateBackground();
    updateButtonAlpha(); // Initial check to set button transparency
}

function update(time, delta) {
    money += (moneyPerSecond * delta) / 1000;
    updateUI();
    updateBackground();
    updateButtonAlpha(); // Continuously check button alpha as money changes
}

function clickBuilding() {
    money += moneyPerClick;
    buildingTween.play();
    updateUI();
}

function purchaseUpgrade(upgrade) {
    if (money >= upgrade.cost) {
        money -= upgrade.cost;
        moneyPerSecond += upgrade.profit; 
        ecoScore = Math.max(0, Math.min(1, ecoScore + upgrade.ecoImpact));
        updateUI();
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
    } else if (ecoScorePercentage < 100) {
        backgroundImage.setTexture('bg75');
    } else {
        backgroundImage.setTexture('bg100');
    }
}
