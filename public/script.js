document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.toggle');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const audioPlayer = document.getElementById('audio-player');
    const songList = document.getElementById('song-list');
    const uploadAudio = document.getElementById('upload-audio');
    const uploadBtn = document.getElementById('upload-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Kiểm tra trạng thái đăng nhập khi vào index.html
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        if (localStorage.getItem('loggedIn') !== 'true') {
            window.location.href = 'login.html';
        } else {
            initMusicPlayer();
        }
    }

    // Toggle sáng/tối
    toggleButtons.forEach(toggle => {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
        });
    });

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }

    // Xử lý đăng ký
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = signupForm.querySelector('#username').value;
            const email = signupForm.querySelector('#email').value;
            const password = signupForm.querySelector('#password').value;

            if (!username || !email || !password) {
                return alert('Vui lòng điền đầy đủ thông tin!');
            }

            if (username.length < 3 || username.length > 20 || !/^[a-zA-Z0-9]+$/.test(username)) {
                return alert('Tên đăng nhập phải dài 3-20 ký tự và chỉ chứa chữ cái hoặc số!');
            }
            if (password.length < 6) {
                return alert('Mật khẩu phải dài ít nhất 6 ký tự!');
            }

            try {
                const response = await fetch('http://localhost:3000/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                });
                const result = await response.json();

                if (response.ok) {
                    alert(result.message);
                    window.location.href = 'login.html';
                } else {
                    alert(result.error || 'Lỗi khi đăng ký!');
                }
            } catch (err) {
                console.error('Lỗi khi gọi API đăng ký:', err);
                alert('Không thể kết nối đến server. Vui lòng kiểm tra server!');
            }
        });
    }

    // Xử lý đăng nhập
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = loginForm.querySelector('#username').value;
            const password = loginForm.querySelector('#password').value;

            if (!username || !password) {
                return alert('Vui lòng điền đầy đủ thông tin!');
            }

            try {
                const response = await fetch('http://localhost:3000/api/users');
                if (!response.ok) {
                    throw new Error('Không thể lấy danh sách người dùng!');
                }
                const users = await response.json();

                const user = users.find(u => u.username === username);

                if (!user) {
                    return alert('Tên đăng nhập không tồn tại!');
                }
                if (user.password !== password) {
                    return alert('Mật khẩu không đúng!');
                }

                localStorage.setItem('loggedIn', 'true');
                alert('Đăng nhập thành công!');
                window.location.href = 'index.html';
            } catch (err) {
                console.error('Lỗi khi gọi API đăng nhập:', err);
                alert('Không thể kết nối đến server. Vui lòng kiểm tra server!');
            }
        });
    }

    // Logic phát nhạc
    function initMusicPlayer() {
        if (!audioPlayer) return; // Chỉ chạy trên index.html

        let songs = [];
        let currentSongIndex = 0;

        uploadBtn.addEventListener('click', async () => {
            const files = uploadAudio.files;
            if (files.length === 0) {
                alert('Vui lòng chọn file để tải lên!');
                return;
            }

            const formData = new FormData();
            for (let file of files) {
                formData.append('audio', file);
            }

            try {
                const response = await fetch('http://localhost:3000/api/upload', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (response.ok) {
                    result.files.forEach((url, index) => {
                        const fileName = files[index].name;
                        songs.push({ name: fileName, url });
                        const li = document.createElement('li');
                        li.textContent = fileName;
                        li.addEventListener('click', () => playSong(songs.indexOf({ name: fileName, url })));
                        songList.appendChild(li);
                    });
                    uploadAudio.value = '';
                    alert(result.message);
                } else {
                    alert(result.error);
                }
            } catch (err) {
                console.error('Lỗi khi gọi API upload:', err);
                alert('Không thể kết nối đến server. Vui lòng kiểm tra server!');
            }
        });

        function playSong(index) {
            if (index >= 0 && index < songs.length) {
                currentSongIndex = index;
                audioPlayer.src = songs[index].url;
                audioPlayer.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
        }

        playPauseBtn.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                audioPlayer.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentSongIndex > 0) playSong(currentSongIndex - 1);
        });

        nextBtn.addEventListener('click', () => {
            if (currentSongIndex < songs.length - 1) playSong(currentSongIndex + 1);
        });
    }
});