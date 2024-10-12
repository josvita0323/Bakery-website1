//

document.addEventListener("DOMContentLoaded", function() {
    const cakes = document.querySelectorAll('.cakes');

    cakes.forEach(cake => {
        cake.addEventListener('click', function() {
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

function showNextSlide() {
    currentIndex++;
    if (currentIndex >= slideCount) {
        currentIndex = 0;
    }
    updateSlider();
}

function updateSlider() {
    slides.style.transform = `translateX(${-currentIndex * 100}%)`;

    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

setInterval(showNextSlide, 3000);

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentIndex = index;
        updateSlider();
    });
});

// Category Dropdown Redirect
document.getElementById('category-select').addEventListener('change', function() {
    const selectedValue = this.value; 
    if (selectedValue) {
        window.location.href = selectedValue;  
    }
});

// Custom Cake Form Submission
document.getElementById('custom-cake-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const flavor = document.getElementById('flavor').value;
    const size = document.getElementById('size').value;
    const theme = document.getElementById('theme').value;
    const message = document.getElementById('message').value;
    const notes = document.getElementById('notes').value;

    // Feedback message before redirection
    alert('Your custom cake order has been submitted!');

    // Store the data in localStorage
    try {
        localStorage.setItem('flavor', flavor);
        localStorage.setItem('size', size);
        localStorage.setItem('theme', theme);
        localStorage.setItem('message', message);
        localStorage.setItem('notes', notes);
    } catch (e) {
        console.error('Error saving data to localStorage:', e);
    }

    // Redirect to the submission confirmation page
    window.location.href = 'submit-order.html';
});

// Add to Cart functionality
const addToCartButtons = document.querySelectorAll('.btn1.btn2');

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
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
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
    let totalPrice = 0;
    cartItems.forEach(item => {
        totalPrice += item.price * item.quantity;
    });
    totalPriceElement.textContent = `Total: ₹${totalPrice}`;
}

// Function to render the cart items
function renderCartItems() {
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
checkoutButton.addEventListener('click', () => {
    alert('Thank you for your purchase!');
    localStorage.removeItem('cart'); 
    window.location.href = 'index.html'; 
});