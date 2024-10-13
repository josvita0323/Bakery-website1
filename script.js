// Cakes toggle ingredients functionality
document.addEventListener("DOMContentLoaded", function () {
    const cakes = document.querySelectorAll('.cakes');

    cakes.forEach(cake => {
        cake.addEventListener('click', function () {
            const ingredients = cake.querySelector('.ingredients');

            // Toggle visibility of ingredients
            if (ingredients.style.display === "none" || ingredients.style.display === "") {
                ingredients.style.display = "block";
            } else {
                ingredients.style.display = "none";
            }
        });
    });
});

// Slider functionality
const slides = document.querySelector('.slides');
const slideCount = document.querySelectorAll('.slide').length;
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;

// Ensure the slides element exists before applying slider logic
if (slides) {
    function showNextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateSlider();
    }

    function updateSlider() {
        slides.style.transform = `translateX(${-currentIndex * 100}%)`; // Corrected transform syntax

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    setInterval(showNextSlide, 3000);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
        });
    });
} else {
    console.error("Slides container not found.");
}

// Category Dropdown Redirect functionality
const categorySelect = document.getElementById('category-select');
if (categorySelect) {
    categorySelect.addEventListener('change', function () {
        const selectedValue = this.value;
        if (selectedValue) {
            window.location.href = selectedValue;
        }
    });
}

// Custom Cake Form Submission
const customCakeForm = document.getElementById('custom-cake-form');
if (customCakeForm) {
    customCakeForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const flavor = document.getElementById('flavor').value;
        const size = document.getElementById('size').value;
        const theme = document.getElementById('theme').value;
        const message = document.getElementById('message').value;
        const notes = document.getElementById('notes').value;

        // Basic validation
        if (!flavor || !size || !theme || !message) {
            alert('Please fill in all required fields.');
            return;
        }

        // Feedback message before redirection
        alert('Your custom cake order has been submitted!');

        // Store the data in localStorage with error handling
        try {
            localStorage.setItem('customCakeOrder', JSON.stringify({ flavor, size, theme, message, notes }));
        } catch (e) {
            console.error('Error saving data to localStorage:', e);
        }

        // Redirect to the submission confirmation page
        window.location.href = 'submit-order.html';
    });
}

// Add to Cart functionality
const addToCartButtons = document.querySelectorAll('.btn1, .btn2');  // Selecting either .btn1 or .btn2

addToCartButtons.forEach(button => {
    button.addEventListener('click', function () {
        const productElement = this.closest('.cakes');
        const productName = productElement.querySelector('.text p').textContent.trim();
        const productPrice = parseFloat(productElement.querySelector('.text p:nth-child(2)').textContent.replace('₹', '').trim());
        const productImage = productElement.querySelector('img').src;

        const cartItem = {
            name: productName,
            price: productPrice,
            imgSrc: productImage,
            quantity: 1
        };

        // Add item to cart or update quantity if it already exists
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cart.findIndex(item => item.name === cartItem.name);

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(cartItem);
        }

        // Save updated cart to localStorage with error handling
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${productName} added to cart!`);
        } catch (e) {
            console.error('Error saving cart to localStorage:', e);
        }
    });
});

// Cart display logic
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
const cartContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');

// Function to update the total price
function updateTotalPrice() {
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    if (totalPriceElement) {
        totalPriceElement.textContent = `Total: ₹${totalPrice}`;
    }
}

// Function to render the cart items
function renderCartItems() {
    if (!cartContainer) return; // Ensure cartContainer exists
    cartContainer.innerHTML = '';

    if (cartItems.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Your cart is empty';
        cartContainer.appendChild(emptyMessage);
        return;
    }

    cartItems.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');

        const img = document.createElement('img');
        img.classList.add('cart-item-img');
        img.src = item.imgSrc;
        img.alt = item.name;

        const name = document.createElement('p');
        name.textContent = item.name;

        const price = document.createElement('p');
        price.textContent = `₹${item.price}`;

        const quantity = document.createElement('p');
        quantity.textContent = `Quantity: ${item.quantity}`;

        cartItemElement.appendChild(img);
        cartItemElement.appendChild(name);
        cartItemElement.appendChild(price);
        cartItemElement.appendChild(quantity);

        cartContainer.appendChild(cartItemElement);
    });

    updateTotalPrice();
}

// Initialize the cart on page load
renderCartItems();

// Checkout button functionality
const checkoutButton = document.getElementById('checkout');
if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
        alert('Thank you for your purchase!');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });
}
