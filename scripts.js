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
    return fetch(`http://api.finditapp.es:5000/pickRandomProduct?number=${number}`)
        .then(response => response.json())
        .then(data => {
            console.log('API response:', data);
            // Returns 2 or 1 product(s) depending on the response
            return data.map(productArray => productArray[0]);
        });
}


async function nextRound() {
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
    setTimeout(() => {
        hideLoadingContainer(); // hide the loading rabbit
        displayProducts();
    }, 3000);
    displayProducts();
}

function displayProducts() {
    if (product1 && product2) { // Check if product1 and product2 are not undefined
        document.getElementById('image1').src = product1.image;
        document.getElementById('name1').textContent = product1.name;
        document.getElementById('price1').textContent = '$' + product1.price.toFixed(2);
        document.getElementById('image2').src = product2.image;
        document.getElementById('name2').textContent = product2.name;
        setTimeout(2000)


    }
}

let score = 0;

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
function guessHigher() {
    if (product1.price < product2.price) {
        document.getElementById('result').textContent = 'Correct! The price of ' + product2.name + ' is $' + product2.price.toFixed(2);
        score++;
        showScoreMessage();
    } else {
        document.getElementById('result').textContent = 'You missed! The price of ' + product2.name + ' is $' + product2.price.toFixed(2);
        score = 0;
    }
    updateScoreboard();
    nextRound();
}

function guessLower() {
    if (product1.price > product2.price) {
        document.getElementById('result').textContent = 'Correct! The price of ' + product2.name + ' is $' + product2.price.toFixed(2);
        score++;
        showScoreMessage();
    } else {
        document.getElementById('result').textContent = 'You missed! The price of' + product2.name + ' is $' + product2.price.toFixed(2);
        score = 0;
    }
    updateScoreboard();
    nextRound();
}

nextRound();

