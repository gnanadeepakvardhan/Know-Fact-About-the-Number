document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('userInput');
    const fact = document.getElementById('fact');
    const loader = document.getElementById('loader');
    const factContainer = document.getElementById('factContainer');

    function showLoader() {
        loader.style.display = 'block';
        factContainer.style.display = 'none';
    }

    function hideLoader() {
        loader.style.display = 'none';
        factContainer.style.display = 'block';
    }

    function displayFact(factText) {
        fact.textContent = factText;
        factContainer.classList.add('success');

        setTimeout(() => {
            factContainer.classList.remove('success');
        }, 600);
    }

    function showError(message) {
        fact.textContent = message;
        factContainer.classList.add('error');

        setTimeout(() => {
            factContainer.classList.remove('error');
        }, 3000);
    }

    function resetFactDisplay() {
        factContainer.classList.remove('success', 'error');
        fact.textContent = '🎯 Enter a number above to get an interesting fact!';
    }

    function addEmojiReaction() {
        const humanizedEmojis = ['😊', '🤓', '💭', '🧠', '💡', '🤔', '😄', '🎯'];
        const randomEmoji = humanizedEmojis[Math.floor(Math.random() * humanizedEmojis.length)];

        const floatingEmoji = document.createElement('div');
        floatingEmoji.textContent = randomEmoji;
        floatingEmoji.style.cssText = `
            position: fixed;
            font-size: 2rem;
            pointer-events: none;
            z-index: 1000;
            animation: floatUp 1s ease-out forwards;
        `;

        floatingEmoji.style.left = Math.random() * window.innerWidth + 'px';
        floatingEmoji.style.top = window.innerHeight + 'px';

        document.body.appendChild(floatingEmoji);

        setTimeout(() => {
            document.body.removeChild(floatingEmoji);
        }, 1000);
    }

    async function getFactAboutNumber(number) {
        try {
            showLoader();

            const url = `https://apis.ccbp.in/numbers-fact?number=${number}`;
            console.log('🔍 Fetching fact for number:', number);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('📦 API Response:', data);

            if (data && data.fact) {
                displayFact(data.fact);
                addEmojiReaction();
            } else {
                throw new Error('No fact found in the response');
            }

        } catch (error) {
            console.error('❌ Error fetching fact:', error);
            showError('😅 Oops! Something went wrong. Please try again!');
        } finally {
            hideLoader();
        }
    }

    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const number = userInput.value.trim();

            if (number === '') {
                showError('🤔 Please enter a number!');
                return;
            }

            if (isNaN(number) || number === '') {
                showError('😅 Please enter a valid number!');
                return;
            }

            resetFactDisplay();
            getFactAboutNumber(number);
        }
    });

    userInput.addEventListener('input', function() {
        if (this.value === '') {
            resetFactDisplay();
        }
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) scale(0.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    userInput.focus();

    document.querySelectorAll('.emoji').forEach(emoji => {
        emoji.addEventListener('click', function() {
            this.style.transform = 'scale(1.5) rotate(360deg)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    });
});
