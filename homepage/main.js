
var defaultProducts =
    [{ name: "COLDPLAY", price: 50, image: "image/image1.jpg", quantity: 5 },
    { name: "THE1975", price: 40, image: "image/image2.jpg", quantity: 4 },
    { name: "陳奕迅", price: 50, image: "image/image3.jpg", quantity: 3 }];

var addedProducts = getAddedProducts();
var cartProducts = getCartProducts();

function editProduct() {
    window.location.href = "../edit/index.html";
}

function getCartProducts() {
    var cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
    return cartProducts;
}

function getAddedProducts() {
    var addedProducts = JSON.parse(localStorage.getItem("products")) || [];
    return addedProducts;
}

function slideToPrev() {
    var slideWrapper = document.querySelector(".slide-wrapper");
    var activeSlide = document.querySelector(".slide.active");

    if (activeSlide.previousElementSibling) {
        activeSlide.classList.remove("active");
        activeSlide.previousElementSibling.classList.add("active");

        var slideIndex = Array.from(slideWrapper.children).indexOf(activeSlide);
        slideWrapper.style.transform = "translateX(" + (-16.66 * slideIndex) + "%)";
    } else {
        var slides = document.querySelectorAll(".slide");
        slides[0].classList.remove("active");
        slides[slides.length - 1].classList.add("active");
        slideWrapper.style.transform = "translateX(" + (-16.66 * (slides.length - 1)) + "%)";
    }
}


function slideToNext() {
    var slideWrapper = document.querySelector(".slide-wrapper");
    var activeSlide = document.querySelector(".slide.active");

    if (activeSlide.nextElementSibling) {
        activeSlide.classList.remove("active");
        activeSlide.nextElementSibling.classList.add("active");

        var slideIndex = Array.from(slideWrapper.children).indexOf(activeSlide);
        slideWrapper.style.transform = "translateX(" + (-16.66 * (slideIndex + 2)) + "%)";
    } else {
        var slides = document.querySelectorAll(".slide");
        slides[slides.length - 1].classList.remove("active");
        slides[0].classList.add("active");
        slideWrapper.style.transform = "translateX(0)";
    }
}

function displayLatestProducts() {
    var latestShowcaseContainer = document.getElementById("latestShowcaseContainer");
    latestShowcaseContainer.innerHTML = "";

    var allProducts = defaultProducts.concat(addedProducts);

    for (var i = 0; i < allProducts.length; i++) {
        var product = allProducts[i];
        if (product.quantity > 0) {
            createShowcaseItem(product, i, latestShowcaseContainer);
        }
    }
}

function createShowcaseItem(product, index, container) {
    var showcaseItem = document.createElement("div");
    showcaseItem.className = "showcase-item";
    showcaseItem.setAttribute("onclick", `showProductInfo(${index})`);

    var productImage = document.createElement("img");
    productImage.src = product.image;
    productImage.alt = "Product Image";

    var productName = document.createElement("h3");
    productName.textContent = product.name;

    var quantityElement = document.createElement("div");
    quantityElement.className = "quantity";
    quantityElement.textContent = "數量: " + product.quantity;

    showcaseItem.appendChild(productImage);
    showcaseItem.appendChild(productName);
    showcaseItem.appendChild(quantityElement);

    container.appendChild(showcaseItem);
}

function showProductInfo(productIndex) {
    var product;
    if (productIndex < defaultProducts.length) {
        product = defaultProducts[productIndex];
    } else {
        product = addedProducts[productIndex - defaultProducts.length];
    }

    var modal = document.getElementById("product-info-modal");
    var productImage = document.getElementById("product-image");
    var nameElement = document.getElementById("product-name");
    var priceElement = document.getElementById("product-price");
    var quantityInput = document.getElementById("quantity-input");

    productImage.src = product.image;
    nameElement.textContent = product.name;
    priceElement.textContent = product.price;

    quantityInput.value = 1;
    quantityInput.max = product.quantity;

    localStorage.setItem("selectedProductImage", product.image);

    modal.style.display = "block";
}

function closeProductInfo() {
    var modal = document.getElementById("product-info-modal");
    modal.style.display = "none";
}

function addToCart() {
    var product = {
        name: document.getElementById("product-name").textContent,
        price: parseFloat(document.getElementById("product-price").textContent),
        quantity: parseInt(document.getElementById("quantity-input").value),
        image: document.getElementById("product-image").src
    };

    var isDefaultProduct = isDefaultProductByName(product.name);

    if (isDefaultProduct) {
        var defaultProduct = getDefaultProductByName(product.name);

        var existingProductIndex = getExistingProductIndex(cartProducts, product.name);

        if (existingProductIndex !== -1) {
            cartProducts[existingProductIndex].quantity += product.quantity;
        } else {
            cartProducts.push(product);
        }

        defaultProduct.quantity -= product.quantity;

        localStorage.setItem("cart", JSON.stringify(cartProducts));
        showSuccessMessage();
    } else {
        alert("無法購買。");
    }
}

function isDefaultProductByName(productName) {
    for (var i = 0; i < defaultProducts.length; i++) {
        if (defaultProducts[i].name === productName) {
            return true;
        }
    }
    return false;
}

function getDefaultProductByName(productName) {
    for (var i = 0; i < defaultProducts.length; i++) {
        if (defaultProducts[i].name === productName) {
            return defaultProducts[i];
        }
    }
    return null;
}

function getExistingProductIndex(cartProducts, productName) {
    for (var i = 0; i < cartProducts.length; i++) {
        if (cartProducts[i].name === productName) {
            return i;
        }
    }
    return -1;
}

function showSuccessMessage() {
    alert("已成功加入購物車");
}

function goToCartPage() {
    window.location.href = "../shopping cart/index.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "../index.html";
}

displayLatestProducts();
