document.addEventListener('DOMContentLoaded', function() {
    initApp();
    initOrderCheckPanel();
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

function initOrderCheckPanel() {
    const orderButton = document.getElementById('check-order-status');
    const hideButton = document.querySelector('.hide');
    const orderCheckPanel = document.querySelector('.order-check');
    
    console.log('Инициализация панели заказов...');
    console.log('Кнопка:', orderButton);
    console.log('Панель:', orderCheckPanel);
    
    if (!orderButton || !orderCheckPanel) {
        console.error('Не найдены необходимые элементы!');
        return;
    }
    
    orderCheckPanel.style.display = 'none';
    orderCheckPanel.style.flexDirection = 'column';
    
    orderButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Клик на ORDER STATUS');
        
        if (orderCheckPanel.style.display === 'none' || orderCheckPanel.style.display === '') {
            console.log('Показываем панель');
            orderCheckPanel.style.display = 'flex';
            loadOrderInfo();
        } else {
            console.log('Скрываем панель');
            orderCheckPanel.style.display = 'none';
        }
    });
    
    if (hideButton) {
        hideButton.addEventListener('click', function() {
            console.log('Клик на HIDE');
            orderCheckPanel.style.display = 'none';
        });
    }
    
    document.addEventListener('click', function(e) {
        const isClickInsidePanel = orderCheckPanel.contains(e.target);
        const isClickOnOrderButton = orderButton.contains(e.target);
        
        if (!isClickInsidePanel && !isClickOnOrderButton && orderCheckPanel.style.display === 'flex') {
            console.log('Клик вне панели - скрываем');
            orderCheckPanel.style.display = 'none';
        }
    });
    
    orderCheckPanel.style.transition = 'transform 0.3s ease';
    orderCheckPanel.style.transform = 'translateX(100%)';
    
    orderButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (orderCheckPanel.style.transform === 'translateX(100%)' || 
            orderCheckPanel.style.transform === '') {
            orderCheckPanel.style.display = 'flex';
            setTimeout(() => {
                orderCheckPanel.style.transform = 'translateX(0)';
            }, 10);
            loadOrderInfo();
        } else {
            orderCheckPanel.style.transform = 'translateX(100%)';
            setTimeout(() => {
                orderCheckPanel.style.display = 'none';
            }, 300);
        }
    });
    
    if (hideButton) {
        hideButton.addEventListener('click', function() {
            orderCheckPanel.style.transform = 'translateX(100%)';
            setTimeout(() => {
                orderCheckPanel.style.display = 'none';
            }, 300);
        });
    }
}

function loadOrderInfo() {
    console.log('Загрузка информации о заказах...');
    
    const orderInfoContainer = document.querySelector('.order-info');
    if (!orderInfoContainer) {
        console.error('Не найден контейнер order-info');
        return;
    }
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    console.log('Найдено заказов:', orders.length);
    console.log('Все заказы:', orders);
    
    orderInfoContainer.innerHTML = '';
    
    if (orders.length === 0) {
        console.log('Нет заказов');
        orderInfoContainer.innerHTML = '<p style="color: #666; padding: 20px;">No orders yet</p>';
        return;
    }
    
    orders.forEach((order, index) => {
        console.log(`Обработка заказа ${index}:`, order);
        
        if (!order || !order.coffee) {
            console.error('Некорректная структура заказа:', order);
            return;
        }
        
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.style.cssText = `
            background: white;
            border-radius: 15px;
            padding: 15px;
            margin: 10px 0;
        `;
        
        const coffeeName = order.coffee.name || 'Unknown Coffee';
        const coffeeImage = order.coffee.image || 'Images/default-coffee.png';
        const coffeeSize = order.size || 'SHORT';
        const coffeeQuantity = order.quantity || 1;
        const coffeeExtra = order.extra || 'No extra';
        const coffeeMilk = order.milk || 'ALMOND-MILK';
        const coffeePrice = order.price || '₹0';
        
        orderCard.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                <div style="width: 60px; height: 60px; border-radius: 10px; overflow: hidden; background: #f0f0f0;">
                    <img src="${coffeeImage}" alt="${coffeeName}" 
                         style="width: 100%; height: 100%; object-fit: cover;"
                         onerror="this.src='Images/default-coffee.png'">
                </div>
                <div style="flex: 1;">
                    <h3 style="margin: 0; color: #483431; font-size: 18px;">${coffeeName}</h3>
                    <p style="margin: 5px 0; color: #666; font-size: 14px;">
                        Size: ${coffeeSize} | Count: ${coffeeQuantity}
                    </p>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="color: #666; font-size: 12px;">
                    <p style="margin: 2px 0;">Extra: ${coffeeExtra.replace('-', ' ')}</p>
                    <p style="margin: 2px 0;">Milk: ${coffeeMilk.replace('-', ' ')}</p>
                </div>
                <div style="font-weight: bold; color: #483431; font-size: 18px;">
                    ${coffeePrice}
                </div>
            </div>
        `;
        
        orderInfoContainer.appendChild(orderCard);
        console.log(`Карточка заказа ${index} создана`);
    });
    
    try {
        const totalAmount = orders.reduce((total, order) => {
            if (order.price) {
                const priceStr = order.price.toString();
                const priceMatch = priceStr.match(/\d+/);
                if (priceMatch) {
                    const price = parseInt(priceMatch[0]);
                    return total + (isNaN(price) ? 0 : price);
                }
            }
            return total;
        }, 0);
        
        console.log('Общая сумма:', totalAmount);
        
        if (totalAmount > 0) {
            const totalDiv = document.createElement('div');
            totalDiv.className = 'order-total';
            totalDiv.style.cssText = `
                margin-top: 20px;
                padding-top: 15px;
                border-top: 2px solid #eee;
                display: flex;
                justify-content: space-between;
                font-weight: bold;
                font-size: 20px;
                color: #483431;
            `;
            totalDiv.innerHTML = `<span>Total:</span><span>₹${totalAmount}</span>`;
            
            orderInfoContainer.appendChild(totalDiv);
        }
    } catch (error) {
        console.error('Ошибка при расчете общей суммы:', error);
    }
    
    console.log('Информация о заказах загружена');
}