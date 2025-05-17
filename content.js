(function() {
    // Create a style element for immediate injection
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Prevent flash of original styles */
        body {
            visibility: hidden;
        }
    `;
    document.head.appendChild(styleElement);

    // Load styles asynchronously
    Promise.all([
        fetch(chrome.runtime.getURL('DarkDefault.css')),
        fetch(chrome.runtime.getURL('LightDefault.css'))
    ]).then(responses => Promise.all(responses.map(r => r.text())))
    .then(([darkStyles, lightStyles]) => {
        // Create and append style elements
        const darkStyle = document.createElement('style');
        darkStyle.textContent = darkStyles;
        document.head.appendChild(darkStyle);

        const lightStyle = document.createElement('style');
        lightStyle.textContent = lightStyles;
        document.head.appendChild(lightStyle);

        // Show the page once styles are loaded
        document.body.style.visibility = 'visible';
    });

    const darkThemeBlock = document.querySelector('div.position-relative.mb-3.flex-shrink-0.col-6.col-md-4 input[id="option-dark"]');

    if (darkThemeBlock) {
        const parentDiv = darkThemeBlock.parentElement;

        const labelDiv = parentDiv.querySelector('label.radio-label .ml-5.pr-1');
        if (labelDiv) labelDiv.textContent = "Custom Theme";

        const image = parentDiv.querySelector('label.radio-label img');
        if (image) image.src = "https://pbs.twimg.com/media/GIzX7v5XcAAov7X?format=jpg&name=small";
    }

    const lightThemeBlock = document.querySelector('div.position-relative.mb-3.flex-shrink-0.col-6.col-md-4 input[id="option-light"]');

    if (lightThemeBlock) {
        const parentDiv = lightThemeBlock.parentElement;

        const labelDiv = parentDiv.querySelector('label.radio-label .ml-5.pr-1');
        if (labelDiv) labelDiv.textContent = "Custom Theme Light";

        const image = parentDiv.querySelector('label.radio-label img');
        if (image) image.src = "https://pbs.twimg.com/media/GJBj52wbMAA7EzT.jpg";
    }

    const snowStyle = document.createElement('style');
    snowStyle.innerHTML = `
        body {
            position: relative;
            margin: 0;
            overflow-x: hidden;
        }
        .snowflake {
            position: absolute;
            top: -20px;
            z-index: -1;
            color: #FFF;
            font-size: 10px;
            user-select: none;
            pointer-events: none;
            animation: fall linear infinite, drift linear infinite;
        }
        @keyframes fall {
            0% {
                transform: translateY(-10px) rotate(0deg);
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
            }
        }
        @keyframes drift {
            0% {
                transform: translateX(0px);
            }
            100% {
                transform: translateX(calc(100px * (1 - 2 * random())));
            }
        }
    `;
    document.head.appendChild(snowStyle);

    let snowflakesCreated = 0;
    const maxSnowflakes = 10;

    let snowEnabled = true

    function createSnowflakes() {
        if (!snowEnabled) {
            return;
        }

        while (snowflakesCreated < maxSnowflakes) {
            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');
            snowflake.textContent = '❄';

            const randomX = Math.random() * window.innerWidth;
            const randomDuration = Math.random() * 5 + 3;

            snowflake.style.left = randomX + 'px';
            snowflake.style.animationDuration = randomDuration + 's';
            snowflake.style.fontSize = (Math.random() * 10 + 5) + 'px';
            snowflake.style.animationDelay = Math.random() * 10 + 's';

            document.body.appendChild(snowflake);

            snowflakesCreated++;

            snowflake.addEventListener('animationend', () => {
                snowflake.remove();
            });
        }
    }

    function enableSnow() {
        snowEnabled = true;
        createSnowflakes();
    }

    function disableSnow() {
        snowEnabled = false;
        snowflakesCreated = 0;
        const snowflakes = document.querySelectorAll('.snowflake');
        snowflakes.forEach(snowflake => {
            snowflake.remove();
        });
    }

    setInterval(() => {
        if (snowEnabled) {
            createSnowflakes();
        }
    }, 500);

    enableSnow();
})(); 
