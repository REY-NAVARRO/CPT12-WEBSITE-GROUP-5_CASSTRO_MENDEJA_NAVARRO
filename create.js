document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('attendance-form');
  const sectionGrid = document.getElementById('section-grid');
  const searchInput = document.getElementById('search');
  const userIcon = document.getElementById('userIcon');
  const authPopup = document.getElementById('authPopup');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  const currentUser = localStorage.getItem('userEmail') || 'guest';

  // Load sections from DB
  fetch('fetch_sections.php')
    .then(res => res.json())
    .then(data => data.forEach(sec => createCard(sec.id, sec.section, sec.subject, sec.owner)))
    .catch(err => console.error(err));

  // Submit new section
  form.addEventListener('submit', e => {
    e.preventDefault();
    const section = document.getElementById('section').value.trim();
    const subject = document.getElementById('subject').value.trim();
    if (!section || !subject) return;

    fetch('add_section.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, subject, owner: currentUser })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        createCard(data.id, section, subject, currentUser);
        form.reset();
      } else {
        alert(data.message);
      }
    })
    .catch(err => console.error(err));
  });

  // Create section card
  function createCard(id, section, subject, owner) {
    const card = document.createElement('div');
    card.className = 'section-card';
    card.innerHTML = `
      <h3>${section}</h3>
      <p>${subject}</p>
      <button class="open-btn">Open Attendance</button>
      <button class="delete-btn">❌ Delete</button>
    `;

    card.querySelector('.open-btn').addEventListener('click', () => {
      window.location.href = `attendance.html?section=${encodeURIComponent(section)}&subject=${encodeURIComponent(subject)}`;
    });

    card.querySelector('.delete-btn').addEventListener('click', () => {
      if (owner !== currentUser) {
        alert('You can only delete your own sections!');
        return;
      }
      if (!confirm(`Delete section "${section}"?`)) return;

      fetch('delete_section.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      .then(res => res.json())
      .then(data => { if (data.success) card.remove(); else alert(data.message); })
      .catch(err => console.error(err));
    });

    sectionGrid.appendChild(card);
  }

  // Search
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll('.section-card').forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      card.style.display = title.includes(query) ? 'block' : 'none';
    });
  });

  // User auth popup
  userIcon.addEventListener('click', e => {
    e.stopPropagation();
    authPopup.style.display = authPopup.style.display === 'flex' ? 'none' : 'flex';
  });
  window.addEventListener('click', () => authPopup.style.display = 'none');

  loginBtn.onclick = () => window.location.href = 'user.html';
  registerBtn.onclick = () => window.location.href = 'user.html';
  logoutBtn.onclick = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userEmail');
    window.location.reload();
  };

  // Update login buttons
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  loginBtn.style.display = isLoggedIn ? 'none' : 'block';
  registerBtn.style.display = isLoggedIn ? 'none' : 'block';
  logoutBtn.style.display = isLoggedIn ? 'block' : 'none';
});
