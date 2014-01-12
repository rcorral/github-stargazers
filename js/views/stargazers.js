define('views/stargazers', ['collections/stargazers', 'views/stargazer', 'stargazers'], function(StargazersCollection, StargazerView, stargazers) {
    'use strict';

    var StargazersView = Backbone.View.extend({
        initialize: function(options) {
            var that = this;

            this.options = options;
            this.collection = new StargazersCollection([], {
                url: this.options.url,
                view: this,
                last_repo: this.options.last_repo
            });
            this.collection.fetch({
                success: _.bind(this.collection.fetch_success, this.collection)
            });
        },

        render: function() {
            var that = this;

            _.each(this.collection.models, function(stargazer) {
                that.renderStargazer(stargazer);
            }, this);
        },

        renderStargazer: function(stargazer) {
            var repoView = new StargazerView({
                    model: stargazer
                }),
                el = repoView.render().el,
                domains = [0, 1, 2, 3],
                random_domain = Math.floor(Math.random() * domains.length),
                avatar = new Image(),
                avatar_url = stargazer.get('avatar_url'),
                matches = avatar_url.match(/(gravatar\.com.*)$/);

            if (matches !== null && matches[1]) {
                avatar_url = 'https://' + domains[random_domain] + '.' + matches[1];
            }

            // Prefetch avatar
            avatar.onload = function() {
                jQuery(el).find('img').attr({src: avatar_url, height: 40, width: 40});
            };
            avatar.src = avatar_url;

            stargazers.append(el);
        }
    });

    return StargazersView;
});