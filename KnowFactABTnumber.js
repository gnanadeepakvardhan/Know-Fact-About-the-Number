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

    function getMockFact(number) {
        const mockFacts = {
            1: "1 is the first natural number and the foundation of all counting!",
            2: "2 is the only even prime number - how special!",
            3: "3 is considered a lucky number in many cultures!",
            4: "4 represents stability and balance in numerology!",
            5: "5 is the number of fingers on one hand!",
            7: "7 is considered a lucky number in many cultures!",
            10: "10 is the base of our decimal number system!",
            42: "42 is the answer to life, the universe, and everything (according to Douglas Adams)!",
            100: "100 represents a century and is a milestone number!",
            365: "365 is the number of days in a non-leap year!",
            1000: "1000 is a millennium and represents great achievement!"
        };

        return mockFacts[number] || `The number ${number} is unique and special in its own way!`;
    }

    async function getFactAboutNumber(number) {
        try {
            showLoader();

            const url = `https://apis.ccbp.in/numbers-fact?number=${number}`;
            console.log('🔍 Fetching fact for number:', number);
            console.log('🌐 API URL:', url);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                signal: controller,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            clearTimeout(timeoutId);
            console.log('�� Response status:', response.status);
            console.log('📡 Response headers:', response.headers);

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

            if (error.name === 'AbortError') {
                console.log('⏰ Request timed out, using mock fact');
                const mockFact = getMockFact(parseInt(userInput.value));
                displayFact(mockFact);
                addEmojiReaction();
            } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                console.log('🌐 Network error, using mock fact');
                const mockFact = getMockFact(parseInt(userInput.value));
                displayFact(mockFact);
                addEmojiReaction();
            } else {
                console.log('🔄 API error, using mock fact');
                const mockFact = getMockFact(parseInt(userInput.value));
                displayFact(mockFact);
                addEmojiReaction();
            }
        } finally {
            hideLoader();
        }
    }

    function handleSearch() {
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

    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            handleSearch();
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

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    }
});