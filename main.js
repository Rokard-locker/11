
const studentIDSuffix = '001';
function createTestUsers001() {
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    const testUsers = [
        { username: 'student1', password: 'pass123!', email: 'student1@rokard.edu.au' },
        { username: 'admin', password: 'admin123!', email: 'admin@rokard.edu.au' },
        { username: 'test', password: 'test123!', email: 'test@rokard.edu.au' }
    ];
    
    let usersUpdated = false;
    
    testUsers.forEach(testUser => {
        if (!existingUsers.find(user => user.username === testUser.username)) {
            existingUsers.push({
                ...testUser,
                registrationDate: new Date().toISOString()
            });
            usersUpdated = true;
            console.log(`Created test user: ${testUser.username}`);
        }
    });
    
    if (usersUpdated) {
        localStorage.setItem('users', JSON.stringify(existingUsers));
        console.log('Test users created successfully');
    }
}

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let appData = {};


function initApp001() {
    loadAppData001();
    initAuthForms001();
    initValidation001();
    initHomepage001();
    initCart001();
    initOrderManagement001();
    loadTodoList001();
    checkAuth001();
    updateNavigation001();
}


async function loadAppData001() {
    try {
        const response = await fetch('data.json');
        appData = await response.json();
        console.log('Application data loaded successfully');
    } catch (error) {
        console.error('Error loading application data:', error);
        // Fallback data in case JSON fails to load
        appData = {
            courses: [],
            resources: []
        };
    }
}

// ==================== AUTHENTICATION FUNCTIONS ====================

/**
 * Register new user with form validation
 * @param {Event} event - Form submission event
 */
function registerUser001(event) {
    event.preventDefault();
    
    // Get form values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const email = document.getElementById('email').value.trim();

    // Validate passwords match
    if (password !== confirmPassword) {
        showError001('Passwords do not match');
        return;
    }

    // Check if user already exists in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (existingUsers.find(user => user.username === username)) {
        showError001('Username already exists');
        return;
    }

    // Save new user to localStorage
    const newUser = { 
        username, 
        password, 
        email,
        registrationDate: new Date().toISOString()
    };
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    // Show success message and redirect
    showSuccess001('Registration successful! Redirecting to login...');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

/**
 * Authenticate user login
 * @param {Event} event - Form submission event
 */
function loginUser001(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Retrieve users from localStorage and validate credentials
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Store login state in sessionStorage and redirect
        sessionStorage.setItem('currentUser', username);
        sessionStorage.setItem('loginTime', new Date().toISOString());
        showSuccess001('Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1000);
    } else {
        showError001('Invalid username or password');
    }
}

/**
 * Logout user and clear session data
 */
function logout001() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('loginTime');
    localStorage.removeItem('cart');
    showSuccess001('Logged out successfully');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

/**
 * Check if user is authenticated for protected pages
 * @returns {boolean} - True if user is logged in
 */
function requireAuth001() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        showError001('Please login to access this page');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return false;
    }
    return true;
}

/**
 * Update UI based on authentication state
 */
function checkAuth001() {
    const currentUser = sessionStorage.getItem('currentUser');
    const authLinks = document.getElementById('auth-links');
    
    if (authLinks) {
        if (currentUser) {
            authLinks.innerHTML = `
                <span style="color: #2c3e50; font-weight: 600;">Welcome, ${currentUser}</span>
                <a href="order-management.html" class="btn-outline">Orders</a>
                <button onclick="logout001()" class="btn-primary">Logout</button>
            `;
        } else {
            authLinks.innerHTML = `
                <a href="login.html" class="btn-outline">Login</a>
                <a href="register.html" class="btn-primary">Register</a>
            `;
        }
    }
}

/**
 * Update navigation based on current page
 */
function updateNavigation001() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.style.color = '#3498db';
            link.style.fontWeight = '600';
        }
    });
}

/**
 * Display error message to user
 * @param {string} message - Error message to display
 */
function showError001(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.style.background = '#e74c3c';
        errorDiv.style.color = 'white';
        errorDiv.style.padding = '1rem';
        errorDiv.style.borderRadius = '8px';
        errorDiv.style.marginBottom = '1rem';
    } else {
        alert(message);
    }
}

/**
 * Display success message to user
 * @param {string} message - Success message to display
 */
function showSuccess001(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.style.background = '#27ae60';
        errorDiv.style.color = 'white';
        errorDiv.style.padding = '1rem';
        errorDiv.style.borderRadius = '8px';
        errorDiv.style.marginBottom = '1rem';
    } else {
        alert(message);
    }
}

/**
 * Initialize authentication form event listeners
 */
function initAuthForms001() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm) {
        registerForm.addEventListener('submit', registerUser001);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', loginUser001);
    }
}

// ==================== FORM VALIDATION FUNCTIONS ====================

/**
 * Validate registration form with comprehensive checks
 * @returns {boolean} - True if form is valid
 */
function validateRegisterForm001() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    let isValid = true;

    // Clear previous errors
    clearErrors001();

    // Username validation: at least 3 characters, alphanumeric only
    const usernameRegex = /^[a-zA-Z0-9]{3,}$/;
    if (!usernameRegex.test(username)) {
        showFieldError001('username', 'Username must be at least 3 characters (letters and numbers only)');
        isValid = false;
    }

    /**
     * Password validation regex explanation:
     * ^(?=.*[!@#$%^&*]) - Positive lookahead for at least one special character
     * [A-Za-z\d!@#$%^&*]{6,} - 6 or more of allowed characters (letters, digits, special chars)
     * $ - End of string
     */
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!passwordRegex.test(password)) {
        showFieldError001('password', 'Password must be at least 6 characters with at least one special character (!@#$%^&*)');
        isValid = false;
    }

    // Confirm password match validation
    if (password !== confirmPassword) {
        showFieldError001('confirmPassword', 'Passwords do not match');
        isValid = false;
    }

    /**
     * Email validation regex explanation:
     * ^[^\s@]+ - Start with one or more non-whitespace, non-@ characters
     * @[^\s@]+ - @ followed by one or more non-whitespace, non-@ characters
     * \.[^\s@]+$ - . followed by one or more non-whitespace, non-@ characters to end
     */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError001('email', 'Please enter a valid email address');
        isValid = false;
    }

    return isValid;
}

/**
 * Display field-specific error message
 * @param {string} fieldId - ID of the form field
 * @param {string} message - Error message to display
 */
function showFieldError001(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    errorDiv.style.marginTop = '0.5rem';
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#e74c3c';
    field.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
}

/**
 * Clear all validation errors from form
 */
function clearErrors001() {
    const errors = document.querySelectorAll('.error');
    errors.forEach(error => error.remove());
    
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.style.borderColor = '#e1e8ed';
        input.style.boxShadow = 'none';
    });
}

/**
 * Initialize form validation event listeners
 * Handles form submission and real-time validation
 */
function initValidation001() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        // Add real-time validation on input blur
        const inputs = registerForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField001(this);
            });
        });
        
        // Main form submission validation
        registerForm.addEventListener('submit', function(event) {
            if (!validateRegisterForm001()) {
                event.preventDefault();
                showError001('Please fix the errors before submitting');
            }
        });
    }
}

/**
 * Validate individual form field
 * @param {HTMLInputElement} field - Input field to validate
 */
function validateField001(field) {
    const value = field.value.trim();
    
    switch (field.id) {
        case 'username':
            if (value.length < 3) {
                showFieldError001('username', 'Username must be at least 3 characters');
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError001('email', 'Please enter a valid email address');
            }
            break;
        case 'password':
            const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
            if (!passwordRegex.test(value)) {
                showFieldError001('password', 'Password must be at least 6 characters with one special character');
            }
            break;
    }
}

// ==================== HOMEPAGE FUNCTIONS ====================

/**
 * Display courses on homepage with animation
 */
function displayCourses001() {
    const container = document.getElementById('courses-container');
    if (!container || !appData.courses) return;

    container.innerHTML = appData.courses.map((course, index) => `
        <div class="card" style="animation-delay: ${index * 0.1}s;">
            <h4>${course.name}</h4>
            <p>${course.description}</p>
            <p><strong>Duration:</strong> ${course.duration}</p>
            <p><strong>Assessment:</strong> ${course.assessment}</p>
            <p><strong>Project:</strong> ${course.project}</p>
            <button class="btn-outline" style="margin-top: 1rem;" onclick="showCourseDetails001('${course.id}')">
                View Details
            </button>
        </div>
    `).join('');
}

/**
 * Display training resources on homepage
 */
function displayResources001() {
    const container = document.getElementById('resources-container');
    if (!container || !appData.resources) return;

    container.innerHTML = appData.resources.map((resource, index) => `
        <div class="card" style="animation-delay: ${index * 0.1}s;">
            <h4>${resource.name}</h4>
            <p>${resource.description}</p>
            <p><strong>Unit Code:</strong> ${resource.unitNumber}</p>
            <p class="price">$${resource.price}</p>
            <button class="btn-primary" onclick="addToCart001('${resource.id}')">
                Add to Cart
            </button>
        </div>
    `).join('');
}

/**
 * Show detailed course information
 * @param {string} courseId - ID of the course to display
 */
function showCourseDetails001(courseId) {
    const course = appData.courses.find(c => c.id === courseId);
    if (course) {
        alert(`Course Details:\n\nName: ${course.name}\nDuration: ${course.duration}\nAssessment: ${course.assessment}\nProject: ${course.project}\n\nDescription: ${course.description}`);
    }
}

/**
 * Initialize homepage components
 */
function initHomepage001() {
    if (document.getElementById('courses-container')) {
        // Wait for data to load before displaying
        if (appData.courses && appData.resources) {
            displayCourses001();
            displayResources001();
        } else {
            // Retry after short delay if data not loaded
            setTimeout(initHomepage001, 100);
        }
    }
}

// ==================== SHOPPING CART FUNCTIONS ====================

/**
 * Add item to shopping cart with animation
 * @param {string} resourceId - ID of the resource to add
 */
function addToCart001(resourceId) {
    if (!requireAuth001()) return;

    const resource = appData.resources.find(r => r.id === resourceId);
    if (resource) {
        const existingItem = cart.find(item => item.id === resourceId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...resource,
                quantity: 1,
                addedDate: new Date().toISOString()
            });
        }
        
        updateCartStorage001();
        showAddToCartAnimation001(resource.name);
    }
}

/**
 * Update cart data in localStorage
 */
function updateCartStorage001() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Display shopping cart items with calculated totals
 */
function displayCart001() {
    const cartContainer = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #666;">
                <h3>Your cart is empty</h3>
                <p>Browse our training resources and add items to your cart</p>
                <a href="index.html" class="btn-primary" style="margin-top: 1rem;">Start Shopping</a>
            </div>
        `;
        if (totalElement) totalElement.textContent = 'Total: $0.00';
        return;
    }

    cartContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item" style="animation-delay: ${index * 0.1}s;">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <p><strong>Unit:</strong> ${item.unitNumber}</p>
                <p class="price">$${item.price} each</p>
            </div>
            <div class="item-controls">
                <button onclick="updateQuantity001('${item.id}', -1)">-</button>
                <span style="padding: 0 1rem; font-weight: bold;">${item.quantity}</span>
                <button onclick="updateQuantity001('${item.id}', 1)">+</button>
            </div>
            <div class="item-subtotal" style="font-weight: bold; color: #2c3e50;">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
            <div>
                <button onclick="removeItem001('${item.id}')" class="btn-outline" style="padding: 0.5rem 1rem;">
                    Remove
                </button>
            </div>
        </div>
    `).join('');

    updateTotal001();
}

/**
 * Update item quantity in cart
 * @param {string} itemId - ID of the item to update
 * @param {number} change - Quantity change (+1 or -1)
 */
function updateQuantity001(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItem001(itemId);
        } else {
            updateCartStorage001();
            displayCart001();
            showSuccess001('Cart updated successfully');
        }
    }
}

/**
 * Remove item from cart
 * @param {string} itemId - ID of the item to remove
 */
function removeItem001(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartStorage001();
    displayCart001();
    showSuccess001('Item removed from cart');
}

/**
 * Calculate and update cart total
 */
function updateTotal001() {
    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalElement.innerHTML = `
            <div style="background: rgba(255,255,255,0.9); padding: 1.5rem; border-radius: 10px;">
                <h3>Order Summary</h3>
                <p>Items: ${cart.reduce((sum, item) => sum + item.quantity, 0)}</p>
                <p style="font-size: 1.5rem; font-weight: bold; color: #27ae60;">Total: $${total.toFixed(2)}</p>
            </div>
        `;
    }
}

/**
 * Process checkout and create order
 */
function checkout001() {
    if (!requireAuth001()) return;
    
    if (cart.length === 0) {
        showError001('Your cart is empty. Add some items before checkout.');
        return;
    }

    const currentUser = sessionStorage.getItem('currentUser');
    const order = {
        id: Date.now(),
        username: currentUser,
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toISOString(),
        status: 'completed'
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart and redirect
    cart = [];
    updateCartStorage001();
    
    showSuccess001('Order placed successfully! Redirecting...');
    setTimeout(() => {
        window.location.href = 'order-confirmation.html';
    }, 1500);
}

/**
 * Show animation when item is added to cart
 * @param {string} itemName - Name of the added item
 */
function showAddToCartAnimation001(itemName) {
    // Create floating notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.5s ease, slideOutRight 0.5s ease 2s;
    `;
    notification.textContent = `✓ ${itemName} added to cart!`;
    
    document.body.appendChild(notification);
    
    // Remove notification after animation
    setTimeout(() => {
        notification.remove();
    }, 2500);
}

/**
 * Initialize cart page functionality
 */
function initCart001() {
    if (document.getElementById('cart-items') && requireAuth001()) {
        displayCart001();
    }
}

// ==================== ORDER MANAGEMENT FUNCTIONS ====================

/**
 * Display user's order history
 */
function displayOrderHistory001() {
    const orderContainer = document.getElementById('order-history');
    const currentUser = sessionStorage.getItem('currentUser');
    
    if (!orderContainer) return;

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => order.username === currentUser);

    if (userOrders.length === 0) {
        orderContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #666;">
                <h3>No orders found</h3>
                <p>You haven't placed any orders yet</p>
                <a href="index.html" class="btn-primary" style="margin-top: 1rem;">Start Shopping</a>
            </div>
        `;
        return;
    }

    // Sort orders by date (newest first)
    userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    orderContainer.innerHTML = userOrders.map((order, index) => `
        <div class="order-item" style="animation-delay: ${index * 0.1}s;">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 1rem; align-items: center;">
                <div>
                    <h4>Order #${order.id}</h4>
                    <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                    <p><strong>Items:</strong> ${order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                </div>
                <div style="text-align: center;">
                    <strong>Status</strong><br>
                    <span style="color: #27ae60; font-weight: bold;">${order.status}</span>
                </div>
                <div style="text-align: center;">
                    <strong>Total</strong><br>
                    <span style="color: #27ae60; font-size: 1.2rem; font-weight: bold;">$${order.total.toFixed(2)}</span>
                </div>
                <div>
                    <button onclick="downloadOrder001(${order.id})" class="btn-outline" style="margin-bottom: 0.5rem;">
                        Download JSON
                    </button>
                    <br>
                    <button onclick="viewOrderDetails001(${order.id})" class="btn-primary">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Download order as JSON file
 * @param {number} orderId - ID of the order to download
 */
function downloadOrder001(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        const dataStr = JSON.stringify(order, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `rokard-order-${orderId}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showSuccess001('Order downloaded successfully!');
    }
}

/**
 * View detailed order information
 * @param {number} orderId - ID of the order to view
 */
function viewOrderDetails001(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        const itemsList = order.items.map(item => 
            `• ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');
        
        alert(`Order Details:\n\nOrder ID: ${order.id}\nDate: ${new Date(order.date).toLocaleString()}\nTotal: $${order.total.toFixed(2)}\n\nItems:\n${itemsList}`);
    }
}

/**
 * Clear shopping cart and order history
 */
function clearHistory001() {
    if (confirm('Are you sure you want to clear your shopping cart and order history? This action cannot be undone.')) {
        localStorage.removeItem('cart');
        localStorage.removeItem('orders');
        cart = [];
        showSuccess001('Shopping cart and order history cleared successfully');
        
        // Refresh displays
        displayOrderHistory001();
        if (document.getElementById('cart-items')) {
            displayCart001();
        }
    }
}

/**
 * Initialize order management page
 */
function initOrderManagement001() {
    if (document.getElementById('order-history') && requireAuth001()) {
        displayOrderHistory001();
    }
}

// ==================== TO-DO LIST FUNCTIONS ====================

/**
 * Add item to interactive to-do list
 */
function addTodoItem001() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (text === '') {
        showError001('Please enter a task');
        return;
    }
    
    const todoList = document.getElementById('todoList');
    const todoItem = document.createElement('li');
    
    // Style the to-do item
    todoItem.style.cssText = `
        padding: 1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(255,255,255,0.8);
        margin-bottom: 0.5rem;
        border-radius: 8px;
        animation: slideInRight 0.3s ease;
    `;
    
    todoItem.innerHTML = `
        <span style="flex: 1;">${text}</span>
        <button onclick="this.parentElement.remove(); saveTodoList001();" 
                class="btn-outline" 
                style="padding: 0.5rem 1rem; font-size: 0.875rem;">
            Remove
        </button>
    `;
    
    todoList.appendChild(todoItem);
    input.value = '';
    
    // Save to localStorage
    saveTodoList001();
    showSuccess001('Task added successfully');
}

/**
 * Save to-do list to localStorage
 */
function saveTodoList001() {
    const todoList = document.getElementById('todoList');
    if (todoList) {
        const items = [];
        todoList.querySelectorAll('li').forEach(li => {
            items.push(li.querySelector('span').textContent);
        });
        localStorage.setItem('todoList', JSON.stringify(items));
    }
}

/**
 * Load to-do list from localStorage
 */
function loadTodoList001() {
    const todoList = document.getElementById('todoList');
    if (todoList) {
        const items = JSON.parse(localStorage.getItem('todoList')) || [];
        todoList.innerHTML = '';
        items.forEach((text, index) => {
            const todoItem = document.createElement('li');
            todoItem.style.cssText = `
                padding: 1rem;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255,255,255,0.8);
                margin-bottom: 0.5rem;
                border-radius: 8px;
                animation-delay: ${index * 0.1}s;
            `;
            
            todoItem.innerHTML = `
                <span style="flex: 1;">${text}</span>
                <button onclick="this.parentElement.remove(); saveTodoList001();" 
                        class="btn-outline" 
                        style="padding: 0.5rem 1rem; font-size: 0.875rem;">
                    Remove
                </button>
            `;
            
            todoList.appendChild(todoItem);
        });
    }
}

// ==================== EVENT LISTENERS AND INITIALIZATION ====================

/**
 * Handle Enter key in to-do list input
 */
document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.getElementById('todoInput');
    if (todoInput) {
        todoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTodoItem001();
            }
        });
    }
    
    // Initialize the application
    initApp001();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100px); opacity: 0; }
    }
    
    .card, .cart-item, .order-item {
        animation: fadeIn 0.6s ease;
    }
`;
document.head.appendChild(style);
function requireAuth001() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        showError001('Please login to access this page');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return false;
    }
    return true;
}
function initOrderManagement001() {
    const orderContainer = document.getElementById('order-history');
    if (orderContainer) {
        if (requireAuth001()) {
            displayOrderHistory001();
        }
    }
}
async function loadAppData001() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        appData = await response.json();
        console.log('Application data loaded successfully:', appData);
    } catch (error) {
        console.error('Error loading application data:', error);
        // 提供默认数据
        appData = {
            courses: [
                {
                    "id": "C001",
                    "name": "Web Development Fundamentals",
                    "description": "Learn HTML, CSS, JavaScript and build responsive websites",
                    "duration": "12 weeks",
                    "assessment": "Practical project and written test",
                    "project": "Build a portfolio website"
                }
            ],
            resources: [
                {
                    "id": "R001",
                    "unitNumber": "ICTWEB431",
                    "name": "Web Development Resource Kit",
                    "description": "Complete toolkit for web development training",
                    "price": 299,
                    "image": "images/web-kit.jpg"
                }
            ]
        };
    }
}

{
  "courses"; [
    {
      "id": "C001",
      "name": "Web Development Fundamentals",
      "description": "Learn HTML, CSS, JavaScript and build responsive websites",
      "duration": "12 weeks",
      "assessment": "Practical project and written test",
      "project": "Build a portfolio website"
    },
    {
      "id": "C002", 
      "name": "Digital Marketing Strategy",
      "description": "Master digital marketing channels and analytics",
      "duration": "10 weeks",
      "assessment": "Campaign project and case study",
      "project": "Develop a marketing plan"
    },
    {
      "id": "C003",
      "name": "Data Analysis with Python",
      "description": "Learn data analysis, visualization and statistical methods",
      "duration": "14 weeks", 
      "assessment": "Data analysis project and exam",
      "project": "Analyze real-world dataset"
    }
  ],
  "resources"; [
    {
      "id": "R001",
      "unitNumber": "ICTWEB431",
      "name": "Web Development Resource Kit",
      "description": "Complete toolkit for web development training",
      "price": 299,
      "image": "images/web-kit.jpg"
    },
    {
      "id": "R002",
      "unitNumber": "BSBMKG543",
      "name": "Digital Marketing Workbook",
      "description": "Comprehensive guide to digital marketing strategies",
      "price": 189,
      "image": "images/marketing-workbook.jpg"
    },
    {
      "id": "R003", 
      "unitNumber": "ICTICT451",
      "name": "Data Analysis Toolkit",
      "description": "Tools and templates for data analysis projects",
      "price": 349,
      "image": "images/data-toolkit.jpg"
    }
  ]
}
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    console.error('Error at:', e.filename, 'line:', e.lineno);
});

// 确保页面加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        createTestUsers001();
        initApp001();
    });
} else {
    createTestUsers001();
    initApp001();
}