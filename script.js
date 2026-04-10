(function() {
    const mainApp = document.getElementById('mainApp');
    const hero = document.querySelector('.hero-section');
    const signin = document.getElementById('signin');
    const signupBtn = document.getElementById('signupBtn');
    const loginBtn = document.getElementById('loginBtn');
    const adminLink = document.getElementById('adminLink');
    const mainSignup = document.getElementById('mainSignupBtn');
    const mainLogin = document.getElementById('mainLoginBtn');
    const mainAdmin = document.getElementById('mainAdminBtn');
    const signOutBtn = document.getElementById('signOutBtn');
    const catIcons = document.getElementById('categoryIcons');
    const catContainer = document.getElementById('categoriesContainer');
    const backBtn = document.getElementById('backButton');
    const welcome = document.querySelector('.categories-welcome');
    const detailPage = document.getElementById('recipeDetailPage');
    const backToCat = document.getElementById('backToCategoryBtn');
    const detailCat = document.getElementById('detailCategory');
    const detailTitle = document.getElementById('detailTitle');
    const detailArabic = document.getElementById('detailArabic');
    const detailDesc = document.getElementById('detailDescription');
    const detailTags = document.getElementById('detailTags');
    const detailTime = document.getElementById('detailTime');
    const detailServ = document.getElementById('detailServings');
    const detailDiff = document.getElementById('detailDifficulty');
    const ingList = document.getElementById('ingredientsList');
    const instrList = document.getElementById('instructionsList');

    // ========== ADMIN AUTHENTICATION ==========
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123';
    let isAdmin = false;

    window.handleAdminLogin = function() {
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value;

        document.getElementById('adminUsernameError').innerText = '';
        document.getElementById('adminPasswordError').innerText = '';

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            isAdmin = true;
            loggedIn = true;
            user = { name: 'Admin User', isAdmin: true };
            closeModal('adminLoginModal');
            updateAuthButtons();
            showMainApp(true);
            showNotif('Welcome, Admin!');
        } else {
            document.getElementById('adminUsernameError').innerText = 'Invalid admin credentials';
        }
    };

    // ========== USER AUTHENTICATION ==========
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let loggedIn = false;
    let user = null;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,3}$/i;
    const phonePattern = /^\d{11}$/;

    window.openModal = function(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    };

    window.closeModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
        const form = document.querySelector(`#${modalId} form`);
        if (form) form.reset();
        const errors = document.querySelectorAll(`#${modalId} .error`);
        errors.forEach(e => e.innerText = '');
    };

    function validateSignup() {
        let valid = true;
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const phone = document.getElementById('signupPhone').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirm = document.getElementById('signupConfirm').value;

        document.getElementById('signupNameError').innerText = '';
        document.getElementById('signupEmailError').innerText = '';
        document.getElementById('signupPhoneError').innerText = '';
        document.getElementById('signupPasswordError').innerText = '';
        document.getElementById('signupConfirmError').innerText = '';

        if (name === '') {
            document.getElementById('signupNameError').innerText = 'Name is required.';
            valid = false;
        }
        if (!emailPattern.test(email)) {
            document.getElementById('signupEmailError').innerText = 'Invalid email format.';
            valid = false;
        }
        if (phone !== '' && !phonePattern.test(phone)) {
            document.getElementById('signupPhoneError').innerText = 'Phone must be 11 digits.';
            valid = false;
        }
        if (password.length < 6) {
            document.getElementById('signupPasswordError').innerText = 'Password must be at least 6 characters.';
            valid = false;
        }
        if (password !== confirm) {
            document.getElementById('signupConfirmError').innerText = 'Passwords do not match.';
            valid = false;
        }
        if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            document.getElementById('signupEmailError').innerText = 'Email already registered.';
            valid = false;
        }
        return valid;
    }

    window.handleSignup = function() {
        if (!validateSignup()) return;

        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim().toLowerCase();
        const phone = document.getElementById('signupPhone').value.trim() || null;
        const password = document.getElementById('signupPassword').value;

        const newUser = { name, email, phone, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        closeModal('signupModal');
        showNotif('Account created! Please log in.');
    };

    function validateLogin() {
        let valid = true;
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;

        document.getElementById('loginEmailError').innerText = '';
        document.getElementById('loginPasswordError').innerText = '';

        const foundUser = users.find(u => u.email === email && u.password === password);
        if (!foundUser) {
            document.getElementById('loginEmailError').innerText = 'Invalid email or password.';
            valid = false;
        } else {
            window.loggedInUser = foundUser;
        }
        return valid;
    }

    window.handleLogin = function() {
        if (!validateLogin()) return;

        const userData = window.loggedInUser;
        loggedIn = true;
        user = { name: userData.name, email: userData.email };
        updateAuthButtons();
        closeModal('loginModal');
        showMainApp(false);
        showNotif(`Welcome back, ${user.name}!`);
    };

    window.handleSignOut = function() {
        loggedIn = false;
        isAdmin = false;
        user = null;
        mainApp.style.display = 'none';
        hero.style.display = 'flex';
        signin.style.display = 'flex';
        detailPage.classList.remove('visible');
        catContainer.classList.remove('visible');
        welcome.style.display = 'block';
        backBtn.style.display = 'none';
        renderCategoryIcons();
        updateAuthButtons();
        showNotif('You have been signed out.');
    };

    // ========== CATEGORY DISPLAY FUNCTIONS (Placeholders) ==========
    const categories = {};

    function renderCategoryIcons() {
        let html = '';
        for (let key in categories) {
            if (categories[key]) {
                html += `<div class="category-icon-item" data-category="${key}">
                    <div class="icon-circle"><i class="${categories[key].icon}"></i></div>
                    <span>${categories[key].name}</span>
                </div>`;
            }
        }
        catIcons.innerHTML = html;
        
        document.querySelectorAll('.category-icon-item').forEach(ic => 
            ic.addEventListener('click', () => showCategory(ic.dataset.category))
        );
    }

    function showCategory(key) {
        // Will be implemented by Marcelle and others
    }

    // ========== HELPER FUNCTIONS ==========
    function updateAuthButtons() {
        if (loggedIn) {
            mainSignup.style.display = 'none';
            mainLogin.style.display = 'none';
            signOutBtn.style.display = 'inline-flex';
            if (isAdmin) {
                mainAdmin.style.display = 'none';
            } else {
                mainAdmin.style.display = 'inline-flex';
            }
        } else {
            mainSignup.style.display = 'inline-flex';
            mainLogin.style.display = 'inline-flex';
            mainAdmin.style.display = 'inline-flex';
            signOutBtn.style.display = 'none';
        }
    }

    function showMainApp(asAdmin) {
        hero.style.display = 'none';
        signin.style.display = 'none';
        mainApp.style.display = 'block';
        setTimeout(() => mainApp.style.opacity = '1', 30);
    }

    function showNotif(msg) {
        const n = document.createElement('div');
        n.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#ffd8b0;color:#4a2f1f;padding:15px 25px;border-radius:50px;box-shadow:0 5px 15px rgba(0,0,0,0.2);z-index:2000;font-weight:600;border:2px solid #ca9f7c;animation:slideIn 0.3s ease;';
        n.textContent = msg;
        document.body.appendChild(n);
        setTimeout(() => {
            n.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                if (n.parentNode) document.body.removeChild(n);
            }, 300);
        }, 3000);
    }

    // ========== EVENT LISTENERS ==========
    if (signupBtn) signupBtn.onclick = () => openModal('signupModal');
    if (loginBtn) loginBtn.onclick = () => openModal('loginModal');
    if (mainSignup) mainSignup.onclick = () => openModal('signupModal');
    if (mainLogin) mainLogin.onclick = () => openModal('loginModal');
    if (signOutBtn) signOutBtn.onclick = handleSignOut;
    if (mainAdmin) mainAdmin.onclick = () => openModal('adminLoginModal');
    if (adminLink) {
        adminLink.onclick = (e) => {
            e.preventDefault();
            openModal('adminLoginModal');
        };
    }

    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };

    // Add slideIn animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Initial UI setup
    renderCategoryIcons();
    updateAuthButtons();
})();


// ========== PASSWORD SHOW/HIDE FUNCTIONALITY ==========
function initPasswordToggles() {
    // Find all password fields
    const passwordFields = document.querySelectorAll('input[type="password"]');
    
    passwordFields.forEach(field => {
        // Skip if already has a toggle
        if (field.hasAttribute('data-toggle-initialized')) return;
        field.setAttribute('data-toggle-initialized', 'true');
        
        // Find or create wrapper
        let wrapper = field.closest('.password-field-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'password-field-wrapper';
            field.parentNode.insertBefore(wrapper, field);
            wrapper.appendChild(field);
        }
        
        // Remove existing toggle if any
        const existingToggle = wrapper.querySelector('.password-toggle-btn');
        if (existingToggle) existingToggle.remove();
        
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle-btn';
        toggleBtn.innerHTML = '<i class="far fa-eye-slash"></i>';
        toggleBtn.setAttribute('title', 'Show password');
        toggleBtn.setAttribute('aria-label', 'Show password');
        
        // Toggle function
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (field.type === 'password') {
                field.type = 'text';
                this.innerHTML = '<i class="far fa-eye"></i>';
                this.setAttribute('title', 'Hide password');
            } else {
                field.type = 'password';
                this.innerHTML = '<i class="far fa-eye-slash"></i>';
                this.setAttribute('title', 'Show password');
            }
            field.focus();
        });
        
        wrapper.appendChild(toggleBtn);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initPasswordToggles();
});

// Also initialize when modals open
const originalOpenModal = window.openModal;
window.openModal = function(modalId) {
    if (originalOpenModal) originalOpenModal(modalId);
    setTimeout(initPasswordToggles, 50);
};

// Watch for dynamically added forms
const observer = new MutationObserver(function(mutations) {
    let needsInit = false;
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1 && node.querySelector) {
                    if (node.querySelector('input[type="password"]')) {
                        needsInit = true;
                    }
                }
            });
        }
    });
    if (needsInit) {
        setTimeout(initPasswordToggles, 50);
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

window.addEventListener('load', function() {
    initPasswordToggles();
});
