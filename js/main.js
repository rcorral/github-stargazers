jQuery(document).ready(function() {
    var user = 'rcorral';
    var token = '?access_token=19274bf4df1e1656fdb79c213c449561c5e82be2'

    jQuery(document).on('submit', 'form', function(e) {
        e.preventDefault();
        var user = jQuery(this).find('input').val(),
            repos;

        if (!user) {
            alert('Enter a user...');
            return;
        }

        var repos = new ReposView({
            url: 'https://api.github.com/users/' + user + '/repos'
        });
    });

    var StargazersModel = Backbone.Model.extend({
        initialize: function() {
            // console.log(this);
        }
    });

    var StargazersCollection = Backbone.Collection.extend({
        model: StargazersModel,
        initialize: function(models, options) {
            this.options = options;
        },
        url: function() {
            return this.options.url + token;
        }
    });

    var StargazerView = Backbone.View.extend({
        tagName: "div",
        className: "stargazer",
        template: $("#stargazerTemplate").html(),

        render: function() {
            var tmpl = _.template(this.template);

            $(this.el).html(tmpl(this.model.toJSON()));

            return this;
        }
    });

    var StargazersView = Backbone.View.extend({
        el: $(".pics"),

        initialize: function(options) {
            var that = this;

            this.options = options;
            this.collection = new StargazersCollection([], {
                url: this.options.url
            });
            this.collection.fetch({
                success: function() {
                    that.render();
                }
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
            });

            this.$el.append(repoView.render().el);
        }
    });

    var RepoModel = Backbone.Model.extend({
        initialize: function() {
        }
    });

    var ReposCollection = Backbone.Collection.extend({
        model: RepoModel,
        initialize: function(models, options) {
            this.options = options;
        },
        url: function() {
            return this.options.url + token;
        }
    });

    var RepoView = Backbone.View.extend({
        tagName: "article",
        className: "repo",
        template: $("#repoTemplate").html(),

        render: function() {
            var tmpl = _.template(this.template);

            $(this.el).html(tmpl(this.model.toJSON()));

            return this;
        }
    });

    var ReposView = Backbone.View.extend({
        el: $(".repos"),

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
                }
            });
        },

        render: function() {
            var that = this;

            _.each(this.collection.models, function(repo) {
                repo.repo_el = that.renderRepo(repo);

                var stargazer_view = new StargazersView({
                    url: repo.get('stargazers_url'),
                    el: repo.repo_el
                });
            }, this);
        },

        renderRepo: function(repo) {
            var repoView = new RepoView({
                    model: repo
                }),
                el = repoView.render().el;

            this.$el.append(el);

            return el;
        }
    });
});