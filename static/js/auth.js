$(document).ready(function () {
    // Only show demo credentials on login page
    

    // Toggle Password Visibility
    $('.toggle-password').click(function () {
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
   

    // Registration Form Handler
    // $('#registerForm').on('submit', function(e) {
    //     e.preventDefault();
        
    //     const phone = $('#phone').val();
    //     const email = $('#email').val();
    //     const password = $('#password').val();
    //     const confirmPassword = $('#confirmPassword').val();

    //     // Validate phone (Bangladeshi format)
    //     // const phonePattern = /^1[3-9]\d{8}$/;
    //     // if (!phonePattern.test(phone)) {
    //     //     alert('Please enter a valid Bangladeshi phone number');
    //     //     return;
    //     // }

    //     // Validate email
    //     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     if (!emailPattern.test(email)) {
    //         alert('Please enter a valid email address');
    //         return;
    //     }

    //     // Check if passwords match
    //     if (password !== confirmPassword) {
    //         alert('Passwords do not match');
    //         return;
    //     }
        
    // });
});