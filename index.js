// DOM elements
const loginForm = document.getElementById('loginForm');
const mainContent = document.getElementById('mainContent');
const loginContainer = document.getElementById('loginContainer');
const jerseyContainer = document.getElementById('jerseyContainer');
const commentSection = document.getElementById('commentSection'); // Added comment section
const commentForm = document.getElementById('commentForm'); // Added comment form

// Event listener for login form submission
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Simulate login validation
    const username = loginForm.elements.username.value;
    const password = loginForm.elements.password.value;

    // Check if username and password are valid (for demonstration purpose only)
    if (username === 'jersey' && password === 'jersey') {
        // Show main content
        mainContent.style.display = 'block';
        // Hide login form
        loginContainer.style.display = 'none';
        // Call function to fetch jersey data and populate the page
        fetchJerseys();
        // Call function to fetch comments and populate the comment section
        fetchComments();
    } else {
        alert('Invalid username or password. Please try again.');
    }
});

// Function to fetch jersey data and populate the page
async function fetchJerseys() {
    try {
        const response = await fetch('http://localhost:3000/jerseys');
        if (!response.ok) {
            throw new Error('Failed to fetch jerseys');
        }
        const jerseys = await response.json();
        
        jerseyContainer.innerHTML = ''; // Clear previous content
        
        jerseys.forEach(jersey => {
            // Initialize count of available jerseys for each jersey to 10
            let availableJerseys = 10;

            const jerseyDiv = document.createElement('div');
            jerseyDiv.classList.add('jersey');
            jerseyDiv.innerHTML = `
                <img src="${jersey.image}" alt="${jersey.title}">
                <p>${jersey.title}</p>
                <p>$${jersey.price}</p>
                <p>Available: ${availableJerseys}</p> <!-- Display initial count of available jerseys -->
                <button class="purchase-btn">Purchase</button>
                <p>${jersey.description}</p>
                <button class="like-btn">Like</button> <!-- Like button -->
            `;
            jerseyContainer.appendChild(jerseyDiv);

            // Event listener for purchase button
            jerseyDiv.addEventListener('click', function(event) {
                if (event.target.classList.contains('purchase-btn')) {
                    // Update count of available jerseys
                    if (availableJerseys > 0) {
                        availableJerseys--;
                        event.target.parentElement.querySelector('p:nth-child(4)').textContent = `Available: ${availableJerseys}`;
                    } else {
                        // If jerseys are sold out, show count as 0
                        event.target.parentElement.querySelector('p:nth-child(4)').textContent = `Available: 0`;
                    }
                }
            });

            // Event listener for like button
            jerseyDiv.querySelector('.like-btn').addEventListener('click', function(event) {
                const likeBtn = event.target;
                let likeCount = parseInt(likeBtn.dataset.likes) || 0;
                likeCount++;
                likeBtn.textContent = `Like (${likeCount})`;
                likeBtn.dataset.likes = likeCount;
                likeBtn.style.backgroundColor = 'red';
            });
        });
    } catch (error) {
        console.error('Error fetching jersey data:', error);
    }
}

// Function to fetch comments and populate the comment section
async function fetchComments() {
    try {
        const response = await fetch('http://localhost:3000/comments');
        if (!response.ok) {
            throw new Error('Failed to fetch comments');
        }
        const comments = await response.json();
        
        commentSection.innerHTML = ''; // Clear previous content
        
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');
            commentDiv.innerHTML = `
                <p>${comment.text}</p>
                <button class="delete-btn" data-id="${comment.id}">Delete</button>
            `;
            commentSection.appendChild(commentDiv);
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

// Event listener for comment form submission
commentForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    
    // Retrieve comment text from the form
    const commentText = commentForm.elements.commentText.value;

    // Post the comment to the server
    try {
        const response = await fetch('http://localhost:3000/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: commentText })
        });

        if (!response.ok) {
            throw new Error('Failed to post comment');
        }

        // Clear the comment text area after posting
        commentForm.elements.commentText.value = '';

        // Fetch and display comments
        fetchComments();
    } catch (error) {
        console.error('Error posting comment:', error);
    }
});

// Event listener for deleting a comment
commentSection.addEventListener('click', async function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const commentId = event.target.dataset.id;

        try {
            const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }

            // Fetch and display comments after deletion
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    }
});

// Fetch comments initially when the page loads
window.onload = function() {
    fetchComments();
};