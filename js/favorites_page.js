import products from './products.js';
import { toggleFavorite, addToCart } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    renderFavorites();
});

function renderFavorites() {
    const favoritesContainer = document.querySelector('.products_items');
    if (!favoritesContainer) return;

    const favoriteIds = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteProducts = products.filter(p => favoriteIds.includes(p.id));

    if (favoriteProducts.length === 0) {
        favoritesContainer.innerHTML = `
            <div style="width: 100%; text-align: center; padding: 3rem; grid-column: 1 / -1;">
                <i class="bi bi-heart" style="font-size: 4rem; color: #ccc;"></i>
                <h2 style="margin-top: 1rem; color: #666;">No favorites yet</h2>
                <p style="color: #999;">Start adding products you love!</p>
                <a href="products.html" class="view_products" style="margin-top: 1.5rem; display: inline-block; padding: 10px 30px; border: 1px solid var(--main-color); border-radius: 8px; color: var(--main-color); font-weight: 600;">Go Shopping</a>
            </div>
        `;
        return;
    }

    favoritesContainer.innerHTML = favoriteProducts.map(product => `
        <div class="products_card" data-id="${product.id}" onclick="location.href='product-details.html?id=${product.id}'" style="cursor: pointer;">
            <div class="card_img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="item_icon_group">
                <div class="status">${product.discount || 'New'}</div>
                <div class="item_icon add-to-favorites-btn" data-id="${product.id}">
                    <i class="bi bi-heart-fill" style="color: #ff4d4d;"></i>
                </div>
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

    // Add event listeners
    favoritesContainer.querySelectorAll('.add-to-favorites-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            toggleFavorite(id);
            renderFavorites(); // Re-render the page
        });
    });

    favoritesContainer.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const product = products.find(p => p.id === id);
            addToCart(product);
        });
    });
}
