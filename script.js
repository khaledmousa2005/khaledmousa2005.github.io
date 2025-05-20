document.addEventListener('DOMContentLoaded', function () {
    const welcomeBtn = document.getElementById('welcomeBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');

    // Array of welcome messages
    const messages = [
        "Welcome to El Khaled Tech! We're excited to have you here.",
        "Discover the future of technology with El Khaled Tech.",
        "Innovation meets excellence at El Khaled Tech.",
        "Your journey into the digital world starts here.",
        "Experience technology like never before with El Khaled Tech."
    ];

    // Function to get a random message
    function getRandomMessage() {
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    }

    // Add click event to the button
    welcomeBtn.addEventListener('click', function () {
        // Hide the button
        welcomeBtn.style.display = 'none';

        // Show the welcome message
        welcomeMessage.textContent = getRandomMessage();
        welcomeMessage.style.display = 'block';

        // Add a reset button after 3 seconds
        setTimeout(function () {
            const resetBtn = document.createElement('button');
            resetBtn.textContent = 'Try Another Message';
            resetBtn.className = 'btn';
            resetBtn.style.marginTop = '20px';

            resetBtn.addEventListener('click', function () {
                welcomeMessage.textContent = getRandomMessage();
            });

            welcomeMessage.appendChild(resetBtn);
        }, 3000);
    });
});
