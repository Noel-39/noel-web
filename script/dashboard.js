const username = localStorage.getItem('logged_in_user');
if (!username) {
    window.location.href = 'login.html';
}

document.getElementById('dashboardTitle').textContent = `Willkommen, ${username}`;
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('logged_in_user');
    window.location.href = 'index.html';
});
