import products from './products.js';
import { addToCart } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    const product = products.find(p => p.id === productId);

    const container = document.getElementById('product-details-container');
    const relatedGrid = document.querySelector('.related-grid');
    const tabContent = document.getElementById('tab-content');
    const tabBtns = document.querySelectorAll('.tab-btn');

    const mockReviews = [
        { name: "Madina", rating: 5, date: "October 12, 2023", text: "Качество очень хорошая! Мне понравилось." },
        { name: "Mumin", rating: 4, date: "September 25, 2023", text: "Ма ша Аллах, книга очень интересная ❤️❤️❤️" },
        { name: "Nilufar", rating: 5, date: "August 30, 2023", text: "Я обещала себе оставить положительный отзыв, и сейчас исполняю свое обещание. Спасибо за очень быструю доставку!" }
    ];

    if (product) {
        document.title = `${product.name} - TechHouse`;
        const galleryImages = product.images || [product.image];

        container.innerHTML = `
            <div class="product-main-content">
                <div class="product-gallery-header">
                    <h1>${product.name}</h1>
                    <div class="header-meta">
                        <div class="stars">
                            <i class="bi bi-star-fill"></i>
                            <span class="rating-val">${product.rating}</span>
                        </div>
                        <span class="reviews-count">(${product.reviews} reviews)</span>
                        <div class="divider"></div>
                        <span class="orders-count">100+ orders</span>
                    </div>
                </div>
                
                <div class="thumbnail-list">
                    ${galleryImages.map((img, index) => `
                        <div class="thumbnail-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <img src="${img}" alt="${product.name}">
                        </div>
                    `).join('')}
                </div>
                
                <div class="main-image">
                    <img src="${galleryImages[0]}" alt="${product.name}" id="mainImgDisplay">
                </div>
            </div>

            <div class="product-sidebar">
                <div class="sidebar-price-section">
                    <span class="sidebar-price-label">BEST PRICE GUARANTEE</span>
                    <div class="sidebar-current-price">$${product.price}</div>
                    ${product.originalPrice ? `<div class="sidebar-old-price">$${product.originalPrice}</div>` : ''}
                </div>

                <div class="installment-banner">
                    <div class="installment-header">
                        <span class="installment-value">$${(product.price / 12).toFixed(2)}/mo</span>
                        <span>in installments</span>
                    </div>
                    <div style="font-size: 12px; color: #8b8e99;">Pay in 12 interest-free payments</div>
                </div>

                <div class="sidebar-actions">
                    <button class="btn-add-savat" id="addToCartBtn">Add to cart</button>
                    <button class="btn-buy-now">Buy in 1 click</button>
                </div>

                <div class="availability-info">
                    <div class="info-item">
                        <i class="bi bi-check-circle-fill"></i>
                        <span>Available: ${product.itemsLeft} items</span>
                    </div>
                    <div class="info-item">
                        <i class="bi bi-truck"></i>
                        <span>Free delivery by tomorrow</span>
                    </div>
                    <div class="info-item">
                        <i class="bi bi-shield-check"></i>
                        <span>1 year official warranty</span>
                    </div>
                </div>
            </div>
        `;

        // Default Tab Content
        renderTabContent('description', product);

        // Tab Switching Logic
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderTabContent(btn.dataset.tab, product);
            });
        });

        // Gallery Switch Logic
        const thumbnails = document.querySelectorAll('.thumbnail-item');
        const mainImgDisplay = document.getElementById('mainImgDisplay');

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = thumb.dataset.index;
                mainImgDisplay.src = galleryImages[index];
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });

        document.getElementById('addToCartBtn').addEventListener('click', () => {
            addToCart(product);
        });

        renderRecommend(product.category, product.id);
    }

    function renderTabContent(tab, product) {
        if (tab === 'description') {
            tabContent.innerHTML = `
                <div class="description-text">
                    <h3>Product Details</h3>
                    <p>${product.description}</p>
                    <ul style="margin-top: 20px; padding-left: 20px;">
                        <li>Model: ${product.name}</li>
                        <li>Origin: ${product.origin.toUpperCase()}</li>
                        <li>Color: ${product.color}</li>
                        <li>Category: ${product.category}</li>
                    </ul>
                </div>
            `;
        } else {
            tabContent.innerHTML = `
                <div class="reviews-list">
                    ${mockReviews.map(r => `
                        <div class="review-item">
                            <div class="review-header">
                                <span class="reviewer-name">${r.name}</span>
                                <span class="review-date">${r.date}</span>
                            </div>
                            <div class="stars" style="color: #ffc107; margin-bottom: 8px;">
                                ${Array(r.rating).fill('<i class="bi bi-star-fill"></i>').join('')}
                            </div>
                            <p class="review-text">${r.text}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    }

    function renderRecommend(category, currentId) {
        const related = products.filter(p => p.category === category && p.id !== currentId).slice(0, 3);
        if (related.length === 0) {
            document.getElementById('related-products-section').style.display = 'none';
            return;
        }

        relatedGrid.innerHTML = related.map(p => `
            <div class="products_card" onclick="location.href='product-details.html?id=${p.id}'" style="cursor: pointer;">
                <div class="card_img">
                    <img src="${p.image}" alt="${p.name}">
                </div>
                <div class="item_icon_group">
                    <div class="status">${p.discount || 'New'}</div>
                    <div class="item_icon"><i class="bi bi-heart"></i></div>
                </div>
                <div class="item_info">
                    <div class="item_info_title">${p.name}</div>
                    <div class="itemPriceAndRate">
                        <div class="price">$${p.price} ${p.originalPrice ? `<span class="lined">$${p.originalPrice}</span>` : ''}</div>
                        <div class="rate">
                            <div class="start_rate"><i class="bi bi-star-fill"></i></div>
                            <div class="rate_num">${p.rating}(${p.reviews})</div>
                        </div>
                    </div>
                    <div class="howManyLeft">
                        <div class="left_icon"><img src="img/check.png" alt=""></div>
                        <div class="left_info">${p.itemsLeft} items left</div>
                    </div>
                    <div class="howManyLeft">
                        <div class="left_icon"><img src="img/approved.png" alt=""></div>
                        <div class="left_info">${p.boughtThisWeek} people bought in this week</div>
                    </div>
                    <div class="item_button">
                        <button class="btn add-to-cart-btn" data-id="${p.id}">Tomorrow</button>
                    </div>
                </div>
            </div>
        `).join('');

        relatedGrid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const p = products.find(prod => prod.id === id);
                addToCart(p);
            });
        });
    }
});
