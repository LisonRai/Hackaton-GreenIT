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


//
function init() {
     
}

function preload() {
    
}

function create() {
    
}

function update() {
       
}