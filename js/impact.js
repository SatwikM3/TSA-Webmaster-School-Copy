document.addEventListener('DOMContentLoaded', function() {
    // Animate stats when they come into view
    const statCards = document.querySelectorAll('.stat-card');
    const chartCards = document.querySelectorAll('.chart-card');
    const storyCards = document.querySelectorAll('.story-card');

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                if (entry.target.classList.contains('stat-card')) {
                    animateNumber(entry.target);
                }
            }
        });
    }, { threshold: 0.2 });

    // Observe all cards
    statCards.forEach(card => observer.observe(card));
    chartCards.forEach(card => observer.observe(card));
    storyCards.forEach(card => observer.observe(card));

    // Number animation function
    function animateNumber(card) {
        const number = card.querySelector('.stat-number');
        const targetValue = parseInt(card.dataset.value);
        const duration = 2000; // 2 seconds
        const steps = 60;
        const stepValue = targetValue / steps;
        let currentValue = 0;
        let currentStep = 0;

        const progressBar = card.querySelector('.stat-progress');

        const interval = setInterval(() => {
            currentStep++;
            currentValue = Math.min(Math.round(stepValue * currentStep), targetValue);
            number.textContent = currentValue.toLocaleString();
            
            // Update progress bar
            const progress = (currentValue / targetValue) * 100;
            progressBar.style.width = `${progress}%`;

            if (currentValue >= targetValue) {
                clearInterval(interval);
            }
        }, duration / steps);
    }

    // Initialize Charts
    const growthCtx = document.getElementById('growthChart').getContext('2d');
    const distributionCtx = document.getElementById('distributionChart').getContext('2d');

    // Growth Chart
    new Chart(growthCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            datasets: [{
                label: 'Community Members',
                data: [500, 800, 1200, 1500, 1800, 2000, 2200, 2350, 2450, 2500],
                borderColor: '#007bff',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(0, 123, 255, 0.1)'
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Distribution Chart
    new Chart(distributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Environmental', 'Education', 'Food & Supplies', 'Health', 'Community Building'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    '#007bff',
                    '#00b4d8',
                    '#0096c7',
                    '#48cae4',
                    '#90e0ef'
                ]
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 2000,
                animateRotate: true,
                animateScale: true
            }
        }
    });

    // Initialize Animsition
    $(".animsition").animsition({
        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 1500,
        outDuration: 800,
        linkElement: '.animsition-link',
        loading: true,
        loadingParentElement: 'body',
        loadingClass: 'animsition-loading',
        loadingInner: '',
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: ['animation-duration', '-webkit-animation-duration'],
        overlay: false,
        overlayClass: 'animsition-overlay-slide',
        overlayParentElement: 'body',
        transition: function(url) { window.location.href = url; }
    });
});