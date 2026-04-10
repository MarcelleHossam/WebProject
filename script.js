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

  // ========== Marcelle Healthy recipes section  ==========
    const categories = {
        healthy: { 
            name: 'Healthy', 
            icon: 'fas fa-leaf', 
            dishes: [
                { 
                    name:'Banana Oat Pancakes', 
                    arabic:'بان كيك الموز والشوفان', 
                    description:'Fluffy and healthy pancakes made with ripe bananas and oats. Naturally sweetened and gluten-free option available.',
                    time:'20 min', 
                    difficulty:'Easy', 
                    servings:'4 servings (8 pancakes)',
                    img:'Banana Oat Pancakes.jpeg',
                    emoji:'🥞', 
                    tags:['Easy','Breakfast','Gluten-Free Option'],
                    ingredients:['2 ripe bananas, mashed','1 cup rolled oats','2 eggs','1/2 cup milk (any kind)','1 tsp baking powder','1 tsp vanilla extract','1/2 tsp cinnamon','Pinch of salt','Maple syrup for serving'],
                    instructions:['Place oats in blender and pulse until flour-like consistency.','Add mashed bananas, eggs, milk, baking powder, vanilla, cinnamon, and salt.','Blend until smooth. Let batter rest 5 minutes.','Heat non-stick pan over medium heat, lightly grease.','Pour 1/4 cup batter for each pancake.','Cook until bubbles form, flip and cook until golden.','Serve with fresh fruit and maple syrup.']
                },
                { 
                    name:'Grilled Chicken', 
                    arabic:'دجاج مشوي', 
                    description:'Juicy and tender grilled chicken breast marinated in herbs and lemon. Perfect for a healthy protein-packed meal.',
                    time:'30 min (plus marinating)', 
                    difficulty:'Easy', 
                    servings:'4 servings',
                    img:'Grilled Chicken.jpeg',
                    emoji:'🍗', 
                    tags:['Easy','Grilled','High Protein'],
                    ingredients:['4 boneless skinless chicken breasts','3 tbsp olive oil','2 lemons, juiced','4 garlic cloves, minced','1 tbsp fresh rosemary, chopped','1 tbsp fresh thyme, chopped','1 tsp salt','1/2 tsp black pepper','1 tsp paprika'],
                    instructions:['In a bowl, mix olive oil, lemon juice, garlic, herbs, salt, pepper, and paprika.','Add chicken, coat well. Cover and marinate for at least 30 minutes (up to 4 hours).','Preheat grill to medium-high heat.','Grill chicken 6-7 minutes per side until cooked through.','Let rest 5 minutes before serving.','Serve with grilled vegetables or salad.']
                },
                { 
                    name:'Grilled Salmon', 
                    arabic:'سلمون مشوي', 
                    description:'Perfectly grilled salmon with a lemon-herb crust. Rich in omega-3 fatty acids and full of flavor.',
                    time:'20 min', 
                    difficulty:'Easy', 
                    servings:'4 servings',
                    img:'Grilled Salmon.jpeg',
                    emoji:'🐟', 
                    tags:['Easy','Grilled','Omega-3'],
                    ingredients:['4 salmon fillets (6 oz each)','3 tbsp olive oil','2 lemons (1 juiced, 1 sliced)','3 garlic cloves, minced','2 tbsp fresh dill, chopped','1 tbsp fresh parsley, chopped','Salt and pepper to taste'],
                    instructions:['Pat salmon dry with paper towels.','Mix olive oil, lemon juice, garlic, dill, parsley, salt, and pepper.','Brush mixture over salmon fillets. Let sit 10 minutes.','Preheat grill to medium-high, oil grates.','Place salmon skin-side down, grill 4-6 minutes per side.','Garnish with lemon slices and fresh herbs before serving.']
                },
                { 
                    name:'Healthy Muffins', 
                    arabic:'مفن صحي', 
                    description:'Wholesome muffins packed with bananas, oats, and blueberries. Naturally sweetened with honey.',
                    time:'35 min', 
                    difficulty:'Easy', 
                    servings:'12 muffins',
                    img:'Healthy Muffins.jpeg',
                    emoji:'🧁', 
                    tags:['Easy','Baked','Snack'],
                    ingredients:['3 ripe bananas, mashed','1/3 cup honey or maple syrup','1/4 cup coconut oil, melted','2 eggs','1 tsp vanilla extract','1 1/2 cups whole wheat flour','1 cup rolled oats','1 tsp baking soda','1 tsp baking powder','1/2 tsp salt','1 tsp cinnamon','1 cup fresh or frozen blueberries'],
                    instructions:['Preheat oven to 350°F and line muffin tin.','Mix mashed bananas, honey, oil, eggs, and vanilla.','In separate bowl, whisk flour, oats, baking soda, powder, salt, cinnamon.','Combine wet and dry ingredients until just mixed.','Gently fold in blueberries.','Divide batter among muffin cups.','Bake 20-25 minutes until toothpick comes out clean.','Cool 5 minutes in pan, then transfer to wire rack.']
                },
                { 
                    name:'Mushroom spinach scrambled eggs', 
                    arabic:'بيض مخفوق بالفطر والسبانخ', 
                    description:'Fluffy scrambled eggs with sautéed mushrooms and fresh spinach. A protein-rich breakfast to start your day right.',
                    time:'15 min', 
                    difficulty:'Easy', 
                    servings:'2 servings',
                    img:'Mushroom spinach scrambled eggs.jpeg',
                    emoji:'🍳', 
                    tags:['Easy','High Protein','Low Carb'],
                    ingredients:['4 large eggs','2 tbsp milk or water','1 tbsp olive oil or butter','1 cup mushrooms, sliced','2 cups fresh spinach','2 cloves garlic, minced','Salt and pepper to taste','2 tbsp grated Parmesan (optional)'],
                    instructions:['Whisk eggs with milk, salt, and pepper in a bowl.','Heat oil in non-stick skillet over medium heat.','Add mushrooms and cook until browned, about 3-4 minutes.','Add garlic and spinach, cook until spinach wilts.','Reduce heat to low, pour in eggs.','Gently stir with spatula until eggs are softly set.','Sprinkle with Parmesan if using.','Serve immediately with whole grain toast.']
                },
                { 
                    name:'Spinach Pesto Pasta', 
                    arabic:'باستا بالبيستو والسبانخ', 
                    description:'Quick and healthy pasta tossed in homemade spinach pesto. Packed with greens and fresh flavor.',
                    time:'25 min', 
                    difficulty:'Easy', 
                    servings:'4 servings',
                    img:'Spinach Pesto Pasta.jpeg',
                    emoji:'🍝', 
                    tags:['Easy','Vegetarian','Quick'],
                    ingredients:['12 oz whole wheat pasta','3 cups fresh spinach','1/2 cup fresh basil','1/4 cup pine nuts or walnuts','2 garlic cloves','1/2 cup olive oil','1/2 cup grated Parmesan','Salt and pepper to taste','1 lemon, juiced'],
                    instructions:['Cook pasta according to package directions. Reserve 1/2 cup pasta water.','In food processor, combine spinach, basil, nuts, garlic, Parmesan, and lemon juice.','Pulse while slowly adding olive oil until smooth.','Season with salt and pepper.','Drain pasta, return to pot.','Add pesto and enough pasta water to create sauce.','Toss well and serve with extra Parmesan.']
                },
                { 
                    name:'Steak', 
                    arabic:'ستيك', 
                    description:'Perfectly seared steak with garlic and rosemary. A delicious source of iron and protein.',
                    time:'20 min', 
                    difficulty:'Medium', 
                    servings:'2 servings',
                    img:'Steak.jpeg',
                    emoji:'🥩', 
                    tags:['Medium','Grilled','High Protein'],
                    ingredients:['2 ribeye or sirloin steaks (1 inch thick)','2 tbsp olive oil','2 tbsp butter','4 garlic cloves, smashed','3 sprigs fresh rosemary','Salt and coarse black pepper'],
                    instructions:['Remove steaks from fridge 30 minutes before cooking. Pat dry.','Season generously with salt and pepper on both sides.','Heat oil in cast iron skillet over high heat until smoking.','Place steaks in pan, cook 3-4 minutes without moving.','Flip, add butter, garlic, and rosemary.','Tilt pan and baste steaks with melted butter for 2-3 minutes.','Cook to desired doneness (125°F for medium-rare).','Rest 5-10 minutes before slicing against the grain.']
                },
                { 
                    name:'Tuna Salad', 
                    arabic:'سلطة تونة', 
                    description:'Fresh and light tuna salad with crisp vegetables and a lemon-herb dressing. Perfect for a quick lunch.',
                    time:'15 min', 
                    difficulty:'Easy', 
                    servings:'2 servings',
                    img:'Tuna Salad.jpeg',
                    emoji:'🥗', 
                    tags:['Easy','No-Cook','High Protein'],
                    ingredients:['2 cans tuna in water, drained','4 cups mixed salad greens','1 cucumber, diced','1 cup cherry tomatoes, halved','1/2 red onion, thinly sliced','1/4 cup Kalamata olives','1/4 cup feta cheese, crumbled','Dressing: 3 tbsp olive oil, 1 lemon juiced, 1 tsp Dijon, 1 tsp oregano, salt, pepper'],
                    instructions:['In a small bowl, whisk dressing ingredients.','In large bowl, combine greens, cucumber, tomatoes, onion, olives.','Flake tuna over the salad.','Drizzle with dressing and toss gently.','Top with feta cheese.','Serve immediately with crusty bread.']
                },
                { 
                    name:'Yogurt Granola Bowl', 
                    arabic:'وعاء زبادي بالجرانولا', 
                    description:'Creamy Greek yogurt bowl layered with crunchy granola and fresh berries. A perfect healthy breakfast or snack.',
                    time:'10 min', 
                    difficulty:'Easy', 
                    servings:'2 servings',
                    img:'Yogurt Granola Bowl.jpeg',
                    emoji:'🥣', 
                    tags:['Easy','No-Cook','Breakfast'],
                    ingredients:['2 cups Greek yogurt','1 cup granola','1 cup mixed berries (strawberries, blueberries, raspberries)','1 banana, sliced','2 tbsp honey or maple syrup','2 tbsp chia seeds','Fresh mint for garnish'],
                    instructions:['Divide yogurt between two bowls.','Top with granola, berries, and banana slices.','Drizzle with honey.','Sprinkle with chia seeds.','Garnish with fresh mint.','Serve immediately for crunchy granola.']
                }
            ]
        },
          // ========== Mark Oriental recipes section  =========
        oriental: { 
            name: 'Oriental', 
            icon: 'fas fa-utensils', 
            dishes: [
                { 
                    name:'Fattah', 
                    arabic:'فتة', 
                    description:'Layers of rice, crispy bread, and tender meat with garlic vinegar and tomato sauce. A celebratory dish often served during Ramadan and special occasions.',
                    time:'50 min', 
                    difficulty:'Medium', 
                    servings:'8 servings',
                    img:'Fattah.jpeg',
                    emoji:'🍲', 
                    tags:['Medium','Oriental','Celebration'],
                    ingredients:['2 cups Egyptian rice','4 pita bread, toasted and broken','500g lamb or beef, cooked and shredded','4 garlic cloves, minced','1/4 cup vinegar','2 cups tomato sauce','1 tsp cumin','Salt and pepper','2 tbsp ghee or butter','Broth from cooking meat'],
                    instructions:['Cook meat with salt, pepper, and spices until tender. Reserve broth.','Cook rice in meat broth until fluffy.','In a pan, sauté garlic in ghee until fragrant, add vinegar and simmer.','In serving dish, layer broken pita, then rice, then meat.','Pour garlic-vinegar mixture over.','Heat tomato sauce with cumin and pour on top.','Garnish with fried nuts and parsley. Serve hot.']
                },
                { 
                    name:'Golash', 
                    arabic:'جولاش', 
                    description:'Layers of thin phyllo dough filled with spiced minced meat, baked until golden and crispy, then soaked in sweet syrup.',
                    time:'60 min', 
                    difficulty:'Hard', 
                    servings:'10 pieces',
                    img:'Golash.jpeg',
                    emoji:'🥟', 
                    tags:['Hard','Oriental','Savory-Sweet'],
                    ingredients:['1 package phyllo dough','500g ground beef or lamb','1 large onion, finely chopped','1 tsp cinnamon','1/2 tsp allspice','Salt and pepper','1/2 cup walnuts or pine nuts','1 cup butter, melted','Syrup: 2 cups sugar, 1 cup water, 1 lemon juice, 1 tsp rose water'],
                    instructions:['Prepare syrup: boil sugar, water, lemon for 10 minutes, add rose water, cool.','Sauté onion, add meat and spices, cook until browned. Stir in nuts.','Layer phyllo in buttered pan, brushing each layer with butter.','Spread meat mixture, cover with more buttered phyllo layers.','Cut into squares or rectangles before baking.','Bake at 350°F for 35-40 minutes until golden.','Pour cold syrup over hot golash. Let absorb before serving.']
                },
                { 
                    name:'Hamam Mahshi', 
                    arabic:'حمام محشي', 
                    description:'Pigeon stuffed with spiced freekeh or rice, a traditional Egyptian delicacy served on special occasions.',
                    time:'75 min', 
                    difficulty:'Hard', 
                    servings:'4 servings',
                    img:'Hamam Mahshi.jpeg',
                    emoji:'🕊️', 
                    tags:['Hard','Oriental','Special Occasion'],
                    ingredients:['4 pigeons, cleaned','1 cup freekeh or rice','1 onion, finely chopped','1/4 cup ghee or butter','1 tsp cinnamon','1 tsp allspice','Salt and pepper','2 cups chicken broth','1/2 cup nuts for garnish'],
                    instructions:['Rinse pigeons and pat dry.','Cook freekeh with half the broth and spices until partially done.','Stuff pigeons with freekeh mixture, secure openings.','Brown pigeons in ghee on all sides.','Add remaining broth, cover and simmer for 45-60 minutes until tender.','Remove pigeons, strain broth for sauce.','Serve pigeons on a bed of extra freekeh, drizzle with broth, garnish with nuts.']
                },
                { 
                    name:'Hawawshi', 
                    arabic:'حواوشي', 
                    description:'Spiced minced meat stuffed in pita bread and baked until crispy. A popular Egyptian street food and comfort food.',
                    time:'35 min', 
                    difficulty:'Medium', 
                    servings:'6 servings',
                    img:'Hawawshi.jpeg',
                    emoji:'🥙', 
                    tags:['Medium','Oriental','Savory'],
                    ingredients:['500g ground beef or lamb','1 large onion, grated','2 bell peppers, finely minced','3 garlic cloves, minced','1 tsp cumin','1 tsp paprika','1/2 tsp cayenne (optional)','Salt and pepper','6 large pita breads','Butter or oil for brushing'],
                    instructions:['Mix meat, onion, peppers, garlic, and spices thoroughly.','Cut pita in half to create pockets.','Stuff each pocket with meat mixture, spread evenly.','Press gently to flatten.','Brush outsides with butter or oil.','Place on baking sheet, bake at 375°F for 20-25 minutes until meat is cooked and bread is crispy.','Serve hot with tahini sauce or yogurt.']
                },
                { 
                    name:'Kofta', 
                    arabic:'كفتة', 
                    description:'Grilled minced meat skewers seasoned with onions, parsley, and aromatic spices. A Middle Eastern classic.',
                    time:'30 min (plus resting)', 
                    difficulty:'Easy', 
                    servings:'4 servings',
                    img:'Kofta.jpeg',
                    emoji:'🍢', 
                    tags:['Easy','Oriental','Grilled'],
                    ingredients:['500g ground beef or lamb','1 large onion, grated','1/4 cup fresh parsley, finely chopped','1 tsp cumin','1 tsp paprika','1/2 tsp cinnamon','1/2 tsp allspice','Salt and pepper','Skewers (metal or wooden soaked)'],
                    instructions:['Combine all ingredients in a bowl, mix well with hands.','Cover and refrigerate for at least 1 hour.','Divide mixture, shape around skewers in long oval shapes.','Preheat grill or grill pan to medium-high.','Grill kofta 4-5 minutes per side until cooked through.','Serve with pita, grilled vegetables, and tahini sauce.']
                },
                { 
                    name:'Macrona Bashamel', 
                    arabic:'مكرونة بشاميل', 
                    description:'Egyptian baked pasta with layers of spiced meat and creamy béchamel sauce. A beloved comfort food.',
                    time:'60 min', 
                    difficulty:'Medium', 
                    servings:'8 servings',
                    img:'Macrona Bashamel.jpeg',
                    emoji:'🍝', 
                    tags:['Medium','Oriental','Baked'],
                    ingredients:['500g penne or any pasta','500g ground beef','1 onion, chopped','2 cups tomato sauce','1 tsp cumin','1 tsp paprika','Salt and pepper','For béchamel: 4 cups milk, 4 tbsp butter, 4 tbsp flour, 1/2 tsp nutmeg, salt, pepper','1 egg (optional, for béchamel)'],
                    instructions:['Cook pasta according to package, drain.','Brown meat with onion, add tomato sauce and spices, simmer.','Make béchamel: melt butter, add flour, whisk 2 minutes. Gradually add milk, whisk until thick. Season with nutmeg, salt, pepper. Optional: beat egg and stir into cooled béchamel.','In baking dish, layer half pasta, all meat, remaining pasta.','Pour béchamel over, spread evenly.','Bake at 375°F for 30-35 minutes until golden.','Let rest 10 minutes before serving.']
                },
                { 
                    name:'Molokhia', 
                    arabic:'ملوخية', 
                    description:'Rich green soup made from finely chopped jute leaves, served with rice and chicken or rabbit. A Egyptian national dish.',
                    time:'40 min', 
                    difficulty:'Medium', 
                    servings:'6 servings',
                    img:'Molokhia.jpeg',
                    emoji:'🥬', 
                    tags:['Medium','Oriental','Traditional'],
                    ingredients:['500g frozen molokhia (jute leaves), finely chopped','4 chicken pieces or rabbit','8 cups chicken broth','6 garlic cloves, minced','2 tbsp dried coriander','2 tbsp ghee or butter','Salt and pepper','2 cups white rice for serving'],
                    instructions:['Cook chicken in broth until tender. Remove chicken, shred meat, reserve broth.','Bring broth to boil, add frozen molokhia. Stir well.','In separate pan, fry garlic in ghee until golden, add coriander.','Pour garlic mixture into soup, simmer 5-10 minutes. Do not overcook.','Serve hot in bowls over rice, with chicken on side.','Optional: add a squeeze of lemon.']
                },
                { 
                    name:'Sheesh Tawook', 
                    arabic:'شيش طاووق', 
                    description:'Marinated chicken skewers grilled to perfection. A popular Middle Eastern street food and barbecue favorite.',
                    time:'30 min (plus marinating)', 
                    difficulty:'Easy', 
                    servings:'4 servings',
                    img:'Sheesh Tawook.jpeg',
                    emoji:'🍗', 
                    tags:['Easy','Oriental','Grilled'],
                    ingredients:['600g chicken breast, cubed','1 cup yogurt','3 garlic cloves, minced','2 tbsp lemon juice','2 tbsp olive oil','1 tsp paprika','1 tsp oregano','1/2 tsp cinnamon','Salt and pepper','Bell peppers and onions for skewering'],
                    instructions:['Mix yogurt, garlic, lemon, oil, and spices.','Add chicken, coat well. Marinate at least 4 hours or overnight.','Thread chicken onto skewers alternating with peppers and onions.','Preheat grill to medium-high.','Grill 5-7 minutes per side until chicken is cooked.','Serve with garlic sauce, pita, and grilled vegetables.']
                },
                { 
                    name:'Wara Enab', 
                    arabic:'ورق عنب', 
                    description:'Grape leaves stuffed with herbed rice and simmered in lemon-olive oil broth. A labor of love and a Mediterranean favorite.',
                    time:'90 min', 
                    difficulty:'Hard', 
                    servings:'6 servings',
                    img:'Wara Enab.jpeg',
                    emoji:'🍃', 
                    tags:['Hard','Oriental','Vegetarian Option'],
                    ingredients:['1 jar grape leaves (about 40-50 leaves)','2 cups short grain rice, rinsed','1 large onion, finely chopped','1/2 cup fresh parsley, chopped','1/4 cup fresh mint, chopped','1 tsp cinnamon','1 tsp allspice','Salt and pepper','1/2 cup olive oil','3 lemons, juiced','2 cups vegetable or chicken broth'],
                    instructions:['Rinse grape leaves, trim stems. Blanch in hot water if needed.','Mix rice, onion, herbs, spices, salt, pepper, and half the oil.','Place a leaf shiny side down, put small amount of filling near stem.','Fold sides over filling, roll tightly like a cigar.','Line pot with broken leaves, layer stuffed leaves snugly.','Pour remaining oil, lemon juice, and broth over.','Place an inverted plate on top to weigh down.','Simmer covered for 45-60 minutes until rice is cooked.','Let rest before serving. Serve with yogurt.']
                }
            ]
        },
        
