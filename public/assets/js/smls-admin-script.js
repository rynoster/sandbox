(function($) {

    /**
     * Add logo functionality
     */
    $(function() {
        $('.smls-color-picker').wpColorPicker();
        $(".smls-logo-type").change(function() {
            if ($(this).val() == "without_filter")
            {

                $(".smls-add-single-logo-wrap").show();
                $(".smls-add-category-logo-wrap").hide();
                $('.smls-filter-setting-wrap').hide();
                $('.smls-without-filter-setting-wrap').show();
                $('.smls-inline-on').removeAttr('disabled');
                $('.smls-note-wrap').hide();
                //checked for full view

            } else
            {
                $(".smls-add-category-logo-wrap").show();
                $(".smls-add-single-logo-wrap").hide();
                $('.smls-filter-setting-wrap').show();
                $('.smls-without-filter-setting-wrap').hide();
                $('.smls-inline-on').attr('disabled', 'disabled');
                $('.smls-note-wrap').show();
                //checked for full view
                $('.smls-show-full-view').click(function() {
                    if ($(this).is(':checked'))
                    {
                        $('.smls-full-view-setting-wrap').show();
                        $('.smls-full-detail-wrap').hide();
                    } else
                    {
                        $('.smls-full-view-setting-wrap').hide();
                        $('.smls-full-detail-wrap').hide();
                    }
                });
            }
        });
        var selected_logo_type = $(".smls-logo-type option:selected").val();
        if (selected_logo_type == "without_filter")
        {
            $(".smls-add-single-logo-wrap").show();
            $(".smls-add-category-logo-wrap").hide();
            $('.smls-filter-setting-wrap').hide();
            $('.smls-without-filter-setting-wrap').show();
            $('.smls-inline-on').removeAttr('disabled');
            $('.smls-note-wrap').hide();
        } else
        {
            $(".smls-add-category-logo-wrap").show();
            $(".smls-add-single-logo-wrap").hide();
            $('.smls-filter-setting-wrap').show();
            $('.smls-without-filter-setting-wrap').hide();
            $('.smls-inline-on').attr('disabled', 'disabled');
            $('.smls-note-wrap').show();
            $('.smls-full-detail-wrap').hide();
        }
//Settings Tabs Switching
        $('body').on('click', '.smls-tab-trigger', function() {
            $('.smls-tab-trigger').removeClass('smls-tab-active-trigger');
            $(this).addClass('smls-tab-active-trigger');
            //var filter_key = $(this).data('filter-key-ref');
            var active_filter_key = $('.smls-tab-trigger.smls-tab-active-trigger').data('filter-key-ref');
            $('.smls-each-filter-wrap').hide();
            $('.smls-each-filter-wrap[data-filter-key-ref="' + active_filter_key + '"]').show();
        });
        $('body').on('click', '.smls-add-logo-button', function() {
            var image = wp.media({
                title: 'Insert Logo',
                button: {text: 'Insert Logo'},
                library: {type: 'image'},
                multiple: "toggle"
            }).open()
                    .on('select', function() {
                        var uploaded_image = image.state().get('selection');
                        uploaded_image.map(function(attachment) {
                            attachment = attachment.toJSON();
                            var image_id = attachment.id;
                            var image_url = attachment.url;
                            var logo_type = $('.smls-logo-type').val();
                            if (logo_type == 'with_filter') {
                                var active_filter_key = $('.smls-tab-trigger.smls-tab-active-trigger').data('filter-key-ref');
                                var data = {
                                    'action': 'smls_logo_detail',
                                    '_wpnonce': smls_backend_js_params.ajax_nonce,
                                    'image_url': image_url,
                                    'image_id': image_id,
                                    'logo_type': 'with_filter',
                                    'active_filter_key': active_filter_key
                                };
                            } else {
                                var data = {
                                    'action': 'smls_logo_detail',
                                    '_wpnonce': smls_backend_js_params.ajax_nonce,
                                    'image_url': image_url,
                                    'image_id': image_id,
                                    'logo_type': 'without_filter'
                                };
                            }
                            $.ajax({
                                url: smls_backend_js_params.ajax_url,
                                data: data,
                                type: "POST",
                                success: function(response) {
                                    if (logo_type == 'without_filter') {
                                        $(".smls-add-append-wrap").append(response);
                                    } else {
                                        $('.smls-each-filter-wrap[data-filter-key-ref="' + active_filter_key + '"] .smls-add-append-wrap').append(response);
                                    }
                                    $('.smls-add-append-wrap').sortable({
                                        handle: ".smls-move-logo",
                                        containment: "parent"
                                    });
                                }
                            });
                        });
                    });
        });
        $('.smls-add-append-wrap').sortable({
            handle: ".smls-move-logo",
            containment: "parent"
        });
        /*
         * filter adder
         */

        $('body').on('click', '.smls-add-category-button', function() {
            var filter_name = $('.smls-filter-name').val();
            var ran_id = Math.random().toString(36).substr(2, 10);
            var filter_key = 'filter_' + ran_id;
            if (filter_name != '') {
                var exist_filter_keys = $('#smls-filter-collection').val();
                if (exist_filter_keys == '') {
                    $('#smls-filter-collection').val(filter_key);
                } else {
                    exist_filter_keys_array = exist_filter_keys.split(',');
                    exist_filter_keys_array.push(filter_key);
                    var new_filter_keys = exist_filter_keys_array.join();
                    $('#smls-filter-collection').val(new_filter_keys);
                }
                if ($('.smls-tab-trigger').length <= 0) {
                    var filter_trigger_html = '<li data-filter-key-ref="' + filter_key + '" class="smls-tab-trigger smls-tab-active-trigger"><input type="hidden" value="' + filter_name + '" name=smls_option[logo][filter_detail][' + filter_key + '][filter_name]>' + filter_name + '<div class="smls-filter-remover"><span class="dashicons dashicons-no"></span></div></li>';
                } else {
                    var filter_trigger_html = '<li data-filter-key-ref="' + filter_key + '" class="smls-tab-trigger"><input type="hidden" value="' + filter_name + '" name=smls_option[logo][filter_detail][' + filter_key + '][filter_name]>' + filter_name + '<div class="smls-filter-remover"><span class="dashicons dashicons-no"></span></div></li>';
                }
                $('.smls-tab-wrap').append(filter_trigger_html);
                if ($('.smls-tab-trigger smls-tab-active-trigger').length <= 1) {
                    var filter_details_html = '<div class="smls-each-filter-wrap" data-filter-key-ref="' + filter_key + '">\n\
      <div class="smls-add-append-wrap clearfix"></div></div>';
                } else {
                    var filter_details_html = '<div class="smls-each-filter-wrap" data-filter-key-ref="' + filter_key + '" style="display:none;">\n\
      <div class="smls-add-append-wrap clearfix"></div></div>';
                }
                $('.smls-form-field-holder').append(filter_details_html);
                $('.smls-filter-name').val('');
                $('.smls-error-message').hide();
                if ($('.smls-each-filter-wrap').length == 1) {
                    $(this).closest('.smls-each-filter-wrap').show();
                }
            } else {
                $('.smls-error-message').show();
            }

        });
        /**
         * Filter Delete
         *
         * @since 1.0.0
         */
        $('body').on('click', '.smls-filter-remover', function(event) {
            var filter_mess = confirm('Are you sure you want to remove this filter ?');
            if (filter_mess) {
                var filter_key = $(this).closest('.smls-tab-trigger').data('filter-key-ref');
                $(this).closest('.smls-tab-trigger').remove();
                $('.smls-each-filter-wrap[data-filter-key-ref="' + filter_key + '"]').remove();
                var pre_filter_keys = $('#smls-filter-collection').val();
                pre_filter_keys_array = pre_filter_keys.split(',');
                var index = pre_filter_keys_array.indexOf(filter_key);
                pre_filter_keys_array.splice(index, 1);
                var new_filter_keys = pre_filter_keys_array.join();
                var value = $('#smls-filter-collection').val(new_filter_keys);
                if ($('.smls-tab-trigger.smls-tab-active-trigger').length == 0) {
                    $('.smls-tab-trigger').first().click();
                }
                event.stopPropagation();
            }
        });
        /**
         * logo Item Remove
         *
         */

        $('body').on('click', '.smls-delete-logo', function() {
            var delete_logo = confirm('Are you sure you want to delete this logo?');
            if (delete_logo) {
                $(this).closest('.smls-each-logo-item').fadeOut(500, function() {
                    $(this).remove();
                });
            }
        });
        /*
         *toggle for logo
         */

        $('body').on('click', '.smls-logo-slideToggle', function() {
            $(this).closest('.smls-add-logo-showcase').find('.smls-logo-slideTogglebox').slideToggle();
            $(this).find('i').toggleClass('fa-angle-down fa-angle-up');
        });
        /*
         *Upload image configuration For editing the main image
         */
        $('body').on('click', '.smls-edit-logo', function(e) {
            e.preventDefault();
            var btnClicked = $(this);
            var image = wp.media({
                title: 'Insert Logo',
                button: {text: 'Insert Logo'},
                library: {type: 'image'},
                multiple: false
            }).open()
                    .on('select', function(e) {
                        var uploaded_image = image.state().get('selection').first();
                        console.log(uploaded_image);
                        var image_url = uploaded_image.toJSON().url;
                        $(btnClicked).closest('.smls-logo-image-preview').find('.smls-logo-image').attr('src', image_url);
                        $(btnClicked).closest('.smls-logo-image-preview').find('.smls-logo-image-url').val(image_url);
                    });
        });
        /*
         *Image Gallery Upload
         */
        $('body').on('click', '.smls-logo-image-gallery-url-button', function(e) {
            e.preventDefault();
            var btnClicked = $(this);
            var image = wp.media({
                title: 'Insert Logo',
                button: {text: 'Insert Logo'},
                library: {type: 'image'},
                multiple: "toggle"
            }).open()
                    .on('select', function() {
                        var uploaded_image = image.state().get('selection');
                        uploaded_image.map(function(attachment) {
                            attachment = attachment.toJSON();
                            var image_url = attachment.url;
                            var logo_key = $(btnClicked).closest('.smls-each-logo-item').data('logo-key');
                            var logo_type = $('.smls-logo-type').val();
                            if (logo_type == 'with_filter') {
                                var active_filter_key = $('.smls-tab-trigger.smls-tab-active-trigger').data('filter-key-ref');
                                var data = {
                                    'action': 'smls_company_gallery',
                                    '_wpnonce': smls_backend_js_params.ajax_nonce,
                                    'image_url': image_url,
                                    'logo_type': 'with_filter',
                                    'logo_key': logo_key,
                                    'active_filter_key': active_filter_key,
                                };
                            } else {
                                var data = {
                                    'action': 'smls_company_gallery',
                                    '_wpnonce': smls_backend_js_params.ajax_nonce,
                                    'image_url': image_url,
                                    'logo_key': logo_key,
                                    'logo_type': 'without_filter'
                                };
                            }
                            $.ajax({
                                url: smls_backend_js_params.ajax_url,
                                data: data,
                                type: "POST",
                                success: function(response) {
                                    $('.smls-each-logo-item[data-logo-key="' + logo_key + '"] .smls-image-url-collect').append(response);
                                    $('.smls-image-url-collect').sortable({
                                        handle: ".smls-move-gallery-image",
                                        containment: "parent"
                                    });
                                }
                            });
                        });
                    });
        });
        $('.smls-image-url-collect').sortable({
            handle: ".smls-move-gallery-image",
            containment: "parent"
        });
        /**
         * Gallery Image Remove
         *
         */

        $('body').on('click', '.smls-delete-gallery-image', function() {
            $(this).closest('.smls-gallery-wrap').fadeOut(500, function() {
                $(this).remove();
            });
        });
        /*
         * checked functionality for social icons
         */
        $('body').on('click', '.smls-logo-social-icon', function() {
            if ($(this).is(':checked')) {
                $(this).closest('.smls-option-field').find('.smls-logo-social-icon-value').val('1');
                $(this).closest('.smls-add-logo-option-wrap').find('.smls-logo-bsocial-wrap').show();
            } else
            {
                $(this).closest('.smls-option-field').find('.smls-logo-social-icon-value').val('0');
                $(this).closest('.smls-add-logo-option-wrap').find('.smls-logo-bsocial-wrap').hide();
            }
        });
        /*
         * checked functionality for contact info
         */
        $('body').on('click', '.smls-logo-contact-info', function() {
            if ($(this).is(':checked')) {
                $(this).closest('.smls-option-field').find('.smls-logo-contact-info-value').val('1');
                $(this).closest('.smls-add-logo-option-wrap').find('.smls-contact-detail-wrap').show();
            } else
            {
                $(this).closest('.smls-option-field').find('.smls-logo-contact-info-value').val('0');
                $(this).closest('.smls-add-logo-option-wrap').find('.smls-contact-detail-wrap').hide();
            }
        });
        /**
         * Popup close
         *
         */
        $('body').on('click', '.smls-close-popup', function() {
            $(this).closest('.smls-each-logo-item').find('.smls-add-logo-option-wrap').fadeOut(500);
        });
        /**
         * Show settings configuration section
         *
         */
        $('body').on('click', '.smls-settings-logo', function() {
            $(this).closest('.smls-each-logo-item').find('.smls-add-logo-option-wrap').fadeIn(500);
        });
        /*
         * Grid layout show and hide
         */
        $('.smls-grid-template').change(function() {
            $('.smls-show-full-view').prop('checked', false);
            if ($(this).val() === 'template-1' || $(this).val() === 'template-2' || $(this).val() === 'template-4') {
                $('.smls-full-view-main-wrapper').show();
                $('.smls-extra-effects-wrap').show();
                $('.smls-grid-9-note').hide();
                $('.smls-overlay-note').show();
                $('.smls-grid-border-wrap').show();
                $('.smls-grid-bg-wrap').hide();
                $('.smls-grid-content-container').hide();
                $('.smls-grid-8bg-color-wrap').hide();
            } else if ($(this).val() === 'template-5') {
                $('.smls-grid-border-wrap').hide();
                $('.smls-grid-bg-wrap').show();
                $('.smls-grid-content-container').hide();
                $('.smls-grid-8bg-color-wrap').hide();
            } else if ($(this).val() === 'template-7') {
                $('.smls-full-view-main-wrapper').hide();
                $('.smls-extra-effects-wrap').hide();
                $('.smls-grid-9-note').hide();
                $('.smls-overlay-note').show();
                $('.smls-grid-border-wrap').hide();
                $('.smls-grid-bg-wrap').hide();
                $('.smls-grid-content-container').show();
                $('.smls-grid-color-wrap').show();
                $('.smls-grid-title-font-size').val('22');
                $('.smls-grid-8bg-color-wrap').hide();
                $('.smls-grid-title-color.smls-color-picker').val('#555555');
                $('.smls-grid-desc-color.smls-color-picker').val('#333333');
                $('.smls-note-grid-7').show();
            } else if ($(this).val() === 'template-8') {
                $('.smls-extra-effects-wrap').show();
                $('.smls-full-view-main-wrapper').hide();
                $('.smls-grid-9-note').hide();
                $('.smls-overlay-note').show();
                $('.smls-grid-border-wrap').hide();
                $('.smls-grid-bg-wrap').hide();
                $('.smls-grid-content-container').show();
                $('.smls-grid-title-font-size').val('20');
                $('.smls-grid-color-wrap').hide();
                $('.smls-grid-8bg-color-wrap').show();
            } else if ($(this).val() === 'template-9') {
                $('.smls-extra-effects-wrap').show();
                $('.smls-full-view-main-wrapper').hide();
                $('.smls-grid-9-note').show();
                $('.smls-overlay-note').hide();
                $('.smls-grid-border-wrap').hide();
                $('.smls-grid-bg-wrap').hide();
                $('.smls-grid-content-container').show();
                $('.smls-grid-8bg-color-wrap').hide();
                $('.smls-grid-color-wrap').show();
                $('.smls-grid-title-font-size').val('16');
                $('.smls-grid-title-color.smls-color-picker').val('#f46632');
                $('.smls-grid-desc-color.smls-color-picker').val('#666666');
            } else {
                $('.smls-full-view-main-wrapper').show();
                $('.smls-extra-effects-wrap').show();
                $('.smls-grid-9-note').hide();
                $('.smls-overlay-note').show();
                $('.smls-grid-border-wrap').hide();
                $('.smls-grid-bg-wrap').hide();
                $('.smls-grid-content-container').hide();
                $('.smls-grid-8bg-color-wrap').hide();
            }
        });
        var selected_grid_type = $(".smls-grid-template option:selected").val();
        if (selected_grid_type == "template-1" || selected_grid_type == "template-2" || selected_grid_type == "template-4")
        {
            $('.smls-full-view-main-wrapper').show();
            $('.smls-extra-effects-wrap').show();
            $('.smls-grid-9-note').hide();
            $('.smls-overlay-note').show();
            $('.smls-grid-border-wrap').show();
            $('.smls-grid-bg-wrap').hide();
            $('.smls-grid-content-container').hide();
            $('.smls-grid-8bg-color-wrap').hide();
        } else if (selected_grid_type === 'template-5') {
            $('.smls-grid-border-wrap').hide();
            $('.smls-grid-bg-wrap').show();
            $('.smls-grid-content-container').hide();
            $('.smls-grid-8bg-color-wrap').hide();
        } else if (selected_grid_type === 'template-7') {
            $('.smls-full-view-main-wrapper').hide();
            $('.smls-extra-effects-wrap').hide();
            $('.smls-grid-9-note').hide();
            $('.smls-overlay-note').show();
            $('.smls-grid-border-wrap').hide();
            $('.smls-grid-bg-wrap').hide();
            $('.smls-grid-content-container').show();
            $('.smls-grid-color-wrap').show();
            $('.smls-grid-8bg-color-wrap').hide();
            $('.smls-note-grid-7').show();

        } else if (selected_grid_type === 'template-8') {
            $('.smls-extra-effects-wrap').show();
            $('.smls-full-view-main-wrapper').hide();
            $('.smls-grid-9-note').hide();
            $('.smls-overlay-note').show();
            $('.smls-grid-border-wrap').hide();
            $('.smls-grid-bg-wrap').hide();
            $('.smls-grid-content-container').show();
            $('.smls-grid-color-wrap').hide();
            $('.smls-grid-8bg-color-wrap').show();
        } else if (selected_grid_type === 'template-9') {
            $('.smls-extra-effects-wrap').show();
            $('.smls-full-view-main-wrapper').hide();
            $('.smls-grid-9-note').show();
            $('.smls-overlay-note').hide();
            $('.smls-grid-border-wrap').hide();
            $('.smls-grid-bg-wrap').hide();
            $('.smls-grid-content-container').show();
            $('.smls-grid-8bg-color-wrap').hide();
            $('.smls-grid-color-wrap').show();

        } else {
            $('.smls-full-view-main-wrapper').show();
            $('.smls-extra-effects-wrap').show();
            $('.smls-grid-9-note').hide();
            $('.smls-overlay-note').show();
            $('.smls-grid-border-wrap').hide();
            $('.smls-grid-bg-wrap').hide();
            $('.smls-grid-content-container').hide();
            $('.smls-grid-8bg-color-wrap').hide();
        }

        /**
         * Layout type show & hide configuration
         *
         */

        $(".smls-layout-type").change(function() {
            if ($(this).val() === "grid")
            {
                $(".smls-grid-setting-wrap").show();
                $(".smls-carousel-setting-section").hide();
                $(".smls-pager-setting-wrapper").hide();
                $(".smls-slider-setting-wrap").hide();
                $(".smls-list-setting-wrap").hide();
                $(".smls-perspective-settings-wrap").hide();
                $('.smls-full-detail-wrap').show();
                $('.smls-inline-on').removeAttr('disabled');
                $('.smls-note-wrap').hide();
                $(".smls-full-view-type").change(function() {
                    if ($(this).val() === "popup")
                    {
                        $(".smls-popup-settings-wrap").show();
                        $(".smls-inline-setting-wrap").hide();
                    } else
                    {
                        $(".smls-popup-settings-wrap").hide();
                        $(".smls-inline-setting-wrap").show();
                    }
                });

            } else if ($(this).val() === "list")
            {
                $(".smls-grid-setting-wrap").hide();
                $(".smls-carousel-setting-section").hide();
                $(".smls-list-setting-wrap").show();
                $(".smls-pager-setting-wrapper").hide();
                $(".smls-slider-setting-wrap").hide();
                $(".smls-perspective-settings-wrap").hide();
                $('.smls-inline-on').removeAttr('disabled');
                $('.smls-full-detail-wrap').show();
                $('.smls-note-wrap').hide();
                $(".smls-full-view-type").change(function() {
                    if ($(this).val() === "popup")
                    {
                        $(".smls-popup-settings-wrap").show();
                        $(".smls-inline-setting-wrap").hide();
                    } else
                    {
                        $(".smls-popup-settings-wrap").hide();
                        $('.smls-inline-setting-wrap').hide();
                    }
                });

            } else if ($(this).val() === "carousel")
            {
                $(".smls-grid-setting-wrap").hide();
                $(".smls-carousel-setting-section").show();
                $(".smls-pager-setting-wrapper").show();
                $(".smls-slider-setting-wrap").show();
                $(".smls-list-setting-wrap").hide();
                $(".smls-perspective-settings-wrap").hide();
                $('.smls-count-slide-wrap').show();
                $('.smls-carousel-margin-wrap').show();
                $('.smls-inline-on').attr('disabled', 'disabled');
                $('.smls-note-wrap').show();
                $('.smls-full-detail-wrap').hide();
                $(".smls-full-view-type").change(function() {
                    if ($(this).val() === "popup")
                    {
                        $(".smls-popup-settings-wrap").show();
                        $(".smls-inline-setting-wrap").hide();
                    } else
                    {
                        $(".smls-popup-settings-wrap").hide();
                        $(".smls-inline-setting-wrap").show();
                    }
                });

                $('.smls-show-full-view').click(function() {
                    if ($(this).is(':checked'))
                    {
                        $('.smls-full-view-setting-wrap').show();
                        $('.smls-full-detail-wrap').hide();
                    } else
                    {
                        $('.smls-full-view-setting-wrap').hide();
                        $('.smls-full-detail-wrap').hide();
                    }
                });
            } else if ($(this).val() === "perspective")
            {
                $(".smls-full-view-type").change(function() {
                    if ($(this).val() === "popup")
                    {
                        $(".smls-popup-settings-wrap").show();
                        $(".smls-inline-setting-wrap").hide();
                    } else
                    {
                        $(".smls-popup-settings-wrap").hide();
                        $(".smls-inline-setting-wrap").show();
                    }
                });

                $(".smls-grid-setting-wrap").hide();
                $(".smls-carousel-setting-section").hide();
                $(".smls-list-setting-wrap").hide();
                $(".smls-perspective-settings-wrap").show();
                $(".smls-pager-setting-wrapper").hide();
                $(".smls-slider-setting-wrap").show();
                $('.smls-count-slide-wrap').hide();
                $('.smls-carousel-margin-wrap').hide();
                $('.smls-inline-on').attr('disabled', 'disabled');
                $('.smls-full-detail-wrap').hide();
                $('.smls-note-wrap').show();
                $('.smls-show-full-view').click(function() {
                    if ($(this).is(':checked'))
                    {
                        $('.smls-full-view-setting-wrap').show();
                        $('.smls-full-detail-wrap').hide();
                    } else
                    {
                        $('.smls-full-view-setting-wrap').hide();
                        $('.smls-full-detail-wrap').hide();
                    }
                });
            } else
            {

                $(".smls-grid-setting-wrap").hide();
                $(".smls-carousel-setting-section").hide();
                $(".smls-list-setting-wrap").hide();
                $(".smls-perspective-settings-wrap").hide();
                $(".smls-pager-setting-wrapper").hide();
                $(".smls-slider-setting-wrap").hide();
                $('.smls-full-detail-wrap').hide();
                $(".smls-full-view-type").change(function() {
                    if ($(this).val() === "popup")
                    {
                        $(".smls-popup-settings-wrap").show();
                        $(".smls-inline-setting-wrap").hide();
                    } else
                    {
                        $(".smls-popup-settings-wrap").hide();
                        $(".smls-inline-setting-wrap").show();
                    }
                });

            }
        });
        var selected_layout_type = $(".smls-layout-type option:selected").val();
        if (selected_layout_type === "grid")
        {
            $(".smls-grid-setting-wrap").show();
            $(".smls-carousel-setting-section").hide();
            $(".smls-pager-setting-wrapper").hide();
            $(".smls-slider-setting-wrap").hide();
            $(".smls-list-setting-wrap").hide();
            $(".smls-perspective-settings-wrap").hide();
            $('.smls-inline-on').removeAttr('disabled');
            $('.smls-note-wrap').hide();
            $('.smls-full-detail-wrap').show();
            var selected_type = $(".smls-full-view-type option:selected").val();
            if (selected_type === "popup")
            {
                $(".smls-popup-settings-wrap").show();
                $(".smls-inline-setting-wrap").hide();
            } else
            {
                $(".smls-popup-settings-wrap").hide();
                $(".smls-inline-setting-wrap").show();
            }
        } else if (selected_layout_type === "list")
        {
            $(".smls-grid-setting-wrap").hide();
            $(".smls-pager-setting-wrapper").hide();
            $(".smls-slider-setting-wrap").hide();
            $(".smls-carousel-setting-section").hide();
            $(".smls-list-setting-wrap").show();
            $(".smls-perspective-settings-wrap").hide();
            $('.smls-inline-on').removeAttr('disabled');
            $('.smls-note-wrap').hide();
            $('.smls-full-detail-wrap').show();

            var selected_type = $(".smls-full-view-type option:selected").val();
            if (selected_type === "popup")
            {
                $(".smls-popup-settings-wrap").show();
                $(".smls-inline-setting-wrap").hide();
            } else
            {
                $(".smls-popup-settings-wrap").hide();
                $('.smls-inline-setting-wrap').hide();
            }
        } else if (selected_layout_type === "carousel")
        {
            $(".smls-grid-setting-wrap").hide();
            $(".smls-carousel-setting-section").show();
            $(".smls-pager-setting-wrapper").show();
            $(".smls-slider-setting-wrap").show();
            $(".smls-list-setting-wrap").hide();
            $(".smls-perspective-settings-wrap").hide();
            $('.smls-count-slide-wrap').show();
            $('.smls-carousel-margin-wrap').show();
            $('.smls-inline-on').attr('disabled', 'disabled');
            $('.smls-note-wrap').show();
            $('.smls-full-detail-wrap').hide();
            var selected_type = $(".smls-full-view-type option:selected").val();
            if (selected_type === "popup")
            {
                $(".smls-popup-settings-wrap").show();
                $(".smls-inline-setting-wrap").hide();
            } else
            {
                $(".smls-popup-settings-wrap").hide();
                $(".smls-inline-setting-wrap").show();
            }
        } else if (selected_layout_type === "perspective")
        {
            $(".smls-grid-setting-wrap").hide();
            $(".smls-carousel-setting-section").hide();
            $(".smls-list-setting-wrap").hide();
            $(".smls-perspective-settings-wrap").show();
            $(".smls-pager-setting-wrapper").hide();
            $(".smls-slider-setting-wrap").show();
            $('.smls-count-slide-wrap').hide();
            $('.smls-carousel-margin-wrap').hide();
            $('.smls-inline-on').attr('disabled', 'disabled');
            $('.smls-note-wrap').show();
            $('.smls-full-detail-wrap').hide();
            var selected_type = $(".smls-full-view-type option:selected").val();
            if (selected_type === "popup")
            {
                $(".smls-popup-settings-wrap").show();
                $(".smls-inline-setting-wrap").hide();
            } else
            {
                $(".smls-popup-settings-wrap").hide();
                $(".smls-inline-setting-wrap").show();
            }
        } else
        {

            $(".smls-grid-setting-wrap").hide();
            $(".smls-carousel-setting-section").hide();
            $(".smls-list-setting-wrap").hide();
            $(".smls-perspective-settings-wrap").hide();
            $(".smls-pager-setting-wrapper").hide();
            $(".smls-slider-setting-wrap").hide();
            $('.smls-full-detail-wrap').hide();
            var selected_type = $(".smls-full-view-type option:selected").val();
            if (selected_type === "popup")
            {
                $(".smls-popup-settings-wrap").show();
                $(".smls-inline-setting-wrap").hide();
            } else
            {
                $(".smls-popup-settings-wrap").hide();
                $(".smls-inline-setting-wrap").show();
            }
        }


        $(".smls-filter-layout").change(function() {
            if ($(this).val() === "sameSize")
            {
                $(".smls-filter-logo-width-wrap").hide();
                $(".smls-filter-logo-height-wrap").hide();
                $(".smls-filter-template-wrap").show();
            } else if ($(this).val() === "sameHeight")
            {
                $(".smls-filter-logo-width-wrap").hide();
                $(".smls-filter-logo-height-wrap").show();
                $(".smls-filter-template-wrap").hide();
            } else if ($(this).val() === "sameWidth")
            {
                $(".smls-filter-logo-width-wrap").show();
                $(".smls-filter-logo-height-wrap").hide();
                $(".smls-filter-template-wrap").hide();
            } else
            {
                $(".smls-filter-logo-width-wrap").hide();
                $(".smls-filter-logo-height-wrap").hide();
                $(".smls-filter-template-wrap").hide();
            }
        });
        var selected_filter = $(".smls-filter-layout option:selected").val();
        if (selected_filter === "sameSize")
        {
            $(".smls-filter-logo-width-wrap").hide();
            $(".smls-filter-logo-height-wrap").hide();
            $(".smls-filter-template-wrap").show();
        } else if (selected_filter === "sameHeight")
        {
            $(".smls-filter-logo-width-wrap").hide();
            $(".smls-filter-logo-height-wrap").show();
            $(".smls-filter-template-wrap").hide();
        } else if (selected_filter === "sameWidth")
        {
            $(".smls-filter-logo-width-wrap").show();
            $(".smls-filter-logo-height-wrap").hide();
            $(".smls-filter-template-wrap").hide();
        } else
        {
            $(".smls-filter-logo-width-wrap").hide();
            $(".smls-filter-logo-height-wrap").hide();
            $(".smls-filter-template-wrap").hide();
        }
        /*
         * toggle form for grid settings
         */
        $('body').on('click', '.smls-grid-toogle-outer-wrap', function() {
            $(this).closest('.smls-grid-setting-wrap').find('.smls-inner-toogle-grid').slideToggle();
            $(this).find('.dashicons').toggleClass('dashicons-arrow-down dashicons-arrow-up');
        });
        $('body').on('click', '.smls-tooltip-outer-wrap', function() {
            $(this).closest('.smls-tooltip-main-wrapper').find('.smls-tooltip-inner-wrap').slideToggle();
            $(this).find('.dashicons').toggleClass('dashicons-arrow-down dashicons-arrow-up');
        });
        $('body').on('click', '.smls-full-view-outer-wrap', function() {
            $(this).closest('.smls-full-view-main-wrapper').find('.smls-full-view-inner-wrap').slideToggle();
            $(this).find('.dashicons').toggleClass('dashicons-arrow-down dashicons-arrow-up');
        });
        $('body').on('click', '.smls-list-setting-outer-wrap', function() {
            $(this).closest('.smls-list-setting-wrap').find('.smls-list-setting-inner-wrap').slideToggle();
            $(this).find('.dashicons').toggleClass('dashicons-arrow-down dashicons-arrow-up');
        });
        $('body').on('click', '.smls-carousel-outer-wrap', function() {
            $(this).closest('.smls-carousel-setting-section').find('.smls-carousel-inner-wrap').slideToggle();
            $(this).find('.dashicons').toggleClass('dashicons-arrow-down dashicons-arrow-up');
        });
        $('body').on('click', '.smls-pager-outer-wrap', function() {
            $(this).closest('.smls-pager-setting-wrapper').find('.smls-pager-inner-wrap').slideToggle();
            $(this).find('.dashicons').toggleClass('dashicons-arrow-down dashicons-arrow-up');
        });
        $('body').on('click', '.smls-slider-outer-wrap', function() {
            $(this).closest('.smls-slider-setting-wrap').find('.smls-slider-inner-wrap').slideToggle();
            $(this).find('.dashicons').toggleClass('dashicons-arrow-down dashicons-arrow-up');
        });
        $('body').on('click', '.smls-perspective-outer-setting-wrap', function() {
            $('.smls-perspective-inner-wrap').slideToggle();
            $(this).find('.dashicons').toggleClass('dashicons-arrow-down dashicons-arrow-up');
        });
        $('body').on('click', '.smls-filter-outer-setting-wrap', function() {
            $(this).closest('.smls-filter-setting-wrap').find('.smls-filter-inner-setting-wrap').slideToggle();
            $(this).find('.dashicons').toggleClass('dashicons-arrow-down dashicons-arrow-up');
        });
//checked for external link
        $('body').on('click', '.smls-logo-external-link-info', function() {
            if ($(this).is(':checked')) {
                $(this).closest('.smls-option-field').find('.smls-logo-external-link-value').val('1');
                $(this).closest('.smls-add-logo-option-wrap').find('.smls-external-link-wrap').show();
            } else
            {
                $(this).closest('.smls-option-field').find('.smls-logo-external-link-value').val('0');
                $(this).closest('.smls-add-logo-option-wrap').find('.smls-external-link-wrap').hide();
            }
        });
        $('.smls-image-effect-type').change(function() {
            if ($(this).val() === "hover")
            {

                $('.smls-hover-setting-wrap').show();
            } else
            {
                $('.smls-hover-setting-wrap').hide();
            }
        });
        var selected_effect = $(".smls-image-effect-type option:selected").val();
        if (selected_effect === "hover")
        {
            $('.smls-hover-setting-wrap').show();
        } else {
            $('.smls-hover-setting-wrap').hide();
        }

        /*
         * Title settings
         */

        $('.smls-view-title-type').change(function() {
            if ($(this).val() === "title_tooltip")
            {

                $('.smls-tooltip-main-wrapper').show();
            } else
            {
                $('.smls-tooltip-main-wrapper').hide();
            }
        });
        var selected_title = $(".smls-view-title-type option:selected").val();
        if (selected_title === "title_tooltip")
        {
            $('.smls-tooltip-main-wrapper').show();
        } else {
            $('.smls-tooltip-main-wrapper').hide();
        }
        $('.smls-show-full-view').click(function() {
            if ($(this).is(':checked'))
            {
                $('.smls-show-full-view-value').val('1');
                $('.smls-full-view-setting-wrap').show();
                //$('.smls-full-detail-wrap').show();
            } else
            {
                $('.smls-show-full-view-value').val('0');
                $('.smls-full-view-setting-wrap').hide();
                //$('.smls-full-detail-wrap').hide();
            }
        });
        /*
         * Carousel layout show and hide
         */
        $('.smls-carousel-template').change(function() {
            $('.smls-show-full-view').prop('checked', false);
            if ($(this).val() === 'template-1') {
                $('.smls-hover-outer-wrap').show();
                $('.smls-carousel-5-note').hide();
                $('.smls-overlay-note').show();
                $('.smls-car-content-container').hide();
                $('.smls-car-border-color').hide();
            } else if ($(this).val() === 'template-2') {
                $('.smls-hover-outer-wrap').show();
                $('.smls-carousel-5-note').hide();
                $('.smls-overlay-note').show();
                $('.smls-car-content-container').show();
                $('.smls-car-desc-wrap').show();
                $('.smls-car-title-font-size').val('16');
                $('.smls-car-title-color.smls-color-picker').val('#333333');
                $('.smls-car-desc-color.smls-color-picker').val('#2e2d2d');
                $('.smls-car-border-color').hide();
            } else if ($(this).val() === 'template-3') {
                $('.smls-hover-outer-wrap').show();
                $('.smls-carousel-5-note').hide();
                $('.smls-overlay-note').show();
                $('.smls-car-content-container').show();
                $('.smls-car-desc-wrap').hide();
                $('.smls-car-title-font-size').val('18');
                $('.smls-car-title-color.smls-color-picker').val('#f6881f');
                $('.smls-car-border-color').hide();
            } else if ($(this).val() === 'template-4') {
                $('.smls-hover-outer-wrap').show();
                $('.smls-carousel-5-note').hide();
                $('.smls-overlay-note').show();
                $('.smls-car-content-container').hide();
                $('.smls-car-border-color').show();
            } else if ($(this).val() === 'template-5') {
                $('.smls-hover-outer-wrap').hide();
                $('.smls-carousel-5-note').show();
                $('.smls-overlay-note').hide();
                $('.smls-car-content-container').show();
                $('.smls-car-desc-wrap').show();
                $('.smls-car-title-font-size').val('18');
                $('.smls-car-title-color.smls-color-picker').val('#fc562e');
                $('.smls-car-desc-color.smls-color-picker').val('#7b7b7b');
                $('.smls-car-border-color').hide();
            } else if ($(this).val() === 'template-6') {
                $('.smls-hover-outer-wrap').show();
                $('.smls-carousel-5-note').hide();
                $('.smls-overlay-note').show();
                $('.smls-car-content-container').show();
                $('.smls-car-desc-wrap').show();
                $('.smls-car-title-font-size').val('18');
                $('.smls-car-title-color.smls-color-picker').val('#fc562e');
                $('.smls-car-desc-color.smls-color-picker').val('#7b7b7b');
                $('.smls-car-border-color').hide();
            } else if ($(this).val() === 'template-7') {
                $('.smls-hover-outer-wrap').hide();
                $('.smls-carousel-5-note').show();
                $('.smls-overlay-note').hide();
                $('.smls-car-content-container').show();
                $('.smls-car-desc-wrap').show();
                $('.smls-car-title-font-size').val('14');
                $('.smls-car-title-color.smls-color-picker').val('#ffffff');
                $('.smls-car-desc-color.smls-color-picker').val('#ffffff');
                $('.smls-car-border-color').hide();
            } else {
                $('.smls-hover-outer-wrap').show();
                $('.smls-carousel-5-note').hide();
                $('.smls-overlay-note').show();
                $('.smls-car-content-container').hide();
                $('.smls-car-border-color').show();
            }
        });
        var selected_car = $(".smls-carousel-template option:selected").val();
        if (selected_car === "template-1") {
            $('.smls-hover-outer-wrap').show();
            $('.smls-carousel-5-note').hide();
            $('.smls-overlay-note').show();
            $('.smls-car-content-container').hide();
            $('.smls-car-border-color').hide();
        } else if (selected_car === "template-2") {
            $('.smls-hover-outer-wrap').show();
            $('.smls-carousel-5-note').hide();
            $('.smls-overlay-note').show();
            $('.smls-car-content-container').show();
            $('.smls-car-desc-wrap').show();
            $('.smls-car-border-color').hide();
        } else if (selected_car === 'template-3') {
            $('.smls-hover-outer-wrap').show();
            $('.smls-carousel-5-note').hide();
            $('.smls-overlay-note').show();
            $('.smls-car-content-container').show();
            $('.smls-car-desc-wrap').hide();
            $('.smls-car-border-color').hide();
        } else if (selected_car === 'template-4') {
            $('.smls-hover-outer-wrap').show();
            $('.smls-carousel-5-note').hide();
            $('.smls-overlay-note').show();
            $('.smls-car-content-container').hide();
            $('.smls-car-border-color').show();
        } else if (selected_car === "template-5")
        {
            $('.smls-hover-outer-wrap').hide();
            $('.smls-carousel-5-note').show();
            $('.smls-overlay-note').hide();
            $('.smls-car-content-container').show();
            $('.smls-car-desc-wrap').show();
            $('.smls-car-title-font-size').val('18');
            $('.smls-car-title-color.smls-color-picker').val('#fc562e');
            $('.smls-car-desc-color.smls-color-picker').val('#7b7b7b');
            $('.smls-car-border-color').hide();
        } else if (selected_car === "template-6")
        {
            $('.smls-hover-outer-wrap').show();
            $('.smls-carousel-5-note').hide();
            $('.smls-overlay-note').show();
            $('.smls-car-content-container').show();
            $('.smls-car-desc-wrap').show();
            $('.smls-car-title-font-size').val('18');
            $('.smls-car-title-color.smls-color-picker').val('#fc562e');
            $('.smls-car-desc-color.smls-color-picker').val('#7b7b7b');
            $('.smls-car-border-color').hide();
        } else if (selected_car === "template-7")
        {
            $('.smls-hover-outer-wrap').hide();
            $('.smls-carousel-5-note').show();
            $('.smls-overlay-note').hide();
            $('.smls-car-content-container').show();
            $('.smls-car-desc-wrap').show();
            $('.smls-car-title-font-size').val('14');
            $('.smls-car-title-color.smls-color-picker').val('#ffffff');
            $('.smls-car-desc-color.smls-color-picker').val('#ffffff');
            $('.smls-car-border-color').hide();
        } else {
            $('.smls-hover-outer-wrap').show();
            $('.smls-carousel-5-note').hide();
            $('.smls-overlay-note').show();
            $('.smls-car-content-container').hide();
            $('.smls-car-border-color').show();
        }
        $('.smls-pager-template').change(function() {
            if ($(this).val() === 'template-1') {
                $('.smls-pager-active-color.smls-color-picker').val('#75be08');
                $('.smls-pager-color-wrap').hide();
            } else if ($(this).val() === 'template-2') {
                $('.smls-pager-active-color.smls-color-picker').val('#0d98dc');
                $('.smls-pager-color.smls-color-picker').val('#7c7c7c');
                $('.smls-pager-color-wrap').show();
            } else {
                $('.smls-pager-active-color.smls-color-picker').val('#f7a644');
                $('.smls-pager-color.smls-color-picker').val('#cacaca');
                $('.smls-pager-color-wrap').show();
            }
        });
        var selected_pager = $(".smls-pager-template option:selected").val();
        if (selected_pager === "template-1") {

            $('.smls-pager-color-wrap').hide();
        } else {
            $('.smls-pager-color-wrap').show();
        }
        $('.smls-arrow-type').change(function() {
            if ($(this).val() === 'type-1') {
                $('.smls-arrow-hover-color.smls-color-picker').val('rgba(71, 71, 71, 0.7)');
                $('.smls-arrow-color.smls-color-picker').val('#474747');
                $('.smls-arrow-hover-wrap').show();
            } else if ($(this).val() === 'type-2') {
                $('.smls-arrow-hover-color.smls-color-picker').val('#f6881f');
                $('.smls-arrow-color.smls-color-picker').val('#bcbcbc');
                $('.smls-arrow-hover-wrap').show();
            } else if ($(this).val() === 'type-3') {
                $('.smls-arrow-hover-color.smls-color-picker').val('#f24831');
                $('.smls-arrow-color.smls-color-picker').val('#e8e8e8');
                $('.smls-arrow-hover-wrap').show();
            } else if ($(this).val() === 'type-4') {
                $('.smls-arrow-hover-color.smls-color-picker').val('#e8e8e8');
                $('.smls-arrow-color.smls-color-picker').val('#cccccc');
                $('.smls-arrow-hover-wrap').show();
            } else {
                $('.smls-arrow-color.smls-color-picker').val('#75be08');
                $('.smls-arrow-hover-wrap').hide();
            }
        });
        var selected_arrow = $(".smls-arrow-type option:selected").val();
        if (selected_arrow === "type-5") {

            $('.smls-arrow-hover-wrap').hide();
        } else {
            $('.smls-arrow-hover-wrap').show();
        }
        $('.smls-perspective-template').change(function() {
            if ($(this).val() === 'template-4') {
                $('.smls-perspective-color-wrap').show();
            } else {
                $('.smls-perspective-color-wrap').hide();
            }
        });
        var selected_perspective = $(".smls-perspective-template option:selected").val();
        if (selected_perspective === "template-4") {

            $('.smls-perspective-color-wrap').show();
        } else {
            $('.smls-perspective-color-wrap').hide();
        }
        //grid template preview
        $(".smls-grid-common").first().addClass("grid-active");
        $('.smls-grid-template').on('change', function() {
            var template_value = $(this).val();
            var array_break = template_value.split('-');
            var current_id = array_break[1];
            $('.smls-grid-common').hide();
            $('#smls-grid-demo-' + current_id).show();
        });
        var grid_view = $(".smls-grid-template option:selected").val();
        var array_break = grid_view.split('-');
        var current_id1 = array_break[1];
        $('.smls-grid-common').hide();
        $('#smls-grid-demo-' + current_id1).show();

        //carousel template preview
        $(".smls-carousel-common").first().addClass("carousel-active");
        $('.smls-carousel-template').on('change', function() {
            var template_value = $(this).val();
            var array_break = template_value.split('-');
            var current_id = array_break[1];
            $('.smls-carousel-common').hide();
            $('#smls-carousel-demo-' + current_id).show();
        });
        var carousel_view = $(".smls-carousel-template option:selected").val();
        var array_break = carousel_view.split('-');
        var current_id1 = array_break[1];
        $('.smls-carousel-common').hide();
        $('#smls-carousel-demo-' + current_id1).show();

        //pager template preview
        $(".smls-pager-common").first().addClass("pager-active");
        $('.smls-pager-template').on('change', function() {
            var template_value = $(this).val();
            var array_break = template_value.split('-');
            var current_id = array_break[1];
            $('.smls-pager-common').hide();
            $('#smls-pager-demo-' + current_id).show();
        });
        var pager_view = $(".smls-pager-template option:selected").val();
        var array_break = pager_view.split('-');
        var current_id1 = array_break[1];
        $('.smls-pager-common').hide();
        $('#smls-pager-demo-' + current_id1).show();

        //arrow template preview
        $(".smls-arrow-common").first().addClass("arrow-active");
        $('.smls-arrow-type').on('change', function() {
            var template_value = $(this).val();
            var array_break = template_value.split('-');
            var current_id = array_break[1];
            $('.smls-arrow-common').hide();
            $('#smls-arrow-demo-' + current_id).show();
        });
        var arrow_view = $(".smls-arrow-type option:selected").val();
        var array_break = arrow_view.split('-');
        var current_id1 = array_break[1];
        $('.smls-arrow-common').hide();
        $('#smls-arrow-demo-' + current_id1).show();

        //list template preview
        $(".smls-list-common").first().addClass("list-active");
        $('.smls-list-template').on('change', function() {
            var template_value = $(this).val();
            var array_break = template_value.split('-');
            var current_id = array_break[1];
            $('.smls-list-common').hide();
            $('#smls-list-demo-' + current_id).show();
        });
        var list_view = $(".smls-list-template option:selected").val();
        var array_break = list_view.split('-');
        var current_id1 = array_break[1];
        $('.smls-list-common').hide();
        $('#smls-list-demo-' + current_id1).show();

        //flipster template preview
        $(".smls-perspective-common").first().addClass("list-active");
        $('.smls-perspective-template').on('change', function() {
            var template_value = $(this).val();
            var array_break = template_value.split('-');
            var current_id = array_break[1];
            $('.smls-perspective-common').hide();
            $('#smls-perspective-demo-' + current_id).show();
        });
        var perspective_view = $(".smls-perspective-template option:selected").val();
        var array_break = perspective_view.split('-');
        var current_id1 = array_break[1];
        $('.smls-perspective-common').hide();
        $('#smls-perspective-demo-' + current_id1).show();

        //filter tab template preview
        $(".smls-filter-tab-common").first().addClass("filter-tab-active");
        $('.smls-filter-tab-template').on('change', function() {
            var template_value = $(this).val();
            var array_break = template_value.split('-');
            var current_id = array_break[1];
            $('.smls-filter-tab-common').hide();
            $('#smls-filter-tab-demo-' + current_id).show();
        });
        var filter_tab_view = $(".smls-filter-tab-template option:selected").val();
        var array_break = filter_tab_view.split('-');
        var current_id1 = array_break[1];
        $('.smls-filter-tab-common').hide();
        $('#smls-filter-tab-demo-' + current_id1).show();

        //filter template preview
        $(".smls-filter-template-common").first().addClass("filter-template-active");
        $('.smls-filter-template').on('change', function() {
            var template_value = $(this).val();
            var array_break = template_value.split('-');
            var current_id = array_break[1];
            $('.smls-filter-template-common').hide();
            $('#smls-filter-template-demo-' + current_id).show();
        });
        var filter_template_view = $(".smls-filter-template option:selected").val();
        var array_break = filter_template_view.split('-');
        var current_id1 = array_break[1];
        $('.smls-filter-template-common').hide();
        $('#smls-filter-template-demo-' + current_id1).show();

        //tooltip template preview
        $(".smls-tooltip-common").first().addClass("tooltip-active");
        $('.smls-tooltip-template').on('change', function() {
            var template_value = $(this).val();
            var array_break = template_value.split('-');
            var current_id = array_break[1];
            $('.smls-tooltip-common').hide();
            $('#smls-tooltip-demo-' + current_id).show();
        });
        var tooltip_view = $(".smls-tooltip-template option:selected").val();
        var array_break = tooltip_view.split('-');
        var current_id1 = array_break[1];
        $('.smls-tooltip-common').hide();
        $('#smls-tooltip-demo-' + current_id1).show();

        //inline template preview
        $(".smls-inline-common").first().addClass("inline-active");
        $('.smls-inline-template').on('change', function() {
            var template_value = $(this).val();
            var array_break = template_value.split('-');
            var current_id = array_break[1];
            $('.smls-inline-common').hide();
            $('#smls-inline-demo-' + current_id).show();
        });
        var inline_view = $(".smls-inline-template option:selected").val();
        var array_break = inline_view.split('-');
        var current_id1 = array_break[1];
        $('.smls-inline-common').hide();
        $('#smls-inline-demo-' + current_id1).show();

        //popup template preview
        $(".smls-popup-common").first().addClass("popup-active");
        $('.smls-popup-type').on('change', function() {
            var template_value = $(this).val();
            var array_break = template_value.split('-');
            var current_id = array_break[1];
            $('.smls-popup-common').hide();
            $('#smls-popup-demo-' + current_id).show();
        });
        var inline_view = $(".smls-popup-type option:selected").val();
        var array_break = inline_view.split('-');
        var current_id1 = array_break[1];
        $('.smls-popup-common').hide();
        $('#smls-popup-demo-' + current_id1).show();

        /*
         * Carousel horizontal vertical show hide
         */
        $('.smls-carousel-type').change(function() {
            if ($(this).val() === 'horizontal') {

                $('.smls-carousel-horiz-wrap').show();
            } else {

                $('.smls-carousel-horiz-wrap').hide();
            }
        });
        var selected_car_type = $(".smls-carousel-type option:selected").val();
        if (selected_car_type === "horizontal") {

            $('.smls-carousel-horiz-wrap').show();
        } else {
            $('.smls-carousel-horiz-wrap').hide();
        }

        /*
         * Carousel pager show hide
         */
        $('.smls-carousel-pager').change(function() {
            if ($(this).val() === 'true') {

                $('.smls-pager-hide-wrap').show();
            } else {

                $('.smls-pager-hide-wrap').hide();
            }
        });
        var selected_car_pager = $(".smls-carousel-pager option:selected").val();
        if (selected_car_pager === "true") {
            $('.smls-pager-hide-wrap').show();
        } else {

            $('.smls-pager-hide-wrap').hide();
        }

        /*
         * Carousel controls arrow show hide
         */
        $('.smls-controls-type').change(function() {
            if ($(this).val() === 'arrow') {

                $('.smls-controls-true-wrap').show();
            } else {

                $('.smls-controls-true-wrap').hide();
            }
        });
        var selected_car_control = $(".smls-controls-type option:selected").val();
        if (selected_car_control === "arrow") {
            $('.smls-controls-true-wrap').show();
        } else {

            $('.smls-controls-true-wrap').hide();
        }
        /*
         * Carousel controls show hide
         */
        $('.smls-carousel-controls').change(function() {
            if ($(this).val() === 'true') {

                $('.smls-car-control-type-wrap').show();
            } else {

                $('.smls-car-control-type-wrap').hide();
            }
        });
        var selected_car_control = $(".smls-carousel-controls option:selected").val();
        if (selected_car_control === "true") {
            $('.smls-car-control-type-wrap').show();
        } else {

            $('.smls-car-control-type-wrap').hide();
        }
        /*
         * Filter types show hide
         */
        $('.smls-filter-type').change(function() {
            if ($(this).val() === 'normal') {

                $('.smls-normal-filter-wrap').show();
            } else {

                $('.smls-normal-filter-wrap').hide();
            }
        });
        var selected_filter_type = $(".smls-filter-type option:selected").val();
        if (selected_filter_type === "normal") {
            $('.smls-normal-filter-wrap').show();
        } else {

            $('.smls-normal-filter-wrap').hide();
        }

        /*
        *  sort for tab
        */

         $('.smls-tab-wrap').sortable();
    });
}(jQuery));
