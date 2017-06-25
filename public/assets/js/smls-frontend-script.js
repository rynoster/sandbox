function resize() {
    if (jQuery(window).width() <= 1024) {
        jQuery('.smls-main-logo-wrapper').addClass('smls-resposive-wrap');

    } else {
        jQuery('.smls-main-logo-wrapper').removeClass('smls-resposive-wrap');
    }
}
jQuery(document).ready(function($) {
    $(window).resize(resize);
    resize();
    setTimeout(function() {

        jQuery('.flipto-next').click();
    }, 1500);
//lightbox popup
    $("a[rel^='smls-popup']").prettyPhoto({
        animation_speed: 'slow', /* fast/slow/normal */
        slideshow: 10000, /* false OR interval time in ms */
        social_tools: false,
        show_title: true,
        autoplay: true,
        opacity: 0.9,
        default_width: 700,
        default_height: 344,
        deeplinking: false,
        markup: '<div class="pp_pic_holder"> \
						<div class="ppt">&nbsp;</div> \
						<div class="pp_top"> \
							<div class="pp_left"></div> \
							<div class="pp_middle"></div> \
							<div class="pp_right"></div> \
						</div> \
						<div class="pp_content_container"> \
							<div class="pp_left"> \
							<div class="pp_right"> \
								<div class="pp_content"> \
									<div class="pp_loaderIcon"></div> \
									<div class="pp_fade"> \
										<a href="#" class="pp_expand" title="Expand the image">Expand</a> \
										<div class="pp_hoverContainer"> \
											<a class="pp_next" href="#">next</a> \
											<a class="pp_previous" href="#">previous</a> \
										</div> \
										<div id="pp_full_res"></div> \
										<div class="pp_details"> \
											<div class="pp_nav"> \
												<a href="#" class="pp_arrow_previous">Previous</a> \
												<p class="currentTextHolder">0/0</p> \
												<a href="#" class="pp_arrow_next">Next</a> \
											</div> \
											<p class="pp_description"></p> \
											<div class="pp_social">{pp_social}</div> \
											<div class="smls-close"> \
											<a class="pp_close" href="#"></a> \
											</div> \
										</div> \
									</div> \
								</div> \
							</div> \
							</div> \
						</div> \
						<div class="pp_bottom"> \
							<div class="pp_left"></div> \
							<div class="pp_middle"></div> \
							<div class="pp_right"></div> \
						</div> \
					</div> \
					<div class="pp_overlay"></div>',
        changepicturecallback: function() {
            /*
             * Scroll Configuration
             */

            $('.smls-logo-description').mCustomScrollbar({
                theme: 'dark-3',
                mouseWheel: {enable: true},
                axis: 'y'

            });
            // $('body').css({'overflow-y': 'hidden'});
            $(".mCSB_inside > .mCSB_container").css("margin-right", "0px");
        }, /* Called everytime an item is shown/changed */
        callback: function() {
            // $('body').css({'overflow-y': 'visible'});

        }

    });
    smlslightbox.option({
        'resizeDuration': 1000,
        'positionFromTop': 50,
        'fadeDuration': 500,
        'wrapAround': false,
        'disableScrolling': true,
        showImageNumberLabel: false

    });
    /*
     * Scroll Configuration
     */

    $('.smls-logo-description').mCustomScrollbar({
        theme: 'dark-3',
        mouseWheel: {enable: true},
        axis: 'y'


    });
    $('.smls-grid-desp').mCustomScrollbar({
        theme: 'dark-3',
        mouseWheel: {enable: true},
        axis: 'y'


    });
    /*
     *
     * check window width
     */
    var smlsWindowWidth = $(window).width();
    $(window).resize(function() {
        smlsWindowWidth = $(window).width();
    });
    /*
     * Add responsive class for grid column
     */
    if (smlsWindowWidth > 1024) {

        for (i = 2; i <= 4; i++) {
            if ($('.smls-grid').hasClass('smls-tablet-column-' + i + '')) {

                $('.smls-grid').removeClass('smls-tablet-column-' + i + '');
            }
        }
        for (i = 1; i <= 2; i++) {
            if ($('.smls-grid').hasClass('smls-mobile-column-' + i + '')) {

                $('.smls-grid').removeClass('smls-mobile-column-' + i + '');
            }
        }


    }
    if (smlsWindowWidth > 740 && smlsWindowWidth <= 1024) {
        for (i = 2; i <= 6; i++) {
            if ($('.smls-grid').hasClass('smls-grid-column-' + i + '')) {

                $('.smls-grid').removeClass('smls-grid-column-' + i + '');
            }
        }
        for (i = 1; i <= 2; i++) {
            if ($('.smls-grid').hasClass('smls-mobile-column-' + i + '')) {

                $('.smls-grid').removeClass('smls-mobile-column-' + i + '');
            }
        }
    }

    if (smlsWindowWidth <= 740) {
        for (i = 2; i <= 6; i++) {
            if ($('.smls-grid').hasClass('smls-grid-column-' + i + '')) {

                $('.smls-grid').removeClass('smls-grid-column-' + i + '');
            }
        }
        for (i = 2; i <= 4; i++) {
            if ($('.smls-grid').hasClass('smls-tablet-column-' + i + '')) {

                $('.smls-grid').removeClass('smls-tablet-column-' + i + '');
            }
        }

    }

    /*
     * inline slidetoggle configuration
     */

    $('.smls-inline-image-container').each(function() {
        var selector = $(this);
        var id = $(this).data('id');
        $('.smls-inline-image-container[data-id="' + id + '"]').on("click", function() {
            $('.smls-grid-each-item').css('opacity', '1');
            $('.smls-logo-inline-wrap').slideUp(500, function() {
                $(this).remove();
            });
            var logo_type = selector.closest('.smls-main-logo-wrapper').data('logo-type');
            var desktop_column = selector.closest('.smls-grid-each-item').data('desktop_column');
            var ipad_column = selector.closest('.smls-grid-each-item').data('ipad_column');
            var mobile_column = selector.closest('.smls-grid-each-item').data('mobile_column');
            var image_count = selector.closest('.smls-grid-each-item').data('image_count');
            if (smlsWindowWidth > 1024) {
                var quotient = image_count / desktop_column;
                var remainder = image_count % desktop_column;
                if (remainder != 0) {
                    var additional_factor = desktop_column - remainder;
                    var append_id = image_count + additional_factor;
                } else {
                    var append_id = image_count;
                }
            } else if (smlsWindowWidth > 720) {
                var quotient = image_count / ipad_column;
                var remainder = image_count % ipad_column;
                if (remainder != 0) {
                    var additional_factor = ipad_column - remainder;
                    var append_id = image_count + additional_factor;
                } else {
                    var append_id = image_count;
                }
            } else if (smlsWindowWidth <= 720) {
                var quotient = image_count / mobile_column;
                var remainder = image_count % mobile_column;
                if (remainder != 0) {
                    var additional_factor = mobile_column - remainder;
                    var append_id = image_count + additional_factor;
                } else {
                    var append_id = image_count;
                }
            }
            var logo_key = selector.data('logo-key');
            var shortcode_id = selector.closest('.smls-grid-each-item').data('shortcode_id');
            var data = {
                action: 'smls_inline_view',
                _wpnonce: smls_frontend_js_params.ajax_nonce,
                shortcode_id: shortcode_id,
                logo_key: logo_key,
                logo_type: 'without_filter',
                beforeSend: function() {
                    selector.closest('.smls-grid-each-item').find('.smls-inline-loading').show();
                    selector.closest('.smls-grid-each-item').css('opacity', '0.3');
                }
            };
            $.ajax({
                url: smls_frontend_js_params.ajax_url,
                data: data,
                type: "POST",
                success: function(response) {

                    setTimeout(function() {
                        $('.smls-inline-loading').hide();
                        $('.smls-grid-each-item').removeClass('smls-active-inline');
                        selector.closest('.smls-grid-each-item').addClass('smls-active-inline');
                        selector.closest('.smls-main-logo-wrapper').find('.smls-grid-each-item[data-image_count="' + append_id + '"]').after(response);
                        $('.smls-logo-inline-wrap').slideDown('slow');
                        $('.smls-inline-description').mCustomScrollbar({
                            theme: 'dark-3',
                            mouseWheel: {enable: true},
                            axis: 'y'
                        });
                        $('.smls-grid-each-item').css('opacity', '0.3');
                        selector.closest('.smls-grid-each-item').css('opacity', '1');

                        $('.smls-logo-inline-delete').on("click", function() {
                            $('.smls-grid-each-item').css('opacity', '1');
                            $('.smls-grid-each-item').removeClass('smls-active-inline');
                            $(this).closest('.smls-logo-inline-wrap').slideUp(500, function() {
                                $(this).remove();
                            });
                        });
                    }, 800
                            );
                }
            });
        });
    });

    /*
     * Close slide toggle
     */


    /*
     * Filter configuration options
     */
    var smls_filter = [];
    var filter_counter = 0;
    $('.smls-filtr-container').each(function() {
        var attr_id = $(this).attr('id');
        var id = $(this).data('id');
        var layout = $(this).data('layout');
        var duration = $(this).data('duration');
        var delaymode = $(this).data('delaymode');
        var delay = $(this).data('delay');
        if (smlsWindowWidth <= 740) {
            $('.smls-filtr-item.smls-filter-masonry').css('width', '230');
            $('.smls-filtr-item.smls-filter-masonry').css('height', '230');
            $('.smls-filtr-item').css('width', '230');
            $('.smls-filtr-item').css('height', '230');

        }
        if (smlsWindowWidth > 740 && smlsWindowWidth <= 1024) {
            $('.smls-filtr-item.smls-filter-masonry').css('width', '250');
            $('.smls-filtr-item.smls-filter-masonry').css('height', '250');
            $('.smls-filtr-item').css('width', '250');
            $('.smls-filtr-item').css('height', '250');
        }
        smls_filter[filter_counter++] = $('#' + attr_id).filterizr({
            animationDuration: duration,
            delay: delay,
            "filterOutCss": {
                "opacity": 0,
                "transform": "scale(0.75)"
            },
            "filterInCss": {
                "opacity": 1,
                "transform": "scale(1)"
            },
            layout: layout,
            delayMode: delaymode,
            setupControls: false
        });
    });
    var filter_counter = 0;
    $('.smls-filter').each(function() {
        $(this).attr('data-filter-catgory-count', filter_counter);
        var selector = $(this);
        selector.find('li').click(function() {
            var filter_category_counter = $(this).parent().attr('data-filter-catgory-count');
            selector.find('li').removeClass('active');
            $(this).addClass('active');
            var filter = $(this).data('filter');
            smls_filter[filter_category_counter].filterizr('filter', filter);
        });
        filter_counter++;
    });
    //for horizontal slide of logo
    var smls_carousel = {};
    $('.smls-carousel-logo').each(function() {
        var id = $(this).data('id');
        var pager = $(this).data('pager');
        var controls = $(this).data('controls');
        var controls_type = $(this).data('controls-type');
        var slide_count = $(this).data('slide-count');
        var auto = $(this).data('autoplay');
        var auto_speed = $(this).data('auto-speed');
        var template = $(this).data('template');
        var pager_template = $(this).data('pager-template');
        var arrow_type = $(this).data('arrow-type');
        if (template == 'template-10') {
            var count = 1;
        } else {
            var count = slide_count;
        }
        if (template == 'template-2' || template == 'template-3') {

            var center = true;

        } else {
            var center = false;
        }
        if (template == 'template-4' || template == 'template-8' || template == 'template-9') {
            var margin = 0;
        } else {
            var margin = 15;
        }
        if (controls_type == 'arrow') {
            if (arrow_type == 'type-5') {
                var nav_type = [
                    '<i class="fa fa-arrow-left" aria-hidden="true"></i>',
                    '<i class="fa fa-arrow-right" aria-hidden="true"></i>'
                ];
            } else {
                var nav_type = [
                    '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                    '<i class="fa fa-angle-right" aria-hidden="true"></i>'
                ];
            }
        } else {
            var nav_type = ['<i class="fa fa-long-arrow-left" aria-hidden="true"></i>prev', 'next<i class="fa fa-long-arrow-right" aria-hidden="true"></i>'];
        }

        smls_carousel.id = $(this).owlCarousel({
            center: center,
            items: 1,
            loop: true,
            margin: margin,
            nav: controls,
            dots: pager,
            dotsEach: true,
            navText: nav_type,
            autoplay: auto,
            autoplayHoverPause: true,
            autoplayTimeout: auto_speed,
            animateOut: 'slideOutUp',
            animateIn: 'slideInUp',
            responsiveClass: true,
            responsive: {
                768: {
                    items: count
                },
                0: {
                    items: 1,
                    center: false,
                    nav: false,
                    dots: false

                },
                480: {
                    items: 1,
                    center: false,
                    nav: false,
                    dots: false

                },
                481: {
                    items: 2,
                    center: false,
                    nav: false,
                    dots: false

                },
                740: {
                    items: 2,
                    center: false,
                    nav: false,
                    dots: false

                }

            }


        });
        if (pager_template == 'template-1') {
            var i = 1;
            $('.smls-carousel-logo[data-id=' + id + '] .owl-dot').each(function() {
                $(this).text(i);
                i++;
            });
        }
    });
    //bxslider configuration options for vertical
    $('.smls-vertical-carousel').each(function() {
        var id = $(this).data('id');
        var pager = $(this).data('pager');
        var controls = $(this).data('controls');
        var autoplay = $(this).data('autoplay');
        var controls_type = $(this).data('controls-type');
        var slide_count = $(this).data('slide-count');
        var auto_speed = $(this).data('auto-speed');
        var arrow_type = $(this).data('arrow-type');
        if (controls_type == 'arrow') {
            if (arrow_type == 'type-5') {
                var next_text = '<i class="fa fa-arrow-down" aria-hidden="true"></i>';
                var pre_text = '<i class="fa fa-arrow-up" aria-hidden="true"></i>';
            } else {
                var next_text = '<i class="fa fa-angle-right" aria-hidden="true"></i>';
                var pre_text = '<i class="fa fa-angle-left" aria-hidden="true"></i>';
            }

        } else {
            var next_text = 'next<i class="fa fa-long-arrow-down" aria-hidden="true"></i>';
            var pre_text = '<i class="fa fa-long-arrow-up" aria-hidden="true"></i>prev';
        }
        smls_carousel.id = $(this).bxSlider({
            mode: 'vertical',
            useCSS: false,
            auto: autoplay,
            controls: controls,
            minSlides: slide_count,
            maxSlides: slide_count,
            moveSlides:  slide_count,
            pager: pager,
            slideWidth: 280,
            slideMargin: 10,
            nextText: next_text,
            prevText: pre_text

        });
    });
    /*
     * Perspetive
     */
    $(window).load(function() {


        setTimeout(function() {


            var prspective = [];
            $('.smls-perspective').each(function() {
                var controls_type = $(this).data('control-type');
                var arrow_type = $(this).data('arrow-type');
                var id = $(this).data('id');
                var autoplay = $(this).data('auto');
                var auto_speed = $(this).data('auto-speed');
                var control = $(this).data('control');
                if (controls_type === 'arrow') {
                    if (arrow_type === 'type-5') {
                        var next_text = '<i class="fa fa-arrow-right" aria-hidden="true"></i>';
                        var pre_text = '<i class="fa fa-arrow-left" aria-hidden="true"></i>';
                    } else {
                        var next_text = '<i class="fa fa-angle-right" aria-hidden="true"></i>';
                        var pre_text = '<i class="fa fa-angle-left" aria-hidden="true"></i>';
                    }
                } else {
                    var next_text = 'next<i class="fa fa-long-arrow-right" aria-hidden="true"></i>';
                    var pre_text = '<i class="fa fa-long-arrow-left" aria-hidden="true"></i>prev';
                }
                prspective[id] = $(this).flipster({
                    style: 'carousel',
                    spacing: -25,
                    start: 0,
                    loop: true,
                    enableNav: false,
                    enableKeyboard: false, // Enable left/right arrow navigation
                    enableTouch: true, // Enable swipe navigation for touch devices
                    enableNavButtons: control,
                    enableMousewheel: false,
                    autoplay: autoplay,
                    prevText: pre_text,
                    nextText: next_text
                }
                );
                // alert(autoplay);
                if (autoplay === true) {

                    var flipsterAutoplay = function() {
                        prspective[id].flipster("jump", "right");
                        setTimeout(flipsterAutoplay, auto_speed);
                    }
                    ;
                    setTimeout(flipsterAutoplay, auto_speed);
                }

            });

        }, 50);
    });

    /*
     * Blur Filter initialization
     */
    var gallery_item = $('.smls-tumb'),
            gallery_img = $('.smls-tumb > img');
    $('.smls-each-blur-item').click(function() {
        $('.smls-each-blur-item').removeClass('smls-current');
        $(this).closest('.smls-each-blur-item').addClass('smls-current');
        var filterVal = $(this).text().toLowerCase();
        if (filterVal == 'all') {
            gallery_item.each(function() {
                $(this).removeClass('smls-blurme')
                        .parent().addClass('smls-info');
            });
        } else {
            gallery_item.each(function() {
                if (!$(this).hasClass(filterVal)) {
                    $(this).addClass('smls-blurme')
                            .parent().addClass('smls-info');
                } else {
                    $(this).removeClass('smls-blurme')
                            .parent().removeClass('smls-info');
                }
            });
        }
        return false;
    });

// simply preloader
    gallery_img.each(function() {
        $(this).css({opacity: 0}).load(function() {
            $(this).animate({opacity: 1}, 1000);
        }).attr('src', $(this).data('src'))
                .delay(100)
                .attr('data-src', '');
    });
    /*
     * Grid inline 8  and 9 style initialization
     */


    $('.smls-eight-outer-container').on("click", function() {

        $('.smls-grid-eight-toggle-content').slideUp(700);
        $('.smls-close-detail').fadeOut(500);
        $(this).closest('.smls-eight-outer-container').find('.smls-grid-eight-toggle-content').slideDown(700);
        $('.smls-eight-content-wrap').removeClass('smls-inline-active-wrap');
        $(this).closest('.smls-logo-block-container').find('.smls-eight-content-wrap').addClass('smls-inline-active-wrap');
        $('.smls-logo-rec-wrap').css("opacity", "0.3");
        $(this).closest('.smls-logo-rec-wrap').css("opacity", "1");
        $(this).closest('.smls-eight-content-wrap').find('.smls-close-detail').fadeIn(200);
    });
    $('body').on('click', '.smls-image-wrap', function() {
        $('.smls-grid-nine-container').fadeOut(500);
        $('.smls-close-detail').fadeOut(500);
        $(this).closest('.smls-block-nine-img-wrap').find('.smls-grid-nine-container').fadeIn(500);
        $(this).closest('.smls-block-nine-img-wrap').find('.smls-close-detail').fadeIn(500);
    });
    $('body').on('click', '.smls-close-detail', function() {

        $(this).closest('.smls-block-nine-img-wrap').find('.smls-grid-nine-container').fadeOut(500);
        $(this).closest('.smls-block-content-wrap').find('.smls-grid-eight-toggle-content').slideUp(700);
        $('.smls-logo-rec-wrap').css("opacity", "1");
        $(this).closest('.smls-eight-content-wrap').find('.smls-close-detail').fadeOut(500);
        $(this).closest('.smls-logo-block-container').find('.smls-eight-content-wrap').removeClass('smls-inline-active-wrap');
    });

    /*
     * Tooltip
     */
    var smls_tool = {};
    $('.smls-tooltip').each(function() {
        var id = $(this).data('id');
        var tool_template = $(this).data('template');
        var tool_position = $(this).data('position');
        var animation = $(this).data('animation');
        var duration = $(this).data('duration');
        smls_tool.id = $(this).tooltipster({
            animation: 'animation',
            animationDuration: duration,
            position: tool_position, // display the tips to the right of the element
            theme: ['tooltipster-noir', 'smls-tooltip-' + tool_template + '']
        });
    });

    /*
     * list inline
     */

    $('.smls-list-inline-open').click(function() {
        if ($(this).closest('.smls-list-block').hasClass('smls-list-active-inline')) {
            $(this).closest('.smls-list-block').removeClass('smls-list-active-inline');
            $(this).closest('.smls-list-block').find('.smls-list-inline-wrap').slideUp(700);
            $(this).closest('.smls-list-block').find('.smls-close-list-inline').fadeOut(700);
        } else {
            $('.smls-list-inline-wrap').slideUp(700);
            $('.smls-list-block').removeClass('smls-list-active-inline');
            $(this).closest('.smls-list-block').find('.smls-list-inline-wrap').slideDown(700);
            $(this).closest('.smls-list-block').addClass('smls-list-active-inline');
            $('.smls-close-list-inline').fadeOut(700);
            $(this).closest('.smls-list-block').find('.smls-close-list-inline').fadeIn(700);
        }

    });
    $('body').on('click', '.smls-close-list-inline', function() {
        $('.smls-list-block').removeClass('smls-list-active-inline');
        $(this).closest('.smls-list-block').find('.smls-close-list-inline').fadeOut(700);
        $(this).closest('.smls-list-block').find('.smls-list-inline-wrap').slideUp(700);
    });


});

