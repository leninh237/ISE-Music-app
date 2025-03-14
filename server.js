const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// đăng ký
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    if (username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9]+$/.test(username)) {
        return res.status(400).json({ message: 'Tên đăng nhập phải dài 3-20 ký tự và chỉ chứa chữ cái hoặc số!' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu phải dài ít nhất 6 ký tự!' });
    }

    let users = [];
    try {
        if (fs.existsSync('users.json')) {
            users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
        }
        if (users.some(user => user.username === username)) {
            return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại!' });
        }

        users.push({ username, email, password });
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
        res.json({ message: 'Đăng ký thành công! Vui lòng đăng nhập.' });
    } catch (error) {
        console.error('Lỗi ghi file:', error);
        res.status(500).json({ message: 'Lỗi server khi ghi dữ liệu, vui lòng thử lại!' });
    }
});

// đăng nhập
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!' });
    }

    try {
        if (!fs.existsSync('users.json')) {
            return res.status(500).json({ message: 'File dữ liệu người dùng không tồn tại!' });
        }

        const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
        const user = users.find(u => u.username === username);

        if (!user) {
            return res.status(401).json({ message: 'Tên đăng nhập không tồn tại!' });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: 'Mật khẩu không đúng!' });
        }

        res.json({ message: 'Đăng nhập thành công!' });
    } catch (error) {
        console.error('Lỗi đọc file:', error);
        res.status(500).json({ message: 'Lỗi server khi đọc dữ liệu, vui lòng thử lại!' });
    }
});

// Chuyển hướng đến signup.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.listen(3000, () => {
    console.log('Server chạy trên http://localhost:3000');
});