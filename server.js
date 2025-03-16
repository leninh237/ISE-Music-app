const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const app = express();

// Cấu hình multer để xử lý upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Đường dẫn đến file users.json
const usersFilePath = path.join(__dirname, 'users.json');

// Middleware
app.use(cors()); // Cho phép CORS
app.use(express.json());
app.use(express.static('public'));

// API lấy danh sách users
app.get('/api/users', async (req, res) => {
    try {
        const data = await fs.readFile(usersFilePath, 'utf8');
        const users = JSON.parse(data);
        res.json(users);
    } catch (err) {
        console.error('Lỗi khi đọc file users.json:', err);
        res.status(500).json({ error: 'Không thể đọc file users.json' });
    }
});

// API thêm user mới
app.post('/api/users', async (req, res) => {
    try {
        const newUser = req.body;
        const data = await fs.readFile(usersFilePath, 'utf8');
        const users = JSON.parse(data);

        // Kiểm tra xem username đã tồn tại chưa
        if (users.some(user => user.username === newUser.username)) {
            return res.status(400).json({ error: 'Tên đăng nhập đã tồn tại!' });
        }

        users.push(newUser);
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (err) {
        console.error('Lỗi khi ghi file users.json:', err);
        res.status(500).json({ error: 'Không thể ghi vào file users.json' });
    }
});

// API upload file nhạc
app.post('/api/upload', upload.array('audio'), (req, res) => {
    const files = req.files;
    if (!files || files.length === 0) {
        return res.status(400).json({ error: 'Không có file nào được tải lên!' });
    }
    const fileUrls = files.map(file => `/uploads/${file.filename}`);
    res.json({ message: 'Tải lên thành công!', files: fileUrls });
});

// Khởi động server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});