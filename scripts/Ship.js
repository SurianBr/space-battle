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
                if (this.ordens.length > 0)
                    switch(this.ordens[0].tipo){
                        case ORDEM_MOVIMENTACAO:
                            this.estado = NAVE_APONTANDO_PARA_DESTINO
                            break;
                    }
                break;
        }
    }

    // Adiciona nova ordem
    adiconar_ordem(ordem){
        this.ordens.push(ordem)
        console.log(this.ordens)
    }
  }