$(document).ready(function() {
    // Initialize variables
    let currentStep = 1;
    const totalSteps = 3;
    
    // Station data
    const stations = [
        'uttara_north', 'uttara_center', 'uttara_south', 'pallabi',
        'mirpur11', 'mirpur10', 'kazipara', 'shewrapara', 'agargaon'
    ];

    // Populate "To Station" dropdown based on "From Station" selection
    $('#fromStation').on('change', function() {
        const selectedStation = $(this).val();
        const $toStation = $('#toStation');
        
        $toStation.empty().append('<option value="">Select Station</option>');
        
        stations.forEach(station => {
            if (station !== selectedStation) {
                const stationName = station.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                $toStation.append(`<option value="${station}">${stationName}</option>`);
            }
        });
    });

    // Handle step navigation
    function updateProgressBar() {
        $('.progress-step').removeClass('active completed');
        
        for (let i = 1; i <= totalSteps; i++) {
            if (i < currentStep) {
                $(`.progress-step[data-step="${i}"]`).addClass('completed');
            } else if (i === currentStep) {
                $(`.progress-step[data-step="${i}"]`).addClass('active');
            }
        }
    }

    function showStep(step) {
        $('.checkout-step').removeClass('active');
        $(`#step${step}`).addClass('active');
        currentStep = step;
        updateProgressBar();
    }

    // Validate step before proceeding
    function validateStep(step) {
        switch(step) {
            case 1:
                return $('#fromStation').val() && $('#toStation').val() && 
                       $('#journeyDate').val() && $('#journeyType').val();
            case 2:
                // Fixed validation for ticket selection
                const adultTickets = parseInt($('.qty-input[data-type="adult"]').val()) || 0;
                const childTickets = parseInt($('.qty-input[data-type="child"]').val()) || 0;
                const totalTickets = adultTickets + childTickets;
                // At least one ticket is required and total should not exceed 10
                return totalTickets > 0 && totalTickets <= 10 && adultTickets >= 1;
            case 3:
                return $('input[name="payment"]:checked').length > 0;
            default:
                return true;
        }
    }

    // Handle next button clicks
    $('.btn-next').click(function() {
        if (validateStep(currentStep)) {
            showStep(currentStep + 1);
        } else {
            if (currentStep === 2) {
                alert('Please ensure you have at least one adult ticket and the total tickets do not exceed 10.');
            } else {
                alert('Please fill in all required fields before proceeding.');
            }
        }
    });

    // Handle back button clicks
    $('.btn-back').click(function() {
        showStep(currentStep - 1);
    });

    // Ticket quantity management
    $('.qty-btn').click(function() {
        const type = $(this).data('type');
        const input = $(`.qty-input[data-type="${type}"]`);
        let value = parseInt(input.val());

        if ($(this).hasClass('plus') && value < 5) {
            value++;
        } else if ($(this).hasClass('minus') && value > (type === 'adult' ? 1 : 0)) {
            value--;
        }

        input.val(value);
        updateFareSummary();
    });

    // Update fare summary
    function updateFareSummary() {
        const adultQty = parseInt($('.qty-input[data-type="adult"]').val());
        const childQty = parseInt($('.qty-input[data-type="child"]').val());
        const adultFare = 60;
        const childFare = 30;

        const adultTotal = adultQty * adultFare;
        const childTotal = childQty * childFare;
        const totalFare = adultTotal + childTotal;

        // Update fare summary display
        $('.fare-details').html(`
            <div class="fare-item">
                <span>Adult Tickets (${adultQty})</span>
                <span>৳${adultTotal}</span>
            </div>
            <div class="fare-item">
                <span>Child Tickets (${childQty})</span>
                <span>৳${childTotal}</span>
            </div>
            <div class="fare-item total">
                <span>Total Fare</span>
                <span>৳${totalFare}</span>
            </div>
        `);
    }

    // Handle payment method selection
    $('input[name="payment"]').change(function() {
        const paymentMethod = $(this).attr('id');
        const $paymentForm = $('.payment-form');
        
        // Clear previous form
        $paymentForm.find('.form-group').not(':first').remove();
        
        // Add specific fields based on payment method
        if (paymentMethod === 'card') {
            $paymentForm.append(`
                <div class="form-group">
                    <label>Card Number</label>
                    <input type="text" placeholder="Enter card number" required>
                </div>
                <div class="form-group">
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" required>
                </div>
                <div class="form-group">
                    <label>CVV</label>
                    <input type="text" placeholder="Enter CVV" required>
                </div>
            `);
        }
    });
function createPaymentPopup(type) {
        const isNagad = type === 'nagad';
        const style = isNagad ? 
            'background-color: #DC143C; color: white;' : 
            'background-color: #E2136E; color: white;';
        const logo = isNagad ? 'Nagad' : 'bKash';
        const numberPlaceholder = isNagad ? 
            '017-XXXX-XXXX' : 
            '01XXXXXXXXX';

        return `
            <div class="payment-popup" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                width: 90%; max-width: 400px; padding: 20px; border-radius: 10px; z-index: 1000; ${style}">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2>${logo} Payment</h2>
                </div>
                <div style="margin-bottom: 15px;">
                    <p>Merchant: Dhaka Metro Rail</p>
                    <p>Invoice no: ${generateInvoiceNumber()}</p>
                    <p>Amount: ৳${calculateTotalAmount()}</p>
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Your ${logo} Account Number</label>
                    <input type="text" class="mobile-number" placeholder="${numberPlaceholder}" 
                        style="width: 100%; padding: 8px; border: 1px solid #fff; border-radius: 5px; background: white; color: black;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Transaction ID</label>
                    <input type="text" class="transaction-id" placeholder="Enter Transaction ID" 
                        style="width: 100%; padding: 8px; border: 1px solid #fff; border-radius: 5px; background: white; color: black;">
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="proceed-btn" style="flex: 1; padding: 10px; border: none; border-radius: 5px; background: white; color: ${isNagad ? '#DC143C' : '#E2136E'}; cursor: pointer;">Proceed</button>
                    <button class="close-btn" style="flex: 1; padding: 10px; border: none; border-radius: 5px; background: white; color: ${isNagad ? '#DC143C' : '#E2136E'}; cursor: pointer;">Close</button>
                </div>
                <div style="margin-top: 15px;">
                    <label style="display: flex; align-items: center; color: white;">
                        <input type="checkbox" class="terms-checkbox" style="margin-right: 8px;">
                        I agree to the terms and conditions
                    </label>
                </div>
            </div>
            <div class="popup-overlay" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 999;"></div>
        `;
    }

    // Function to generate random invoice number
    function generateInvoiceNumber() {
        return Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // Function to calculate total amount
    function calculateTotalAmount() {
        const adultQty = parseInt($('.qty-input[data-type="adult"]').val());
        const childQty = parseInt($('.qty-input[data-type="child"]').val());
        return (adultQty * 60) + (childQty * 30);
    }

    // Handle payment method selection
    $('input[name="payment"]').change(function() {
        const paymentMethod = $(this).attr('id');
        const $paymentForm = $('.payment-form');
        
        // Clear previous form
        $paymentForm.find('.form-group').not(':first').remove();
        
        // Add specific fields based on payment method
        if (paymentMethod === 'card') {
            $paymentForm.append(`
                <div class="form-group">
                    <label>Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" required 
                           pattern="[0-9]{16}" maxlength="16">
                </div>
                <div class="form-group">
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" required 
                           pattern="(0[1-9]|1[0-2])\/([0-9]{2})" maxlength="5">
                </div>
                <div class="form-group">
                    <label>CVV</label>
                    <input type="password" placeholder="***" required 
                           pattern="[0-9]{3,4}" maxlength="4">
                </div>
                <div class="form-group">
                    <label>Card Holder Name</label>
                    <input type="text" placeholder="Name on card" required>
                </div>
            `);
        } else {
            // Remove any existing popup
            $('.payment-popup, .popup-overlay').remove();
            
            // Create and append new popup
            $('body').append(createPaymentPopup(paymentMethod));
            
            // Show popup when payment method is selected
            $('.payment-popup, .popup-overlay').show();
            
            // Handle popup close
            $('.close-btn, .popup-overlay').click(function() {
                $('.payment-popup, .popup-overlay').hide();
            });
            
            // Handle proceed button
            $('.proceed-btn').click(function() {
                const mobileNumber = $('.mobile-number').val();
                const transactionId = $('.transaction-id').val();
                const termsAccepted = $('.terms-checkbox').is(':checked');
                
                if (!mobileNumber || !transactionId || !termsAccepted) {
                    alert('Please fill in all fields and accept the terms and conditions.');
                    return;
                }
                
                // Here you would typically validate and process the payment
                console.log('Processing payment:', {
                    method: paymentMethod,
                    mobileNumber,
                    transactionId
                });
                
                $('.payment-popup, .popup-overlay').hide();
                alert('Payment processed successfully!');
            });
        }
    });
// Card patterns for detection
const cardPatterns = {
    visa: {
        pattern: /^4/,
        logo: '/api/placeholder/40/25'  // Replace with actual Visa logo path
    },
    mastercard: {
        pattern: /^5[1-5]/,
        logo: '/api/placeholder/40/25'  // Replace with actual Mastercard logo path
    },
    amex: {
        pattern: /^3[47]/,
        logo: '/api/placeholder/40/25'  // Replace with actual American Express logo path
    },
    jcb: {
        pattern: /^35/,
        logo: '/api/placeholder/40/25'  // Replace with actual JCB logo path
    }
};

// Payment popup template
function createPaymentPopup(type) {
    const isNagad = type === 'nagad';
    const style = isNagad ? 
        'background-color: #ef3421; color: white;' : 
        'background-color: #e8146c; color: white;';
    const logo = isNagad ? 
        '<img src="img/nagad.png" alt="Nagad" style="max-width: 150px; margin-bottom: 15px;">' : 
        '<img src="img/bkash.png" alt="bKash" style="max-width: 150px; margin-bottom: 15px;">';
    const numberPlaceholder = isNagad ? 
        '017-XXXX-XXXX' : 
        '01XXXXXXXXX';

    return `
        <div class="payment-popup" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
            width: 90%; max-width: 400px; padding: 20px; border-radius: 10px; z-index: 1000; ${style}">
            <div style="text-align: center; margin-bottom: 20px;">
                ${logo}
                <h2>${isNagad ? 'Nagad' : 'bKash'} Payment</h2>
            </div>
            <div style="margin-bottom: 15px;">
                <p>Merchant: Dhaka Metro Rail</p>
                <p>Invoice no: ${generateInvoiceNumber()}</p>
                <p>Amount: ৳${calculateTotalAmount()}</p>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Your ${isNagad ? 'Nagad' : 'bKash'} Account Number</label>
                <input type="text" class="mobile-number" placeholder="${numberPlaceholder}" 
                    style="width: 100%; padding: 8px; border: 1px solid #fff; border-radius: 5px; background: white; color: black;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Transaction ID</label>
                <input type="text" class="transaction-id" placeholder="Enter Transaction ID" 
                    style="width: 100%; padding: 8px; border: 1px solid #fff; border-radius: 5px; background: white; color: black;">
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="proceed-btn" style="flex: 1; padding: 10px; border: none; border-radius: 5px; background: white; color: ${isNagad ? '#DC143C' : '#E2136E'}; cursor: pointer;">Proceed</button>
                <button class="close-btn" style="flex: 1; padding: 10px; border: none; border-radius: 5px; background: white; color: ${isNagad ? '#DC143C' : '#E2136E'}; cursor: pointer;">Close</button>
            </div>
            <div style="margin-top: 15px;">
                <label style="display: flex; align-items: center; color: white;">
                    <input type="checkbox" class="terms-checkbox" style="margin-right: 8px;">
                    I agree to the terms and conditions
                </label>
            </div>
        </div>
        <div class="popup-overlay" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 999;"></div>
    `;
}

// Handle payment method selection
$('input[name="payment"]').change(function() {
    const paymentMethod = $(this).attr('id');
    const $paymentForm = $('.payment-form');
    
    // Clear previous form
    $paymentForm.find('.form-group').not(':first').remove();
    
    // Add specific fields based on payment method
    if (paymentMethod === 'card') {
        $paymentForm.append(`
            <div class="form-group">
                <label>Card Number</label>
                <div style="position: relative;">
                    <input type="text" class="card-number" placeholder="1234 5678 9012 3456" required 
                           pattern="[0-9]{16}" maxlength="16" style="width: 100%; padding-right: 50px;">
                    <div class="card-type-icon" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%);"></div>
                </div>
            </div>
            <div class="form-group">
                <label>Expiry Date</label>
                <input type="text" class="expiry-date" placeholder="MM/YY" required 
                       pattern="(0[1-9]|1[0-2])\/([0-9]{2})" maxlength="5">
            </div>
            <div class="form-group">
                <label>CVV</label>
                <input type="password" class="cvv" placeholder="***" required 
                       pattern="[0-9]{3,4}" maxlength="4">
            </div>
            <div class="form-group">
                <label>Card Holder Name</label>
                <input type="text" class="card-holder" placeholder="Name on card" required>
            </div>
        `);

        // Handle card number input for type detection
        $('.card-number').on('input', function() {
            const cardNumber = $(this).val().replace(/\s/g, '');
            const $cardTypeIcon = $('.card-type-icon');
            
            // Reset card type icon
            $cardTypeIcon.html('');
            
            // Detect card type
            for (const [cardType, data] of Object.entries(cardPatterns)) {
                if (data.pattern.test(cardNumber)) {
                    $cardTypeIcon.html(`<img src="${data.logo}" alt="${cardType}" style="height: 25px;">`);
                    break;
                }
            }

            // Format card number with spaces
            if (cardNumber) {
                $(this).val(cardNumber.replace(/(\d{4})/g, '$1 ').trim());
            }
        });

        // Handle expiry date input formatting
        $('.expiry-date').on('input', function() {
            let value = $(this).val().replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substr(0, 2) + '/' + value.substr(2);
            }
            $(this).val(value);
        });
    } else {
        // Remove any existing popup
        $('.payment-popup, .popup-overlay').remove();
        
        // Create and append new popup
        $('body').append(createPaymentPopup(paymentMethod));
        
        // Show popup when payment method is selected
        $('.payment-popup, .popup-overlay').show();
        
        // Handle popup close
        $('.close-btn, .popup-overlay').click(function() {
            $('.payment-popup, .popup-overlay').hide();
        });
        
        // Handle proceed button
        $('.proceed-btn').click(function() {
            const mobileNumber = $('.mobile-number').val();
            const transactionId = $('.transaction-id').val();
            const termsAccepted = $('.terms-checkbox').is(':checked');
            
            if (!mobileNumber || !transactionId || !termsAccepted) {
                alert('Please fill in all fields and accept the terms and conditions.');
                return;
            }
            
            // Here you would typically validate and process the payment
            console.log('Processing payment:', {
                method: paymentMethod,
                mobileNumber,
                transactionId
            });
            
            $('.payment-popup, .popup-overlay').hide();
            alert('Payment processed successfully!');
        });
    }
});
    // Handle confirm payment button
$('.btn-confirm').click(function() {
    if (validateStep(3)) {
        // Collect all form data
        const formData = {
            journey: {
                from: $('#fromStation').val(),
                to: $('#toStation').val(),
                date: $('#journeyDate').val(),
                type: $('#journeyType').val()
            },
            tickets: {
                adult: parseInt($('.qty-input[data-type="adult"]').val()),
                child: parseInt($('.qty-input[data-type="child"]').val())
            },
            payment: {
                method: $('input[name="payment"]:checked').attr('id'),
                mobileNumber: $('input[type="tel"]').val()
            }
        };

        // Log data for debugging (optional)
        console.log('Submitting order:', formData);

        // Redirect to ticket.html
        window.location.href = 'ticket.html';
    } else {
        alert('Please fill in all required payment information.');
    }
});

    // Set minimum date for journey date picker to today
    const today = new Date().toISOString().split('T')[0];
    $('#journeyDate').attr('min', today);

    // Initialize the first step
    showStep(1);
    updateFareSummary();
});