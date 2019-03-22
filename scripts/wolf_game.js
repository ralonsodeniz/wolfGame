//variables
var gameStarted = 0;
var animalPositionsMatrix = Array.from ({length:4}, (_,i) => Array.from({length:2}, (_,j) => 0));
var canvasSource = document.getElementById("picture");
var drawArea = canvasSource.getContext("2d");
const gameBackground = new Image(canvasSource.width - 2, canvasSource.height - 2);
const pigImage = new Image(80, 80);
const chickenImage = new Image(80, 80);
const cowImage = new Image(80, 80);
const wolveImage = new Image(80, 80);
var startButtonSource = document.getElementById("startButton");
var canvasMaxWidth = canvasSource.clientWidth - 2;
var canvasMaxHeight = canvasSource.clientHeight - 2;
var cursorKeys = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
};
var skull = {
    pig: [0, 0],
    chicken: [0, 0],
    cow: [0, 0],
    src: "images/skull.png"
};

skull.image = new Image (80,80);
skull.image.src = skull.src;

var cursorMovement;
var initialCursorXPosition;
var initialCursorYPosition;
var pigAlive = 1;
var chickenAlive = 1;
var cowAlive = 1;
var gameDifficultySource;
var gameOver = 1;

//events
gameBackground.src = "images/tile.png";
gameBackground.addEventListener("load", drawBackground);
startButtonSource.addEventListener("mousedown", () => {
    cursorMovement = 0;
    pigAlive = 1;
    chickenAlive = 1;
    cowAlive = 1;
    gameDifficultySource = document.getElementById("gameDifficulty").value;
    gameOver = 0;
    gameStarted = 1;});
startButtonSource.addEventListener("mouseup", () => {
    initialCursorXPosition = animalPositionsMatrix[3][0];
    initialCursorYPosition = animalPositionsMatrix[3][1];});
startButtonSource.addEventListener("mousedown", drawGameImages);
document.addEventListener("keydown", movementAnimals);
pigImage.src = "images/cerdo.png";
chickenImage.src = "images/pollo.png";
cowImage.src = "images/vaca.png";
wolveImage.src = "images/wolve.png";

//functions and functions call
contourDraw(drawArea);

function movementAnimals(keyEvent) {
    cursorMovement = 1;
    animalsHunted();
    if (gameStarted) {
        switch (keyEvent.keyCode) {
            case cursorKeys.UP:
                if (initialCursorYPosition >= wolveImage.height) {
                    initialCursorYPosition = initialCursorYPosition - wolveImage.height;
                } else {
                    initialCursorYPosition = 0;
                    
                }
                drawGameImages();
                break;
            
            case cursorKeys.DOWN:
                if (initialCursorYPosition <= canvasMaxHeight - 2* wolveImage.height) {
                    initialCursorYPosition = initialCursorYPosition + wolveImage.height;
                } else {
                    initialCursorYPosition = canvasMaxHeight - wolveImage.height;
    
                }
                drawGameImages();
                break;
    
            case cursorKeys.LEFT:
                if (initialCursorXPosition >= wolveImage.width) {
                    initialCursorXPosition = initialCursorXPosition - wolveImage.width;
                } else {
                    initialCursorXPosition = 0;
                }
                drawGameImages();
                break;
            
            case cursorKeys.RIGHT:
                if (initialCursorXPosition <= canvasMaxWidth - 2* wolveImage.width) {
                    initialCursorXPosition = initialCursorXPosition + wolveImage.width;
                } else {
                    initialCursorXPosition = canvasMaxWidth - wolveImage.width;
                }
                drawGameImages();
                break;
                   default:
                break;
        }
    }
}

function clearCanvas(canvas) {
    canvas.clearRect(0, 0, canvasMaxWidth, canvasMaxHeight);
    contourDraw(drawArea);
    drawBackground();
}

function contourDraw(canvas) {
    lineDraw("black", 1, 1, (canvasMaxWidth + 1), 1, 1, canvas);
    lineDraw("black", 1, 1, 1, (canvasMaxHeight +1), 1, canvas);
    lineDraw("black", (canvasMaxWidth + 1), 1, (canvasMaxWidth + 1), (canvasMaxHeight +1), 1, canvas);
    lineDraw("black", 1, (canvasMaxHeight +1), (canvasMaxWidth + 1), (canvasMaxHeight +1), 1, canvas);
}

function lineDraw(colour, xstart, ystart, xend, yend, strokeWidth, canvas) {
    canvas.beginPath();
    canvas.strokeStyle = colour;
    canvas.lineWidth = strokeWidth;
    canvas.moveTo(xstart, ystart);
    canvas.lineTo(xend, yend);
    canvas.stroke();
    canvas.closePath();
}
   
function drawGameImages(draGameImagesParams) {
    animalsNewCoordinates();
    clearCanvas(drawArea);
    drawPig();
    drawChicken();
    drawCow();
    drawWolve();
    drawSkull();
}

function drawBackground(drawBackgroundParams) {
    drawArea.drawImage(gameBackground, 1, 1);
}

function drawPig(drawPigParams) {
    if (pigAlive) {
        drawArea.drawImage(pigImage, animalPositionsMatrix[0][0], animalPositionsMatrix[0][1]);
    }
}

function drawChicken(drawChickenParams) {
    if (chickenAlive) {
        drawArea.drawImage(chickenImage, animalPositionsMatrix[1][0], animalPositionsMatrix[1][1]);
    }
}

function drawCow(drawCowParams) {
    if (cowAlive) {
        drawArea.drawImage(cowImage, animalPositionsMatrix[2][0], animalPositionsMatrix[2][1]);
    }
}

function drawWolve(drawWolveParams) {
    if (!cursorMovement) {
        drawArea.drawImage(wolveImage, animalPositionsMatrix[3][0], animalPositionsMatrix[3][1]);
    } else {
        drawArea.drawImage(wolveImage, initialCursorXPosition, initialCursorYPosition);
    }
    
}

function drawSkull(drawSkullParams) {
    if (!pigAlive) {
        drawArea.drawImage(skull.image, skull.pig [0], skull.pig [1]);
    }

    if (!chickenAlive) {
        drawArea.drawImage(skull.image, skull.chicken [0], skull.chicken [1]);

    }

    if (!cowAlive) {
        drawArea.drawImage(skull.image, skull.cow [0], skull.cow [1]);

    }
}

function random (minimunValue, maximunValue) {
    var randomResult = Math.floor(Math.random() * ((maximunValue - minimunValue) +1 ) + minimunValue);
    return randomResult;
}

function animalsNewCoordinates() {
    let animalXPositionMax;
    let animalYPositionMax;
    for (let animalIndex = 0; animalIndex <= animalPositionsMatrix.length - 1; animalIndex++) {
        for (let coordinateIndex = 0; coordinateIndex <= 1; coordinateIndex++) {
            switch (animalIndex) {
                case 0:
                    animalXPositionMax = canvasMaxWidth - pigImage.width;
                    animalYPositionMax = canvasMaxWidth - pigImage.height;
                    break;
                    
                case 1:
                    animalXPositionMax = canvasMaxWidth - chickenImage.width;
                    animalYPositionMax = canvasMaxWidth - chickenImage.height;
                    break;

                case 2:
                    animalXPositionMax = canvasMaxWidth - cowImage.width;
                    animalYPositionMax = canvasMaxWidth - cowImage.height;
                    break;
                
                case 3:
                    animalXPositionMax = canvasMaxWidth - wolveImage.width;
                    animalYPositionMax = canvasMaxWidth - wolveImage.height;
                    break;
            }
            
            if (!coordinateIndex) {
                animalPositionsMatrix [animalIndex][coordinateIndex] = random(0,animalXPositionMax);
            } else {
                animalPositionsMatrix [animalIndex][coordinateIndex] = random(0,animalYPositionMax);
            }
        }
    }
}

function animalsHunted() {
    for (let animalsIndex = 0; animalsIndex <= animalPositionsMatrix.length - 2; animalsIndex++) {
        var wolfHauntX = differenceIsBigger(animalPositionsMatrix[animalsIndex][0], initialCursorXPosition, gameDifficultySource);
        var wolfHauntY = differenceIsBigger(animalPositionsMatrix[animalsIndex][1], initialCursorYPosition, gameDifficultySource);
        if (!wolfHauntX && !wolfHauntY) {
                switch (animalsIndex) {
                    case 0:
                        if (pigAlive) {
                            pigAlive = 0;
                            skull.pig [0] = animalPositionsMatrix[animalsIndex][0];
                            skull.pig [1] = animalPositionsMatrix[animalsIndex][1];
                            //document.write("The wolf has hunted the pig!");    
                        }
                        break;

                    case 1:
                        if (chickenAlive) {
                            chickenAlive = 0;
                            skull.chicken [0] = animalPositionsMatrix[animalsIndex][0];
                            skull.chicken [1] = animalPositionsMatrix[animalsIndex][1];
                            //document.write("The wolf has hunted the chicken!");    
                        }
                        break;

                    case 2:
                        if (cowAlive) {
                            cowAlive = 0;
                            skull.cow [0] = animalPositionsMatrix[animalsIndex][0];
                            skull.cow [1] = animalPositionsMatrix[animalsIndex][1];
                            //document.write("The wolf has hunted the cow!");   
                        }
                        break;
                
                    default:
                        break;
                }   
        }   
       
    }
    if (!pigAlive && !chickenAlive && !cowAlive && !gameOver) {
        alert("The wolf has hunted them all!");
        cursorMovement = 0;
        gameOver = 1;
    }
}

function differenceIsBigger(firstNumber, secondNumber, maxDifference) {
    var min = Math.min(firstNumber, secondNumber);
    var max = Math.max(firstNumber, secondNumber);
    var difference = max - min;
    return maxDifference <= difference ? true : false;
}