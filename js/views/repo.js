define('views/repo', function() {
    'use strict';

    var RepoView = Backbone.View.extend({
        tagName: 'article',
        className: 'repo',
        template: $('#repoTemplate').html(),

        render: function() {
            var tmpl = _.template(this.template);
            $(this.el).html(tmpl(this.model.toJSON()));

            return this;
        }
    });

    return RepoView;
});