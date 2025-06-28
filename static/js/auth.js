$(document).ready(function() {
    // Only show demo credentials on login page
    if ($('#loginForm').length > 0) {
        const demoNotice = `
            <div class="demo-notice" style="text-align: center; margin-bottom: 20px; padding: 10px; background: #f0f8ff; border-radius: 5px;">
                <p style="margin: 0; font-weight: bold;">Demo Credentials</p>
                <code>Phone: 01234567891<br>Password: 123456</code>
            </div>
        `;
        $('.auth-form-container h2').after(demoNotice);
    }

    // Toggle Password Visibility
    $('.toggle-password').click(function() {
        const input = $(this).parent().find('input');
        const icon = $(this).find('i');
        
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            input.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    // Login Form Handler
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        const phone = $('#phone').val();
        const password = $('#password').val();

        // Check demo credentials
        if (phone === '01234567891' && password === '123456') {
            alert('Login successful!');
            window.location.href = 'account.html';
        } else {
            alert('Invalid credentials. Please use the demo credentials shown above.');
        }
    });

    // Registration Form Handler
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();
        
        const phone = $('#phone').val();
        const email = $('#email').val();
        const password = $('#password').val();
        const confirmPassword = $('#confirmPassword').val();

        // Validate phone (Bangladeshi format)
        const phonePattern = /^1[3-9]\d{8}$/;
        if (!phonePattern.test(phone)) {
            alert('Please enter a valid Bangladeshi phone number');
            return;
        }

        // Validate email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // If all validations pass
        alert('Registration successful!');
        window.location.href = 'account.html';
    });
});