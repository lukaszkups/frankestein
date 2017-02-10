var game = new Phaser.Game(800, 800, Phaser.CANVAS, '', { preload: preload, create: create, update: update });
var platforms;
var playerMovingLeft = false;
var map;
var layer
var player;
var traps;
var trapMap;
var spikes;
var playerIsTakingDamage = false; 
var playerHealth = 3;
var damageTime;

function preload(){
  // load game sprite image, 5 x 5px each frame, 33 frames in total
  game.load.spritesheet('tile', 'assets/img/tiles.png', 50, 50, 32);
  game.load.spritesheet('hero', 'assets/img/hero.png', 40, 50, 6);
  // load tiled level
  game.load.tilemap('lvl', 'assets/map/map2.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('lvlTiles', 'assets/img/tiles.png');
}

function create() {
  platforms = game.add.group();
  platforms.enableBody = true;

  game.stage.backgroundColor = '#dddddd';

  map = game.add.tilemap('lvl');
  map.addTilesetImage('tiles', 'lvlTiles');
  layer = map.createLayer('ground');
  map.setCollisionBetween(1, 400, true, 'ground');
  
  // The player and its settings
  setupPlayer();

    //player.body.collideWorldBounds = true;

    //player.scale.setTo(10, 10);
  cursors = game.input.keyboard.createCursorKeys();

  trapMap = game.add.tilemap('lvl');
  trapMap.addTilesetImage('tiles', 'lvlTiles');
  traps = trapMap.createLayer('traps');
  
  
  spikes = game.add.group();
  spikes.enableBody = true;
  console.log(map.objects);

  // create spike hit areas
  map.objects.kill.forEach(function(item){
    var spike = game.add.sprite(item.x, item.y);

    spike.scale.setTo(item.width, item.height);
    spikes.add(spike);
  });
}

function drawHealth(){
  
}


function setupPlayer(){
  player = game.add.sprite(60, 60, 'hero');
   
  //player = game.add.sprite(32, 32, 'hero');
  //  We need to enable physics on the player
  game.physics.arcade.enable(player);
  //  Player physics properties. Give the little guy a slight bounce.
  player.body.bounce.y = 0.1;
  player.body.gravity.y = 700;
  //  Our two animations, walking left and right.
  player.animations.add('left', [0, 1, 0, 2], 10, true);
  player.animations.add('right', [3, 4, 3, 5], 10, true);
  player.animations.add('blinkRight', [3, 0, 6, 7], 10, true);
  playerHealth = 3;
  playerIsTakingDamage = false;
}

function respawnPlayer(){
  if(player && player.kill){
    player.kill();
  }
  setupPlayer();   
}

function checkIfTimeElapsed(timeStart, duration){
  var currentTime = new Date();
  var timeDiff = timeStart - currentTime.getTime();
  var timeElapsed = Math.abs(timeDiff / 1000);
   
  console.log(timeDiff, timeElapsed, duration);
  return timeElapsed >= duration;
}

function damageBlink(){
  if(!playerIsTakingDamage){
    playerIsTakingDamage = true;
    damageTime = new Date();
    damageTime = damageTime.getTime();

    if(!checkIfTimeElapsed(damageTime, 1000)){
      if(game.time.elapsed % 3 < 2){
        player.alpha = 1;
      }else{
        player.alpha = 0;
      }
    }else{
      playerIsTakingDamage = false;
    }
  }else{
  }
}

function takingDamage(enemyGroup){
  var overlapsEnemy = game.physics.arcade.overlap(player, enemyGroup);
  
  if(!playerIsTakingDamage){
    if(overlapsEnemy){
      if(playerHealth > 0){
        damageTime = new Date();
        damageBlink();
      }else{
        respawnPlayer();
      }
    }else{
      player.alpha = 1;
    }
  }else{
    damageBlink(); 
  }
}

function update() {
  //  Collide the player and the stars with the platforms
  var hitPlatform = game.physics.arcade.collide(player, layer);

  //  Reset the players velocity (movement)
  //player.body.velocity.x = 0;
 

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
    player.body.velocity.x = 0;
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
  takingDamage(spikes);
}
