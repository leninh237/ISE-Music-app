document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.toggle');
    const body = document.body;
    const menuItems = document.querySelectorAll('.menu-list-item');
    const profileContainer = document.querySelector('.profile-text-container');

    // Xử lý toggle chế độ sáng/tối
    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark');
        
        // Lưu trạng thái vào localStorage (tùy chọn)
        if (body.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark');
    }

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    profileContainer.addEventListener('click', () => {
        console.log('Profile clicked!');
    });
});