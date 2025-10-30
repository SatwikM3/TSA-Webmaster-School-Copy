$(function(){
    var $timeline_item = $('.timeline-item');
    var $timeline_content = $('.timeline-content');

    // Add click handlers to timeline cards
    $timeline_content.on('click', function() {
        var $this = $(this);
        
        // If already active, close it with animation
        if ($this.hasClass('active')) {
            $this.removeClass('active');
            return;
        }
        
        // Close any other active cards
        $('.timeline-content.active').removeClass('active');
        
        // Open this card
        $this.addClass('active');
    });

    // Function to check if an element is in viewport
    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Function to handle scroll event
    function callbackFunc() {
        for (var i = 0; i < $timeline_item.length; i++) {
            if (isElementInViewport($timeline_item[i])) {
                $($timeline_item[i]).find('.js--fadeInLeft, .js--fadeInRight').addClass('is-visible');
                // Add a slight delay before showing content
                setTimeout(function(item) {
                    $(item).find('.timeline-content').addClass('is-visible');
                }, 300, $timeline_item[i]);
            }
        }
    }

    // Initial check on page load
    setTimeout(callbackFunc, 500);

    // Listen for scroll event
    $(window).on('scroll', function() {
        callbackFunc();
    });

    // Back to Top button
    var $back_to_top = $('.back-to-top');

    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 300) {
            $back_to_top.fadeIn();
        } else {
            $back_to_top.fadeOut();
        }
    });

    $back_to_top.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop : 0}, 800);
    });

});