import products from './products.js';
import { addToCart, toggleFavorite } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search input');
    const productsContainer = document.querySelector('.products_items'); // Assuming the first one
    const allProductContainers = document.querySelectorAll('.products_items');

    // Initial render of products if needed, or just handle search
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length > 0) {
                const filteredProducts = products.filter(p => 
                    p.name.toLowerCase().includes(searchTerm) || 
                    p.category.toLowerCase().includes(searchTerm)
                );
                renderSearchResults(filteredProducts);
            } else {
                // If search is empty, we might want to restore original view or just leave it
                // For now, let's just clear if search is empty? Or show all?
            }
        });
    }

    function renderSearchResults(filteredProducts) {
        const hotDealsSection = document.querySelector('.products_items');
        if (hotDealsSection) {
            hotDealsSection.innerHTML = filteredProducts.map(product => `
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
            hotDealsSection.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent clicking the card
                    const id = parseInt(btn.dataset.id);
                    const product = products.find(p => p.id === id);
                    addToCart(product);
                });
            });

            hotDealsSection.querySelectorAll('.item_icon').forEach(icon => {
                icon.style.cursor = 'pointer';
                icon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const card = icon.closest('.products_card');
                    const id = parseInt(card.getAttribute('onclick').match(/id=(\d+)/)[1]);
                    toggleFavorite(id);
                });
            });
        }
    }

    // Also update existing cards to be clickable
    document.querySelectorAll('.products_card').forEach((card, index) => {
        // Since original cards don't have IDs, we just map them to our dummy products for demo
        const product = products[index % products.length];
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.btn')) {
                window.location.href = `product-details.html?id=${product.id}`;
            }
        });

        const btn = card.querySelector('.btn');
        if (btn && btn.textContent.trim() === 'Tomorrow') {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(product);
            });
        }

        // Add favorite click listener
        const heartIcon = card.querySelector('.item_icon');
        if (heartIcon) {
            heartIcon.style.cursor = 'pointer';
            heartIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(product.id);
            });
        }
    });
});
