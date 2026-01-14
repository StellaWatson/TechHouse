import { updateCartBadge } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    const cartProductsContainer = document.querySelector('.cart_products_items_container');
    const totalItemsBadge = document.querySelector('.cartitems');
    const subtotalDisplay = document.querySelector('.calc_subtitle .left');
    const totalDisplay = document.querySelectorAll('.calc_subtitle .left')[1];

    function renderCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        totalItemsBadge.textContent = `${cart.length} items`;

        if (!cartProductsContainer) return;
        cartProductsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartProductsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="bi bi-cart-x"></i>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <a href="products.html" class="go-shopping-btn">Explore Products</a>
                </div>
            `;
            updateSummary(0);
            return;
        }

        const groupedCart = groupCartItems(cart);
        let totalPrice = 0;

        Object.values(groupedCart).forEach(item => {
            const product = item.product;
            const quantity = item.quantity;
            totalPrice += product.price * quantity;

            const itemHtml = `
                <div class="cart_products_items" data-id="${product.id}">
                    <div class="cart_products_items_title">Delivering Tomorrow</div>
                    <div class="cart_product">
                        <div class="cart_select">
                            <input type="checkbox" checked>
                        </div>
                        <div class="cart_products_list">
                            <div class="cart_products_img" onclick="location.href='product-details.html?id=${product.id}'" style="cursor: pointer;">
                                <img src="${product.image}" alt="${product.name}">
                            </div>
                            <div class="cart_products_info">
                                <div class="product_header">
                                    <div class="product_name" onclick="location.href='product-details.html?id=${product.id}'" style="cursor: pointer;">${product.name}</div>
                                    <button class="remove-item" data-id="${product.id}"><i class="bi bi-trash"></i></button>
                                </div>
                                <div class="product_des">${product.description || 'Quality tech product'}</div>
                                <div class="delivery_more_info">
                                    <div class="quantity">
                                        <button class="decrease" data-id="${product.id}">-</button>
                                        <span class="qty-val">${quantity}</span>
                                        <button class="increase" data-id="${product.id}">+</button>
                                    </div>
                                    <div class="product_price">$${(product.price * quantity).toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cartProductsContainer.insertAdjacentHTML('beforeend', itemHtml);
        });

        updateSummary(totalPrice);
        addEventListeners();
    }

    function groupCartItems(cart) {
        return cart.reduce((acc, product) => {
            if (!acc[product.id]) {
                acc[product.id] = { product, quantity: 0 };
            }
            acc[product.id].quantity++;
            return acc;
        }, {});
    }

    function updateSummary(total) {
        if (subtotalDisplay) subtotalDisplay.textContent = `$${total.toFixed(2)}`;
        if (totalDisplay) totalDisplay.textContent = `$${total.toFixed(2)}`;
        
        // Update summary counts
        const summaryCounts = document.querySelectorAll('.calc_subtitle .right');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        summaryCounts.forEach(el => el.textContent = `Items(${cart.length})`);
    }

    function addEventListeners() {
        document.querySelectorAll('.increase').forEach(btn => {
            btn.onclick = () => {
                const id = parseInt(btn.dataset.id);
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const product = cart.find(p => p.id === id);
                cart.push(product);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                updateCartBadge();
            };
        });

        document.querySelectorAll('.decrease').forEach(btn => {
            btn.onclick = () => {
                const id = parseInt(btn.dataset.id);
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const index = cart.findLastIndex(p => p.id === id);
                if (index > -1) {
                    cart.splice(index, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                    updateCartBadge();
                }
            };
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.onclick = () => {
                const id = parseInt(btn.dataset.id);
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart = cart.filter(p => p.id !== id);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                updateCartBadge();
            };
        });
    }

    renderCart();
});
