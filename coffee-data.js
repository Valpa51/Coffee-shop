const coffeeData = {
    cappuccino: {
        name: "Cappuccino",
        image: "Images/coffee.png",
        items: [
            { 
                id: 1, 
                name: "Cinnamon and Cocoa", 
                price: "₹99", 
                image: "Images/cappuccino-1.png",
                buttonName: "cappuccino-1"
            },
            { 
                id: 2, 
                name: "Drizzled with Caramel", 
                price: "₹99", 
                image: "Images/cappuccino-2.png",
                buttonName: "cappuccino-2"
            },
            { 
                id: 3, 
                name: "Bursting Blueberry", 
                price: "₹99", 
                image: "Images/cappuccino-3.png",
                buttonName: "cappuccino-3"
            },
            { 
                id: 4, 
                name: "Dalgona Macha", 
                price: "₹99", 
                image: "Images/cappuccino-4.png",
                buttonName: "cappuccino-4"
            },
            { 
                id: 5, 
                name: "Coco & Vanilla Cream", 
                price: "₹99", 
                image: "Images/cappuccino-5.png",
                buttonName: "cappuccino-5"
            },
            { 
                id: 6, 
                name: "Whipped chocolate", 
                price: "₹99", 
                image: "Images/cappuccino-6.png",
                buttonName: "cappuccino-6"
            }
        ]
    },
    latte: {
        name: "Latte",
        image: "Images/coffee.png",
        items: [
            { 
                id: 7, 
                name: "Vanilla Latte", 
                price: "₹110", 
                image: "Images/latte-1.png",
                buttonName: "latte-1"
            },
            { 
                id: 8, 
                name: "Caramel Latte", 
                price: "₹110", 
                image: "Images/latte-2.png",
                buttonName: "latte-2"
            },
            { 
                id: 9, 
                name: "Hazelnut Latte", 
                price: "₹110", 
                image: "Images/latte-3.png",
                buttonName: "latte-3"
            }
        ]
    },
    americano: {
        name: "Americano",
        image: "Images/coffee.png",
        items: [
            { 
                id: 10, 
                name: "Classic Americano", 
                price: "₹85", 
                image: "Images/americano-1.png",
                buttonName: "americano-1"
            },
            { 
                id: 11, 
                name: "Iced Americano", 
                price: "₹90", 
                image: "Images/americano-2.png",
                buttonName: "americano-2"
            }
        ]
    },
    espresso: {
        name: "Espresso",
        image: "Images/coffee.png",
        items: [
            { 
                id: 12, 
                name: "Single Espresso", 
                price: "₹75", 
                image: "Images/espresso-1.png",
                buttonName: "espresso-1"
            },
            { 
                id: 13, 
                name: "Double Espresso", 
                price: "₹120", 
                image: "Images/espresso-2.png",
                buttonName: "espresso-2"
            }
        ]
    },
    flatWhite: {
        name: "Flat White",
        image: "Images/coffee.png",
        items: [
            { 
                id: 14, 
                name: "Classic Flat White", 
                price: "₹105", 
                image: "Images/flat-white-1.png",
                buttonName: "flatWhite-1"
            },
            { 
                id: 15, 
                name: "Coconut Flat White", 
                price: "₹115", 
                image: "Images/flat-white-2.png",
                buttonName: "flatWhite-2"
            }
        ]
    }
};

let currentCoffeeType = 'cappuccino';