// frontend/media-event.js
document.addEventListener('DOMContentLoaded', () => {
    const choiceButtons = document.querySelectorAll('.choice-btn');

    choiceButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const choice = event.target.dataset.choice;
            
            const updatedPlayer = await window.footballAPI.handleMediaEvent(choice);

            if (updatedPlayer) {
                alert(`Your reputation has been updated based on your answer!`);
                window.location.href = 'index.html';
            } else {
                alert('An error occurred.');
            }
        });
    });
});