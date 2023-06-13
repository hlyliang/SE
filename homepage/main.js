var defaultProducts = [
    { name: "COLDPLAY", price: 50, image: "image/image1.jpg", quantity: 5, date: "2023-07-01" },
    { name: "(G)I-DLE", price: 40, image: "image/image2.jpg", quantity: 4, date: "2023-07-02" },
    { name: "IVE", price: 50, image: "image/image3.jpg", quantity: 3, date: "2023-07-03" }
];


var addedProducts = getAddedProducts();
var cartProducts = getCartProducts();

function goToGamePage() {
    window.location.href = "../game/index.html";
}

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

function onYouTubeIframeAPIReady() {
    var iframeIds = ["youtube-player1", "youtube-player2", "youtube-player3", "youtube-player4", "youtube-player5", "youtube-player6"];

    for (var i = 0; i < iframeIds.length; i++) {
        var iframeId = iframeIds[i];
        createYouTubePlayer(iframeId);
    }
}

function createYouTubePlayer(iframeId) {
    var player = new YT.Player(iframeId, {
        events: {
            onReady: onYouTubePlayerReady
        }
    });
}

function onYouTubePlayerReady(event) {
    var iframe = event.target.getIframe();
    var slides = document.querySelectorAll(".slide");

    for (var i = 0; i < slides.length; i++) {
        var slide = slides[i];
        var slideIframe = slide.querySelector("iframe");

        if (slideIframe === iframe) {
            slideIframe.addEventListener("mouseover", function () {
                event.target.pauseVideo();
            });

            slideIframe.addEventListener("mouseout", function () {
                event.target.playVideo();
            });

            break;
        }
    }
}

function slideToPrev() {
    var slideWrapper = document.querySelector(".slide-wrapper");
    var activeSlide = document.querySelector(".slide.active");

    if (activeSlide.previousElementSibling) {
        activeSlide.classList.remove("active");
        activeSlide.previousElementSibling.classList.add("active");

        var slideIndex = Array.from(slideWrapper.children).indexOf(activeSlide);
        slideWrapper.style.transform = "translateX(" + (-16.66 * slideIndex) + "%)";

        var iframe = activeSlide.querySelector("iframe");
        pauseYouTubeVideo(iframe);
    } else {
        var slides = document.querySelectorAll(".slide");
        slides[0].classList.remove("active");
        slides[slides.length - 1].classList.add("active");
        slideWrapper.style.transform = "translateX(" + (-16.66 * (slides.length - 1)) + "%)";

        var iframe = activeSlide.querySelector("iframe");
        pauseYouTubeVideo(iframe);
    }
}

function slideToNext() {
    var slideWrapper = document.querySelector(".slide-wrapper");
    var activeSlide = document.querySelector(".slide.active");

    if (activeSlide.nextElementSibling) {
        activeSlide.classList.remove("active");
        activeSlide.nextElementSibling.classList.add("active");

        var slideIndex = Array.from(slideWrapper.children).indexOf(activeSlide);
        slideWrapper.style.transform = "translateX(" + (-16.66 * (slideIndex + 1)) + "%)";

        var iframe = activeSlide.querySelector("iframe");
        pauseYouTubeVideo(iframe);
    } else {
        var slides = document.querySelectorAll(".slide");
        slides[slides.length - 1].classList.remove("active");
        slides[0].classList.add("active");
        slideWrapper.style.transform = "translateX(0)";

        var iframe = activeSlide.querySelector("iframe");
        pauseYouTubeVideo(iframe);
    }
}

function pauseYouTubeVideo(iframe) {
    var videoSrc = iframe.src;
    iframe.src = videoSrc;
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

    var originalIndex = -1;

    // 先從 defaultProducts 中尋找索引
    originalIndex = defaultProducts.findIndex(function (p) {
        return p.name === product.name && p.date === product.date;
    });

    // 如果在 defaultProducts 中找不到索引，再在 addedProducts 中尋找索引
    if (originalIndex === -1) {
        originalIndex = addedProducts.findIndex(function (p) {
            return p.name === product.name && p.date === product.date;
        });
        originalIndex += defaultProducts.length;
    }

    // 設定 onclick 屬性，傳遞 originalIndex 作為參數
    showcaseItem.setAttribute("onclick", `showProductInfo(${originalIndex})`);

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
    var priceElement = document.getElementById("product-price-value"); // 修改為不重複的 id
    var quantityInput = document.getElementById("quantity-input");
    var dateElement = document.getElementById("product-date-value"); // 修改為不重複的 id

    productImage.src = product.image;
    nameElement.textContent = product.name;
    priceElement.textContent = product.price;
    dateElement.textContent = "演出日期: " + product.date;

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
        price: document.getElementById("product-price-value").textContent,
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

var lastRandomIndex = -1;  // 追蹤上一次的隨機索引

function randomProduct() {
    var allProducts = defaultProducts.concat(addedProducts);
    var randomIndex;

    do {
        randomIndex = Math.floor(Math.random() * allProducts.length);
    } while (randomIndex === lastRandomIndex);  // 如果和上一次相同，重新隨機產生索引

    lastRandomIndex = randomIndex;  // 更新上一次的隨機索引

    showProductInfo(randomIndex);
}

var searchInput = document.querySelector('input[type="text"]');
searchInput.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        // 如果按下的是 Enter 键 (keyCode 为 13)，则触发搜索函数
        search();
    }
});

function search() {
    var searchInput = document.getElementById("search-input");
    var searchText = searchInput.value.trim().toLowerCase();

    var dateInput = document.getElementById("date-input");
    var selectedDate = dateInput.value;

    var filteredProducts = [];

    if (searchText !== "") {
        filteredProducts = defaultProducts.concat(addedProducts).filter(function (product) {
            var nameMatch = product.name.toLowerCase().includes(searchText);
            var dateMatch = selectedDate === "" || product.date >= selectedDate;
            return nameMatch && dateMatch;
        });
    } else {
        filteredProducts = defaultProducts.concat(addedProducts).filter(function (product) {
            return product.date >= selectedDate;
        });
    }

    if (filteredProducts.length > 0) {
        displayFilteredProducts(filteredProducts);
    } else {
        displayNoResults();
    }
}



function displayFilteredProducts(products) {
    var latestShowcaseContainer = document.getElementById("latestShowcaseContainer");
    latestShowcaseContainer.innerHTML = "";

    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        if (product.quantity > 0) {
            createShowcaseItem(product, i, latestShowcaseContainer);
        }
    }
}

function displayNoResults() {
    var latestShowcaseContainer = document.getElementById("latestShowcaseContainer");
    latestShowcaseContainer.innerHTML = "";

    var noResultsMessage = document.createElement("p");
    noResultsMessage.textContent = "查無此商品";
    noResultsMessage.style.textAlign = "center";

    latestShowcaseContainer.appendChild(noResultsMessage);
}

displayLatestProducts();
