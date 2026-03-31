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

// ========== HEALTHY RECIPES SECTION BY MARCELLE ==========
const categories = {
    healthy: { 
        name: 'Healthy', 
        icon: 'fas fa-leaf', 
        dishes: [
            { 
                name: 'Banana Oat Pancakes', 
                arabic: 'بان كيك الموز والشوفان', 
                description: 'Fluffy and healthy pancakes made with ripe bananas and oats. Naturally sweetened and gluten-free option available.',
                time: '20 min', 
                difficulty: 'Easy', 
                servings: '4 servings (8 pancakes)',
                img: 'Banana Oat Pancakes.jpeg',
                emoji: '🥞', 
                tags: ['Easy', 'Breakfast', 'Gluten-Free Option'],
                ingredients: [
                    '2 ripe bananas, mashed',
                    '1 cup rolled oats',
                    '2 eggs',
                    '1/2 cup milk (any kind)',
                    '1 tsp baking powder',
                    '1 tsp vanilla extract',
                    '1/2 tsp cinnamon',
                    'Pinch of salt',
                    'Maple syrup for serving'
                ],
                instructions: [
                    'Place oats in blender and pulse until flour-like consistency.',
                    'Add mashed bananas, eggs, milk, baking powder, vanilla, cinnamon, and salt.',
                    'Blend until smooth. Let batter rest 5 minutes.',
                    'Heat non-stick pan over medium heat, lightly grease.',
                    'Pour 1/4 cup batter for each pancake.',
                    'Cook until bubbles form, flip and cook until golden.',
                    'Serve with fresh fruit and maple syrup.'
                ]
            },
            { 
                name: 'Grilled Chicken', 
                arabic: 'دجاج مشوي', 
                description: 'Juicy and tender grilled chicken breast marinated in herbs and lemon. Perfect for a healthy protein-packed meal.',
                time: '30 min (plus marinating)', 
                difficulty: 'Easy', 
                servings: '4 servings',
                img: 'Grilled Chicken.jpeg',
                emoji: '🍗', 
                tags: ['Easy', 'Grilled', 'High Protein'],
                ingredients: [
                    '4 boneless skinless chicken breasts',
                    '3 tbsp olive oil',
                    '2 lemons, juiced',
                    '4 garlic cloves, minced',
                    '1 tbsp fresh rosemary, chopped',
                    '1 tbsp fresh thyme, chopped',
                    '1 tsp salt',
                    '1/2 tsp black pepper',
                    '1 tsp paprika'
                ],
                instructions: [
                    'In a bowl, mix olive oil, lemon juice, garlic, herbs, salt, pepper, and paprika.',
                    'Add chicken, coat well. Cover and marinate for at least 30 minutes (up to 4 hours).',
                    'Preheat grill to medium-high heat.',
                    'Grill chicken 6-7 minutes per side until cooked through.',
                    'Let rest 5 minutes before serving.',
                    'Serve with grilled vegetables or salad.'
                ]
            },
            { 
                name: 'Grilled Salmon', 
                arabic: 'سلمون مشوي', 
                description: 'Perfectly grilled salmon with a lemon-herb crust. Rich in omega-3 fatty acids and full of flavor.',
                time: '20 min', 
                difficulty: 'Easy', 
                servings: '4 servings',
                img: 'Grilled Salmon.jpeg',
                emoji: '🐟', 
                tags: ['Easy', 'Grilled', 'Omega-3'],
                ingredients: [
                    '4 salmon fillets (6 oz each)',
                    '3 tbsp olive oil',
                    '2 lemons (1 juiced, 1 sliced)',
                    '3 garlic cloves, minced',
                    '2 tbsp fresh dill, chopped',
                    '1 tbsp fresh parsley, chopped',
                    'Salt and pepper to taste'
                ],
                instructions: [
                    'Pat salmon dry with paper towels.',
                    'Mix olive oil, lemon juice, garlic, dill, parsley, salt, and pepper.',
                    'Brush mixture over salmon fillets. Let sit 10 minutes.',
                    'Preheat grill to medium-high, oil grates.',
                    'Place salmon skin-side down, grill 4-6 minutes per side.',
                    'Garnish with lemon slices and fresh herbs before serving.'
                ]
            },
            { 
                name: 'Healthy Muffins', 
                arabic: 'مفن صحي', 
                description: 'Wholesome muffins packed with bananas, oats, and blueberries. Naturally sweetened with honey.',
                time: '35 min', 
                difficulty: 'Easy', 
                servings: '12 muffins',
                img: 'Healthy Muffins.jpeg',
                emoji: '🧁', 
                tags: ['Easy', 'Baked', 'Snack'],
                ingredients: [
                    '3 ripe bananas, mashed',
                    '1/3 cup honey or maple syrup',
                    '1/4 cup coconut oil, melted',
                    '2 eggs',
                    '1 tsp vanilla extract',
                    '1 1/2 cups whole wheat flour',
                    '1 cup rolled oats',
                    '1 tsp baking soda',
                    '1 tsp baking powder',
                    '1/2 tsp salt',
                    '1 tsp cinnamon',
                    '1 cup fresh or frozen blueberries'
                ],
                instructions: [
                    'Preheat oven to 350°F and line muffin tin.',
                    'Mix mashed bananas, honey, oil, eggs, and vanilla.',
                    'In separate bowl, whisk flour, oats, baking soda, powder, salt, cinnamon.',
                    'Combine wet and dry ingredients until just mixed.',
                    'Gently fold in blueberries.',
                    'Divide batter among muffin cups.',
                    'Bake 20-25 minutes until toothpick comes out clean.',
                    'Cool 5 minutes in pan, then transfer to wire rack.'
                ]
            },
            { 
                name: 'Mushroom spinach scrambled eggs', 
                arabic: 'بيض مخفوق بالفطر والسبانخ', 
                description: 'Fluffy scrambled eggs with sautéed mushrooms and fresh spinach. A protein-rich breakfast to start your day right.',
                time: '15 min', 
                difficulty: 'Easy', 
                servings: '2 servings',
                img: 'Mushroom spinach scrambled eggs.jpeg',
                emoji: '🍳', 
                tags: ['Easy', 'High Protein', 'Low Carb'],
                ingredients: [
                    '4 large eggs',
                    '2 tbsp milk or water',
                    '1 tbsp olive oil or butter',
                    '1 cup mushrooms, sliced',
                    '2 cups fresh spinach',
                    '2 cloves garlic, minced',
                    'Salt and pepper to taste',
                    '2 tbsp grated Parmesan (optional)'
                ],
                instructions: [
                    'Whisk eggs with milk, salt, and pepper in a bowl.',
                    'Heat oil in non-stick skillet over medium heat.',
                    'Add mushrooms and cook until browned, about 3-4 minutes.',
                    'Add garlic and spinach, cook until spinach wilts.',
                    'Reduce heat to low, pour in eggs.',
                    'Gently stir with spatula until eggs are softly set.',
                    'Sprinkle with Parmesan if using.',
                    'Serve immediately with whole grain toast.'
                ]
            },
            { 
                name: 'Spinach Pesto Pasta', 
                arabic: 'باستا بالبيستو والسبانخ', 
                description: 'Quick and healthy pasta tossed in homemade spinach pesto. Packed with greens and fresh flavor.',
                time: '25 min', 
                difficulty: 'Easy', 
                servings: '4 servings',
                img: 'Spinach Pesto Pasta.jpeg',
                emoji: '🍝', 
                tags: ['Easy', 'Vegetarian', 'Quick'],
                ingredients: [
                    '12 oz whole wheat pasta',
                    '3 cups fresh spinach',
                    '1/2 cup fresh basil',
                    '1/4 cup pine nuts or walnuts',
                    '2 garlic cloves',
                    '1/2 cup olive oil',
                    '1/2 cup grated Parmesan',
                    'Salt and pepper to taste',
                    '1 lemon, juiced'
                ],
                instructions: [
                    'Cook pasta according to package directions. Reserve 1/2 cup pasta water.',
                    'In food processor, combine spinach, basil, nuts, garlic, Parmesan, and lemon juice.',
                    'Pulse while slowly adding olive oil until smooth.',
                    'Season with salt and pepper.',
                    'Drain pasta, return to pot.',
                    'Add pesto and enough pasta water to create sauce.',
                    'Toss well and serve with extra Parmesan.'
                ]
            },
            { 
                name: 'Steak', 
                arabic: 'ستيك', 
                description: 'Perfectly seared steak with garlic and rosemary. A delicious source of iron and protein.',
                time: '20 min', 
                difficulty: 'Medium', 
                servings: '2 servings',
                img: 'Steak.jpeg',
                emoji: '🥩', 
                tags: ['Medium', 'Grilled', 'High Protein'],
                ingredients: [
                    '2 ribeye or sirloin steaks (1 inch thick)',
                    '2 tbsp olive oil',
                    '2 tbsp butter',
                    '4 garlic cloves, smashed',
                    '3 sprigs fresh rosemary',
                    'Salt and coarse black pepper'
                ],
                instructions: [
                    'Remove steaks from fridge 30 minutes before cooking. Pat dry.',
                    'Season generously with salt and pepper on both sides.',
                    'Heat oil in cast iron skillet over high heat until smoking.',
                    'Place steaks in pan, cook 3-4 minutes without moving.',
                    'Flip, add butter, garlic, and rosemary.',
                    'Tilt pan and baste steaks with melted butter for 2-3 minutes.',
                    'Cook to desired doneness (125°F for medium-rare).',
                    'Rest 5-10 minutes before slicing against the grain.'
                ]
            },
            { 
                name: 'Tuna Salad', 
                arabic: 'سلطة تونة', 
                description: 'Fresh and light tuna salad with crisp vegetables and a lemon-herb dressing. Perfect for a quick lunch.',
                time: '15 min', 
                difficulty: 'Easy', 
                servings: '2 servings',
                img: 'Tuna Salad.jpeg',
                emoji: '🥗', 
                tags: ['Easy', 'No-Cook', 'High Protein'],
                ingredients: [
                    '2 cans tuna in water, drained',
                    '4 cups mixed salad greens',
                    '1 cucumber, diced',
                    '1 cup cherry tomatoes, halved',
                    '1/2 red onion, thinly sliced',
                    '1/4 cup Kalamata olives',
                    '1/4 cup feta cheese, crumbled',
                    'Dressing: 3 tbsp olive oil, 1 lemon juiced, 1 tsp Dijon, 1 tsp oregano, salt, pepper'
                ],
                instructions: [
                    'In a small bowl, whisk dressing ingredients.',
                    'In large bowl, combine greens, cucumber, tomatoes, onion, olives.',
                    'Flake tuna over the salad.',
                    'Drizzle with dressing and toss gently.',
                    'Top with feta cheese.',
                    'Serve immediately with crusty bread.'
                ]
            },
            { 
                name: 'Yogurt Granola Bowl', 
                arabic: 'وعاء زبادي بالجرانولا', 
                description: 'Creamy Greek yogurt bowl layered with crunchy granola and fresh berries. A perfect healthy breakfast or snack.',
                time: '10 min', 
                difficulty: 'Easy', 
                servings: '2 servings',
                img: 'Yogurt Granola Bowl.jpeg',
                emoji: '🥣', 
                tags: ['Easy', 'No-Cook', 'Breakfast'],
                ingredients: [
                    '2 cups Greek yogurt',
                    '1 cup granola',
                    '1 cup mixed berries (strawberries, blueberries, raspberries)',
                    '1 banana, sliced',
                    '2 tbsp honey or maple syrup',
                    '2 tbsp chia seeds',
                    'Fresh mint for garnish'
                ],
                instructions: [
                    'Divide yogurt between two bowls.',
                    'Top with granola, berries, and banana slices.',
                    'Drizzle with honey.',
                    'Sprinkle with chia seeds.',
                    'Garnish with fresh mint.',
                    'Serve immediately for crunchy granola.'
                ]
            }
        ]
    }
};


// ========== Display categories by Marcelle ==========
function displayCategories() {
    const container = document.getElementById('categoryIcons');
    if (!container) return;
    
    let html = '';
    for (let key in categories) {
        let cat = categories[key];
        html += `<div class="category-icon-item" data-category="${key}">
            <div class="icon-circle"><i class="${cat.icon}"></i></div>
            <span>${cat.name}</span>
        </div>`;
    }
    container.innerHTML = html;
    
    document.querySelectorAll('.category-icon-item').forEach(item => {
        item.addEventListener('click', function() {
            showCategory(this.dataset.category);
        });
    });
}

function showCategory(key) {
    const cat = categories[key];
    const container = document.getElementById('categoriesContainer');
    const welcome = document.querySelector('.categories-welcome');
    const backBtn = document.getElementById('backButton');
    
    if (!container || !cat) return;
    
    if (welcome) welcome.style.display = 'none';
    container.style.display = 'block';
    if (backBtn) backBtn.style.display = 'inline-flex';
    
    let html = `<div class="category-section">
        <div class="category-title"><i class="${cat.icon}"></i> ${cat.name}</div>
        <div class="recipe-grid">`;
    
    cat.dishes.forEach((dish, index) => {
        let folder = '';
        if (key === 'healthy') folder = 'Healthy/';
        else if (key === 'oriental') folder = 'Oriental/';
        else if (key === 'desserts') folder = 'Desserts/';
        else if (key === 'street') folder = 'Street Food/';
        
      
        let imageHtml;
        if (dish.img) {
            imageHtml = `<div class="recipe-img-grid" style="background-image: url('${folder}${dish.img}'); background-size: cover; background-position: center;"></div>`;
        } else {
            imageHtml = `<div class="recipe-img-grid">${dish.emoji || '🍽️'}</div>`;
        }

        html += `<div class="recipe-card-grid" data-category="${key}" data-index="${index}">
            ${imageHtml}
            <div class="recipe-info-grid">
                <div class="recipe-name-grid">${dish.name}</div>
                <div class="recipe-name-arabic">${dish.arabic}</div>
                <div class="recipe-description">${dish.description.substring(0,80)}...</div>
                <div class="recipe-meta-grid">
                    <span class="time-badge">⏱️ ${dish.time}</span>
                    <span class="difficulty-badge">⚖️ ${dish.difficulty}</span>
                </div>
                <div class="servings">${dish.servings}</div>
            </div>
        </div>`;
    });
    
    html += '</div></div>';
    container.innerHTML = html;
    
    document.querySelectorAll('.recipe-card-grid').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            const index = this.dataset.index;
            showRecipeDetail(category, parseInt(index));
        });
    });
}

function showRecipeDetail(key, index) {
    const dish = categories[key].dishes[index];
    const detailPage = document.getElementById('recipeDetailPage');
    const container = document.getElementById('categoriesContainer');
    const backBtn = document.getElementById('backButton');
    const backToCategory = document.getElementById('backToCategoryBtn');
    
    if (!detailPage || !dish) return;
    
    
    if (container) container.style.display = 'none';
    if (backBtn) backBtn.style.display = 'none';
    detailPage.style.display = 'block';
    
    
    document.getElementById('detailCategory').textContent = categories[key].name;
    document.getElementById('detailTitle').textContent = dish.name;
    document.getElementById('detailArabic').textContent = dish.arabic;
    document.getElementById('detailDescription').textContent = dish.description;
    

    let tagsHtml = '';
    dish.tags.forEach(tag => {
        tagsHtml += `<span class="tag"><i class="fas fa-tag"></i> ${tag}</span>`;
    });
    document.getElementById('detailTags').innerHTML = tagsHtml;
    
   
    document.getElementById('detailTime').textContent = dish.time;
    document.getElementById('detailServings').textContent = dish.servings;
    document.getElementById('detailDifficulty').textContent = dish.difficulty;
    
    let ingredientsHtml = '';
    dish.ingredients.forEach(ing => {
        ingredientsHtml += `<li class="ingredient-item"><i class="fas fa-circle"></i> ${ing}</li>`;
    });
    document.getElementById('ingredientsList').innerHTML = ingredientsHtml;
 
    let instructionsHtml = '';
    dish.instructions.forEach((inst, i) => {
        instructionsHtml += `<li class="instruction-item"><span class="instruction-number">${i+1}</span><span class="instruction-text">${inst}</span></li>`;
    });
    document.getElementById('instructionsList').innerHTML = instructionsHtml;
    
    if (backToCategory) {
        backToCategory.onclick = function() {
            detailPage.style.display = 'none';
            showCategory(key);
        };
    }
}

const backBtn = document.getElementById('backButton');
if (backBtn) {
    backBtn.addEventListener('click', function() {
        const container = document.getElementById('categoriesContainer');
        const welcome = document.querySelector('.categories-welcome');
        const icons = document.querySelectorAll('.category-icon-item');
        
        if (container) container.style.display = 'none';
        if (welcome) welcome.style.display = 'block';
        icons.forEach(icon => icon.style.display = 'flex');
        this.style.display = 'none';
        
        const detailPage = document.getElementById('recipeDetailPage');
        if (detailPage) detailPage.style.display = 'none';
    });
}
document.addEventListener('DOMContentLoaded', function() {
    displayCategories();
});
