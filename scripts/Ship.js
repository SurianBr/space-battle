class Ship {
    constructor(phaser, x, y, texture, frame, config){
        // adiciona ship ni stage
        this.objeto = phaser.matter.add.sprite(x, y, texture, frame, config);
    }
  }