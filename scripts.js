// Global variables
var score = 0;
var highscore = 0;

const BASE_URL = 'http://api.finditapp.es:5000';



window.onload = function() {
    document.getElementById('username-modal').style.display = "block";
}

function saveUsername() {
    const username = document.getElementById('username-input').value;
    if(username === '') {
        alert("Please enter your username!");
        return;
    }
    document.getElementById('username-modal').style.display = "none";
}

function showLoadingContainer() {
    const container = document.getElementById('loading-container');
    container.style.display = 'flex';
    container.style.backgroundColor = 'rgba(103, 58, 183, 0.5)'; // Add opacity
}

function hideLoadingContainer() {
    const container = document.getElementById('loading-container');
    container.style.display = 'none';
    container.style.backgroundColor = 'rgba(103, 58, 183, 1)'; // Remove opacity
}
let product1, product2;
// function animateLoadingRabbit() {
//     const rabbit = document.getElementById('loading-rabbit');
//     rabbit.style.left = '-200px'; /* reset position to start */
//     setTimeout(() => rabbit.style.left = '100vw', 0); /* animate to the right side of the screen */
// }
function fetchProduct(number) {
    return fetch(`${BASE_URL}/pickRandomProduct?number=${number}`)
        .then(response => response.json())
        .then(data => {
            // Returns 2 or 1 product(s) depending on the response
            return data.map(productArray => productArray[0]);
        });
}

function fetchHighScore() {
    return fetch(`${BASE_URL}/getHighScore`)
        .then(response => response.json())
        .then(data => {
            const highScore = data.highscore || 0;
            const maxScorer = data.scorer || 'unknown';
            console.log()
            return { highScore, maxScorer };
        });
}
function setHighScore(){
    const username = document.getElementById('username-input').value;
    fetch(`${BASE_URL}/setHighScore?highscore=${score}&username=${username}`)
        .then(response => response.text())
        .then(response => {
            return response;
        });
}


async function nextRound() {

     // Update highscore
      const { highScore, maxScorer } = await fetchHighScore();
     // Show score, higscore and maxScorer
     document.getElementById("score").innerText = "Score: "+score;
     document.getElementById("highscore").innerText = "Highscore: "+highScore + " by " + maxScorer;

     if (Number(score) > Number(highScore)) {
         setHighScore();
     }

    

//  animateLoadingRabbit();
    if (!product2) {
        // Fetch two random products
        const products = await fetchProduct(2);
        product1 = products[0];
        product2 = products[1];
    } else {
        product1 = product2;
        // Fetch one random product
        const products = await fetchProduct(1);
        product2 = products[0]; // Take the first product from the array
    }
    // Display the products to the user
    // setTimeout(() => {
    //     hideLoadingContainer(); // hide the loading rabbit
    //     displayProducts();
    // }, 3000);
    document.getElementById("image2").src = "img/loading_icon.gif"
    displayProducts();


}

function displayProducts() {
    if (product1 && product2) { // Check if product1 and product2 are not undefined
        var img1 = new Image();
        img1.onload = function() {
            document.getElementById('image1').src = img1.src;
        };
        img1.src = product1.image;

        document.getElementById('name1').textContent = product1.name;
        document.getElementById('price1').textContent = product1.price.toFixed(2) + '€';

        var img2 = new Image();
        img2.onload = function() {
            document.getElementById('image2').src = img2.src;
        };
        img2.src = product2.image;

        document.getElementById('name2').textContent = product2.name;
        document.getElementById('price2').textContent = product2.price.toFixed(2) + '€';
    }
}



function updateScoreboard() {
    document.getElementById('scoreboard').textContent = 'Score: ' + score;
}

function showScoreMessage() {
    const scoreMessage = document.getElementById('score-message');
    scoreMessage.style.opacity = '1';
    scoreMessage.classList.add('show');
    setTimeout(() => {
        scoreMessage.style.opacity = '0';
        scoreMessage.classList.remove('show');
    }, 1000); // Hide the message after 1 second
}
async function guessHigher() {
    let correct = product1.price < product2.price;
    var higherButton = document.getElementById('higher-button');
    var higherButtonText = higherButton.querySelector('p');

    var lowerButton = document.getElementById('lower-button');
    var oLetter = document.querySelector('.o-letter');

    if (correct) {
        higherButton.classList.remove('incorrect');
        higherButton.classList.add('correct');
        score++;
    } else {
        higherButton.classList.remove('correct');
        higherButton.classList.add('incorrect');
        if (Number(score) > Number(highscore)) {
            highscore = score;
            setHighScore();
        }
        score = 0;
    }

    setTimeout(function() {
        higherButton.classList.remove('correct');
        higherButton.classList.remove('incorrect');

        higherButtonText.textContent = product2.price.toFixed(2)+'€';
    }, 2000);

    setTimeout(function() {
        higherButtonText.textContent = 'Higher';

        nextRound();
    }, 4000);
}


async function guessLower() {
    let correct = product1.price > product2.price;
    var lowerButton = document.getElementById('lower-button');
    var lowerButtonText = lowerButton.querySelector('p');

    var higherButton = document.getElementById('higher-button');
    var oLetter = document.querySelector('.o-letter');

    if (correct) {
        lowerButton.classList.remove('incorrect');
        lowerButton.classList.add('correct');
        score++;
    } else {
        lowerButton.classList.remove('correct');
        lowerButton.classList.add('incorrect');
        if (Number(score) > Number(highscore)) {
            highscore = score;
            setHighScore();
        }
        score = 0;
    }

    setTimeout(function() {
        lowerButton.classList.remove('correct');
        lowerButton.classList.remove('incorrect');

        lowerButtonText.textContent = product2.price+'$';
    }, 2000);

    setTimeout(function() {
        lowerButtonText.textContent = 'Lower';

        nextRound();
    }, 4000);
}


nextRound();

