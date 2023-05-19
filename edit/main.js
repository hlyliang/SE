// 初始化頁面
function init() {
    // 檢查本地存儲中是否有先前的商品資訊
    var storedProducts = localStorage.getItem("products");
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    }

    displayProductList();
    // 綁定編輯按鈕的點擊事件
    bindEditButtons();
    // 綁定下架按鈕的點擊事件
    bindRemoveButtons();

    document.getElementById("home-button").addEventListener("click", function () {
        // 執行跳轉首頁的操作
        window.location.href = "../homepage/index.html";
    });
}

var editProductImage = document.getElementById("edit-product-image");
var editProductImagePreview = document.getElementById("edit-product-image-preview");

var products = [];

// 顯示商品列表
function displayProductList() {
    var productList = document.querySelector(".product-list");
    productList.innerHTML = ""; // 清空商品列表內容

    // 迭代商品陣列，為每個商品創建列表項目
    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        var listItem = document.createElement("div");
        listItem.className = "product-item";

        // 顯示商品資訊
        var productInfo = document.createElement("div");
        productInfo.className = "product-info";
        productInfo.innerHTML = `
        <img src="${product.image}" alt="Product Image">
        <h3>${product.name}</h3>
        <p>價格: $${product.price}</p>
        <p>數量: ${product.quantity}</p>`;

        // 編輯商品按鈕
        var editButton = document.createElement("button");
        editButton.className = "edit-button";
        editButton.textContent = "編輯";
        editButton.setAttribute("data-index", i); // 添加data-index属性

        // 下架商品按鈕
        var removeButton = document.createElement("button");
        removeButton.className = "remove-button";
        removeButton.textContent = "下架";
        removeButton.setAttribute("data-index", i); // 添加data-index属性

        // 將商品資訊和按鈕添加到列表項目中
        listItem.appendChild(productInfo);
        listItem.appendChild(editButton);
        listItem.appendChild(removeButton);

        // 將列表項目添加到商品列表容器中
        productList.appendChild(listItem);
    }

    // 綁定編輯按鈕的點擊事件
    bindEditButtons();
    // 綁定下架按鈕的點擊事件
    bindRemoveButtons();
}

// 綁定編輯按鈕的點擊事件
function bindEditButtons() {
    var editButtons = document.getElementsByClassName("edit-button");
    for (var i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener("click", function () {
            // 獲取商品索引
            var index = parseInt(this.getAttribute("data-index"));
            // 獲取商品圖片URL
            var productImage = products[index].image;
            // 顯示編輯表單並填充商品資訊
            showEditForm(index, productImage);
        });
    }
}

// 顯示編輯表單並填充商品資訊
function showEditForm(index, productImage) {
    // 獲取編輯表單和相關元素
    var editForm = document.getElementById("edit-product-form");
    var editProductIndex = document.getElementById("edit-product-index");
    var editProductImage = document.getElementById("edit-product-image");
    var editProductImagePreview = document.getElementById("edit-product-image-preview");
    var editProductName = document.getElementById("edit-product-name");
    var editProductQuantity = document.getElementById("edit-product-quantity");
    var editProductPrice = document.getElementById("edit-product-price");

    // 填充商品資訊到編輯表單
    var product = products[index];
    editProductIndex.value = index;
    editProductName.value = product.name;
    editProductQuantity.value = product.quantity;
    editProductPrice.value = product.price;

    // 清空圖片預覽容器
    editProductImagePreview.innerHTML = "";

    // 顯示商品圖片預覽
    if (productImage) {
        var img = document.createElement("img");
        img.src = productImage;
        img.alt = "Product Image";
        img.style.width = "100%";
        img.style.height = "auto";
        img.classList.add("preview-image");
        editProductImagePreview.appendChild(img);
    } else {
        editProductImagePreview.innerHTML = "暂无图片";
    }

    // 顯示編輯表單
    editForm.style.display = "block";
}

// 監聽選擇文件輸入框的變化事件
editProductImage.addEventListener("change", function () {
    if (this.files && this.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var img = document.createElement("img");
            img.src = e.target.result;
            img.alt = "Product Image";
            img.style.width = "100%";
            img.style.height = "auto";
            img.classList.add("preview-image");
            editProductImagePreview.innerHTML = ""; // 清空圖片預覽容器
            editProductImagePreview.appendChild(img); // 顯示選擇的圖片
        };

        reader.readAsDataURL(this.files[0]);
    }
});

// 綁定下架按鈕的點擊事件
function bindRemoveButtons() {
    var removeButtons = document.getElementsByClassName("remove-button");
    for (var i = 0; i < removeButtons.length; i++) {
        removeButtons[i].addEventListener("click", function () {
            // 獲取商品索引
            var index = parseInt(this.getAttribute("data-index"));
            // 確認是否下架商品
            var confirmed = confirm("是否確定下架商品？");
            if (confirmed) {
                // 下架商品
                removeProduct(index);
            }
        });
    }
}

// 下架商品
function removeProduct(index) {
    // 從商品陣列中刪除指定索引的商品
    var removedProduct = products.splice(index, 1)[0];
    // 重新顯示商品列表
    displayProductList();

    // 將更新後的商品列表保存到本地存儲
    localStorage.setItem("products", JSON.stringify(products));
}

// 提交上架新商品表單的處理函式
document.getElementById("add-product-form").addEventListener("submit", function (event) {
    event.preventDefault(); // 阻止表單的默認提交行為
    // 獲取表單輸入的值
    var fileInput = document.getElementById("product-image");
    var productImage = fileInput.files[0]; // 獲取文件

    var reader = new FileReader();
    reader.onload = function (event) {
        var imageDataUrl = event.target.result;
        var productName = document.getElementById("product-name").value;
        var productQuantity = parseInt(document.getElementById("product-quantity").value);
        var productPrice = parseFloat(document.getElementById("product-price").value);

        // 創建新商品
        var newProduct = {
            name: productName,
            price: productPrice,
            image: imageDataUrl,
            quantity: productQuantity,
        };

        products.push(newProduct);

        displayProductList();

        // 清空表單輸入
        fileInput.value = "";
        document.getElementById("product-name").value = "";
        document.getElementById("product-quantity").value = "";
        document.getElementById("product-price").value = "";

        // 將更新後的商品列表保存到本地存儲
        localStorage.setItem("products", JSON.stringify(products));
    };

    reader.readAsDataURL(productImage);
});

// 提交編輯商品表單的處理函式
document.getElementById("edit-product-form").addEventListener("submit", function (event) {
    event.preventDefault(); // 阻止表單的默認提交行為
    // 獲取編輯表單輸入的值
    var editProductIndex = parseInt(document.getElementById("edit-product-index").value);
    var editProductName = document.getElementById("edit-product-name").value;
    var editProductQuantity = parseInt(document.getElementById("edit-product-quantity").value);
    var editProductPrice = parseFloat(document.getElementById("edit-product-price").value);

    // 更新商品資訊
    var editedProduct = {
        name: editProductName,
        price: editProductPrice,
        quantity: editProductQuantity,
    };

    var editProductImage = document.getElementById("edit-product-image");
    var newImage = editProductImage.files[0];
    if (newImage) {
        var reader = new FileReader();
        reader.onload = function (event) {
            editedProduct.image = event.target.result;
            products[editProductIndex] = editedProduct;
            displayProductList();
            hideEditForm();

            // 將更新後的商品列表保存到本地存儲
            localStorage.setItem("products", JSON.stringify(products));

            // 更新購物車中相同商品的資訊
            updateCartItem(editProductIndex, editedProduct);
        };
        reader.readAsDataURL(newImage);
    } else {
        editedProduct.image = products[editProductIndex].image;
        products[editProductIndex] = editedProduct;
        displayProductList();
        hideEditForm();

        // 將更新後的商品列表保存到本地存儲
        localStorage.setItem("products", JSON.stringify(products));

        // 更新購物車中相同商品的資訊
        updateCartItem(editProductIndex, editedProduct);
    }

    // 若數量為 0，則刪除該商品
    if (editedProduct.quantity === 0) {
        removeProduct(editProductIndex);
        // 從購物車中移除該商品
        removeCartItem(editProductIndex);
    }
});

// 更新購物車中相同商品的資訊
function updateCartItem(productIndex, editedProduct) {
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].name === editedProduct.name) {
            cart[i].price = editedProduct.price;
            cart[i].quantity = editedProduct.quantity;
        }
    }
    // 將更新後的購物車保存到本地存儲
    localStorage.setItem("cart", JSON.stringify(cart));
}

// 從購物車中移除指定索引的商品
function removeCartItem(productIndex) {
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(productIndex, 1);
    // 將更新後的購物車保存到本地存儲
    localStorage.setItem("cart", JSON.stringify(cart));
}



// 隱藏編輯表單
function hideEditForm() {
    var editForm = document.getElementById("edit-product-form");
    editForm.style.display = "none";
}

// 初始化頁面
init();
