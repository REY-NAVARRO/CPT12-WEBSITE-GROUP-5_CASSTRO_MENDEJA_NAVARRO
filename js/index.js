document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");
    const footer = document.getElementById("footerPopup");
    const userIcon = document.getElementById('userIcon');
    const authPopup = document.getElementById('authPopup');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const logo = document.getElementById("logo");
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const closeBtn = document.querySelector(".close");

    function updateLoginStatus() {
        const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
        const userName = sessionStorage.getItem('userName');

        loginBtn.style.display = isLoggedIn ? 'none' : 'block';
        registerBtn.style.display = isLoggedIn ? 'none' : 'block';
        logoutBtn.style.display = isLoggedIn ? 'block' : 'none';

        if (isLoggedIn && userName) {
            authPopup.querySelector('.username')?.remove();
            const span = document.createElement('span');
            span.classList.add('username');
            span.textContent = `Hello, ${userName}`;
            authPopup.prepend(span);
        }
    }
    updateLoginStatus();

    loginBtn.onclick = () => window.location.href = 'user.html';
    registerBtn.onclick = () => window.location.href = 'user.html';

    logoutBtn.onclick = async () => {
        try {
            await fetch('api/logout.php', { method: 'POST' });
        } catch (err) {
            console.error(err);
        }

        sessionStorage.clear();
        updateLoginStatus();
        window.location.reload();
    };

    userIcon.onclick = (e) => {
        e.stopPropagation();
        authPopup.style.display = authPopup.style.display === 'flex' ? 'none' : 'flex';
    };
    window.addEventListener('click', () => authPopup.style.display = 'none');

    logo.onclick = () => {
        modal.style.display = 'block';
        modalImg.src = logo.src;
    };
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; }

    document.querySelectorAll("a[href^='#']").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const section = document.querySelector(link.getAttribute("href"));
            const offset = header.offsetHeight + 20;
            window.scrollTo({ top: section.offsetTop - offset, behavior: "smooth" });
        });
    });

    let lastScrollY = window.scrollY;
    window.addEventListener("scroll", () => {
        header.style.transform = window.scrollY > lastScrollY ? "translateY(-100%)" : "translateY(0)";
        lastScrollY = window.scrollY;

        footer.style.bottom = (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) ? "0" : "-100px";
    });

    document.addEventListener("mousemove", (e) => {
        if (e.clientY <= 50) header.style.transform = "translateY(0)";
    });
});
