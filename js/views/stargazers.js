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

            // Render each stargazer
            _.each(this.collection.models, function(stargazer) {
                that.renderStargazer(stargazer);
            }, this);
        },

        renderStargazer: function(stargazer) {
            var repoView = new StargazerView({
                    model: stargazer
                }),
                el = repoView.render().el;

            stargazers.prefech_image(el, stargazer.get('avatar_url'));
            stargazers.append(el);
        }
    });

    return StargazersView;
});