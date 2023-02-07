import {
    collisions
} from './data/collisions.js'


const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');


canvas.width = 1024
canvas.height = 576


const collisionsMap = []
for (let i = 0; i < collisions.length; i += 45) {
    collisionsMap.push(collisions.slice(i, 45 + i));
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


const image = new Image();
image.src = 'img/dungeon.png'

const playerImage = new Image();
playerImage.src = 'img/down.png'



class Sprite {
    constructor({position, velocity, image, frames = { max: 1}}) {
        this.position = position
        this.image = image
        this.frames = frames

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
            console.log(this.width)
            console.log(this.height)
        }
        
        
    }

    draw() {
        c.drawImage(
            this.image,
            0,
            0,
            this.image.width/this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width/this.frames.max,
            this.image.height
        );
    }   
}



const player = new Sprite ({
    position: {
        x: 470,
        y: 400
    },
    
    image: playerImage,
    frames: {
        max: 3
    }

})


const background = new Sprite({
    position: {
        x:-980,
        y:-1580
    },
    image: image
});




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



const moveable = [background, ...boundaries]



function rectCollision ({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + (rectangle1.width) >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&  
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&  
        rectangle1.position.y + (rectangle1.height) >= rectangle2.position.y
        )
}



function animate() {
    window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach((boundary) => {
        boundary.draw();


    })
    
    player.draw()


    let moving = true

    if (keys.w.pressed && lastKey === 'w') {
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
                console.log('colliding')
                moving = false 
                break
            }
        }
        if (moving) 
         moveable.forEach((moveable) => {
            moveable.position.y += 4;
            })
    } else if (keys.s.pressed && lastKey === 's') {
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
                console.log('colliding')
                moving = false 
                break
            }
        }
        if (moving) 
        moveable.forEach((moveable) => {
            moveable.position.y -= 4;
        })
    } else if (keys.a.pressed && lastKey === 'a') {
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
                console.log('colliding')
                moving = false 
                break
            }
        }
        if (moving) 
        moveable.forEach((moveable) => {
        moveable.position.x += 4;
        })
    } else if (keys.d.pressed && lastKey === 'd') {
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
                console.log('colliding')
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
    console.log(keys)
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
    console.log(keys)
});