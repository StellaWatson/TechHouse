document.addEventListener('DOMContentLoaded', () => {
    // Tab switching logic
    const tabs = document.querySelectorAll('.tab_navigation a');
    const sections = document.querySelectorAll('.content_section');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = tab.getAttribute('href').substring(1);
            
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            document.getElementById(targetId).style.display = 'block';
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Default view
    if (sections.length > 0) {
        sections.forEach((s, i) => s.style.display = i === 0 ? 'block' : 'none');
        tabs[0].classList.add('active');
    }

    // Load user info from localStorage if available
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {
        firstName: 'Stella',
        middleName: '',
        lastName: 'Watson',
        birthday: '22.12.2000',
        gender: 'Female',
        email: 'stella@example.com',
        phone: '+123456789'
    };

    const inputs = document.querySelectorAll('.form_input');
    if (inputs.length >= 7) {
        inputs[0].value = userInfo.firstName;
        inputs[1].value = userInfo.middleName;
        inputs[2].value = userInfo.lastName;
        inputs[3].value = userInfo.birthday;
        inputs[4].value = userInfo.gender;
        inputs[5].value = userInfo.email;
        inputs[6].value = userInfo.phone;
    }

    // Save info on change
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            const updatedInfo = {
                firstName: inputs[0].value,
                middleName: inputs[1].value,
                lastName: inputs[2].value,
                birthday: inputs[3].value,
                gender: inputs[4].value,
                email: inputs[5].value,
                phone: inputs[6].value
            };
            localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
            document.querySelector('.profile_header h1').textContent = `${updatedInfo.firstName} ${updatedInfo.lastName}`;
        });
    });

    const logoutBtn = document.querySelector('.logout_btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            alert('Logging out...');
            // In a real app, clear session/token
            window.location.href = 'index.html';
        });
    }
});
