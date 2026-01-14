document.addEventListener('DOMContentLoaded', () => {
    const orderBanner = document.querySelector('.order_banner');
    const deliveryInfoCard = document.getElementById('delivery_info_card');
    
    function renderOrder() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            orderBanner.innerHTML = '<div style="padding: 20px; text-align: center;">Your cart is empty</div>';
            if (deliveryInfoCard) {
                deliveryInfoCard.style.display = 'none';
            }
            return;
        }

        if (deliveryInfoCard) {
            deliveryInfoCard.style.display = 'flex';
        }

        const groupedCart = groupCartItems(cart);
        let grandTotal = 0;

        let orderItemsHtml = '';
        let deliveryImagesHtml = '';

        Object.values(groupedCart).forEach(item => {
            const product = item.product;
            const quantity = item.quantity;
            
            // Add product image to delivery card images
            deliveryImagesHtml += `<img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: contain; margin-right: -15px; background: white; border-radius: 5px; border: 1px solid #eee; position: relative;">`;

            // Parse discount percentage from string like "40% OFF"
            const discountPercent = parseInt(product.discount) || 0;
            const originalPrice = product.originalPrice || product.price;
            
            const itemTotalOriginal = originalPrice * quantity;
            const itemTotalDiscount = (originalPrice * (discountPercent / 100)) * quantity;
            const itemFinalPrice = itemTotalOriginal - itemTotalDiscount;
            
            grandTotal += itemFinalPrice;

            orderItemsHtml += `
                <div class="order_banner_top" style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                    <div class="order_right">
                        <div class="order_img">
                            <img src="${product.image}" alt="${product.name}" style="width: 80px; height: 80px; object-fit: contain;">
                        </div>
                        <div class="order_info">
                            <div class="order_name">${product.name} (x${quantity})</div>
                            <div class="order_des">${product.description || ''}</div>
                        </div>
                    </div>
                    <div class="order_left">
                        <div class="order_left_items">
                            <div class="left_items_right">Price:</div>
                            <div class="left_items_left">$${itemTotalOriginal.toFixed(2)}</div>
                        </div>
                        ${itemTotalDiscount > 0 ? `
                        <div class="order_left_items">
                            <div class="left_items_right">Discount:</div>
                            <div class="left_items_left">-$${itemTotalDiscount.toFixed(2)}</div>
                        </div>` : ''}
                    </div>
                </div>
            `;
        });

        // Update delivery card images and count
        if (deliveryInfoCard) {
            const takerImg = deliveryInfoCard.querySelector('.taker_img');
            const takerInfo = deliveryInfoCard.querySelector('.taker_info');
            
            if (takerImg) {
                takerImg.style.display = 'flex';
                takerImg.style.alignItems = 'center';
                takerImg.style.width = 'auto';
                takerImg.style.height = 'auto';
                takerImg.innerHTML = deliveryImagesHtml;
            }
            
            if (takerInfo) {
                const itemCount = cart.length;
                takerInfo.innerHTML = `We will deliver ${itemCount} ${itemCount === 1 ? 'item' : 'items'} tomorrow`;
            }
        }

        orderBanner.innerHTML = `
            ${orderItemsHtml}
            <div class="order_banner_bottom">
                <div class="line"></div>
                <div class="total_q">
                    <div class="total">Total:</div>
                    <div class="total_p">$${grandTotal.toFixed(2)}</div>
                </div>
            </div>
        `;
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

    renderOrder();
});
