class Ship {
    constructor(phaser, x, y, texture, frame, config){
        // adiciona ship no mundo
        this.objeto = phaser.matter.add.sprite(x, y, texture, frame, config);

        // Estado atual da nave
        this.estado = NAVE_OCIOSA;
        
        // Ordens da nave
        this.ordens = [];
    }

    // Atualiza estado atual da nave
    updade() {
        switch(this.estado){
            case NAVE_OCIOSA:
                if (ordens.length > 0)
                    this.estado = NAVE_APONTANDO_PARA_DESTINO;
                break;
        }
    }
  }