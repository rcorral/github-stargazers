define('stargazers', function() {
    'use strict';

    var stargazers = {
        token: '?access_token=10838b19e7632b67bde25802235eac0e559ec8a2',
        $append_el: jQuery('.all-stargazers'),
        avatar_queue: {},

        init: function() {
            this.has_scrolled = false;
            this.to_append = [];
        },

        // Scroll to the all-stargazers element when there are enough images on the page
        scroll: function() {
            var $all_stargazers = jQuery('.all-stargazers');

            if (this.has_scrolled) {return;}

            if (window.innerHeight < ($all_stargazers.height() + 40)) {
                setTimeout(function() {
                    jQuery(window).scrollTo($all_stargazers, 1000);
                }, 5000);
                this.has_scrolled = true;
            }
        },

        // Will only request each avatar_url once, once fetched it will add it to all img tags that require that avatar
        prefech_image: function(el, avatar_url) {
            // Prefetch each avatar, then add to DOM
            var avatar, i, _images,
                request_url = avatar_url,
                domains = [0, 1, 2, 3],
                random_domain = Math.floor(Math.random() * domains.length),
                matches = avatar_url.match(/(gravatar\.com.*)$/);

            // Only request the avatar URL once
            if (this.avatar_queue[avatar_url]) {
                // If we have already looped through the queue then just add to the DOM
                if (typeof this.avatar_queue[avatar_url] === 'string') {
                    return jQuery(el).find('img').attr({src: this.avatar_queue[avatar_url], height: 40, width: 40});
                } else {
                    return this.avatar_queue[avatar_url].push(el);
                }
            }

            // Play around with cdn domains to speed things up
            if (matches !== null && matches[1]) {
                request_url = 'https://' + domains[random_domain] + '.' + matches[1];
            }

            avatar = new Image();
            // Add to DOM
            avatar.onload = function() {
                var _images = stargazers.avatar_queue[avatar_url];
                stargazers.avatar_queue[avatar_url] = request_url;
                // Loop through queue and add to DOM
                for (i in _images) {
                    jQuery(_images[i]).find('img').attr({src: request_url, height: 40, width: 40});
                }
            };
            avatar.src = request_url;
            this.avatar_queue[avatar_url] = [el];
        },

        // We don't want to append one by one...too much dom manipulation
        append: function(html) {
            this.to_append.push(html);
            this.trigger_append();
        },

        // Maybe append new stargazers to the DOM
        trigger_append: function(force) {
            var docfrag, i;

            // 15 seems like a sweet spot
            if (this.to_append.length !== 15 && force !== true) {
                return;
            }

            docfrag = document.createDocumentFragment();
            for (i = 0; i < this.to_append.length; i++) {
                docfrag.appendChild(this.to_append[i]);
            }

            this.$append_el.append(docfrag);
            this.to_append = [];
            this.scroll();
        }
    };

    return stargazers;
});