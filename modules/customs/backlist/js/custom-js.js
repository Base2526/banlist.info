(function($, Drupal, drupalSettings){
    console.log('#1');
    $(document).ready(function() {
        console.log('custom-js.js hihi > ');

        $('#report-view-slick-lightbox').slickLightbox();
    });
})(jQuery, Drupal, drupalSettings);