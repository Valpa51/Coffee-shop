document.addEventListener('DOMContentLoaded', function() {
    initCoffeePage();
    initOrderCheckPanel();
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

    updatePrice();
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

    else if (extraButton && extraButton.name == 'SUGAR') {
        totalPrice += 5;
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
    
    const savedOrder = {
        coffee: order.coffee,
        size: order.size,
        extra: order.extra,
        milk: order.milk,
        quantity: order.quantity,
        price: order.price
    };
    
    orders.push(savedOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    console.log('Заказ сохранен:', savedOrder);
    updateOrderCounter();
}

function updateOrderCounter() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const counter = document.getElementById('num');
    
    if (counter) {
        counter.textContent = orders.length;
        
        counter.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            width: 38px;
            height: 38px;
            font-size: 30px;
            background-color: ${orders.length > 0 ? '#CD4126CC' : '#AC8F64'};
            border-radius: 50%;
            color: #FFFFFF;
        `;
    }
}

// function updateCheckOrder() {
//     const orderButton = document.querySelector('#check-order-status');
//     const container_info = document.querySelector('.order-info');
//     container_info.innerHTML = '';
//     orderButton.addEventListener('click', function() {
//     orders.forEach(order => {
//         let str = `<div class="card-info">
//             <img src=${order.coffeeData.image}>
//             <p>Name: ${order.coffeeData.name}</p>
//             <p>Size: ${order.size}</p>
//             <p>Price: ${order.price}</p>
//         </div>`
//         container_info.innerHTML += str;
//     });
// });
// }


function initOrderCheckPanel() {
    const orderButton = document.getElementById('check-order-status');
    const hideButton = document.querySelector('.hide');
    const orderCheckPanel = document.querySelector('.order-check');
    
    if (!orderButton || !orderCheckPanel) {
        console.error('error!');
        return;
    }
    
    orderCheckPanel.style.display = 'none';
    orderCheckPanel.style.flexDirection = 'column';
    
    orderButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (orderCheckPanel.style.display === 'none' || orderCheckPanel.style.display === '') {
            orderCheckPanel.style.display = 'flex';
            loadOrderInfo();
        } else {
            orderCheckPanel.style.display = 'none';
        }
    });
    
    if (hideButton) {
        hideButton.addEventListener('click', function() {
            orderCheckPanel.style.display = 'none';
        });
    }
    
    document.addEventListener('click', function(e) {
        const isClickInsidePanel = orderCheckPanel.contains(e.target);
        const isClickOnOrderButton = orderButton.contains(e.target);
        
        if (!isClickInsidePanel && !isClickOnOrderButton && orderCheckPanel.style.display === 'flex') {
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
    const orderInfoContainer = document.querySelector('.order-info');
    if (!orderInfoContainer) {
        return;
    }
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    orderInfoContainer.innerHTML = '';
    
    if (orders.length === 0) {
        orderInfoContainer.innerHTML = '<p style="color: #666; padding: 20px;">No orders yet</p>';
        return;
    }
    
    orders.forEach((order, index) => {
        
        if (!order || !order.coffee) {
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
    
}

function addOrderCheckStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .order-check {
            position: fixed;
            right: 0;
            top: 0;
            width: 350px;
            height: 100vh;
            background: #F6F6F6;
            box-shadow: -5px 0 15px rgba(0,0,0,0.1);
            padding: 20px;
            z-index: 1000;
            overflow-y: auto;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        }
        
        .order-check.show {
            transform: translateX(0);
        }
        
        .order-check > p:first-child {
            font-size: 24px;
            color: #483431;
            margin-bottom: 20px;
            text-align: center;
            font-family: Rosarivo;
        }
        
        .hide {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            cursor: pointer;
            color: #666;
            padding: 10px;
            border-radius: 8px;
            transition: background 0.3s;
        }
        
        .hide:hover {
            background: rgba(0,0,0,0.05);
        }
        
        .order-info {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', addOrderCheckStyles);