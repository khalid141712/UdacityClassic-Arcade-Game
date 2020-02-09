let allEnemies = [];
let allGems = [];



/////////////////////// Start of Enemy Class ///////////////////////////
class Enemy {
    constructor(x, y) {
        this.sprite = 'images/enemy-bug.png';
        this.x = x;
        this.y = y;
        // enemyspeed will be between 100 and 200
        this.enemyspeed = 100 + (Math.random() * 100); 
    }
    update(delta) {
        this.x += this.enemyspeed * delta;
        if (this.x > ctx.canvas.width + 50) {
            this.x = -100;
        }
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x - 50, this.y-100);
    }
};
/////////////////////// End of Enemy Class ///////////////////////////

/////////////////////// Start of Player Class ///////////////////////////
class Player {
    constructor() {
        this.sprite = 'images/char-boy.png';
        this.numberOfLives = 3;
        this.startOver();
        
    }
    update() {

    }
    gameIsOver() {
        this.pauseGame = true;
        this.winner = false;
        let modalover = document.querySelector("#over");
        modalover.style.display = 'block';
    }
    gameIsWon() {
        
        this.pauseGame = true;
        this.winner = true;
        let modal = document.querySelector("#modal");
        modal.style.display = 'block';
       
    }
    startOver() {
        this.x = 250;
        this.y = 500;
        this.pauseGame = false;
        this.winner = false;
        let modalover = document.querySelector("#over");
        modalover.style.display = 'none';
    }
    collidedWithEnemey() {
        this.numberOfLives -= 1;
        if(this.numberOfLives>0) {
            this.startOver();
        } 
    }
    collidedWithGem() {
        score.increase();
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x-50, this.y-100);
    }

    handleInput(direction) {
        if(this.pauseGame) { 
            if(direction=='space') {
                if(this.winner) {
                    createGems();
                    score.startOver();
                }
                this.numberOfLives = 3;
                this.startOver();
                score.startOver();
                modal.style.display = 'none';
            } else {
                return; 
            }
        }
        switch(direction) {
            case "right":
                if(this.x<400) {
                    this.x += 100;
                }
                break;
            case "left":
                if(this.x>50) {
                    this.x -= 100;
                }
                break;
            case "up":
                if(this.y>100) {
                    this.y -= 82;
                }
                break;
            case "down":
                if(this.y<500) {
                    this.y += 82;
                }
                break;
            default:
                break;
        }
    }
}
/////////////////////// End of Player Class ////////////////////////////

/////////////////////// Start of Score Class ///////////////////////////
class Score {
    constructor() {
        this.startOver();
    }
    startOver() {
        this.gemScore = 0;
    }
    render() {
        ctx.font = "30px Arial";
        ctx.fillText(`Lives: ${player.numberOfLives}`, 10, 40);
        ctx.fillText(`Score: ${this.gemScore}`, 350, 40);
        if(player.numberOfLives < 1) { 
            player.gameIsOver();
        }
        if(allGems.length == 0) {
            player.gameIsWon();
        }
    }
    increase() {
        this.gemScore += 50;
    }
}
/////////////////////// End of Score Class ////////////////////////////

/////////////////////// Start of Gem Class ///////////////////////////
class Gem {
    static sprites = ["Gem Blue.png", "Gem Green.png", "Gem Orange.png"];
    static yLocations = [160, 240, 330];

    constructor() {
        let index = parseInt(Math.random() * Gem.sprites.length);

        this.sprite = 'images/' + Gem.sprites[index];
        this.angle = 0;
        this.angleSpeed = -2 + (Math.random() * 4);  // range: -2 to 2
        let column = parseInt(Math.random() * 5);
        this.x = 100 * column + 50;
        let yIndex = parseInt(Math.random() * Gem.yLocations.length);
        this.y = Gem.yLocations[yIndex];
    }
    update(dt) {
        this.angle += this.angleSpeed * dt ;
    }
    render() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.scale(0.5, 0.5);
        ctx.drawImage(Resources.get(this.sprite),  - 50 ,  - 100);
        ctx.restore();        
    }
}
/////////////////////// End of Gem Class ////////////////////////////

//////////// Generate Position for Enemeis /////////////
function createEnemeis() {
    for(let y of [160, 240, 330]) {
        let x = Math.random() * 200;
        allEnemies.push(new Enemy(x, y));
    }
}
//////////// Generate Gems /////////////
function createGems() {
    allGems = [];
    for(let i=0; i<4; i++) {
        allGems.push(new Gem());
    }
}
/////////////// Check Enemies Collisions ////////////////////
function checkCollisions() {
    if(player.numberOfLives < 1) { return; }
    allEnemies.forEach(bug => {
        if(Math.abs(bug.x - player.x)< 50 && Math.abs(bug.y - player.y)< 50) {
            player.collidedWithEnemey();
        }
    });
/////////////// Check Gems Collisions ////////////////////
    allGems.forEach((gem,index) => {
        if(Math.abs(gem.x - player.x)< 50 && Math.abs(gem.y - player.y)< 50) {
            player.collidedWithGem();
            allGems.splice(index, 1);  // remove the gem from the array
                                        // this will stop it from rendering
        }
    });
}
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

function newGame(){
    let modal = document.querySelector("#newgame");
    modal.style.display = 'none';
};

let player = new Player();
let score = new Score();

createEnemeis();
createGems();