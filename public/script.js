document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.toggle');
    const body = document.body;
    const menuItems = document.querySelectorAll('.menu-list-item');
    const profileContainer = document.querySelector('.profile-text-container');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Toggle sáng/tối
    toggleButtons.forEach(toggle => {
        toggle.addEventListener('click', () => {
            body.classList.toggle('dark');
            localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
        });
    });

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark');
    }

    // Menu
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Profile
    if (profileContainer) {
        profileContainer.addEventListener('click', () => {
            console.log('Profile clicked!');
        });
    }

    // Signup form
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = signupForm.querySelector('#username').value;
            const email = signupForm.querySelector('#email').value;
            const password = signupForm.querySelector('#password').value;

            if (!username || !email || !password) {
                return alert('Vui lòng điền đầy đủ thông tin!');
            }

            // Kiểm tra định dạng
            if (username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9]+$/.test(username)) {
                return alert('Tên đăng nhập phải dài 3-20 ký tự và chỉ chứa chữ cái hoặc số!');
            }
            if (password.length < 6) {
                return alert('Mật khẩu phải dài ít nhất 6 ký tự!');
            }

            // Lấy danh sách users từ localStorage
            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(user => user.username === username)) {
                return alert('Tên đăng nhập đã tồn tại!');
            }

            // Thêm user mới
            users.push({ username, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            window.location.href = 'login.html';
        });
    }

    // Login form
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = loginForm.querySelector('#username').value;
            const password = loginForm.querySelector('#password').value;

            if (!username || !password) {
                return alert('Vui lòng điền đầy đủ thông tin!');
            }

            // Lấy danh sách users từ localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === username);

            if (!user) {
                return alert('Tên đăng nhập không tồn tại!');
            }
            if (user.password !== password) {
                return alert('Mật khẩu không đúng!');
            }

            alert('Đăng nhập thành công!');
            window.location.href = 'index.html';
        });
    }
});