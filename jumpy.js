// app and sizes
const size = [1300, 900];
var ratio = size[0] / size[1];

let app = new PIXI.Application({ width: size[0], height: size[1], antialias: true, backgroundColor: 0xCCCCCC });
document.getElementById("game").appendChild(app.view);

// game variables
paused = false;

jumping = false;
vSpeed = 0;
GRAVITY = 3;

cakeSpeed = 10;

score = 1;

// draw the ground
let myRect = new PIXI.Graphics();
myRect.lineStyle(4);
myRect.beginFill(0x785000);
myRect.drawRect(0, size[1] - 100, size[0], 100); // x, y, width, height
myRect.endFill();
app.stage.addChild(myRect);

// draw the dino
let dinoSprite = PIXI.Sprite.from('images/dino.png');
dinoSprite.x = 100;
dinoSprite.y = size[1] - 300;
dinoSprite.width = 200;
dinoSprite.height = 200;
app.stage.addChild(dinoSprite);

// draw the cake
let cakeSprite = PIXI.Sprite.from('images/cake.png');
cakeSprite.x = size[0] - 100;
cakeSprite.y = size[1] - 200;
cakeSprite.width = 100;
cakeSprite.height = 100;
app.stage.addChild(cakeSprite);

// draw birthday text
let textStyle = new PIXI.TextStyle({
    fill: '#005b82',
    fontFamily: 'Open Sans',
    fontWeight: 300,
    fontSize: 50
});

let myText = new PIXI.Text('🎉​🎉​Alles Gute, Mopo🎉​🎉​', textStyle)
myText.anchor.set(0.5);
myText.x = size[0] / 2;
myText.y = 75;
app.stage.addChild(myText);

// draw the score
let scoreTextStyle = new PIXI.TextStyle({
    fill: '#DD3366',
    fontFamily: 'Open Sans',
    fontWeight: 300,
    fontSize: 50
});

let scoreText = new PIXI.Text('Score: ' + score, scoreTextStyle)
scoreText.anchor.set(0.5);
scoreText.x = size[0] / 2;
scoreText.y = 150;
app.stage.addChild(scoreText);

// draw pause text
let pauseTextStyle = new PIXI.TextStyle({
    fill: '#000000',
    fontFamily: 'Open Sans',
    fontWeight: 300,
    fontSize: 50
});

let pauseText = new PIXI.Text('Paused​', pauseTextStyle)
pauseText.anchor.set(0.5);
pauseText.x = size[0] / 2;
pauseText.y = 225;
pauseText.visible = false;
app.stage.addChild(pauseText);

// add a ticker callback to move the sprite back and forth
app.ticker.add((delta) => {
    if (paused == true) {
        return;
    }

    // update dino jump
    dinoSprite.y += vSpeed * delta;
    vSpeed += GRAVITY * delta;
    if (dinoSprite.y > size[1] - 300) {
        dinoSprite.y = size[1] - 300;
        jumping = false;
        vSpeed = 0;
    }

    // move cake
    cakeSprite.x -= cakeSpeed * delta;

    // check collision
    dinoSprite.tint = 0xFFFFFF;
    if (checkCollision(dinoSprite.x + 10, dinoSprite.y + 10, dinoSprite.width - 20, dinoSprite.height - 20, cakeSprite.x + 10, cakeSprite.y + 10, cakeSprite.width - 20, cakeSprite.height - 20)) {
        score = 0;
        dinoSprite.tint = 0xff0000;
    }

    // loop cake
    if (cakeSprite.x + cakeSprite.width < 0) {
        cakeSprite.x += size[0] + cakeSprite.width;
        score++;
        cakeSpeed = 10 + Math.random() * 20;
    }

    // update score text
    scoreText.text = "Score: " + score;
})

// basic rect collision detection
function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

// listen for window resize events
window.addEventListener('resize', resize);
function resize() {
    if (window.innerWidth / window.innerHeight >= ratio) {
        var w = window.innerHeight * ratio;
        var h = window.innerHeight;
    } else {
        var w = window.innerWidth;
        var h = window.innerWidth / ratio;
    }
    app.renderer.view.style.width = (w - 100) + 'px';
    app.renderer.view.style.height = (h - 100) + 'px';
}
resize();

// listen for key events
document.addEventListener('keydown', onKeyDown);
function onKeyDown(event) {
    // Spacebar
    if (event.keyCode == 32 && jumping == false) {
        jumping = true;
        vSpeed = -50;
    }

    // Spacebar
    if (event.keyCode == 80) {
        if (paused == false) {
            paused = true;
            pauseText.visible = true;
        } else {
            paused = false;
            pauseText.visible = false;
        }
    }

    event.preventDefault();
}

// listen for mouse events
document.addEventListener('mousedown', onMouseDown);
function onMouseDown(event) {
    // Spacebar
    if (jumping == false) {
        jumping = true;
        vSpeed = -50;
    }
}
