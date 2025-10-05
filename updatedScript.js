

console.log('script.js loaded');

// Helper: escape HTML for safe insertion
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
    // SIGNUP
    const signupForm = document.querySelector('#signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.querySelector('#name')?.value.trim() || '';
            const username = document.querySelector('#username')?.value.trim() || '';
            const email = (document.querySelector('#email')?.value.trim() || '').toLowerCase();
            const password = document.querySelector('#password')?.value || '';

              if (!name || !username || !email || !password) {
                        alert("for signing up, all the fields have to be properly filled!");
                        return;
                    }

            let users = [];
            try { users = JSON.parse(localStorage.getItem('users')) || []; } catch (err) { users = []; }

            if (users.some(u => u.email === email)) {
                    alert('this email is already being registered, please login instead or if you want to create a new account, use a different email!');
                    return;
                }

            const newUser = { name, username, email, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            alert(`welcome, ${name}! your account has been created, thank-you for joining Eunoia!`);
            window.location.href = 'login.html';
        });
    }

        //copilot stop fucking my code up, i dont need your stupid suggestions

        // LOGIN
    const loginForm = document.querySelector('#login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = (document.querySelector('#login-email')?.value.trim() || '').toLowerCase();
            const password = document.querySelector('#login-password')?.value || '';

              if (!email || !password) {
                        alert("for login in your account enter the correct password and email id!")
                        return;
                    }

            let users = [];
            try { users = JSON.parse(localStorage.getItem('users')) || []; } catch (err) { users = []; }

            const matched = users.find(u => u.email === email && u.password === password);
            if (!matched) {
                    alert("incorrect credentials, dont try to get into someone else's account! get a life!");
                    return;
                }

            localStorage.setItem('loggedInUser', JSON.stringify(matched));
            alert(`welcome back, ${matched.name}! you have successfully logged in!`);
            window.location.href = 'dashboard.html';
        });
    }

    // INDEX - show welcome when logged in and provide logout
    if (document.body.classList.contains('index-page')) {
        const container = document.querySelector('.container');
        let loggedInUser = null;
        try { loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || null; } catch (err) { loggedInUser = null; }

        if (loggedInUser) {
           console.log(`user is logged in: ${loggedInUser}`);
        }
        else{
            console.log('no user is logged in');
        }
    }
});
       
    
    


