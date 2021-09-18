// Estados de uma nave
const NAVE_OCIOSA = 0; // sem nada para fazer
const NAVE_ROTACIONANDO_PARA_DESTINO = 1; // roticionar para pontar ao destino
const NAVE_APONTANDO_PARA_DESTINO = 2; // terminou de roticionar e está apontando para o destino
const NAVE_MOVENDO_PARA_DESTINO = 3; // a caminho do destino
const NAVE_CHEGOU_DESTINO = 4; // chegou ao destino
const NAVE_PARAR = 5 // Para a nave
const NAVE_ROTACIONANDO_PARA_PARAR = 6; // rotaciona a nove no sentido oposta da direção de movimento para parar a nave
const NAVE_ROTACIONADA_PARA_PARAR = 7; //nave está apontando para a direção correta para parar

// Tipos de ordens
const ORDEM_MOVIMENTACAO = 0;