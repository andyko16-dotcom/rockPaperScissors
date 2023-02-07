/*
PsuedoCode

create array = ["rock","paper","scissors"]


function randomComputerChoice(move)
    this will give a random number between 0-2
    use the random number and match index of array
    return that index of array (string)


function playerChoice(move)
    player will pick moves "Rock","Paper","Scissors"
    return move

function gameplay
    run function randomComputerChoice
    run function playerChoice

    create var
    let comp = randomComputerChoice()
    let self = playerChoice()

    if ((self."rock" && comp."scissors") || (self."paper" && comp."rock") || (self."scissors" && comp."paper"))
        then player win
    else if ((self."rock" && comp."rock") || (self."paper" && comp."paper") || (self."scissors" && comp."scissors"))
        then tie
    else
        you lose

function winloss
    if player wins
        then add one to player
    else if computer wins
        then add one to computer
    else
        then add one to tie
*/




//Rock Paper Scissors
/*const moves = ["rock", "paper", "scissors"];
var playerWin = 0;
var compWin = 0;
var tie = 0;

function randomComputerChoice(move) {
    move = moves[Math.floor(Math.random() * moves.length)];
    return move;
}

function playerChoice() {
    let playerMove = prompt("Enter your move: ");
    return playerMove;
}

function gameplay() {
    
    let playerSelection = playerChoice();
    console.log(playerSelection);
    
    let compSelection = randomComputerChoice();
    console.log(compSelection);

    if ((playerSelection == 'rock' && compSelection == 'scissors') || (playerSelection == 'paper' && compSelection == 'rock') || (playerSelection == 'scissors' && compSelection == 'paper')) {
        console.log('player win');
        winlosstie('win');
    } else if ((playerSelection == 'rock' && compSelection == 'paper') || (playerSelection == 'paper' && compSelection == 'scissors') || (playerSelection == 'scissors' && compSelection == 'rock')) {
        console.log('Comp wins');
        winlosstie('loss');
    } else {
        console.log('Tie');
        winlosstie();
    }

}

function winlosstie(who) {
    if (who == 'win') {
        playerWin++;
    } else if (who == 'loss') {
        compWin++;
    } else {
        tie++;
    }
    console.log("Win: " + playerWin + " Loss: " + compWin + " Tie: " + tie);
}

gameplay();
*/