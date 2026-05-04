const loginStatusButton = document.getElementById('loginStatusButton');
const currentUser = localStorage.getItem('logged_in_user');
if (loginStatusButton) {
    if (currentUser) {
        loginStatusButton.textContent = currentUser;
        loginStatusButton.href = 'dashboard.html';
    } else {
        loginStatusButton.textContent = 'Login';
        loginStatusButton.href = 'login.html';
    }
}
