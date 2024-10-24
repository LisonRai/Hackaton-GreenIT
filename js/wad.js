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
    audio: {         
        disableWebAudio: true     
    },
    autoCenter: true
};

// Déclaration de nos variables globales
let game = new Phaser.Game(config);
let score = 0;//représente le profit en euros
let ecoGauge = 0;//Jauge écologique(commence à 0)
let pointsPerClick = 1;//Euros gagnés par clic

//Coûts et bénéfices initiaux des achats polluants et écologiques
let upgradeCostPolluting = 20;
let upgradeCostEco = 30;

//Impacts sur la jauge écologique
let pollutingPenalty = 6; //Diminution de l'écoresponsabilité pour les choix polluants
let ecoBonus = 4; //Augmentation de l'écoresponsabilité pour les choix


//Ajouts  du shop
let shopPollutinItems = [];
let shopEcoItems =[];

//UI elements
let scoreText, ecoGaugeText, clickButton, shopButton;
let choiceAvailable = false;// Empêcher d'acheter plusieurs fois avant d'avoir l'argent
function init() {
     
}

function preload() {
    
}

function create() {
    scoreText = this.add.text(10, 10, 'Profit: ' + score + '€', { fontSize: '16px', fill: '#000' });
    ecoGaugeText = this.add.text(10, 30, 'Écoresponsabilité: ' + ecoGauge, { fontSize: '16px', fill: '#000' });
    pointsText = this.add.text(10, 50, 'Points par clic: ' + pointsPerClick, { fontSize: '16px', fill: '#000' });

    // Création d'un bouton qui correspond à un clic pour générer des points
    let clickButton = this.add.text(150, 160, 'Cliquez ici', { fontSize: '20px', fill: '#056' });
    clickButton.setInteractive();
    clickButton.on('pointerdown', clickToProduce, this);  // Appelle onClick() à chaque clic
    console.log("Le bouton est crée et est interactif");
}

//Augmentation du profit après un certain nombre de clic + fenetre choix d'achat

function clickToProduce() {
       score += pointsPerClick;//Augmenter le profit avec chaque clic
       scoreText.setText('Profit: ' + score + '€');
         console.log("Clic! Score actuel:" +score);
       //si le joueur a assez d'argent pour un achat polluant
       if (score>= upgradeCostPolluting && !choiceAvailable) {
        offerUpgradeChoices();
       }

}

//gestion des choix d'achat

function offerUpgradeChoices(){
    choiceAvailable = true;

    //choix polluant ou éco
    let pollutingChoice = confirm("Voulez-vous acheter un item polluant à" + upgradeCostPolluting + "€ (+5€/clic, -6 points d'écoresponsabilité) ou attendre pour un item écoresponsable à " + upgradeCostEco + "€ (3€/clic, +4 points d'écoresponsabilité) ? Cliquez sur OK pour acheter, ou sur Annuler pour continuer à cliquer.");

    if (pollutingChoice) {
        makePollutingChoice();
    } 
    else {
        alert("Continuez à cliquer pour atteindre l'achat écoresponsable")
        
    }

    if( score >= upgradeCostEco) {
        let ecoFriendlyChoice = confirm("Vous avez maintenant assez pour un achat écoresponsable à" + upgradeCostEco + "€ (+3€/clic, +5 points d'écoresponsabilité). Voulez- ahcter?");
    
        if(ecoFriendlyChoice && score >= upgradeCostEco){
            makeEcoFriendlyChoice();
        }
    }
    choiceAvailable = false;
}

//Choix polluant
function makePollutingChoice(){
    score -= upgradeCostPolluting;  //déduire le coût de l'item polluant
    pointsPerClick += 5;            //Augmenter le gain par clic (polluant)
    ecoGauge -= pollutingPenalty;   //Diminuer la jauge écoresponsabilité
    update();                       //Met à jour l'affichage

    //Incrémenter le coût et ajuster la pénalité pour le prochain item polluant
    upgradeCostPolluting += 20;     //Chaque item polluant coûte 20€ de plus
    pollutingPenalty += 6;          //La pénalité écologique devient plus sévère

    checkGameOver(); 
}

//Choix Eco
function makeEcoFriendlyChoice(){
    score -= upgradeCostEco;        //déduire le coût de l'item éco
    pointsPerClick += 2;            //Augmenter le gain par clic
    ecoGauge += ecoBonus;           //Augmenter la jauge écoresponsabilité
    update();                       //Met à jour l'affichage

    //Incrémenter le cout et ajuster le bonus pour le prochain item éco
    upgradeCostEco += 30;
    ecoBonus += 4;

    checkGameOver();                //Vérifier si la jauge éco est atteint
}

//Fonction de mise à jour de l'affichage
function update(){
    scoreText.setText('Profit: ' + score + '€');
    ecoGaugeText.setText('Ecoresponsabilité: ' +ecoGauge);
}

//Fonction pour vérifier les conditions de fin de jeu
function checkGameOver(){
    if (ecoGauge <= -50) {
        alert("Vous avez perdu, votre entreprise est trop polluante!");
        resetGame();
    }
    else if (ecoGauge >=50){
        alert("Bravo! Votre entreprise est 100% ecoresponsable!");
        resetGame();
    }
}

function resetGame(){
    score = 0;
    ecoGauge = 0;
    pointsPerClick = 1;

    //Réinitialiser les coûts et les bonus/pénalités
    upgradeCostPolluting = 20;
    pollutingPenalty = 6;
    upgradeCostEco = 30;
    ecoBonus = 4;

    update();
}

