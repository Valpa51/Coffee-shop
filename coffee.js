document.addEventListener('DOMContentLoaded', function() {
    initCoffeePage();
});

function initCoffeePage() {
    loadSelectedCoffee();
    
    setupSizeSelection();
    
    setupExtraSelection();

    setupMilkSelection();
    
    setupCounter();
    
    setupBackButton();
    
    setupAddToOrderButton();
    
    updateOrderCounter();
}

function loadSelectedCoffee() {
    const coffeeData = JSON.parse(localStorage.getItem('selectedCoffee'));
    
    if (!coffeeData) {
        window.location.href = 'main.html';
        return;
    }
    
    const titleElement = document.querySelector('.infoCoffee h1');
    if (titleElement) {
        titleElement.textContent = coffeeData.name;
    }
    
    const imgElement = document.querySelector('.imgCoffee img');
    if (imgElement) {
        imgElement.src = coffeeData.image;
        imgElement.alt = coffeeData.name;
    }
    
    const priceElement = document.querySelector('.selectCount p');
    if (priceElement) {
        priceElement.textContent = coffeeData.price;
        
        priceElement.dataset.basePrice = 
            coffeeData.price.replace('₹', '');
    }
}

function setupSizeSelection() {
    const sizeCards = document.querySelectorAll('.sizeCard');
    
    sizeCards.forEach(card => {
        card.addEventListener('click', function() {
            sizeCards.forEach(c => {
                c.classList.remove('selected-Size-Card');
                const button = c.querySelector('button');
                if (button) {
                    button.style.backgroundColor = '#FFFFFF';
                    button.style.border = 'none';
                }
            });
            
            this.classList.add('selected-Size-Card');
            const button = this.querySelector('button');
            if (button) {
                button.style.backgroundColor = '#AC8F64';
                button.style.border = '2px solid black';
            }
            
            updatePrice();
        });
    });
}

function setupExtraSelection() {
    const extraButtons = document.querySelectorAll('.selectExtra button');
    
    extraButtons.forEach(button => {
        button.addEventListener('click', function() {
            extraButtons.forEach(btn => {
                btn.classList.remove('selected-Extra');
                btn.style.backgroundColor = '#FFFFFF';
                btn.style.border = 'none';
            });
            
            this.classList.add('selected-Extra');
            this.style.backgroundColor = '#AC8F64';
            this.style.border = '2px solid black';
            
            updatePrice();
        });
    });
}


function setupMilkSelection() {
    const milkButtons = document.querySelectorAll('.selectMilk button');
    
    milkButtons.forEach(button => {
        button.addEventListener('click', function() {
            milkButtons.forEach(btn => {
                btn.classList.remove('selected-Extra');
                btn.style.backgroundColor = '#FFFFFF';
                btn.style.border = 'none';
            });
            
            this.classList.add('selected-Extra');
            this.style.backgroundColor = '#AC8F64';
            this.style.border = '2px solid black';
            
            updatePrice();
        });
    });
}

function setupCounter() {
    const minusBtn = document.querySelector('.count-but button[name="minus"]');
    const plusBtn = document.querySelector('.count-but button[name="plus"]');
    const countDisplay = document.querySelector('.count-but p');
    
    if (!minusBtn || !plusBtn || !countDisplay) return;
    
    let count = 1;
    
    minusBtn.addEventListener('click', function() {
        if (count > 1) {
            count--;
            countDisplay.textContent = count;
            updatePrice();
        }
    });
    
    plusBtn.addEventListener('click', function() {
        count++;
        countDisplay.textContent = count;
        updatePrice();
    });
}

function updatePrice() {
    const priceElement = document.querySelector('.selectCount p');
    if (!priceElement || !priceElement.dataset.basePrice) return;
    
    const basePrice = parseInt(priceElement.dataset.basePrice);
    let totalPrice = basePrice;
    
    const sizeCard = document.querySelector('.sizeCard.selected-Size-Card');
    if (sizeCard) {
        const sizeText = sizeCard.querySelector('p');
        if (sizeText) {
            const selectedSize = sizeText.textContent;
            switch(selectedSize) {
                case 'TALL': totalPrice += 20; break;
                case 'GRANDE': totalPrice += 30; break;
                case 'VENTI': totalPrice += 40; break;
                default: break;
            }
        }
    }
    
    const extraButton = document.querySelector('.selectExtra button.selected-Extra');
    if (extraButton && extraButton.name == 'MILK') {
        totalPrice += 15;
    }
    
    const milkButton = document.querySelector('.selectMilk button.selected-Extra');
    if (milkButton && milkButton.name != 'ALMOND-MILK') {
        totalPrice += 10;
    }
    
    const countElement = document.querySelector('.count-but p');
    if (countElement) {
        const count = parseInt(countElement.textContent) || 1;
        totalPrice *= count;
    }
    
    priceElement.textContent = `₹${totalPrice}`;
}

function setupBackButton() {
    const backButton = document.querySelector('.back-to-menu');
    
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = 'main.html';
        });
    }
}

function setupAddToOrderButton() {
    const addButton = document.querySelector('.addCoffee button[name="add"]');
    
    if (addButton) {
        addButton.addEventListener('click', function() {
            
            const coffeeData = JSON.parse(localStorage.getItem('selectedCoffee'));
            const sizeCard = document.querySelector('.sizeCard.selected-Size-Card');
            const extraButton = document.querySelector('.selectExtra button.selected-Extra');
            const milkButton = document.querySelector('.selectMilk button.selected-Extra');
            const countElement = document.querySelector('.count-but p');
            const priceElement = document.querySelector('.selectCount p');
            
            const order = {
                coffee: coffeeData,
                size: sizeCard ? sizeCard.querySelector('p').textContent : 'SHORT',
                extra: extraButton ? extraButton.name : 'SUGAR',
                milk: milkButton ? milkButton.name : 'ALMOND-MILK',
                quantity: countElement ? parseInt(countElement.textContent) : 1,
                price: priceElement ? priceElement.textContent : '₹99'
            };
            
            saveOrder(order);
            
            window.location.href = 'main.html';
        });
    }
}


function saveOrder(order) {

    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    orders.push(order);
    
    localStorage.setItem('orders', JSON.stringify(orders));
}

function updateOrderCounter() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    const counter = document.getElementById('num');
    if (counter) {
        counter.textContent = orders.length;
    }
}