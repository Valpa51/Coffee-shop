document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    initSliderImages();;
    renderCoffeeCards('cappuccino');
    setupSliderHandlers();
    setupArrowHandlers();
    setupSearchHandler();
    setupAddToCartHandlers();
    
    loadOrderCounter();
}

function loadOrderCounter() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const counter = document.getElementById('num');
    
    if (counter) {
        counter.textContent = orders.length;
    }
}

function initSliderImages() {
    const sliderCards = document.querySelectorAll('.slider-card');
    
    sliderCards.forEach(card => {
        const coffeeType = card.dataset.coffee;
        if (coffeeType && coffeeData[coffeeType]) {
            const img = document.createElement('img');
            img.src = coffeeData[coffeeType].image;
            img.alt = coffeeData[coffeeType].name;
            
            card.insertBefore(img, card.firstChild);
        }
    });
}

function renderCoffeeCards(coffeeType) {
    const coffee = coffeeData[coffeeType];
    const container = document.getElementById('coffeeCardsContainer');
    
    if (!coffee || !container) return;
    
    currentCoffeeType = coffeeType;
    
    container.innerHTML = '';
    
    coffee.items.forEach(item => {
        const cardHTML = createCardHTML(item);
        container.innerHTML += cardHTML;
    });
    
    updateActiveSlide(coffeeType);
    
    setupAddToCartHandlers();
}

function createCardHTML(item) {
    return `
        <div class="card" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <p>${item.name}</p>
            <div class="instruments">
                <p>${item.price}</p>
                <div class="plus">
                    <button type="button" name="${item.buttonName}">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M1.30038 9.10202H14.3041C15.0219 9.10202 15.6045 8.51945 15.6045 7.80164C15.6045 7.08384 15.0219 6.50127 14.3041 6.50127H1.30038C0.582568 6.50127 0 7.08384 0 7.80164C0 8.51945 0.582568 9.10202 1.30038 9.10202Z"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.10301 14.3041V1.30038C9.10301 0.582568 8.52044 0 7.80263 0C7.08483 0 6.50226 0.582568 6.50226 1.30038V14.3041C6.50226 15.0219 7.08483 15.6045 7.80263 15.6045C8.52044 15.6045 9.10301 15.0219 9.10301 14.3041Z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}


function setupSliderHandlers() {
    const sliderCards = document.querySelectorAll('.slider-card');
    
    sliderCards.forEach(card => {
        card.addEventListener('click', function() {
            const coffeeType = this.dataset.coffee;
            if (coffeeType) {
                renderCoffeeCards(coffeeType);
            }
        });
    });
}

function setupArrowHandlers() {
    const prevArrow = document.querySelector('.prev-slider');
    const nextArrow = document.querySelector('.next-slider');
    
    if (prevArrow) {
        prevArrow.addEventListener('click', showPreviousCoffee);
    }
    
    if (nextArrow) {
        nextArrow.addEventListener('click', showNextCoffee);
    }
}

function showPreviousCoffee() {
    const coffeeTypes = Object.keys(coffeeData);
    const currentIndex = coffeeTypes.indexOf(currentCoffeeType);
    const prevIndex = (currentIndex - 1 + coffeeTypes.length) % coffeeTypes.length;
    
    renderCoffeeCards(coffeeTypes[prevIndex]);
}

function showNextCoffee() {
    const coffeeTypes = Object.keys(coffeeData);
    const currentIndex = coffeeTypes.indexOf(currentCoffeeType);
    const nextIndex = (currentIndex + 1) % coffeeTypes.length;
    
    renderCoffeeCards(coffeeTypes[nextIndex]);
}


function updateActiveSlide(coffeeType) {
    const allSlides = document.querySelectorAll('.slider-card');
    allSlides.forEach(slide => {
        slide.classList.remove('active');
        
        const img = slide.querySelector('img');
        const text = slide.querySelector('p');
        
        if (img) img.style.backgroundColor = '#FFFFFF';
        if (text) text.style.backgroundColor = '#FFFFFF';
        slide.style.backgroundColor = '#FFFFFF';
        slide.style.border = 'none';
    });
    
    const activeSlide = document.querySelector(`.slider-card[data-coffee="${coffeeType}"]`);
    if (activeSlide) {
        activeSlide.classList.add('active');
        
        const img = activeSlide.querySelector('img');
        const text = activeSlide.querySelector('p');
        
        if (img) img.style.backgroundColor = '#AC8F64';
        if (text) {
            text.style.backgroundColor = '#AC8F64';
            text.style.color = '#483431';
        }
        activeSlide.style.backgroundColor = '#AC8F64';
        activeSlide.style.border = '2px solid #000000';
    }
}

function setupAddToCartHandlers() {
    const addButtons = document.querySelectorAll('.plus button');
    
    addButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const card = this.closest('.card');
            const coffeeId = card.dataset.id;
            const coffeeName = card.querySelector('p').textContent;
            const coffeePrice = card.querySelector('.instruments p').textContent;
            const coffeeImage = card.querySelector('img').src;
            
            goToCoffeeSelection({
                id: coffeeId,
                name: coffeeName,
                price: coffeePrice,
                image: coffeeImage,
                type: currentCoffeeType
            });
        });
    });
}

function goToCoffeeSelection(coffeeData) {
    
    localStorage.setItem('selectedCoffee', JSON.stringify(coffeeData));
    
    window.location.href = 'coffee.html';
}


function addToCart(itemName) {
    console.log(`Товар добавлен в корзину: ${itemName}`);
    
    updateCartCounter();
}

function updateCartCounter() {
    const cartCounter = document.getElementById('num');
    if (cartCounter) {
        let currentCount = parseInt(cartCounter.textContent) || 0;
        cartCounter.textContent = currentCount + 1;
    }
}


function setupSearchHandler() {
    const searchInput = document.querySelector('#coffee');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            filterCoffeeCards(e.target.value.toLowerCase());
        });
    }
}


function filterCoffeeCards(searchTerm) {
    const currentCoffee = coffeeData[currentCoffeeType];
    if (!currentCoffee) return;
    
    const container = document.getElementById('coffeeCardsContainer');
    container.innerHTML = '';
    
    const filteredItems = currentCoffee.items.filter(item => 
        item.name.toLowerCase().includes(searchTerm)
    );
    
    if (filteredItems.length == 0) {
        container.innerHTML = '<p class="no-results">Ничего не найдено</p>';
        return;
    }
    
    filteredItems.forEach(item => {
        const cardHTML = createCardHTML(item, currentCoffeeType);
        container.innerHTML += cardHTML;
    });
    
    setupAddToCartHandlers();
}