const $ = id => document.getElementById(id);

$('tab-login').onclick = () => showForm('login');
$('tab-register').onclick = () => showForm('register');
$('to-login').onclick = () => showForm('login');

function showForm(which) {
    const loginForm = $('login-form');
    const registerForm = $('register-form');

    $('tab-login').classList.toggle('active', which === 'login');
    $('tab-register').classList.toggle('active', which === 'register');

    loginForm.style.display = which === 'login' ? 'block' : 'none';
    registerForm.style.display = which === 'register' ? 'block' : 'none';
}

$('login-toggle').onclick = () => togglePwd('login-password', 'login-toggle');
$('reg-toggle').onclick = () => togglePwd('reg-password', 'reg-toggle');

function togglePwd(inputId, btnId) {
    const input = $(inputId);
    const btn = $(btnId);
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.textContent = show ? 'Hide' : 'Show';
}

$('reg-password').addEventListener('input', e => {
    const pw = e.target.value;
    const score = passwordScore(pw);
    const bar = $('pw-meter');
    bar.style.width = (score * 20) + '%';
    bar.style.background = score <= 1 ? 'red' : score <= 3 ? 'orange' : 'green';
});

function passwordScore(pw) {
    let score = 0;
    if (pw.length >= 6) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[!@#$]/.test(pw)) score++;
    if (pw.length >= 10) score++;
    return score;
}

$('register-form').onsubmit = e => {
    e.preventDefault();
    const name = $('reg-name').value.trim();
    const email = $('reg-email').value.trim().toLowerCase();
    const pw = $('reg-password').value;
    const pwc = $('reg-password-confirm').value;

    if (pw !== pwc) {
        alert("Passwords do not match!");
        return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", pw);

    fetch("auth/register.php", { method: "POST", body: data })
        .then(r => r.json()) 
        .then(result => {
            if (result.status === "success") {
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('userEmail', result.email);
                localStorage.setItem('userName', result.name);
                alert("Account created! Logged in successfully.");
                window.location.href = "index.html";
            } else if (result.message && result.message.includes("Email")) {
                alert("Email already exists!");
            } else {
                alert("Error: " + (result.message || "Unknown error"));
            }
        })
        .catch(err => alert("Fetch error: " + err));

};

$('login-form').onsubmit = e => {
    e.preventDefault();
    const email = $('login-email').value.trim().toLowerCase();
    const pw = $('login-password').value;

    const data = new FormData();
    data.append("email", email);
    data.append("password", pw);

    fetch("auth/login.php", { method: "POST", body: data })
        .then(r => r.json())
        .then(result => {
            if (result.status === "success") {
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('userEmail', result.email);
                localStorage.setItem('userName', result.name);
                alert("Login successful!");
                window.location.href = "index.html";
            } else if (result.status === "not_found") {
                alert("Account not found");
            } else if (result.status === "wrong_password") {
                alert("Wrong password");
            } else {
                alert("Error: " + (result.message || "Unknown error"));
            }
        })
        .catch(err => alert("Fetch error: " + err));
};
