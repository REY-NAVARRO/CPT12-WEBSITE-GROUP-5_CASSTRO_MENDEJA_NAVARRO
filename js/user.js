const $ = id => document.getElementById(id);

const tabLogin = $('tab-login');
const tabRegister = $('tab-register');
const loginForm = $('login-form');
const registerForm = $('register-form');
const toLoginBtn = $('to-login');

tabLogin.onclick = () => showForm('login');
tabRegister.onclick = () => showForm('register');
toLoginBtn.onclick = () => showForm('login');

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
if (mode === 'register') {
    showForm('register');
}

function showForm(which) {
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
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = 'Hide';
    } else {
        input.type = 'password';
        button.textContent = 'Show';
    }
}

$('reg-password').oninput = e => {
    const pw = e.target.value;
    const score = passwordScore(pw);
    $('pw-meter').style.width = (score * 20) + '%';
}

function passwordScore(p) {
    let s = 0;
    if (p.length >= 6) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[!@#$]/.test(p)) s++;
    if (p.length >= 10) s++;
    return s;
}

registerForm.onsubmit = async e => {
    e.preventDefault();
    const name = $('reg-name').value.trim();
    const email = $('reg-email').value.trim().toLowerCase();
    const pw = $('reg-password').value;
    const pwc = $('reg-password-confirm').value;
    const role = $('reg-role').value;
    const subject = role === 'teacher' ? $('reg-subject').value.trim() : null;

    if (!role) { alert('Please select a role'); return; }
    if (!name || !email) { alert('Please fill in all fields'); return; }
    if (pw.length < 8) { alert('Password must be at least 8 characters'); return; }
    if (pw !== pwc) { alert('Passwords do not match'); return; }
    if (role === 'teacher' && !subject) {
        alert('Please enter a subject');
        return;
    }

    try {
        const payload = { name, email, password: pw, role };
        if (role === 'teacher') {
            payload.subject = subject;
        }
        const res = await fetch('register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            alert('Account created successfully!');
            showForm('login');
        } else {
            alert(data.error);
        }
    } catch (err) {
        alert('Server error. Please try again.');
        console.error(err);
    }
}

loginForm.onsubmit = async e => {
    e.preventDefault();
    const email = $('login-email').value.trim().toLowerCase();
    const pw = $('login-password').value;

    try {
        const res = await fetch('api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pw })
        });
        const data = await res.json();
        if (data.success) {
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('userEmail', email);
            sessionStorage.setItem('userName', data.name);
            sessionStorage.setItem('role', data.role);

            alert('Login successful!');
            window.location.href = 'index.html';
        } else {
            alert(data.error);
        }
    } catch (err) {
        alert('Server error. Please try again.');
        console.error(err);
    }
}

const overlay = $('overlay');
$('forgot-btn').onclick = () => overlay.style.display = 'flex';
$('close-modal').onclick = () => {
    overlay.style.display = 'none';
    $('forgot-step-2').style.display = 'none';
}

const forgotForm = $('forgot-form');
const step2 = $('forgot-step-2');

forgotForm.onsubmit = async e => {
    e.preventDefault();
    const email = $('forgot-email').value.trim().toLowerCase();

    if (step2.style.display === 'none') {
        try {
            const res = await fetch('api/forgot.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, step: 1 })
            });
            const data = await res.json();
            if (data.success) {
                step2.style.display = 'block';
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert('Server error. Please try again.');
            console.error(err);
        }
        return;
    }

    const npw = $('forgot-new-password').value;
    const cpw = $('forgot-new-confirm').value;

    if (npw !== cpw) { alert('Passwords do not match'); return; }

    try {
        const res = await fetch('api/forgot.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: npw, step: 2 })
        });
        const data = await res.json();
        if (data.success) {
            alert('Password reset successful!');
            overlay.style.display = 'none';
            step2.style.display = 'none';
        } else {
            alert(data.error);
        }
    } catch (err) {
        alert('Server error. Please try again.');
        console.error(err);
    }
}

const regRole = document.getElementById('reg-role');
const teacherFields = document.getElementById('teacher-fields');

regRole.addEventListener('change', () => {
    if (regRole.value === 'teacher') {
        teacherFields.style.display = 'block';
    } else {
        teacherFields.style.display = 'none';
    }
});
