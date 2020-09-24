$(function () {
    var normalImages = ["normal-blue","normal-green","normal-purple","normal-red","normal-yellow"];
    var downImages = ["down-blue","down-green","down-purple","down-red","down-yellow"];
    var note1 = new Audio("./sounds/note1.mp3");
    var note2 = new Audio("./sounds/note2.mp3");
    var note3 = new Audio("./sounds/note3.mp3");
    var note4 = new Audio("./sounds/note4.mp3");
    var note5 = new Audio("./sounds/note5.mp3");
    var notes = [note1, note2, note3, note4, note5];

    var generatedPattern =[];
    var guessedPattern = [];

    var totalGuesses = 0;

    // adding remarks at the top
    var successRemarks = ['Good', 'Perfect', 'Awesome'];            //you can change the success remarks here
    var failRemarks = "Wrong! Better luck next time";               //these remarks appear above when player fails
    var yourTurnText = "Your Turn!";                                //text to show player's turn

    $('#start-overlay').css('display', 'block');
    $('#overlay').css("display", "none");
    $('#remarks').text('');

    function initializeCircles() {
        var div = 360 / 5;
        var radius = 150;
        var parentdiv = document.getElementById('parentdiv');
        var offsetToParentCenter = parseInt(parentdiv.offsetWidth / 2); //assumes parent is square
        var offsetToChildCenter = 60;                                   //can make it 20
        var totalOffset = offsetToParentCenter - offsetToChildCenter;
        for (var i = 1; i <= 5; ++i) {
        var childdiv = document.createElement('div');
        childdiv.className = 'div2 circle';
        childdiv.id = i;
        childdiv.style.background = 'url("./images/'+normalImages[i-1]+'.jpg")';
        childdiv.style.backgroundRepeat = 'round';
        childdiv.style.position = 'absolute';
        var y = Math.sin((div * i) * (Math.PI / 180)) * radius;
        var x = Math.cos((div * i) * (Math.PI / 180)) * radius;
        childdiv.style.top = (y + totalOffset).toString() + "px";
        childdiv.style.left = (x + totalOffset).toString() + "px";
        parentdiv.appendChild(childdiv);
        }
    }

    initializeCircles();

    async function createPattern(){
        $('.circle').unbind();
        var level = parseInt($('#level').text());
        var i;
        for (i=0; i<level; i++) {
            var random_number = Math.floor(Math.random() * 5 ) + 1;
            var animationCompleted = await animate(random_number);

            if (animationCompleted) {
                generatedPattern.push(random_number);
            }
        }
        if (i === level) {
            $('#remarks').text(yourTurnText);
        }
        
    }

    function animate (id) {
        $('.circle').unbind();
        $('#remarks').text('');
        return new Promise ((resolve, reject) => {
            $('#'+id).css("background-image", "url('./images/"+downImages[id-1]+".jpg')");
            notes[id-1].play();
            var liftUp = setTimeout (function () {
                $('#'+id).css("background-image", "url('./images/"+normalImages[id-1]+".jpg')");
                //resolve(true);
            }, 1000);           // you can slow or speed up the animation based on this number (unit is millisecond)

            var stopNote = setTimeout(function() {
                notes[id-1].pause();
                $('.circle').bind('click', clickAble);
                resolve(true);
            }, 1300);

        })
    }

    function checkGuess () {
        return new Promise((resolve, reject) => {
            if (JSON.stringify(generatedPattern) === JSON.stringify(guessedPattern)) {
                generatedPattern.length = 0;
                totalGuesses = 0;
                guessedPattern.length = 0;
                resolve(true);
            }
            else {
                resolve(false)
            }
        })
    }

    function nextLevel() {
        var currentLevel = parseInt($('#level').text());
        var nextLevel = currentLevel + 1;
        $('#level').text(currentLevel + 1);

        var num = Math.floor(Math.random() * successRemarks.length);        //randomly generate a number between 0 and length of "SUCCESS REMARKS"
        $('#remarks').text(successRemarks[num]);                            //displaying the success remarks

        var next = setTimeout(function (){
            createPattern();
        }, 1300);
    }

    async function clickAble(){
        var level = parseInt($('#level').text());

        if (totalGuesses < level) {
            var currentID = $(this).attr('id');
            guessedPattern.push(parseInt(currentID));
            var animationCompleted = animate(currentID);
            if (animationCompleted) {
                totalGuesses += 1;
                //notes[parseInt(currentID)-1].pause();
                if (totalGuesses === level) {
                    var result = await checkGuess();
                    if (result) {
                        nextLevel();
                    }
                    else {
                        $('#score').text(level);
                        $('#remarks').text(failRemarks);
                        var gameOver = setTimeout(function() {
                            $('#overlay').css('display','block');
                        }, 1000);
                    }
                }
            }

        }
    }

    $('#play-again').on('click', function() {
        guessedPattern.length = 0;
        generatedPattern.length = 0;
        totalGuesses = 0;
        $('#overlay').css("display", "none");
        $('#remarks').text('');
        createPattern();

    })

    $('#play').on('click', function(){
        $('#start-overlay').css('display', 'none');
        // create a pattern after 0.5 when the page loads
        var initializeGame = setTimeout(function() {
            createPattern();
        },500)
    })


})