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

        // numero em graus da diferencia entre angulos aceitavel
        this.precisao_rotacao = 0.1

        // numero aceitavel da distancia até o alvo
        this.precisao_distancia = 10
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

            case NAVE_APONTANDO_PARA_DESTINO:
                this.estado = NAVE_MOVENDO_PARA_DESTINO;
                break;

            case NAVE_MOVENDO_PARA_DESTINO:
                this.ir_destino()
                break;

            case NAVE_CHEGOU_DESTINO:
                this.ordens = this.ordens.shift()
                this.estado = NAVE_OCIOSA
                break;
        }
    }

    // Adiciona nova ordem
    adiconar_ordem(ordem){
        this.ordens.push(ordem)
        console.log(this.ordens)
    }

    rotacionar(){
        // Cria linha entra a nave e o destino para calculo do angulo do alvo em relação a nave
        this.linha.setTo(
            this.objeto.x,
            this.objeto.y,
            this.ordens[0].objeto[0],
            this.ordens[0].objeto[1]
        );
        // Angulo do destino em relação a nave
        var angulo_destino = Phaser.Math.RadToDeg(Phaser.Geom.Line.Angle(this.linha))%360
        // Converte angulo do phaser de -180 a 180 para 0 a 360
        if (angulo_destino < 0){
            angulo_destino = 360 + angulo_destino
        }

        // Angulo da em relação ao mundo - 0° graus aponta para esquerda
        var angulo_nave = Phaser.Math.RadToDeg(ship1.objeto.body.angle)
        // Converte angulo do phaser de -180 a 180 para 0 a 360
        if (angulo_nave < 0){
            angulo_nave = 360 + angulo_nave
        }

        // calcula rotaçao. <= 180 - rotação para esquerda | > 180 rotação para direira
        var direcao_rotacao = (angulo_nave-angulo_destino+360)%360 > 180

        // Rotaciona nave se estiver parada
        if (ship1.objeto.body.angularVelocity == 0){
            if (direcao_rotacao)
                this.rotacao_direita()
            else
                this.rotacao_esquerda()

        // Para a rotação quando estiver apontado para o alvo
        } else {
            var diferenca_angulo = this.calcular_diferenca_angulo(angulo_nave, angulo_destino)
            if(diferenca_angulo < this.precisao_rotacao){
                if (direcao_rotacao){
                    this.rotacao_esquerda()
                } else {
                    this.rotacao_direita()
                }
                this.estado = NAVE_APONTANDO_PARA_DESTINO
            }
        }
    }

    // Calcula diferença entre o angula da nave com a do alvo
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
        )
        this.objeto.applyForceFrom(
            {x: 16, y: 90},
            {x: -0.001, y: 0}
        )
    }

    // movimenta nave até o destino
    ir_destino(){
        var velocidade_nave = this.objeto.body.speed
        
        // Se nave parada verifica se precisa movimentar
        if (velocidade_nave == 0){
            this.movimentar_frente()
        } else {
            // Cria linha entre a nave e o destino para calculo da distancia
            this.linha.setTo(
                this.objeto.x,
                this.objeto.y,
                this.ordens[0].objeto[0],
                this.ordens[0].objeto[1]
            )
            var distancia_destino = Phaser.Geom.Line.Length(this.linha)
            // TESTE ***************************
            console.log("RENAN: " + distancia_destino)
            if (distancia_destino < this.precisao_distancia){
                this.movimentar_atras()
                this.estado = NAVE_CHEGOU_DESTINO
            }   
        }
    }

    // Movimentar nave para frente usando RCS
    movimentar_frente(){
        this.objeto.thrust(0.005)
    }

    // Movimentar nave para atras usando RCS
    movimentar_atras(){
        this.objeto.thrust(-0.005)
    }
}