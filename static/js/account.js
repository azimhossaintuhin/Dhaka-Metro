$(document).ready(function() {
    // Handle sidebar navigation
    $('.account-nav a').click(function(e) {
        e.preventDefault();
        
        // Update active navigation link
        $('.account-nav a').removeClass('active');
        $(this).addClass('active');
        
        // Show corresponding section
        const targetSection = $(this).attr('href').substring(1);
        $('.account-section').removeClass('active');
        $(`#${targetSection}`).addClass('active');
    });

    // Load user data (mock implementation)
    function loadUserData() {
        // This would typically fetch from an API
        const userData = {
            name: 'Foysal Zihak',
            email: 'hello@zihak.me',
            activeTickets: 2,
            totalTrips: 47,
            balance: 500,
            recentActivity: [
                {
                    type: 'trip',
                    title: 'Trip Completed',
                    details: 'Uttara North to Agargaon',
                    time: 'Today, 10:30 AM'
                },
                {
                    type: 'purchase',
                    title: 'Ticket Purchased',
                    details: 'Day Pass',
                    time: 'Yesterday, 2:15 PM'
                }
                // More activities...
            ]
        };

        updateDashboard(userData);
    }

    // Update dashboard with user data
    function updateDashboard(userData) {
        // $('.user-name').text(userData.name);
        // $('.user-email').text(userData.email);
        
        // // Update stats
        // updateStats(userData);
        
        // Update activity list
        updateActivityList(userData.recentActivity);
    }

    // Update dashboard statistics
    function updateStats(userData) {
        const stats = {
            activeTickets: userData.activeTickets,
            totalTrips: userData.totalTrips,
            balance: `৳${userData.balance}`
        };

        Object.entries(stats).forEach(([key, value]) => {
            $(`.stat-card:contains("${key.replace(/([A-Z])/g, ' $1').trim()}")`)
                .find('span')
                .text(value);
        });
    }

    // Update activity list
    function updateActivityList(activities) {
        const activityList = $('.activity-list');
        activityList.empty();

        activities.forEach(activity => {
            const activityItem = $(`
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-${activity.type === 'trip' ? 'train' : 'ticket-alt'}"></i>
                    </div>
                    <div class="activity-details">
                        <h4>${activity.title}</h4>
                        <p>${activity.details}</p>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                </div>
            `);
            activityList.append(activityItem);
        });
    }

    // Handle profile image upload
    $('.profile-image').click(function() {
        $('<input type="file" accept="image/*">').click().change(function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    $('.profile-image img').attr('src', event.target.result);
                 
                    // Here you would typically upload the image to your server
                };
                const formData = new FormData();
                formData.append("iamge", e.target.files[0]);
                reader.readAsDataURL(e.target.files[0]);
                console.log(e.target.files[0]);
                fetch("/account/profile/image/", {
                    method: "POST",
                    body: formData,
                    headers: {
                        "X-CSRFToken": $('meta[name=csrf-token]').attr('content')
                    }
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);  
                })
                .catch(error => {
                    console.error("Error:", error);
                });
            }
        });
    });

    // Initialize dashboard
    loadUserData();
});