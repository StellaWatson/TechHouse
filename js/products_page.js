import products from './products.js';
import { addToCart, toggleFavorite, updateFavoriteIcons } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.querySelector('.products_part .products_items');
    const productsFoundTitle = document.querySelector('.products_found_title');
    const categoryCheckboxes = document.querySelectorAll('.by_category input[type="checkbox"]');
    const priceFromInput = document.querySelector('.price_inputs .left:first-child input');
    const priceToInput = document.querySelector('.price_inputs .left:last-child input');

    let activeFilters = {
        category: [],
        origin: [],
        color: [],
        promotion: [],
        price: { min: 0, max: 1000 }
    };

    function renderProducts(filteredProducts) {
        if (!productsContainer) return;
        
        productsFoundTitle.textContent = `${filteredProducts.length} items are found`;
        
        productsContainer.innerHTML = filteredProducts.map(product => `
            <div class="products_card" onclick="location.href='product-details.html?id=${product.id}'" style="cursor: pointer;">
                <div class="card_img">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="item_icon_group">
                    <div class="status">${product.discount || 'New'}</div>
                    <div class="item_icon"><i class="bi bi-heart"></i></div>
                </div>
                <div class="item_info">
                    <div class="item_info_title">${product.name}</div>
                    <div class="itemPriceAndRate">
                        <div class="price">$${product.price} ${product.originalPrice ? `<span class="lined">$${product.originalPrice}</span>` : ''}</div>
                        <div class="rate">
                            <div class="start_rate"><i class="bi bi-star-fill"></i></div>
                            <div class="rate_num">${product.rating}(${product.reviews})</div>
                        </div>
                    </div>
                    <div class="howManyLeft">
                        <div class="left_icon"><img src="img/check.png" alt=""></div>
                        <div class="left_info">${product.itemsLeft} items left</div>
                    </div>
                    <div class="howManyLeft">
                        <div class="left_icon"><img src="img/approved.png" alt=""></div>
                        <div class="left_info">${product.boughtThisWeek} people bought in this week</div>
                    </div>
                    <div class="item_button">
                        <button class="btn add-to-cart-btn" data-id="${product.id}">Tomorrow</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners to the new buttons
        productsContainer.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const product = products.find(p => p.id === id);
                addToCart(product);
            });
        });

        productsContainer.querySelectorAll('.item_icon').forEach(icon => {
            icon.style.cursor = 'pointer';
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = icon.closest('.products_card');
                const id = parseInt(card.getAttribute('onclick').match(/id=(\d+)/)[1]);
                toggleFavorite(id);
            });
        });

        updateFavoriteIcons();
    }

    function applyFilters() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search')?.toLowerCase() || "";
        const urlCategory = urlParams.get('category');

        let filtered = products.filter(product => {
            const matchesCategory = (activeFilters.category.length === 0 && !urlCategory) || 
                                   activeFilters.category.includes(product.category) ||
                                   (urlCategory && product.category === urlCategory);
            const matchesOrigin = activeFilters.origin.length === 0 || activeFilters.origin.includes(product.origin);
            const matchesColor = activeFilters.color.length === 0 || activeFilters.color.includes(product.color);
            const matchesPromotion = activeFilters.promotion.length === 0 || activeFilters.promotion.includes(product.promotion);
            const matchesPrice = product.price >= activeFilters.price.min && product.price <= activeFilters.price.max;
            const matchesSearch = searchQuery === "" || 
                                 product.name.toLowerCase().includes(searchQuery) || 
                                 product.category.toLowerCase().includes(searchQuery);

            return matchesCategory && matchesOrigin && matchesColor && matchesPromotion && matchesPrice && matchesSearch;
        });

        renderProducts(filtered);
    }

    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const filterType = e.target.dataset.filter;
            const filterValue = e.target.id;

            if (filterType && activeFilters.hasOwnProperty(filterType)) {
                if (e.target.checked) {
                    activeFilters[filterType].push(filterValue);
                } else {
                    activeFilters[filterType] = activeFilters[filterType].filter(item => item !== filterValue);
                }
                applyFilters();
            }
        });
    });

    if (priceFromInput) {
        priceFromInput.addEventListener('input', (e) => {
            let val = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
            activeFilters.price.min = isNaN(val) ? 0 : val;
            applyFilters();
        });
    }

    if (priceToInput) {
        priceToInput.addEventListener('input', (e) => {
            let val = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
            activeFilters.price.max = isNaN(val) ? 10000 : val; // Increased max price
            applyFilters();
        });
    }

    // Initial render
    applyFilters();
});
