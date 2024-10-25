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
    { name: "upgrade3", cost: 150, ecoImpact: -0.3, profit: 5 , addClick: 1},
    { name: "upgrade4", cost: 200, ecoImpact: 0.1, profit: 3 , addClick: 1},
    { name: "upgrade5", cost: 1000, ecoImpact: -0.5, profit: 20 , addClick: 2},
    { name: "upgrade6", cost: 1500, ecoImpact: 0.2, profit: 10 , addClick: 2},
];

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

    this.load.image('upgrade1', './assets/images/iconPollution.02.png');
    this.load.image('upgrade2', './assets/images/iconEco.02.png');
    this.load.image('upgrade3', './assets/images/iconPollution.01.png');
    this.load.image('upgrade4', './assets/images/iconEco.01.png');
    this.load.image('upgrade5', './assets/images/iconPollution.03.png');
    this.load.image('upgrade6', './assets/images/iconEco.03.png');

    this.load.image('info1', './assets/images/info1.png');
    this.load.image('info2', './assets/images/info2.png');
    this.load.image('info3', './assets/images/info3.png');
    this.load.image('info4', './assets/images/info4.png');
    this.load.image('info5', './assets/images/info5.png');
    this.load.image('info6', './assets/images/info6.png');

    this.load.image('iconOff', './assets/images/iconOff.png');

    this.load.image('bg0', './assets/images/bg0.png');
    this.load.image('bg25', './assets/images/bg25.png');
    this.load.image('bg50', './assets/images/bg50.png');
    this.load.image('bg75', './assets/images/bg75.png');
    this.load.image('bg100', './assets/images/bg100.png');

    this.load.image('cursor', './assets/images/cursor.png');
    this.load.image('jaugeEco', './assets/images/UI_JaugeEco.png');

    this.load.image('moneyBar', './assets/images/UI_Money_background_01.png');
    this.load.image('iconBar', './assets/images/UI_Icons_background_01.png');
}

function create() {

    backgroundImage = this.add.image(0, 0, 'bg50');
    backgroundImage.setOrigin(0, 0);

    let buildingButton = this.add.image(84+53, 60+100, 'building').setInteractive();
    buildingButton.setOrigin(0.5,0.5)
    buildingButton.on('pointerdown', clickBuilding);

    // Create and assign upgrade buttons
    moneyBarImage = this.add.image(265,6, 'iconBar');
    moneyBarImage.setOrigin(0,0);

    upgrade1Button = this.add.image(311, 34, 'upgrade1').setInteractive();
    upgrade1Button.setOrigin(0,0)
    upgrade1Button.on('pointerdown', () => purchaseUpgrade(upgrades[0]));
    upgrades[0].button = upgrade1Button; 
    upgrade1Button.on('pointerover',() => showInfo(info1));
    upgrade1Button.on('pointerout',() => hideInfo(info1));

    upgrade2Button = this.add.image(311, 184, 'upgrade2').setInteractive();
    upgrade2Button.setOrigin(0,0)
    upgrade2Button.on('pointerdown', () => purchaseUpgrade(upgrades[1]));
    upgrades[1].button = upgrade2Button;
    upgrade2Button.on('pointerover',() => showInfo(info2));
    upgrade2Button.on('pointerout',() => hideInfo(info2));

    upgrade3Button = this.add.image(358, 34, 'upgrade3').setInteractive();
    upgrade3Button.setOrigin(0,0)
    upgrade3Button.on('pointerdown', () => purchaseUpgrade(upgrades[2]));
    upgrades[2].button = upgrade3Button;
    upgrade3Button.on('pointerover',() => showInfo(info3));
    upgrade3Button.on('pointerout',() => hideInfo(info3));

    upgrade4Button = this.add.image(358, 184, 'upgrade4').setInteractive();
    upgrade4Button.setOrigin(0,0)
    upgrade4Button.on('pointerdown', () => purchaseUpgrade(upgrades[3]));
    upgrades[3].button = upgrade4Button;
    upgrade4Button.on('pointerover',() => showInfo(info4));
    upgrade4Button.on('pointerout',() => hideInfo(info4));

    upgrade5Button = this.add.image(405, 34, 'upgrade5').setInteractive();
    upgrade5Button.setOrigin(0,0)
    upgrade5Button.on('pointerdown', () => purchaseUpgrade(upgrades[4]));
    upgrades[4].button = upgrade5Button;
    upgrade5Button.on('pointerover',() => showInfo(info5));
    upgrade5Button.on('pointerout',() => hideInfo(info5));
    
    upgrade6Button = this.add.image(405, 184, 'upgrade6').setInteractive();
    upgrade6Button.setOrigin(0,0)
    upgrade6Button.on('pointerdown', () => purchaseUpgrade(upgrades[5]));
    upgrades[5].button = upgrade6Button;
    upgrade6Button.on('pointerover',() => showInfo(info6));
    upgrade6Button.on('pointerout',() => hideInfo(info6));

    offButton1 = this.add.image(311, 74, 'iconOff');
    offButton1.setOrigin(0,0)
    offButton1.alpha=0.1;

    offButton2 = this.add.image(358, 74, 'iconOff');
    offButton2.setOrigin(0,0)
    offButton2.alpha=0.1;

    offButton3 = this.add.image(405, 74, 'iconOff');
    offButton3.setOrigin(0,0)
    offButton3.alpha=0.1;

    offButton4 = this.add.image(311, 114, 'iconOff');
    offButton4.setOrigin(0,0)
    offButton4.alpha=0.1;

    offButton5 = this.add.image(358, 114, 'iconOff');
    offButton5.setOrigin(0,0)
    offButton5.alpha=0.1;

    offButton6 = this.add.image(405, 114, 'iconOff');
    offButton6.setOrigin(0,0)
    offButton6.alpha=0.1;

    offButton7 = this.add.image(311, 224, 'iconOff');
    offButton7.setOrigin(0,0)
    offButton7.alpha=0.1;

    offButton8 = this.add.image(358, 224, 'iconOff');
    offButton8.setOrigin(0,0)
    offButton8.alpha=0.1;

    offButton9 = this.add.image(405, 224, 'iconOff');
    offButton9.setOrigin(0,0)
    offButton9.alpha=0.1;

    offButton10 = this.add.image(311, 264, 'iconOff');
    offButton10.setOrigin(0,0)
    offButton10.alpha=0.1;

    offButton11 = this.add.image(358, 264, 'iconOff');
    offButton11.setOrigin(0,0)
    offButton11.alpha=0.1;

    offButton12 = this.add.image(405, 264, 'iconOff');
    offButton12.setOrigin(0,0)
    offButton12.alpha=0.1;

    info1 = this.add.image(upgrade1Button.x,upgrade1Button.y, 'info1');
    info1.setVisible(false);
    info2 = this.add.image(upgrade2Button.x,upgrade2Button.y, 'info2');
    info2.setVisible(false);
    info3 = this.add.image(upgrade3Button.x,upgrade3Button.y, 'info3');
    info3.setVisible(false);
    info4 = this.add.image(upgrade4Button.x,upgrade4Button.y, 'info4');
    info4.setVisible(false);
    info5 = this.add.image(upgrade5Button.x,upgrade5Button.y, 'info5');
    info5.setVisible(false);
    info6 = this.add.image(upgrade6Button.x,upgrade6Button.y, 'info6');
    info6.setVisible(false);

    moneyBarImage = this.add.image(7,8, 'moneyBar');
    moneyBarImage.setOrigin(0,0);


    moneyText = this.add.text(45, 14, '$0', { 
        fontFamily: 'Arial', 
        fontSize: '16px', 
        color: '#000000' 
    });    
    // ecoScoreText = this.add.text(10, 30, 'Eco Score: 50%', { fontSize: '16px', fill: '#fff' });

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

    gauge = this.add.image(124,38, 'jaugeEco'); 
    gauge.setOrigin(0,0);
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
    updateButtonAlpha(); 
}

function update(time, delta) {
    money += (moneyPerSecond * delta) / 1000;
    updateUI();
    updateBackground();
    updateButtonAlpha(); 
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

function updateUI() {
    moneyText.setText('$' + Math.floor(money));
    // ecoScoreText.setText('Eco Score: ' + Math.floor(ecoScore * 100) + '%');
}

function updateButtonAlpha() {
    upgrades.forEach(upgrade => {
        if (money >= upgrade.cost) {
            upgrade.button.alpha = 1;  
        } else {
            upgrade.button.alpha = 0.1; 
        }
    });
}

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

    if (cursor.tween) {
        cursor.tween.updateTo('x', targetX, true);
        cursor.tween.restart();
    } else {
        cursor.tween = scene.tweens.add({
            targets: cursor,
            x: targetX,
            duration: 500, 
            ease: 'Power2',
            yoyo: false,
            loop: 0
        });
    }
}

function showInfo(info){
    info.setVisible(true);
}

function hideInfo(info){
    info.setVisible(false);
}