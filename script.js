document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cardsGrid = document.getElementById('cards-grid');
    const movesDisplay = document.getElementById('moves');
    const timeDisplay = document.getElementById('time');
    const pairsDisplay = document.getElementById('pairs');
    const resetBtn = document.getElementById('reset-btn');

    // Game Variables
    const emojis = ['🍎', '🍊', '🍓', '🍋', '🍒', '🍉'];
    let cards = [...emojis, ...emojis]; // Create pairs
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let time = 0;
    let timer;
    const TIME_LIMIT = 60;
    let gameOver = false;

    // Initialize Game
    function init() {
        shuffleCards();
        createCards();
        startTimer();
    }

    // Fisher-Yates Shuffle Algorithm
    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
    }

    // Create Game Board
    function createCards() {
        cardsGrid.innerHTML = '';
        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            card.dataset.emoji = emoji;
            card.addEventListener('click', flipCard);
            cardsGrid.appendChild(card);
        });
    }

    // Card Click Handler
    function flipCard() {
        if (gameOver || flippedCards.length >= 2 || 
            this.classList.contains('flipped') || 
            this.classList.contains('matched')) return;

        this.classList.add('flipped');
        this.textContent = this.dataset.emoji;
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            checkMatch();
        }
    }

    // Check for Matches
    function checkMatch() {
        const [card1, card2] = flippedCards;
        
        if (card1.dataset.emoji === card2.dataset.emoji) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            pairsDisplay.textContent = matchedPairs;
            flippedCards = [];
            
            // Win Condition
            if (matchedPairs === emojis.length) {
                clearInterval(timer);
                showResult(true);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.textContent = '';
                card2.textContent = '';
                flippedCards = [];
            }, 1000);
        }
    }

    // Game Timer
    function startTimer() {
        timer = setInterval(() => {
            time++;
            timeDisplay.textContent = time;
            
            // Critical time warning
            if (TIME_LIMIT - time <= 10) {
                timeDisplay.classList.add('time-critical');
            }
            
            // Lose Condition
            if (time >= TIME_LIMIT && matchedPairs < emojis.length) {
                clearInterval(timer);
                gameOver = true;
                showResult(false);
            }
        }, 1000);
    }

    // Show Game Result
    function showResult(isWinner) {
        const resultDiv = document.createElement('div');
        resultDiv.className = `result-message ${isWinner ? 'won' : 'lost'}`;
        resultDiv.textContent = isWinner 
            ? `🎉 You won in ${moves} moves!` 
            : `😢 Time's up! ${matchedPairs}/${emojis.length} pairs matched`;
        
        document.querySelector('.game-container').prepend(resultDiv);
        
        // Disable all cards
        document.querySelectorAll('.card').forEach(card => {
            card.style.pointerEvents = 'none';
        });
    }

    // Reset Game
    function resetGame() {
        clearInterval(timer);
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        time = 0;
        gameOver = false;
        
        movesDisplay.textContent = '0';
        timeDisplay.textContent = '0';
        pairsDisplay.textContent = '0';
        timeDisplay.classList.remove('time-critical');
        
        const existingResult = document.querySelector('.result-message');
        if (existingResult) existingResult.remove();
        
        shuffleCards();
        createCards();
        startTimer();
    }

    // Event Listeners
    resetBtn.addEventListener('click', resetGame);
    
    // Start the game
    init();
});