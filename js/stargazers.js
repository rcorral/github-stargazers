define('stargazers', function() {
    'use strict';

    var stargazers = {
        token: '?access_token=19274bf4df1e1656fdb79c213c449561c5e82be2',
        $append_el: jQuery('.all-stargazers'),
        init: function() {
            this.has_scrolled = false;
            this.to_append = [];
        },

        scroll: function() {
            if (this.has_scrolled) {return;}

            if (window.innerHeight < jQuery('.all-stargazers').height()) {
                jQuery(window).scrollTo(88, 1000);
                this.has_scrolled = true;
            }
        },

        // We don't want to append one by one...too much dom manipulation
        append: function(html) {
            this.to_append.push(html);
            this.trigger_append();
        },

        trigger_append: function(force) {
            // 15 seems like a sweet spot
            if (this.to_append.length === 15 || force === true) {
                var docfrag = document.createDocumentFragment();
                for (var i = 0; i < this.to_append.length; i++) {
                    docfrag.appendChild(this.to_append[i]);
                };
                this.$append_el.append(docfrag);
                this.to_append = [];
                this.scroll();
            }
        }
    };

    return stargazers;
});