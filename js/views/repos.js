define('views/repos', ['collections/repos', 'views/stargazers', 'views/repo', 'stargazers'], function(ReposCollection, StargazersView, RepoView, stargazers) {
    'use strict';

    var ReposView = Backbone.View.extend({
        initialize: function(options) {
            var that = this;

            // Clean up
            this.$el.html('');

            this.options = options;
            this.collection = new ReposCollection([], {
                url: this.options.url
            });
            this.collection.fetch({
                success: function() {
                    that.render();
                },
                error: function(collection, response, options) {
                    if (response.status === 404) {
                        alert('Invalid Github username.')
                    }
                }
            });
        },

        // Render repos
        render: function() {
            var that = this;

            _.each(this.collection.models, function(repo, i) {
                var stargazer_view;
                var repo_el = that.renderRepo(repo);

                // Init load of stargazers
                stargazer_view = new StargazersView({
                    url: repo.get('stargazers_url') + stargazers.token + '&page=1&per_page=100',
                    last_repo: i === (that.collection.models.length - 1)
                });
            }, this);
        },

        // Render a single repo
        renderRepo: function(repo) {
            var repoView = new RepoView({
                    model: repo
                }),
                el = repoView.render().el;

            // this.$el.append(el);

            return el;
        }
    });

    return ReposView;
});