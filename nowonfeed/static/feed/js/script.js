document.addEventListener('DOMContentLoaded', function() {
    const tweetForm = document.querySelector('.tweet-box form');
    const tweetInput = document.querySelector('.tweet-box textarea');
    const feedContainer = document.querySelector('.feed-content div');

    if (tweetForm) {
        tweetForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const content = tweetInput.value.trim();
            if (content) {
                fetch('/nowonfeed/', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                    },
                    body: new URLSearchParams({
                        content: content
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.new_post) {
                        const newTweet = document.createElement('div');
                        newTweet.classList.add('tweet');
                        newTweet.innerHTML = `
                            <div class="tweet-content">
                                <div class="tweet-header">
                                    <strong>${data.username}</strong>
                                </div>
                                <p>${data.new_post}</p>
                            </div>
                        `;
                        
                        feedContainer.insertBefore(newTweet, feedContainer.firstChild);
                        tweetInput.value = '';
                    } else if (data.error) {
                        console.error('Error:', data.error);
                    }
                })
                .catch(error => console.error('Error sending tweet:', error));
            }
        });
    }
});
