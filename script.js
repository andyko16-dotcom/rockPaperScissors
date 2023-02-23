import {
    collisions
} from './data/collisions.js'

import {
    battleZonesData
} from './data/battleZone.js'

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

const image = new Image();
image.src = 'img/dungeon.png'

const playerDownImage = new Image();
playerDownImage.src = 'img/down.png'

const playerUpImage = new Image();
playerUpImage.src = 'img/up.png'

const playerLeftImage = new Image();
playerLeftImage.src = 'img/left.png'

const playerRightImage = new Image();
playerRightImage.src = 'img/right.png'

const foregroundObjects = new Image();
foregroundObjects.src = 'img/foregroundObjects.png'

const battleBackgroundImage = new Image();
battleBackgroundImage.src = 'img/battleBackground.png'

const bossImage = new Image();
bossImage.src = 'img/boss.png'

const trainerImage = new Image();
trainerImage.src = 'img/trainer.png'



const collisionsMap = []
for (let i = 0; i < collisions.length; i += 45) {
    collisionsMap.push(collisions.slice(i, 45 + i));
}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 45) {
    battleZonesMap.push(battleZonesData.slice(i, 45 + i));
}


class Boundary {
    static width = 64
    static height = 64
    constructor({position}) {
        this.position = position
        this.width = 64
        this.height = 64
    }
    
    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const battleZones = []

battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 2816) {
        battleZones.push(
            new Boundary({
                position:{
                    x: j * Boundary.width - 980,
                    y: i * Boundary.height - 1550
                }
            })
        )
    }})
})


const boundaries = []

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 2817) {
        boundaries.push(
            new Boundary({
                position:{
                    x: j * Boundary.width - 980,
                    y: i * Boundary.height - 1550
                }
            })
        )
    }})
})


class Sprite {
    constructor({position, image, frames = { max: 1, hold: 10}, sprites, animate = false}) {
        this.position = position
        this.image = new Image()
        this.frames = {...frames, val: 0, elasped:0}
        this.sprites = sprites
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;

        }
        this.image.src = image.src
        this.animate = animate
        this.opacity = 1


        
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.drawImage(
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width/this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width/this.frames.max,
            this.image.height
        );
        c.restore();
        
        if (!this.animate) return

        if (this.frames.max > 1) {
            this.frames.elasped++
        }

        if (this.frames.elasped % this.frames.hold === 0){
            if (this.frames.val < this.frames.max) this.frames.val++
            else this.frames.val = 0
        }
    }
}

//overWorld Character
const player = new Sprite ({
    position: {
        x: 470,
        y: 400
    },
    
    image: playerDownImage,
    frames: {
        max: 2.99,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage
    }
})

const background = new Sprite({
    position: {
        x:-980,
        y:-1580
    },
    image: image
});

const foreground = new Sprite({
    position: {
        x: -980,
        y: -1580
    },
    image: foregroundObjects
})


let lastKey = '';

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

window.addEventListener('keydown', (move) => {
    switch (move.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }
    

});

window.addEventListener('keyup', (move) => {
    switch (move.key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
    
});


const moveable = [background, ...boundaries, foreground, ...battleZones]


function rectCollision ({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + (rectangle1.width) >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&  
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&  
        rectangle1.position.y + (rectangle1.height) >= rectangle2.position.y
        )
}

const battle = {
    initiated: false
}

const battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
})

function animate() {
    const animationID = window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach((boundary) => {
        boundary.draw();   
    })
    battleZones.forEach((battleZone) => {
        battleZone.draw();   
    })
    
    player.draw()
    
    foreground.draw()

    let moving = true
    player.animate = false

    if(battle.initiated) return

    if (keys.w.pressed || keys.a.pressed || keys.d.pressed || keys.s.pressed) {
        for (let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i]
            
            if (rectCollision({
                    rectangle1: player,
                    rectangle2: battleZone
                })
            ) { // this is battle transition
                battle.initiated = true
                cancelAnimationFrame(animationID)
                gsap.to('.overlappingDiv', {
                    opacity: 1,
                    repeat: 13,
                    yoyo: true,
                    duration: 0.1,
                    onComplete() {
                        gsap.to('.overlappingDiv', {
                            opacity: 1,
                            duration: 0.1,
                            onComplete() {
                                initBattle()
                                animateBattle()
                                gsap.to('.overlappingDiv', {
                                    opacity: 0,
                                    duration: 2
                                })
                            }
                        })
                        
                    }
                })
                return
            }
        }
    }

    if (keys.w.pressed && lastKey === 'w') {
        player.animate = true
        player.image = player.sprites.up
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            
            if (rectCollision({
                rectangle1: player,
                rectangle2: {...boundary, 
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 4
                }}
            })) {

                moving = false 
                break
            }
        }
        if (moving) 
         moveable.forEach((moveable) => {
            moveable.position.y += 4;
            })
    } else if (keys.s.pressed && lastKey === 's') {
        player.animate = true
        player.image = player.sprites.down
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectCollision({
                rectangle1: player,
                rectangle2: {...boundary, 
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 4
                }}
            })) {

                moving = false 
                break
            }
        }
        if (moving) 
        moveable.forEach((moveable) => {
            moveable.position.y -= 4;
        })
    } else if (keys.a.pressed && lastKey === 'a') {
        player.animate = true
        player.image = player.sprites.left
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectCollision({
                rectangle1: player,
                rectangle2: {...boundary, 
                    position: {
                        x: boundary.position.x + 4,
                        y: boundary.position.y 
                }}
            })) {

                moving = false 
                break
            }
        }
        if (moving) 
        moveable.forEach((moveable) => {
        moveable.position.x += 4;
        })
    } else if (keys.d.pressed && lastKey === 'd') {
        player.animate = true
        player.image = player.sprites.right
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (rectCollision({
                rectangle1: player,
                rectangle2: {...boundary, 
                    position: {
                        x: boundary.position.x - 4,
                        y: boundary.position.y 
                }}
            })) {

                moving = false 
                break
            }
        }
        if (moving) 
        moveable.forEach((moveable) => {
        moveable.position.x -= 4;
        })
    }
}

const attacks = {
    Rock: {
        name: 'Rock',
        damage: 20
    },
    Paper: {
        name: 'Paper',
        damage: 20
    },
    Scissors: {
        name: 'Scissors',
        damage: 20
    }
}



//BATTLE SQUENCE

class Fighter extends Sprite {
    constructor({
        isEnemy = false, 
        name,
        attacks,
        position, image, frames = { max: 1, hold: 10}, sprites, animate = false
    }) {
        super({
            position,
            image,
            frames,
            sprites,
            animate
        })
        this.isEnemy = isEnemy
        this.name = name
        this.health = 100
        this.attacks = attacks
    }
    //creates dialogue and death animation
    faint() {
        document.querySelector('.dialogue').innerHTML = this.name + ' fainted!'
        gsap.to(this.position, {
            y: this.position.y + 20
        })
        gsap.to(this, {
            opacity: 0
        })
    }

    attack({attack, recipient}) {
        //this opens dialogue box after move
        //calculates damage
        //creates animations
        document.querySelector('.dialogue').style.display = 'block';
        document.querySelector('.dialogue').innerHTML = this.name + ' used ' + attack.name;


        const tl = gsap.timeline()

        recipient.health -= attack.damage
        let healthBar = '.bossHptwo'
        if (this.isEnemy) healthBar = '.playerHptwo'

        //attack animation

        let movementDistance = 20
        if (this.isEnemy) movementDistance = -20

        //both player and boss movement
        tl.to(this.position, {
            x: this.position.x - movementDistance
            })
            .to(this.position, {
                x: this.position.x + movementDistance * 2,
                duration: 0.1,
                onComplete: () => {
                    gsap.to(healthBar, {
                        width: recipient.health + '%'
                    })

                    gsap.to(recipient.position, {
                        x: recipient.position.x + 10,
                        yoyo: true,
                        repeat: 5,
                        duration: 0.08
                    })

                    gsap.to(recipient, {
                        opacity: 0,
                        repeat: 5,
                        yoyo:true,
                        duration: .08
                    })
                }
            })
            .to(this.position, {
                x: this.position.x
            })
    }
}


function minigames(player, computer) {
    switch (player, computer) {

        case player == 'Rock', computer == 'Rock':
            console.log('ROCK')
            break
        case player == 'Paper', computer == 'Paper':
            console.log('PAPER')
            break 
        case player == 'Scissors', computer == 'Scissors':
            console.log('SCISSORS')
            break
    }
}

let boss
let trainer
let battleAnimationID
let queue

function initBattle() {

    //reinitializing
    document.querySelector('.userInterface').style.display = 'block'
    document.querySelector('.dialogue').style.display = 'none'
    document.querySelector('.bossHptwo').style.width = '100%'
    document.querySelector('.playerHptwo').style.width = '100%'
    document.querySelector('.attacksBox').replaceChildren()
    queue = []
    boss = new Fighter({
        position: {
            x: 725,
            y: 25
        },
        image: {
            src:'img/boss.png'
        },
        isEnemy: true,
        name: 'Boss',
        attacks: [attacks.Rock, attacks.Paper, attacks.Scissors]
    })

    trainer = new Fighter({
        position: {
            x: 320,
            y: 360
        },
        image: {
            src:'img/trainer.png'
        },
        name: 'Red',
        attacks: [attacks.Rock, attacks.Paper, attacks.Scissors]
    })

    //creates ATTACKINGBOX
    trainer.attacks.forEach(attack => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('.attacksBox').append(button)
    })

    //ATTACKING SQUENCE
    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            console.log(selectedAttack)
    
            let randomAttack = boss.attacks[Math.floor(Math.random() * boss.attacks.length)]
            console.log(randomAttack)
        
            
            

            if ((selectedAttack.name == 'Rock' && randomAttack.name == 'Scissors') || (selectedAttack.name == 'Paper' && randomAttack.name == 'Rock') || (selectedAttack.name == 'Scissors' && randomAttack.name == 'Paper')) {
                
                trainer.attack({
                    attack: selectedAttack,
                    recipient: boss
                })

            } else if ((selectedAttack.name == 'Rock' && randomAttack.name == 'Paper') || (selectedAttack.name == 'Paper' && randomAttack.name == 'Scissors') || (selectedAttack.name == 'Scissors' && randomAttack.name == 'Rock')) {
                
                boss.attack({
                    attack: randomAttack,
                    recipient: trainer,
                })
                boss.isEnemy

            } else {
                minigames(selectedAttack.name, randomAttack.name)
                
            }


//change this to if statment with conditionals of selectedAttack vs. randomAttack, winning conditionals will have player attack boss, lossing conditionals will have boss attack.
         
        /*trainer.attack({
            attack: selectedAttack,
            recipient: boss
        }) //^ player selecting attack

            //Boss Attack
            queue.push(() => {
                boss.attack({
                    attack: randomAttack,
                    recipient: trainer,
                })
                boss.isEnemy
                
            })*/




//over here will need to add lossing and winning dialogue with innerHTML to document.querySelector('.dialogue') or set it in faint() or Do we even need a ending dialogue?
            //win dialogue (ending)
            //Boss faint
            if (boss.health <= 0) {
                queue.push(() => {
                    boss.faint()
                })
                queue.push(() => {
                    gsap.to('.overlappingDiv', {
                        opacity: 1,
                        onComplete: () => {
                            window.cancelAnimationFrame(battleAnimationID)
                            animate()
                            document.querySelector('.userInterface').style.display = 'none'
                            document.querySelector('.dialogue').style.display = 'none'
                            gsap.to('.overlappingDiv', {
                                opacity: 0
                            })
                            battle.initiated = false
                        }
                    })
                })
            }
            //death dialogue - gameover try again - send them back to the start of the game (ending)
            //trainer Faint
            if (trainer.health <= 0) {
                queue.push(() => {
                    trainer.faint()
                })
                queue.push(() => {
                    gsap.to('.overlappingDiv', {
                        opacity: 1,
                        onComplete: () => {
                            window.cancelAnimationFrame(battleAnimationID)
                            animate()
                            document.querySelector('.userInterface').style.display = 'none'
                            document.querySelector('.dialogue').style.display = 'none'
                            gsap.to('.overlappingDiv', {
                                opacity: 0
                            })
                            battle.initiated = false
                        }
                    })
                })
            }
        })
    })
}







function animateBattle() {
    battleAnimationID = window.requestAnimationFrame(animateBattle)
    battleBackground.draw();
    boss.draw();
    trainer.draw();
    
}

//makes dialogue disappear
document.querySelector('.dialogue').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'

})

animate();


//initBattle();
//animateBattle();

//i am going to create function with three cases from within a switch statement.
/* switch (minigame)
    case (minigame = Rock) Rock will be playable asteroids on lives, fast moving rocks, three lives, instincts
        will load minigame canvas and be playable here in this case
        then will end minigame after time limit or loss
        if player win, then attack boss
        if player loss minigame, then player lose hp
        break
    
    case (minigame = Paper) Paper will be a mashing game spacebar masher, boss will be set speed but fast, but player must be faster (PACMAN? not button masher)
        will load minigame canvas and be playable here in this case
        then will end minigame after time limit or loss
        if player win, then attack boss
        if player loss minigame, then player lose hp
        break
    
    case (minigame = Scissors) Scissors will be a dodging game like a bullet hell game.
        will load minigame canvas and be playable here in this case
        then will end minigame after time limit or loss
        if player win, then attack boss
        if player loss minigame, then player lose hp
        break
*/




//practice for creating letters on screen one at a time



