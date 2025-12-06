const feedbackForm = document.getElementById('feedback-form');

feedbackForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = feedbackForm.name.value;
    const email = feedbackForm.email.value;
    const phone = feedbackForm.phone.value;
    const rating = feedbackForm.rating.value;
    const message = feedbackForm.message.value;

    const res = await fetch('api/feedback.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, rating, message })
    });
    const data = await res.json();
    if (data.success) alert('Feedback submitted!');
    else alert(data.error);
});
