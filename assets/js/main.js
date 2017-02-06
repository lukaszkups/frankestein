var game = new Phaser.Game(800, 800, Phaser.CANVAS, '', { preload: preload, create: create, update: update });
var platforms;
var playerMovingLeft = false;
var map;
var layer
var player;
var traps;
var trapMap;
var spikes;

function preload(){
  // load game sprite image, 5 x 5px each frame, 33 frames in total
  game.load.spritesheet('tile', 'assets/img/tiles.png', 50, 50, 32);
  game.load.spritesheet('hero', 'assets/img/hero.png', 40, 50, 6);
  // turn scale filter to nearest neighbour
  //game.stage.smoothed = false;
  // load tiled level
  game.load.tilemap('lvl', 'assets/map/map2.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('lvlTiles', 'assets/img/tiles.png');
}

function create() {
  game.add.sprite(0, 0, 'tile');
  platforms = game.add.group();
  platforms.enableBody = true;
  
  /* 
  var ground = platforms.create(0, game.world.height - 64, 'tile');
  
  ground.scale.set(10, 10);
  ground.frame = 7;
  ground.body.immovable = true;
  ground = platforms.create(40, game.world.height - 64, 'tile');
  ground.scale.set(100, 10);
  ground.frame = 6;

  ground.body.immovable = true;
  
  platforms.scale.set(10, 10); 
  */


  player = game.add.sprite(10, game.world.height - 150, 'hero');

  game.stage.backgroundColor = '#dddddd';

  map = game.add.tilemap('lvl');
  map.addTilesetImage('tiles', 'lvlTiles');
  layer = map.createLayer('ground');
  map.setCollisionBetween(1, 400, true, 'ground');
  

  // The player and its settings
  player = game.add.sprite(32, 32, 'hero');
  //  We need to enable physics on the player
  game.physics.arcade.enable(player);

  //  Player physics properties. Give the little guy a slight bounce.
  player.body.bounce.y = 0.1;
  player.body.gravity.y = 700;
  //player.body.collideWorldBounds = true;

  //  Our two animations, walking left and right.
  player.animations.add('left', [0, 1, 0, 2], 10, true);
  player.animations.add('right', [3, 4, 3, 5], 10, true);

  //player.scale.setTo(10, 10);
  cursors = game.input.keyboard.createCursorKeys();

  trapMap = game.add.tilemap('lvl');
  trapMap.addTilesetImage('tiles', 'lvlTiles');
  traps = trapMap.createLayer('traps');
  

  spikes = game.add.group();
  spikes.enableBody = true;
  //map.createFromObjects('kill', null, 'spikes', 0, true, false, spikes);
  console.log(map.objects);
}

function update() {
  //  Collide the player and the stars with the platforms
  var hitPlatform = game.physics.arcade.collide(player, layer);
  var overlapTrap = game.physics.arcade.overlap(player, spikes);

  //  Reset the players velocity (movement)
  player.body.velocity.x = 0;
  
  if(overlapTrap){
    console.log('die!');
  }
  if(cursors.left.isDown){
    playerMovingLeft = true;
    //  Move to the left
    player.body.velocity.x = -200;

    player.animations.play('left');
  }else if(cursors.right.isDown){
    playerMovingLeft = false;
    //  Move to the right
    player.body.velocity.x = 200;

    player.animations.play('right');
  }else{
    //  Stand still
    player.animations.stop();
    if(playerMovingLeft){
      player.frame = 0;
    }else{
      player.frame = 3;
    }
  }

  //  Allow the player to jump if they are touching the ground.
  if(cursors.up.isDown && player.body.blocked.down && hitPlatform){
    player.body.velocity.y = -400;
  }

  // rewarp!
  if(player.y > 800){
    player.y = -50;
  }
  
  if(player.body.velocity.y > 700){
    player.body.velocity.y = 700;
  } 
}
