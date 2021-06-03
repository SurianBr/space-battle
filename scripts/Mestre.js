class Mestre{
    constructor()
    {
        this.naves = []
    }

    adicionar_nave(nave){
        this.naves.push(nave)
    }

    atualizar(){
        this.naves.forEach(this.avaliar_naves, this)
    }

    // Avalida naves e manda ordens de acordo com o seu estado 
    avaliar_naves(nave, index){
        switch(nave.estado){
            case NAVE_OCIOSA:
                this.destino_aleatorio(nave)
                break
        }
    }

    // Manda nave ir para um ponto aleátorio da tela
    destino_aleatorio(nave){
        var x_aleatorio = this.numero_aleatorio(50, screen.width - 50)
        var y_aleatorio = this.numero_aleatorio(50, screen.height - 50)
        var nova_ordem = new Ordem(ORDEM_MOVIMENTACAO, [x_aleatorio, y_aleatorio])

        nave.adiconar_ordem(nova_ordem)
    }

    // retorna um numero aleatório entre um valor minimo e maximo
    numero_aleatorio(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}