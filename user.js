const $ = id => document.getElementById(id);

$('tab-login').onclick = () => showForm('login');
$('tab-register').onclick = () => showForm('register');
$('to-login').onclick = () => showForm('login');

function showForm(which) {
    const loginForm = $('login-form');
    const registerForm = $('register-form');
    const tabLogin = $('tab-login');
    const tabRegister = $('tab-register');

    if (which === 'login') {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        loginForm.style.display = 'grid';
        registerForm.style.display = 'none';
    } else {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        loginForm.style.display = 'none';
        registerForm.style.display = 'grid';
    }
}

$('login-toggle').onclick = () => togglePwd('login-password', 'login-toggle');
$('reg-toggle').onclick = () => togglePwd('reg-password', 'reg-toggle');

function togglePwd(inputId, btnId) {
    const input = $(inputId);
    const btn = $(btnId);
    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    btn.textContent = visible ? 'Hide' : 'Show';
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

    if (pw !== pwc) { alert('Passwords do not match'); return; }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', pw);

    fetch("auth/register.php", { method: "POST", body: formData })
        .then(res => res.text())
        .then(data => {
            if (data.trim() === "success") {
                alert('Account created successfully!');
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('userEmail', email);

                $('reg-name').value = '';
                $('reg-email').value = '';
                $('reg-password').value = '';
                $('reg-password-confirm').value = '';
                $('pw-meter').style.width = '0';

                window.location.href = 'index.html';
            } else {
                alert('Error: ' + data);
            }
        })
        .catch(err => alert('Request failed: ' + err));
};

$('login-form').onsubmit = e => {
    e.preventDefault();
    const email = $('login-email').value.trim().toLowerCase();
    const pw = $('login-password').value;

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', pw);

    fetch("auth/login.php", { method: "POST", body: formData })
        .then(res => res.text())
        .then(data => {
            if (data.trim() === "success") {
                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('userEmail', email);

                alert('Login successful!');
                window.location.href = 'index.html';
            } else if (data.trim() === "not_found") {
                alert('Account not found');
            } else if (data.trim() === "wrong_password") {
                alert('Wrong password');
            } else {
                alert('Error: ' + data);
            }
        })
        .catch(err => alert('Request failed: ' + err));
};

const overlay = $('overlay');
const forgotForm = $('forgot-form');
const step2 = $('forgot-step-2');

$('forgot-btn').onclick = () => overlay.style.display = 'flex';
$('close-modal').onclick = () => {
    overlay.style.display = 'none';
    step2.style.display = 'none';
    $('forgot-email').value = '';
    $('forgot-new-password').value = '';
    $('forgot-new-confirm').value = '';
};

forgotForm.onsubmit = e => {
    e.preventDefault();
    const email = $('forgot-email').value.trim().toLowerCase();
    const newPass = $('forgot-new-password').value;
    const confirmPass = $('forgot-new-confirm').value;

    const step2Visible = window.getComputedStyle(step2).display !== 'none';

    if (!step2Visible) {
        fetch('auth/reset.php', {
            method: 'POST',
            body: new URLSearchParams({ email: email, step: 1 })
        })
        .then(res => res.text())
        .then(data => {
            if (data.trim() === 'found') {
                step2.style.display = 'block';
            } else {
                alert('Email not found');
            }
        });
    } else {
        // Step 2: Reset password
        if (newPass !== confirmPass) {
            alert('Passwords do not match');
            return;
        }

        fetch('auth/reset.php', {
            method: 'POST',
            body: new URLSearchParams({ email: email, password: newPass, step: 2 })
        })
        .then(res => res.text())
        .then(data => {
            if (data.trim() === 'success') {
                alert('Password reset successful!');
                overlay.style.display = 'none';
                step2.style.display = 'none';
                $('forgot-email').value = '';
                $('forgot-new-password').value = '';
                $('forgot-new-confirm').value = '';
            } else {
                alert('Error: ' + data);
            }
        });
    }
};
