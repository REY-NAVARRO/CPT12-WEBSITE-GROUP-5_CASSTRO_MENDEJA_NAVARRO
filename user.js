const $ = id => document.getElementById(id);

// Tabs
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

function togglePwd(id, btn) {
    const input = $(id);
    const button = $(btn);
    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    button.textContent = visible ? 'Hide' : 'Show';
}

$// PASSWORD STRENGTH METER
$('reg-password').addEventListener('input', e => {
    const pw = e.target.value;
    const score = passwordScore(pw);
    const bar = $('pw-meter');    // Targets <i>

    const width = score * 20;
    bar.style.width = width + '%';

    // Color scaling based on score
    if (score <= 1) bar.style.background = 'red';
    else if (score <= 3) bar.style.background = 'orange';
    else bar.style.background = 'green';
});

// Strength calculation
function passwordScore(p) {
    let s = 0;
    if (p.length >= 6) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[!@#$]/.test(p)) s++;
    if (p.length >= 10) s++;
    return s;
}


function readUsers() {
    return JSON.parse(localStorage.getItem('users') || '{}');
}
function writeUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

$('register-form').onsubmit = e => {
    e.preventDefault();
    const name = $('reg-name').value;
    const email = $('reg-email').value.toLowerCase();
    const pw = $('reg-password').value;
    const pwc = $('reg-password-confirm').value;

    if (pw !== pwc) { alert('Passwords do not match'); return; }
    const users = readUsers();
    if (users[email]) { alert('Email already exists'); return; }

    users[email] = { name, email, password: pw };
    writeUsers(users);

    alert('Account created successfully!');
    showForm('login');
}

$('login-form').onsubmit = e => {
    e.preventDefault();
    const email = $('login-email').value.toLowerCase();
    const pw = $('login-password').value;

    const users = readUsers();
    if (!users[email]) { alert('Account not found'); return; }
    if (users[email].password !== pw) { alert('Wrong password'); return; }

    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userEmail', email);

    alert('Login successful!');
    window.location.href = 'index.html';
}

$('forgot-btn').onclick = () => $('overlay').style.display = 'flex';
$('close-modal').onclick = () => $('overlay').style.display = 'none';

const forgotForm = $('forgot-form');
const step2 = $('forgot-step-2');

forgotForm.onsubmit = e => {
    e.preventDefault();
    const email = $('forgot-email').value.toLowerCase();
    const users = readUsers();

    if (step2.style.display === 'none') {
        if (!users[email]) { alert('Email not found'); return; }
        step2.style.display = 'block';
        return;
    }

    const npw = $('forgot-new-password').value;
    const cpw = $('forgot-new-confirm').value;

    if (npw !== cpw) { alert('Passwords do not match'); return; }

    users[email].password = npw;
    writeUsers(users);

    alert('Password reset successful!');
    $('overlay').style.display = 'none';
    step2.style.display = 'none';
}
