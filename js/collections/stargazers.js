define('collections/stargazers', ['models/stargazer', 'stargazers'], function(StargazerModel, stargazers) {
    'use strict';

    var StargazersCollection = Backbone.Collection.extend({
        model: StargazerModel,

        initialize: function(models, options) {
            this.options = options;
            this.view = this.options.view;

            // Handle pagination
            this.on('sync', function(model, resp, options) {
                var match = (options.xhr.getResponseHeader('Link') || '').match(/<(.*?)>; rel="next"/);

                if (match === null) {
                    // Append any remaining stargazers
                    if (this.options.last_repo) {
                        stargazers.trigger_append(true);
                    }

                    return;
                }

                // Fetch next page
                this.next_url = match[1];
                this.fetch({
                    success: _.bind(this.fetch_success, this)
                });
            });
        },

        url: function() {
            return this.next_url || this.options.url;
        },

        fetch_success: function() {
            this.view.render();
        }
    });

    return StargazersCollection;
});