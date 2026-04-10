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
    const detailFavBtn = document.getElementById('detailFavoriteBtn');
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
    const commentForm = document.getElementById('commentForm');
    const commentText = document.querySelector('#commentForm textarea');
    const postComment = document.getElementById('postCommentBtn');
    const signInLink = document.getElementById('signInToComment');
    const loginPrompt = document.getElementById('loginPrompt');
    const commentsDiv = document.getElementById('commentsList');
    const commentCount = document.getElementById('commentCount');
    const favBtn = document.getElementById('favoritesBtn');
    const favDropdown = document.getElementById('favoritesDropdown');
    const favList = document.getElementById('favoritesList');
    const favCount = document.getElementById('favoritesCount');
    const clearFav = document.getElementById('clearFavorites');
    const editRecipeBtn = document.getElementById('editRecipeBtn');
    const deleteRecipeBtn = document.getElementById('deleteRecipeBtn');
    const adminRecipeActions = document.getElementById('adminRecipeActions');

    // Admin Panel Elements
    const adminPanel = document.getElementById('adminPanel');
    const closeAdminBtn = document.getElementById('closeAdminBtn');
    const adminTabs = document.querySelectorAll('.admin-tab');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const addRecipeBtn = document.getElementById('addRecipeBtn');
    const recipeCategoryFilter = document.getElementById('recipeCategoryFilter');
    const commentRecipeFilter = document.getElementById('commentRecipeFilter');
    const categoryModal = document.getElementById('categoryModal');
    const recipeModal = document.getElementById('recipeModal');
    const categoryForm = document.getElementById('categoryForm');
    const recipeForm = document.getElementById('recipeForm');
    const adminLoginModal = document.getElementById('adminLoginModal');

    
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
            updateCommentForm();
            updateAuthButtons();
            showMainApp(true);
            showAdminPanel();
            showNotif('Welcome, Admin!');
        } else {
            document.getElementById('adminUsernameError').innerText = 'Invalid admin credentials';
        }
    };

    function showAdminPanel() {
        if (!isAdmin) return;
        adminPanel.style.display = 'block';
        loadAdminCategories();
        loadAdminRecipes();
        loadAdminComments();
        updateCategoryFilter();
        updateCommentRecipeFilter();
    }

    function hideAdminPanel() {
        adminPanel.style.display = 'none';
    }

    // ========== USER AUTHENTICATION ==========
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let loggedIn = false;
    let user = null;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,3}$/i;
    const phonePattern = /^\d{11}$/;

    window.openModal = function(modalId) {
        document.getElementById(modalId).style.display = 'flex';
        setTimeout(function() {
            initPasswordToggles();
        }, 150);
    };

    window.closeModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
        const form = document.querySelector(#${modalId} form);
        if (form) form.reset();
        const errors = document.querySelectorAll(#${modalId} .error);
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
        updateCommentForm();
        updateAuthButtons();
        closeModal('loginModal');
        showMainApp(false);
        showNotif(Welcome back, ${user.name}!);
        updateFavDisplay();
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
        adminPanel.style.display = 'none';
        hideAdminRecipeActions();
        renderCategoryIcons();
        updateCommentForm();
        updateAuthButtons();
        showNotif('You have been signed out.');
    };
