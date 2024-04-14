// DOM elements
const loginForm = document.getElementById('loginForm');
const mainContent = document.getElementById('mainContent');
const loginContainer = document.getElementById('loginContainer');

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
        const jerseys = await response.json();
        
        const jerseyContainer = document.getElementById('jerseyContainer');
        jerseyContainer.innerHTML = ''; // Clear previous content
        
        jerseys.forEach(jersey => {
            const jerseyDiv = document.createElement('div');
            jerseyDiv.classList.add('jersey');
            jerseyDiv.innerHTML = `
                <img src="${jersey.image}" alt="${jersey.name}">
                <p>${jersey.name}</p>
                <p>${jersey.price}</p>
                <button class="purchase-btn">Purchase</button>
                <p>${jersey.description}</p>
            `;
            jerseyContainer.appendChild(jerseyDiv);
        });
    } catch (error) {
        console.error('Error fetching jersey data:', error);
    }
}

// Event listener for purchase button
document.addEventListener('click', async function(event) {
    if (event.target.classList.contains('purchase-btn')) {
        const jerseyTitle = event.target.parentElement.querySelector('p').textContent;
        alert(`You have purchased ${jerseyTitle}`);
    }
});