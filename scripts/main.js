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
                /*
                showBody: true,
                showStaticBody: true,
                debugBodyColor: 0xffffff
                */
                showAxes: false,
                showAngleIndicator: true,
                angleColor: 0xe81153,

                showBroadphase: false,
                broadphaseColor: 0xffb400,

                showBounds: false,
                boundsColor: 0xffffff,

                showVelocity: true,
                velocityColor: 0x00aeef,

                showCollisions: true,
                collisionColor: 0xf5950c,
    
                showSeparations: false,
                separationColor: 0xffa500,

                showBody: true,
                showStaticBody: true,
                showInternalEdges: true,

                renderFill: false,
                renderLine: true,
    
                fillColor: 0x106909,
                fillOpacity: 1,
                lineColor: 0x28de19,
                lineOpacity: 1,
                lineThickness: 1,
    
                staticFillColor: 0x0d177b,
                staticLineColor: 0x1327e4,

                showSleeping: true,
                staticBodySleepOpacity: 1,
                sleepFillColor: 0x464646,
                sleepLineColor: 0x999a99,
    
                showSensors: true,
                sensorFillColor: 0x0d177b,
                sensorLineColor: 0x1327e4,
    
                showPositions: true,
                positionSize: 4,
                positionColor: 0xe042da,
    
                showJoint: true,
                jointColor: 0xe0e042,
                jointLineOpacity: 1,
                jointLineThickness: 2,
    
                pinSize: 4,
                pinColor: 0x42e0e0,
    
                springColor: 0xe042e0,
    
                anchorColor: 0xefefef,
                anchorSize: 4,
    
                showConvexHulls: true,
                hullColor: 0xd703d0
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

    mestre =  new Mestre()
    mestre.adicionar_nave(ship1)

    this.matter.add.mouseSpring();
    cursors = this.input.keyboard.createCursorKeys();

    // debug
    texto0 = this.add.text(0, 0, '', { font: '12px Arial', fill: '#00ff00' });
    texto1 = this.add.text(0, 14, '', { font: '12px Arial', fill: '#00ff00' });
    texto2 = this.add.text(0, 28, '', { font: '12px Arial', fill: '#00ff00' });
    texto3 = this.add.text(0, 42, '', { font: '12px Arial', fill: '#00ff00' });
    texto4 = this.add.text(0, 70, '', { font: '12px Arial', fill: '#00ff00' });
    texto5 = this.add.text(0, 56, '', { font: '12px Arial', fill: '#00ff00' });

    graphics = this.add.graphics({ lineStyle: { width: 4, color: 0xaa00aa } });

    line = new Phaser.Geom.Line(-100, -100, -150, -150);
    point = new Phaser.Geom.Point(-100, -100);

    //game.events.onInputDown.add(listener, this);
}

function update ()
{
     pointer = this.game.input.activePointer;
     
    if(pointer.leftButtonDown()){
        /*
        point.setTo(pointer.x, pointer.y);
        graphics.clear();
        graphics.fillPointShape(point, 5);
        */
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
        /*
        if(point.x >= 0 && point.y >= 0){
            line.setTo(ship1.objeto.x, ship1.objeto.y, point.x, point.y);
            graphics.strokeLineShape(line);
            var angulo = Phaser.Math.RadToDeg(Phaser.Geom.Line.Angle(line))
            if (angulo < 0){
                angulo = 360 + angulo
            }
            texto3.setText("Angulo: " + angulo)

            ordem = new Ordem(ORDEM_MOVIMENTACAO, [point.x, point.y])
            ship1.adiconar_ordem(ordem)
        }
        */
    }

    // Atualiza mestre
    mestre.atualizar()

    // Atualiza estado da naves
    ship1.atualizar()

    if (ship1.ordens.length > 0){
        point.setTo(ship1.ordens[0].objeto[0], ship1.ordens[0].objeto[1]);
        graphics.clear();
        graphics.fillPointShape(point, 5);
    }

    var angulo_nave = Phaser.Math.RadToDeg(ship1.objeto.body.angle)%360
    if (angulo_nave < 0){
        angulo_nave = 360 + angulo_nave
    }

    texto0.setText("Angulo Nave: " + ship1.angulo_nave);
    texto1.setText("Direcao: " + ship1.angulo_direcao);
    texto2.setText("Velocidade Angular: " + ship1.objeto.body.angularVelocity)
    texto4.setText("Ship1 : " + ship1.estado)
    texto5.setText("Velocidade: " + ship1.objeto.body.speed)

    //console.log(ship.body.velocity.x + " " + ship.body.velocity.x)
}