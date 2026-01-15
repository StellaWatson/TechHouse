import products from './products.js';

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // Catalog / Category Dropdown
    const catalogIcons = document.querySelectorAll('.catalog');
    const categories = [
        { id: 'kitchen', name: 'Kitchen Appliances', icon: 'bi-egg-fried' },
        { id: 'smart', name: 'Smart Home', icon: 'bi-house-gear' },
        { id: 'cleaning', name: 'Cleaning', icon: 'bi-wind' },
        { id: 'heat', name: 'Heating & Cooling', icon: 'bi-thermometer-half' },
        { id: 'care', name: 'Personal Care', icon: 'bi-person-hearts' }
    ];

    catalogIcons.forEach(catalog => {
        let catDropdown = catalog.querySelector('.catalog-dropdown');
        if (!catDropdown) {
            catDropdown = document.createElement('div');
            catDropdown.className = 'catalog-dropdown';
            catDropdown.innerHTML = categories.map(cat => `
                <div class="category-dropdown-item" data-id="${cat.id}">
                    <i class="bi ${cat.icon}"></i>
                    <span>${cat.name}</span>
                </div>
            `).join('');
            catalog.appendChild(catDropdown);
        }

        catalog.addEventListener('click', (e) => {
            e.stopPropagation();
            catDropdown.classList.toggle('active');
            // Close search dropdown if open
            const searchDropdown = document.querySelector('.search-results-dropdown.active');
            if (searchDropdown) searchDropdown.classList.remove('active');
        });

        catDropdown.querySelectorAll('.category-dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const catId = item.dataset.id;
                location.href = `products.html?category=${catId}`;
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.catalog-dropdown.active, .search-results-dropdown.active').forEach(d => {
            d.classList.remove('active');
        });
    });

    // Search Functionality
    const searchInputs = document.querySelectorAll('input[placeholder="Search Products"]');
    
    searchInputs.forEach(input => {
        // Add ID if not present
        if (!input.id) input.id = 'mainSearch';
        
        const searchContainer = input.closest('.search');
        if (searchContainer) {
            // Create dropdown if it doesn't exist
            let dropdown = searchContainer.querySelector('.search-results-dropdown');
            if (!dropdown) {
                dropdown = document.createElement('div');
                dropdown.className = 'search-results-dropdown';
                input.parentElement.appendChild(dropdown);
            }

            input.addEventListener('focus', () => {
                showRecentSearches(dropdown);
            });

            input.addEventListener('input', (e) => {
                const query = e.target.value.trim().toLowerCase();
                if (query.length > 0) {
                    showProductResults(query, dropdown);
                } else {
                    showRecentSearches(dropdown);
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!searchContainer.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
        }
    });

    function showRecentSearches(dropdown) {
        const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        dropdown.innerHTML = `
            <div class="dropdown-header">
                <h3>Recently searched</h3>
                ${recentSearches.length > 0 ? '<button class="clear-history">Clear</button>' : ''}
            </div>
            <div class="recent-list">
                ${recentSearches.length > 0 ? recentSearches.map(term => `
                    <div class="search-item" data-term="${term}">
                        <div class="search-item-content">
                            <i class="bi bi-clock-history"></i>
                            <span>${term}</span>
                        </div>
                        <button class="remove-search-item" data-term="${term}">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>
                `).join('') : '<p style="color: #8b8e99; font-size: 0.9rem;">No recent searches</p>'}
            </div>
        `;
        
        dropdown.classList.add('active');

        // Add event listeners for recent items
        dropdown.querySelectorAll('.search-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.remove-search-item')) {
                    const term = item.dataset.term;
                    const input = dropdown.parentElement.querySelector('input');
                    input.value = term;
                    showProductResults(term.toLowerCase(), dropdown);
                }
            });
        });

        dropdown.querySelectorAll('.remove-search-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const term = btn.dataset.term;
                removeRecentSearch(term);
                showRecentSearches(dropdown);
            });
        });

        const clearBtn = dropdown.querySelector('.clear-history');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                localStorage.setItem('recentSearches', JSON.stringify([]));
                showRecentSearches(dropdown);
            });
        }
    }

    function showProductResults(query, dropdown) {
        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.category.toLowerCase().includes(query)
        ).slice(0, 6);

        if (filtered.length > 0) {
            dropdown.innerHTML = `
                <div class="dropdown-header">
                    <h3>Products found</h3>
                </div>
                <div class="product-results-list">
                    ${filtered.map(p => `
                        <div class="product-result-item" onclick="location.href='product-details.html?id=${p.id}'">
                            <img src="${p.image}" alt="${p.name}">
                            <div class="product-result-info">
                                <span class="product-result-name">${p.name}</span>
                                <span class="product-result-price">$${p.price}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            // Save search term to history when pressing Enter (handled via input listener or form)
            // For now, let's just show results
        } else {
            dropdown.innerHTML = `
                <div class="dropdown-header">
                    <h3>No results found</h3>
                </div>
                <p style="color: #8b8e99; font-size: 0.9rem;">Try searching for something else</p>
            `;
        }
        dropdown.classList.add('active');
    }

    function removeRecentSearch(term) {
        let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        recentSearches = recentSearches.filter(t => t !== term);
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }

    // Handle Enter key for saving search
    searchInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = input.value.trim();
                if (query.length > 0) {
                    saveRecentSearch(query);
                    // Navigate to products page with search query if needed
                    location.href = `products.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    });

    function saveRecentSearch(term) {
        let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        recentSearches = recentSearches.filter(t => t !== term);
        recentSearches.unshift(term);
        recentSearches = recentSearches.slice(0, 5); // Keep last 5
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }

    // Create overlay if it doesn't exist
    let menuOverlay = document.getElementById('menuOverlay');
    if (!menuOverlay) {
        menuOverlay = document.createElement('div');
        menuOverlay.id = 'menuOverlay';
        menuOverlay.className = 'mobile-menu-overlay';
        document.body.appendChild(menuOverlay);
    }

    if (menuToggle && mobileMenu) {
        // Open menu
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close menu function
        const closeMenuFunc = () => {
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeMenu) {
            closeMenu.addEventListener('click', closeMenuFunc);
        }
        
        menuOverlay.addEventListener('click', closeMenuFunc);

        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.header_nav ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenuFunc);
        });
    }

    // Update cart badge
    updateCartBadge();
    updateFavoriteIcons();
});

export function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.textContent = cart.length;
    });
}

export function updateFavoriteIcons() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    document.querySelectorAll('.item_icon i').forEach(icon => {
        const card = icon.closest('.products_card');
        const btn = icon.closest('.add-to-favorites-btn');
        let productId;
        
        if (card && card.dataset.id) {
            productId = parseInt(card.dataset.id);
        } else if (btn && btn.dataset.id) {
            productId = parseInt(btn.dataset.id);
        }

        if (productId) {
            if (favorites.includes(productId)) {
                icon.classList.add('favorited');
            } else {
                icon.classList.remove('favorited');
                icon.style.color = '';
            }
        }
    });
}

export function toggleFavorite(productId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.indexOf(productId);
    
    if (index === -1) {
        favorites.push(productId);
        const product = products.find(p => p.id === productId);
        console.log(`Product ${productId} added to favorites`);
    } else {
        favorites.splice(index, 1);
        console.log(`Product ${productId} removed from favorites`);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteIcons();
}

export function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    alert(`${product.name} added to cart!`);
}
