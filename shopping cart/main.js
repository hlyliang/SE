// 購物車頁面

var cart = JSON.parse(localStorage.getItem("cart")) || [];
var products = JSON.parse(localStorage.getItem("products")) || [];
var defaultProductsString = localStorage.getItem("defaultProducts");
var defaultProducts = defaultProductsString ? JSON.parse(defaultProductsString) : [];

function displayCartItems() {
    var cartItemsDiv = document.getElementById("cart-items");
    var cartTotalDiv = document.getElementById("total-price");
    cartItemsDiv.innerHTML = ""; // 清空购物车内容

    for (var i = 0; i < cart.length; i++) {
        (function (index) {
            var item = cart[index];
            var itemDiv = document.createElement("div");
            itemDiv.className = "cart-item";

            var imageDiv = document.createElement("div");
            imageDiv.className = "item-image";
            var image = document.createElement("img");
            image.src = item.image;
            image.alt = "Product Image";
            imageDiv.appendChild(image);
            itemDiv.appendChild(imageDiv);

            var infoDiv = document.createElement("div");
            infoDiv.className = "item-info";
            var name = document.createElement("div");
            name.className = "item-name";
            name.textContent = item.name;
            var quantityPrice = document.createElement("div");
            quantityPrice.className = "item-quantity-price";
            var quantity = document.createElement("span");
            quantity.textContent = "數量: ";
            var decreaseButton = document.createElement("button");
            decreaseButton.textContent = "-";
            decreaseButton.addEventListener("click", function () {
                decreaseQuantity(index);
            });
            var quantityInput = document.createElement("input");
            quantityInput.id = "quantity-input-" + index;
            quantityInput.type = "number";
            quantityInput.value = item.quantity;
            quantityInput.min = 1;
            quantityInput.max = getProductQuantity(item.name); // 使用商品的上架数量
            var increaseButton = document.createElement("button");
            increaseButton.textContent = "+";
            increaseButton.addEventListener("click", function () {
                increaseQuantity(index);
            });
            quantityPrice.appendChild(decreaseButton);
            quantityPrice.appendChild(quantityInput);
            quantityPrice.appendChild(increaseButton);
            var price = document.createElement("span");
            price.className = "item-price";
            price.textContent = "價格: $" + item.price;
            infoDiv.appendChild(name);
            infoDiv.appendChild(quantityPrice);
            infoDiv.appendChild(price);
            itemDiv.appendChild(infoDiv);

            cartItemsDiv.appendChild(itemDiv);
        })(i);
    }

    var totalPrice = cart.reduce(function (acc, item) {
        return acc + item.price * item.quantity;
    }, 0);

    cartTotalDiv.textContent = "總價格: $" + totalPrice.toFixed(2);
}

function decreaseQuantity(index) {
    var item = cart[index];
    var quantityInput = document.getElementById("quantity-input-" + index);
    var newQuantity = parseInt(quantityInput.value) - 1;
    if (newQuantity >= 1) {
        quantityInput.value = newQuantity;
        item.quantity = newQuantity;
        displayCartItems();
    }
}

function increaseQuantity(index) {
    var item = cart[index];
    var quantityInput = document.getElementById("quantity-input-" + index);
    var newQuantity = parseInt(quantityInput.value) + 1;
    var productQuantity = getProductQuantity(item.name);
    if (newQuantity <= productQuantity) {
        quantityInput.value = newQuantity;
        item.quantity = newQuantity;
        displayCartItems();
    }
}

function updateQuantity(index, newQuantity) {
    var quantity = parseInt(newQuantity);
    if (quantity < 1) {
        quantity = 1;
    } else {
        var item = cart[index];
        var productQuantity = getProductQuantity(item.name);
        if (quantity > productQuantity) {
            quantity = productQuantity;
        }
    }
    cart[index].quantity = quantity;
    displayCartItems();
}

function getProductQuantity(productName) {
    var product = defaultProducts.find(function (item) {
        return item.name === productName;
    });
    return product ? product.quantity : 0;
}

function updateCartItems() {
    // 更新購物車內的商品資訊和圖片
    for (var i = 0; i < cart.length; i++) {
        var cartItem = cart[i];
        var product = getDefaultProductByName(cartItem.name); // 使用 getDefaultProductByName 取得預設商品資訊
        if (product) {
            cartItem.image = product.image; // 更新圖片路徑
            cartItem.price = product.price; // 更新價格
        }
    }
    // 將更新後的購物車資訊保存到本地存儲
    localStorage.setItem("cart", JSON.stringify(cart));
}

function clearCart() {
    cart = [];
    localStorage.removeItem("cart");
    displayCartItems();
}

function checkout() {
    var confirmation = confirm("確定結帳嗎？");
    if (confirmation) {
        var purchasedItems = [];
        for (var i = 0; i < cart.length; i++) {
            var item = cart[i];
            purchasedItems.push({ name: item.name, quantity: item.quantity });
        }

        clearCart();

        alert("結帳成功！");
        updateDefaultProductQuantities(purchasedItems);
        updateDefaultProductsFromLocalStorage();
        window.location.href = "../homepage/index.html";
    }
}

function updateDefaultProductQuantities(purchasedItems) {
    for (var i = 0; i < purchasedItems.length; i++) {
        var purchasedItem = purchasedItems[i];
        var defaultProduct = defaultProducts.find(function (item) {
            return item.name === purchasedItem.name;
        });

        if (defaultProduct) {
            defaultProduct.quantity -= purchasedItem.quantity;
            if (defaultProduct.quantity < 0) {
                defaultProduct.quantity = 0;
            }
        }
    }

    localStorage.setItem("defaultProducts", JSON.stringify(defaultProducts));
}

function updateDefaultProductsFromLocalStorage() {
    var defaultProductsString = localStorage.getItem("defaultProducts");
    if (defaultProductsString) {
        defaultProducts = JSON.parse(defaultProductsString);
    } else {
        defaultProducts = [];
    }
}


function init() {
    displayCartItems();

    document.getElementById("home-button").addEventListener("click", function () {
        window.location.href = "../homepage/index.html";
    });
}

init();
