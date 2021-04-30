class Ship {
    constructor(phaser, x, y, texture, frame, config){
        // adiciona ship no mundo
        this.objeto = phaser.matter.add.sprite(x, y, texture, frame, config);

        // Estado atual da nave
        this.estado = NAVE_OCIOSA;
        
        // Ordens da nave
        this.ordens = [];
        
        // linha para cauculos de angulos entre a nave e um ponto qualquer
        this.linha = new Phaser.Geom.Line(-100, -100, -150, -150);
    }

    // Atualiza estado atual da nave
    updade() {
        switch(this.estado){
            case NAVE_OCIOSA:
                if (this.ordens.length > 0){
                    if (this.ordens[0].tipo == ORDEM_MOVIMENTACAO){
                        this.estado = NAVE_ROTACIONANDO_PARA_DESTINO
                    }
                }
                break;
            case NAVE_ROTACIONANDO_PARA_DESTINO:
                this.rotacionar()
                break;
        }
    }

    // Adiciona nova ordem
    adiconar_ordem(ordem){
        this.ordens.push(ordem)
        console.log(this.ordens)
    }

    rotacionar(){
        // Cria linha entra a nave e o destino
        this.linha.setTo(
            this.objeto.x,
            this.objeto.y,
            this.ordens[0].objeto[0],
            this.ordens[0].objeto[1]
        );
        var angulo_destino = Phaser.Math.RadToDeg(Phaser.Geom.Line.Angle(this.linha))%360
        if (angulo_destino < 0){
            angulo_destino = 360 + angulo_destino
        }

        var angulo_nave = Phaser.Math.RadToDeg(ship1.objeto.body.angle)
        if (angulo_nave < 0){
            angulo_nave = 360 + angulo_nave
        }

        // calcula rotaçao. <= 180 - rotação para esquerda | > 180 rotação para direira
        var direcao_rotacao = (angulo_nave-angulo_destino+360)%360

        // Rotaciona nave se estiver parada
        if (ship1.objeto.body.angularVelocity == 0){
            if (direcao_rotacao > 180)
                this.rotacao_direita()
            else
                this.rotacao_esquerda()

        // Para a rotação quando estiver apontado para o alvo
        } else {
            var diferenca_angulo = this.calcular_diferenca_angulo(angulo_nave, angulo_destino)
            console.log(direcao_rotacao)
            if(diferenca_angulo < 1){
                if (direcao_rotacao > 180){
                    this.rotacao_esquerda()
                } else {
                    this.rotacao_direita()
                }

                this.estado = NAVE_APONTANDO_PARA_DESTINO
            }
        }
    }

    calcular_diferenca_angulo(angulo_nave, angulo_destino){
        if (angulo_nave > angulo_destino){
            return Math.abs(angulo_nave-angulo_destino)

        } else {
            return Math.abs(angulo_destino-angulo_nave)
        }
    }

    // Ratocionar nava para esquerda usando RCS
    rotacao_esquerda(){
        ship1.objeto.applyForceFrom(
            {x: 16, y: 0},
            {x: -0.001, y: 0}
        );
        ship1.objeto.applyForceFrom(
            {x: 16, y: 90},
            {x: 0.001, y: 0}
        );
    }

    // Ratocionar nava para direira usando RCS
    rotacao_direita(){
        this.objeto.applyForceFrom(
            {x: 16, y: 0},
            {x: 0.001, y: 0}
        );
        this.objeto.applyForceFrom(
            {x: 16, y: 90},
            {x: -0.001, y: 0}
        );
    }
  }