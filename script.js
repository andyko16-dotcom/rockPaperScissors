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
        c.fillStyle = 'rgba(255, 0, 0, 0.5)'
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
    constructor({position, velocity, image, frames = { max: 1}, sprites}) {
        this.position = position
        this.image = image
        this.frames = {...frames, val: 0, elasped:0}
        this.sprites = sprites

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;

        }
        this.moving = false
        
    }

    draw() {
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
        
        if (!this.moving) return

        if (this.frames.max > 1) {
            this.frames.elasped++
        }

        if (this.frames.elasped % 10 === 0){
            if (this.frames.val < this.frames.max) this.frames.val++
            else this.frames.val = 0
        }
    }   
}

const player = new Sprite ({
    position: {
        x: 470,
        y: 400
    },
    
    image: playerDownImage,
    frames: {
        max: 2.99
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


const moveable = [background, ...boundaries, foreground, ...battleZones]


function rectCollision ({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + (rectangle1.width) >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&  
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&  
        rectangle1.position.y + (rectangle1.height) >= rectangle2.position.y
        )
}

if (!keys.w.pressed || !keys.a.pressed || !keys.d.pressed || !keys.s.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
        const battleZone = battleZones[i]
        
        if (rectCollision({
                rectangle1: player,
                rectangle2: battleZone
            })
        ) {
            console.log('battlezone')
            break
        }
    }
}

function animate() {
    window.requestAnimationFrame(animate)
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
    player.moving = false

    if (keys.w.pressed && lastKey === 'w') {
        player.moving = true
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
        player.moving = true
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
        player.moving = true
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
        player.moving = true
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
animate();

let lastKey = '';

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