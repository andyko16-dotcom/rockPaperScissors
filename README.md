# rockPaperSissors
A Game of RockPaperSissors in Javascript

What my goal is creating RockPaperSissors in JS:
    My goal is to refresh my memories on creating fucntion and passing return from one function to another. I hope that by the end of this I have a firmer grasp on creating functions, if else statements, for loops/while loops (maybe?). I also hope that I learn more technical skills with css and maybe use javascipt to enchance the design of my game.
 
 1/31/2023: 1hr 40min~
    - I created the foudation of game in html,js,css
    - created foundation of rockpapersissors
    - need to fix randomCompChoice; returns undefined

2/1/2023: 2hrs~
   - corrected spelling errors
   - decided to make a pixel art fighter style verison of rock paper scissors
   - planning how i would like my website to look

2/3/2023: 4+ hrs~
   - after two days of planning i have decided to make a rock paper scissors game with minigames within it
   - i have decided also to add player movement similar to pokemon
   - the minigames i have decided to add are going to maybe be pong, a time limit survival, button mashing game
   - today i have also created sprites from pokemon fire red

2/4/2023: 8hrs~
   - i have add player movement
   - updated sprites so it fits nicely on the canvas background img
   - trying to create boundaries

2/5/2023: 3hrs~
   - got stuck on having boundaries fit in the right place
   - learned to not believe typeof for parameters
   - now trying to get img of character looking down width and height bc it is reading Nan
   - fixed having boundaries fit in the right place

2/6/2023: 3hrs~
   - skipped a step in tutorial: figured out how to get character width and height
   - came across an error when i would collide with collision block: it was a simple typo error that took me 3 hours to figure out.

2/7/2023: 3hrs~
   - added foreground, which makes it seem like character is behind an object
   - after finishing collision blocks, i have started working on battlezones
   - this works the same as collision blocks, but i am stuck again with having character trigger console.log when character is touching battleZone.

2/8/2023: 3hrs~
   - created battle transition when character enters the zone
   - learned how to use gsap to add battle transition screen effects
   - loaded background picture of battle image

2/9/2023: 
   - break

2/10/2023: 2hrs ~
   - while in battle scene, added trainer image and boss image
   - added boss image onto dungeon.png
   - will not set animation of trainer and boss image becuase it will take too long to create, but i have created a way to easily add sprite animation during battle scene

2/11/2023: 4+hrs
   - created health bar status for both enemy and player
   - created health bar animation when enemy or player gets attacked
   - created attack animations when either player or enemy attacks

2/12/2023:
   - finished setting up click event attack moves

2/13-2/16:
   - I have spend hours trying to figure out why .style.display kept coming out null. I found out it was because document.querySelector('.dialogue').style.display was targeting .dialogue which was within a div already and becuase of that it didnt work.
   - Also i have spent many hours trying to finish this game up within this time frame:
   - i have fixed healthbar so that if boss attacks player then player hp will get hurt.
   - i have made it so that after player defeats boss, player can move freely in the overworld without any UI showing.
   -currently I am trying to fix starting battle up again after defeating boss.
   -okay i have completed the game's foundation
   -I need to work on death transition, and actually implementing rock paper scissors game.

2/17/2023:
   - i have completed the foundation of the game. i can move my character and play a round of pokemon type game.
   - i have yet to implement rock paper scissors and the three other minigames.
   - i am pretty close to solving the rockpaperscissors part by using if statements for rockpaperscissors and maybe use switch statments to initiate the three other minigames

2/19/2023: 2hrs
   -I have finished rock paper scissors foundation for the game
   -I need to set it so that if i get a tie then i will trigger my switch statement.
   -I also need to create introduction of the game and epilogue of game after beating boss

2/20-2/22/2023: 3hrs
   -I have created the introduction of my game with text printing one by one and set the background to fade away

2/23/2023:
   -one thing that my game doesnt have is .dialogue not printing out 'Tie' when trainer and boss both play same move.
   -need to add what happens when tariner loses or when boss loses within faint()
   -for that I am going to make new divs one for win and one for loss with each of them doing their correspondence

   