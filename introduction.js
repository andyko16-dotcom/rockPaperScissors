var myText = 'You are a trainer with a mission to defeat the clown king that is planning to demolish the world and it must be stopped in an ultimate game of Rock, Paper, Scissors...';

var myArray = myText.split("");

var loopTimer;

function frameLooper() {

if(myArray.length > 0) {

document.getElementById("introduction").innerHTML += myArray.shift();

} else {

    gsap.to('#introduction', {
        opacity:0,
        duration: 3,
        onComplete: () => {
            document.querySelector('#introduction').style.display = 'none'
            gsap.to('#introductionbackground', {
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    document.querySelector('#introductionbackground').style.display = 'none'
                }
            })
        }
    })
clearTimeout(loopTimer);


return false;

}

loopTimer = setTimeout('frameLooper()',10);

}

frameLooper();