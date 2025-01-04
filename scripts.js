document.addEventListener('DOMContentLoaded', function () {
    // Handle product add alerts
    const buttons = document.querySelectorAll('.btn-danger');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const productCard = button.closest('.card');
            const productName = productCard.querySelector('.card-title').innerText;
            const productPrice = parseFloat(productCard.querySelector('.card-text').innerText.replace('₹', ''));
            const productImage = productCard.querySelector('img').src;

            addToCart(productName, productPrice, productImage);
        });
    });

    // Search button functionality
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    searchButton.addEventListener('click', function () {
        toggleSearchInput();
    });

    // Toggle search input visibility with animation
    const toggleSearchInput = function () {
        if (window.getComputedStyle(searchInput).display === 'none') {
            searchInput.style.display = 'block';
            searchInput.style.animation = 'fadeIn 0.3s ease-in-out';
        } else {
            searchInput.style.animation = 'fadeOut 0.3s ease-in-out forwards';
            setTimeout(function () {
                searchInput.style.display = 'none';
            }, 300);
        }
    };

    // Ensure search input starts hidden
    searchInput.style.display = 'none';

    // Live search functionality
    const productList = document.getElementById('product-list');
    const products = productList.getElementsByClassName('col-md-4');

    const filterProducts = function () {
        const filter = searchInput.value.trim().toLowerCase();
        Array.from(products).forEach(function (product) {
            const name = product.getAttribute('data-name').toLowerCase();
            if (name.includes(filter)) {
                product.style.display = '';
            } else {
                product.style.display = 'none';
            }
        });
    };

    // Trigger search on pressing Enter
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            filterProducts();
        }
    });

    // Live search input listener
    searchInput.addEventListener('input', filterProducts);

    // Close search input if clicked outside
    document.addEventListener('click', function (event) {
        if (!event.target.closest('#search-form')) {
            if (window.getComputedStyle(searchInput).display !== 'none') {
                searchInput.style.animation = 'fadeOut 0.3s ease-in-out forwards';
                setTimeout(function () {
                    searchInput.style.display = 'none';
                }, 300);
            }
        }
    });

    // Cart functionality
    const cartItemsContainer = document.getElementById('cart-items');
    const clearCartButton = document.getElementById('clear-cart');
    const cartTotal = document.getElementById('cart-total');

    const addToCart = function (name, price, image) {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item', 'col-md-12');

        cartItem.innerHTML = `
            <img src="${image}" alt="${name}">
            <div class="cart-item-info">
                <h4>${name}</h4>
                <p>₹<span class="item-price">${price.toFixed(2)}</span></p>
            </div>
            <div class="cart-item-quantity">
                <input type="number" class="form-control quantity-input" value="1" min="1">
            </div>
            <div class="cart-item-actions">
                <button class="btn btn-danger btn-sm remove-item">Remove</button>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);

        // Add remove item functionality
        cartItem.querySelector('.remove-item').addEventListener('click', function () {
            cartItem.remove();
            updateCartTotal();
        });

        // Update total when quantity changes
        cartItem.querySelector('.quantity-input').addEventListener('input', function () {
            updateCartTotal();
        });

        updateCartTotal();
    };

    const updateCartTotal = function () {
        let total = 0;
        const cartItems = cartItemsContainer.getElementsByClassName('cart-item');

        Array.from(cartItems).forEach(function (item) {
            const price = parseFloat(item.querySelector('.item-price').innerText);
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            total += price * quantity;
        });

        cartTotal.innerText = total.toFixed(2);
    };

    // Clear cart
    clearCartButton.addEventListener('click', function () {
        cartItemsContainer.innerHTML = '';
        updateCartTotal();
    });
});

// Submit order functionality
const submitOrderButton = document.getElementById('submit-order');

submitOrderButton.addEventListener('click', function () {
    const cartItems = cartItemsContainer.getElementsByClassName('cart-item');
    const customerName = document.getElementById('name').value; // Assuming 'name' is your input ID
    const customerEmail = document.getElementById('email').value; // Assuming 'email' is your input ID
    const customerNumber = document.getElementById('number').value; // Assuming 'number' is your input ID
    const customerMessage = document.getElementById('message').value; // Assuming 'message' is your textarea ID
    const cartTotalValue = cartTotal.innerText;

    // Prepare data to send to server
    const orderData = {
        customerName: customerName,
        customerEmail: customerEmail,
        customerNumber: customerNumber,
        customerMessage: customerMessage,
        cartTotal: cartTotalValue,
        cartItems: []
    };

    // Collect cart items data
    Array.from(cartItems).forEach(function (item) {
        const itemName = item.querySelector('.cart-item-info h4').innerText;
        const itemPrice = parseFloat(item.querySelector('.item-price').innerText);
        const itemQuantity = parseInt(item.querySelector('.quantity-input').value);

        orderData.cartItems.push({
            name: itemName,
            price: itemPrice,
            quantity: itemQuantity
        });
    });

    // Example: Send order data to server (replace with your actual endpoint)
    fetch('https://example.com/place-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    })
    .then(response => {
        if (response.ok) {
            // Handle success (e.g., show confirmation to user)
            alert('Order placed successfully!');
            cartItemsContainer.innerHTML = ''; // Clear cart after successful order
            updateCartTotal(); // Update total to zero
        } else {
            throw new Error('Failed to place order');
        }
    })
    .catch(error => {
        console.error('Error placing order:', error);
        // Handle error (e.g., show error message to user)
        alert('Failed to place order. Please try again later.');
    });
});
