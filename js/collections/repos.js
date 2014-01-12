define('collections/repos', ['models/repo'], function(RepoModel) {
    'use sctrict';

    var ReposCollection = Backbone.Collection.extend({
        model: RepoModel,
        initialize: function(models, options) {
            this.options = options;
        },
        url: function() {
            return this.options.url;
        }
    });

    return ReposCollection;
});