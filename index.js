// DOM elements
const loginForm = document.getElementById('loginForm');
const mainContent = document.getElementById('mainContent');
const loginContainer = document.getElementById('loginContainer');
const jerseyContainer = document.getElementById('jerseyContainer');

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
        });
    } catch (error) {
        console.error('Error fetching jersey data:', error);
    }
}