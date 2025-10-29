$(function(){

    var $timeline_item = $('.timeline-item');

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
            }
        }
    }

    // Initial check on page load
    callbackFunc();

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