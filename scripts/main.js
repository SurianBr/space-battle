var config = {
    type: Phaser.AUTO,
    width: screen.width,
    height: screen.height,
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: false,    
            gravity: {x: 0, y: 0},
            debug: {
                showBody: true,
                showStaticBody: true,
                debugBodyColor: 0xffffff
            }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ship1', '/assets/ships/ship_1.png');
}

function create ()
{
    var Bodies = Phaser.Physics.Matter.Matter.Bodies;

    var shipConfig = {
        friction: 0.0,
        frictionAir: 0.0,
        frictionStatic: 0.0,
        angle: Phaser.Math.DegToRad(-90)
     }

     ship1 = new Ship(
        this,
        screen.width / 2,
        screen.height / 2,
        'ship1',
        0,
        shipConfig
    );

    ship2 = new Ship(
        this,
        (screen.width / 2) - 200,
        (screen.height / 2) - 200,
        'ship1',
        0,
        shipConfig
    );

    this.matter.add.mouseSpring();
    cursors = this.input.keyboard.createCursorKeys();

    // debug
    texto0 = this.add.text(0, 0, '', { font: '12px Arial', fill: '#00ff00' });
    texto1 = this.add.text(0, 14, '', { font: '12px Arial', fill: '#00ff00' });
    texto2 = this.add.text(0, 28, '', { font: '12px Arial', fill: '#00ff00' });
    texto3 = this.add.text(0, 42, '', { font: '12px Arial', fill: '#00ff00' });
    texto4 = this.add.text(0, 56, '', { font: '12px Arial', fill: '#00ff00' });

    graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });

    line = new Phaser.Geom.Line(-100, -100, -150, -150);
    point = new Phaser.Geom.Point(-100, -100);

    //game.events.onInputDown.add(listener, this);
}

function update ()
{
     pointer = this.game.input.activePointer;
     
    if(pointer.leftButtonDown()){
        point.setTo(pointer.x, pointer.y);
        graphics.clear();
        graphics.fillPointShape(point, 5);
    };

    if (cursors.left.isDown)
    {
        ship1.objeto.applyForceFrom(
            {x: 16, y: 0},
            {x: -0.0001, y: 0}
        );
        ship1.objeto.applyForceFrom(
            {x: 16, y: 90},
            {x: 0.0001, y: 0}
        );
    }
    else if (cursors.right.isDown)
    {
        ship1.objeto.applyForceFrom(
            {x: 16, y: 0},
            {x: 0.0001, y: 0}
        );
        ship1.objeto.applyForceFrom(
            {x: 16, y: 90},
            {x: -0.0001, y: 0}
        );
    }
    if (cursors.up.isDown)
    {
        ship1.objeto.thrust(0.001);
    }
    else if (cursors.down.isDown)
    {
        if(point.x >= 0 && point.y >= 0){
            line.setTo(ship1.objeto.x, ship1.objeto.y, point.x, point.y);
            graphics.strokeLineShape(line);
            texto3.setText("Angulo: " + Phaser.Math.RadToDeg(Phaser.Geom.Line.Angle(line)))

            ordem = new Ordem(ORDEM_MOVIMENTACAO, [point.x, point.y])
            ship1.adiconar_ordem(ordem)
        }
    }

    // Atualiza estado da naves
    ship1.updade()

    texto0.setText("Angulo: " + Phaser.Math.RadToDeg(ship1.objeto.body.angle));
    texto1.setText("Direcao: " + Phaser.Math.RadToDeg(Math.atan2(ship1.objeto.body.velocity.y, ship1.objeto.body.velocity.x)));
    texto2.setText("Velocidade: " + ship1.objeto.body.angularVelocity)
    texto4.setText("Ship1 : " + ship1.estado)

    //console.log(ship.body.velocity.x + " " + ship.body.velocity.x)
}