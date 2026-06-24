// 1. PRODUCT DATABASE (Simulated local backend data)
const products = [
    { id: 1, name: "Oversize Hoodie Black", price: 290, category: "hoodie", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600" },
    { id: 2, name: "Cargo Pants v2 Ashen", price: 340, category: "pants", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600" },
    { id: 3, name: "Cyber Armor Boots", price: 520, category: "boots", img: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600" },
    { id: 4, name: "Crop Hoodie Ghost-White", price: 260, category: "hoodie", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600" },
    { id: 5, name: "Techwear Cargo Black", price: 390, category: "pants", img: "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?q=80&w=600" }
];

// Array to hold user selected products
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    // DOM Element Node Selectors
    const catalogGrid = document.getElementById('catalog-grid');
    const filterButtons = document.querySelectorAll('.btn-filter');
    const sortSelect = document.getElementById('sort-select');
    
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartCountBadge = document.getElementById('cart-count');

    // 2. PRODUCT RENDER ENGINE
    function renderProducts(productsToRender) {
        catalogGrid.innerHTML = ''; // Wipe out existing DOM cards
        
        if(productsToRender.length === 0) {
            catalogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#555;">No items found in this category</p>';
            return;
        }

        // Loop through data array and build dynamic structural HTML nodes
        productsToRender.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.innerHTML = `
                <img src="${product.img}" alt="${product.name}" class="product-img">
                <h3>${product.name}</h3>
                <p>$${product.price.toLocaleString()}</p>
                <button class="btn-add-to-cart" data-id="${product.id}">Add to Cart</button>
            `;
            catalogGrid.appendChild(card);
        });

        // Attach event listeners to newly mounted add-to-cart action triggers
        const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
        addToCartButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                addToCart(id);
            });
        });
    }

    // 3. RUNTIME FILTER & SORTING ARCHITECTURE
    let currentCategory = 'all';

    function filterAndSort() {
        // Apply filter validation routines
        let filtered = products;
        if (currentCategory !== 'all') {
            filtered = products.filter(p => p.category === currentCategory);
        }

        // Apply sorting execution routines
        const sortValue = sortSelect.value;
        if (sortValue === 'cheap') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'expensive') {
            filtered.sort((a, b) => b.price - a.price);
        }

        renderProducts(filtered);
    }

    // Handle interactive state toggles on active filter controls
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            currentCategory = e.target.getAttribute('data-category');
            filterAndSort();
        });
    });

    // Fire sorting adjustment workflows on selector change
    sortSelect.addEventListener('change', filterAndSort);

    // 4. BUSINESS LOGIC RUNTIME FOR CART
    
    // Toggle sidebar visibility animations
    cartBtn.addEventListener('click', () => cartSidebar.classList.add('active'));
    closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('active'));

    // Inject data structures into internal local cart array
    function addToCart(id) {
        const product = products.find(p => p.id === id);
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1; // Increment quantitative entity tracking variables
        } else {
            cart.push({ ...product, quantity: 1 }); // Push fresh object slice copy
        }
        
        updateCart();
    }

    // Splice targeted nodes out of the matching array reference
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }

    // Sync state computations directly into user viewport elements
    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;
            count += item.quantity;

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toLocaleString()} × ${item.quantity}</p>
                </div>
                <button class="btn-remove" data-id="${item.id}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Mutate numeric data badges and price counters
        cartCountBadge.textContent = count;
        cartTotalPrice.textContent = total.toLocaleString();

        // Attach event handlers on remove action nodes
        const removeButtons = document.querySelectorAll('.btn-remove');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                removeFromCart(id);
            });
        });
    }

    // Simulate final checkout workflow sequences
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if(cart.length === 0) {
            alert('Your cart is empty');
            return;
        }
        alert('Order placed successfully! Our manager will contact you soon.');
        cart = []; // Reset local memory tracking structures
        updateCart();
        cartSidebar.classList.remove('active'); // Close panel view
    });

    // Boot initialize product catalog display on page ready lifecycle event
    renderProducts(products);
});