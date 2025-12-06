document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
  });

  const form = document.getElementById('attendance-form');
  const sectionGrid = document.getElementById('section-grid');
  const searchInput = document.getElementById("search");
  const userIcon = document.getElementById('userIcon');
  const authPopup = document.getElementById('authPopup');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  const userEmail = sessionStorage.getItem('userEmail');
  const userRole = sessionStorage.getItem('role');

  if (userRole !== 'teacher') form.style.display = 'none';

  async function loadSections() {
    try {
      const res = await fetch('api/sections.php', { credentials: 'include' });
      const data = await res.json();
      sectionGrid.innerHTML = '';

      data.forEach(sec => {
        if (userRole === 'teacher' && sec.owner_email !== userEmail) return;
        createCard(sec.id, sec.section_name, sec.subject, sec.owner_email);
      });
    } catch (err) {
      console.error(err);
    }
  }

  loadSections();

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (userRole !== 'teacher') return alert("Only teachers can create sections.");
    if (!userEmail) return alert("You must be logged in to create a section.");

    const section = document.getElementById('section').value.trim();
    const subject = document.getElementById('subject').value.trim();
    if (!section || !subject) return alert('Please fill in both section and subject');

    try {
      const res = await fetch('api/sections.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, subject }),
        credentials: 'include'
      });

      const result = await res.json();
      if (result.error) return alert(result.error);

      createCard(result.id, section, subject, userEmail);
      form.reset();
      alert('Section created successfully!');
    } catch (err) {
      console.error(err);
      alert('Error creating section. Please try again.');
    }
  });

  function createCard(id, section, subject, owner) {
    const card = document.createElement('div');
    card.className = 'section-card';
    card.innerHTML = `
      <h3>${section}</h3>
      <p>${subject}</p>
      <button class="open-btn">Open Attendance</button>
      ${userRole === 'teacher' ? '<button class="delete-btn">❌ Delete</button>' : ''}
    `;
    sectionGrid.appendChild(card);

    card.querySelector('.open-btn').addEventListener('click', () => {
      window.location.href = `attendance.html?section=${encodeURIComponent(section)}&subject=${encodeURIComponent(subject)}&owner=${encodeURIComponent(owner)}`;
    });

    const delBtn = card.querySelector('.delete-btn');
    if (delBtn) {
      delBtn.addEventListener('click', async () => {
        if (!confirm(`Delete section "${section}"?`)) return;
        try {
          const res = await fetch('api/sections.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
            credentials: 'include'
          });
          const result = await res.json();
          if (result.success) card.remove();
          else alert(result.error || 'Failed to delete section');
        } catch (err) {
          console.error(err);
        }
      });
    }
  }

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll(".section-card").forEach(card => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      card.style.display = title.includes(query) ? "block" : "none";
    });
  });

  userIcon.addEventListener('click', e => {
    e.stopPropagation();
    authPopup.style.display = authPopup.style.display === 'flex' ? 'none' : 'flex';
  });
  window.addEventListener('click', () => authPopup.style.display = 'none');

  loginBtn.onclick = () => window.location.href = 'user.html';
  registerBtn.onclick = () => window.location.href = 'user.html';
  logoutBtn.onclick = async () => {
    try { await fetch('api/logout.php', { method: 'POST', credentials: 'include' }); } catch (e) { }
    sessionStorage.clear();
    window.location.reload();
  };

  function updateLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
    loginBtn.style.display = isLoggedIn ? 'none' : 'block';
    registerBtn.style.display = isLoggedIn ? 'none' : 'block';
    logoutBtn.style.display = isLoggedIn ? 'block' : 'none';
  }
  updateLoginStatus();
});
