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
        this.precisao_rotacao = 0.15

        // numero aceitavel da distancia até o alvo
        this.precisao_distancia = 10

        this.direcao_rotacao = false

        this.angulo_nave = 0

        this.angulo_direcao = 0
    }

    // Atualiza estado atual da nave
    atualizar() {
        this.calcular_angulo_nave()
        this.calcular_angulo_direcao()

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
                this.ordens.shift()
                this.estado = NAVE_OCIOSA
                break;

            case NAVE_PARAR:
                this.parar_nave()
                break;

            case NAVE_ROTACIONANDO_PARA_PARAR:
                this.roticionando_para_parar()
                break;

            case NAVE_ROTACIONADA_PARA_PARAR:
                this.rotacionada_para_parar()
                break;
        }
    }

    // Angulo da em relação ao mundo - 0° graus aponta para esquerda
    calcular_angulo_nave(){
        this.angulo_nave = Phaser.Math.RadToDeg(ship1.objeto.body.angle)
        // Converte angulo do phaser de -180 a 180 para 0 a 360
        if (this.angulo_nave < 0){
            this.angulo_nave = 360 + this.angulo_nave
        }

        // Força o angulo sempre ser entre 0 e 360 graus
        if (this.angulo_nave < 0 || this.angulo_nave > 360){
            this.angulo_nave = Math.abs(0 + this.angulo_nave%360)
        }
    }

    // Calcula a direção de movimento da nave em relação ao mundo.
    calcular_angulo_direcao(){
        // https://en.wikipedia.org/wiki/Atan2
        this.angulo_direcao = Phaser.Math.RadToDeg(
            Math.atan2(ship1.objeto.body.velocity.y, ship1.objeto.body.velocity.x)
        )
        
        // Se for zero não precisa fazer os caluculos abaixo
        if (this.angulo_direcao == 0){
            return
        }

        // Converte angulo do phaser de -180 a 180 para 0 a 360
        if (this.angulo_direcao < 0){
            this.angulo_direcao = 360 + this.angulo_direcao
        }

        // Força o angulo sempre ser entre 0 e 360 graus
        if (this.angulo_direcao < 0 || this.angulo_direcao > 360){
            this.angulo_direcao = Math.abs(0 + this.angulo_direcao%360)
        }
    }

    // Calcula angulo entre dois pontos
    calcular_angulo(x1, x2, x3, x4){
        // Cria um linha entra os dois pontos para calculo do angulo
        this.linha.setTo(x1, x2, x3, x4);

        var angulo = Phaser.Math.RadToDeg(Phaser.Geom.Line.Angle(this.linha))%360

        // Converte angulo do phaser de -180 a 180 para 0 a 360
        if (angulo < 0){
            angulo = 360 + angulo
        }

        // Força o angulo sempre ser entre 0 e 360 graus
        if (angulo > 360){
            angulo = Math.abs(0 + angulo%360)
        }

        if (angulo < 0){
            angulo = Math.abs(360 - angulo%360)
        } 

        return angulo
    }

    // Calcula diferença entre dois angulos
    calcular_diferenca_angulo(angulo1, angulo2){
        if (angulo1 > angulo2){
            return Math.abs(angulo1-angulo2)
        } else {
            return Math.abs(angulo2-angulo1)
        }
    }

    // Adiciona nova ordem
    adiconar_ordem(ordem){
        this.ordens.push(ordem)
    }

    rotacionar(){
        var velocidade_nave = this.objeto.body.speed
        if (velocidade_nave != 0){
            this.estado = NAVE_ROTACIONANDO_PARA_PARAR
            return
        } 

        // Angulo do destino em relação a nave
        var angulo_destino = this.calcular_angulo(
            this.objeto.x,
            this.objeto.y,
            this.ordens[0].objeto[0],
            this.ordens[0].objeto[1]
        )

        // calcula rotaçao. <= 180 - rotação para esquerda | > 180 rotação para direira
        var direcao_rotacao = (this.angulo_nave-angulo_destino+360)%360 > 180

        // Rotaciona nave se estiver parada
        if (ship1.objeto.body.angularVelocity == 0){
            if (direcao_rotacao)
                this.rotacao_direita()
            else
                this.rotacao_esquerda()

            // Guarda direção da rotação para parar depois
            this.direcao_rotacao = direcao_rotacao

        // Para a rotação quando estiver apontado para o alvo
        } else {
            var diferenca_angulo = this.calcular_diferenca_angulo(this.angulo_nave, angulo_destino)
            console.log(
                this.angulo_nave + " " +
                angulo_destino + " - " +
                diferenca_angulo
            )
            if(diferenca_angulo < this.precisao_rotacao){
                if (this.direcao_rotacao){
                    this.objeto.setAngularVelocity(0)
                } else {
                    this.objeto.setAngularVelocity(0)
                }
                this.estado = NAVE_APONTANDO_PARA_DESTINO
            }
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
            if (distancia_destino < this.precisao_distancia){
                this.objeto.setVelocity(0)
                this.estado = NAVE_CHEGOU_DESTINO
                return
            }

            // Angulo do destino em relação a nave
            var angulo_destino = this.calcular_angulo(
                this.objeto.x,
                this.objeto.y,
                this.ordens[0].objeto[0],
                this.ordens[0].objeto[1]
            )
            
            // Calcula diferença entre o direção de movimento desejada e a atual
            var diferenca_angulo = this.calcular_diferenca_angulo(
                this.angulo_nave,
                angulo_destino
            )
            
            // Se diferença for maior que a esperada, para a nave para realinhar
            if(diferenca_angulo > 1 && distancia_destino > 50){
                console.log("Parando nave " + distancia_destino)
                this.estado = NAVE_PARAR
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

    // Para a nave, primeiro para a rotação, aponta para o sentido oposto da direção
    // e depois para
    parar_nave(){
        var velocidade_angular_nave = this.objeto.body.angularVelocity
        var velocidade_nave = this.objeto.body.speed

        if (velocidade_angular_nave != 0){
            this.objeto.setAngularVelocity(0)
            return
        }

        if (velocidade_nave != 0){
            this.estado = NAVE_ROTACIONANDO_PARA_PARAR
            return
        }

        this.estado = NAVE_OCIOSA
    }

    // Rotaciona a nave no sentido oposto da direção de movimento para parar
    roticionando_para_parar(){
        // Calcula direção oposta da direção atual
        var angulo_destino = this.angulo_direcao + 180
        if (angulo_destino > 360){
            angulo_destino = angulo_destino%360
        }

        // Força o angulo sempre ser entre 0 e 360 graus
        if (angulo_destino < 0 || angulo_destino > 360){
            angulo_destino = Math.abs(0 + angulo_destino%360)
        }

        // Calcula direção da rotação
        var direcao_rotacao = (this.angulo_nave-angulo_destino+360)%360 > 180

        // Rotaciona nave se estiver parada
        if (ship1.objeto.body.angularVelocity == 0){
            if (direcao_rotacao)
                this.rotacao_direita()
            else
                this.rotacao_esquerda()

            // Guarda direção da rotação para parar depois
            this.direcao_rotacao = direcao_rotacao

        // Para a rotação quando estiver apontado para o alvo
        } else {
            var diferenca_angulo = this.calcular_diferenca_angulo(this.angulo_nave, angulo_destino)
            if(diferenca_angulo < this.precisao_rotacao){
                if (this.direcao_rotacao){
                    this.objeto.setAngularVelocity(0)
                } else {
                    this.objeto.setAngularVelocity(0)
                }
                this.estado = NAVE_ROTACIONADA_PARA_PARAR
            }
        }
    }

    // Nave está apontando para a direção correta para parar
    rotacionada_para_parar(){
        this.objeto.setVelocity(0)
        this.estado = NAVE_OCIOSA
    }

}