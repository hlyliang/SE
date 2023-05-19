// 記錄所有註冊的使用者的資訊
let registeredUsers = [];

function showRegistrationForm() {
    document.getElementById("loginDiv").style.display = "none";
    document.getElementById("registerDiv").style.display = "block";
    document.getElementById("registerMessage").style.color = "#fff";
    document.getElementById("registerMessage").innerHTML = "";
}

function showLoginForm() {
    document.getElementById("loginDiv").style.display = "block";
    document.getElementById("registerDiv").style.display = "none";
    document.getElementById("loginMessage").style.color = "#fff";
    document.getElementById("loginMessage").innerHTML = "";
}

function togglePasswordVisibility(inputId, toggleIconId) {
    const input = document.getElementById(inputId);
    const toggleIcon = document.getElementById(toggleIconId);

    if (input.type === "password") {
        input.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}

function register() {
    var username = document.getElementById("registerUsername").value;
    var email = document.getElementById("registerEmail").value;
    var password = document.getElementById("registerPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    // 檢查使用者名稱是否為空
    if (username.trim() === "") {
        document.getElementById("registerMessage").style.color = "#fff";
        document.getElementById("registerMessage").innerHTML = "請輸入使用者名稱";
        return;
    }

    // 檢查電郵件是否符合格式
    var emailFormat = /^\S+@\S+\.\S+$/;
    if (!emailFormat.test(email)) {
        document.getElementById("registerMessage").style.color = "#fff";
        document.getElementById("registerMessage").innerHTML =
            "請輸入有效的電子郵件地址";
        return;
    }

    // 檢查密碼是否符合要求
    var passwordFormat = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/;
    if (!passwordFormat.test(password)) {
        document.getElementById("registerMessage").style.color = "#fff";
        document.getElementById("registerMessage").innerHTML =
            "密碼必須包含至少一個英文字母、一個數字，且長度至少為8位";
        return;
    }

    // 檢查兩次輸入的密碼是否相符
    if (password !== confirmPassword) {
        document.getElementById("registerMessage").style.color = "#fff";
        document.getElementById("registerMessage").innerHTML = "兩次輸入的密碼不相符";
        return;
    }

    // 檢查電子郵件是否已被註冊
    if (registeredUsers.some((user) => user.Email === email)) {
        document.getElementById("registerMessage").style.color = "#fff";
        document.getElementById("registerMessage").innerHTML = "該電子郵件已被註冊";
    } else {
        registeredUsers.push({ Username: username, Email: email, Password: password });
        document.getElementById("registerMessage").style.color = "#fff";
        document.getElementById("registerMessage").innerHTML = "註冊成功！請使用新帳號登入";
        document.getElementById("registerUsername").value = "";
        document.getElementById("registerEmail").value = "";
        document.getElementById("registerPassword").value = "";
        document.getElementById("confirmPassword").value = "";
        document.getElementById("registrationSuccessDiv").style.display = "block";
        setTimeout(() => {
            document.getElementById("registrationSuccessDiv").style.display = "none";
            showLoginForm();
        }, 1000);

    }
}

async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const user = registeredUsers.find(
        (user) => user.Email === email && user.Password === password
    );

    if (user) {
        window.location.href = "./homepage/index.html";
    } else {
        document.getElementById("loginMessage").style.color = "#fff";
        document.getElementById("loginMessage").innerHTML =
            "錯誤的電子郵件或密碼";
    }
}
