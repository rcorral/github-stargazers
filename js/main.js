jQuery(document).ready(function() {
    var token = '?access_token=19274bf4df1e1656fdb79c213c449561c5e82be2'

    var stargazers = {
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

    // Listen on form submit
    jQuery(document).on('submit', 'form', function(e) {
        e.preventDefault();
        var user = jQuery(this).find('input').val(),
            repos;

        if (!user) {
            alert('Enter a user...');
            return;
        }

        stargazers.init();
        var repos = new ReposView({
            url: 'https://api.github.com/users/' + user + '/repos' + token,
            el: $('.all-stargazers')
        });
    });

    /* Stargazers */

    var StargazersModel = Backbone.Model.extend({
        initialize: function() {}
    });

    var StargazersCollection = Backbone.Collection.extend({
        model: StargazersModel,
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

    var StargazerView = Backbone.View.extend({
        tagName: 'div',
        className: 'stargazer',
        template: $('#stargazerTemplate').html(),

        render: function() {
            var tmpl = _.template(this.template),
                options = [
                    'slowest',
                    'slower',
                    'slow',
                    'normal',
                    'fast',
                    'faster',
                    'fastest'
                ],
                random_key = Math.floor(Math.random() * options.length);

            // Set the twinkle speed
            this.$el.addClass(options[random_key]);

            $(this.el).html(tmpl(this.model.toJSON()));

            return this;
        }
    });

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
                avatar = new Image(),
                avatar_url = stargazer.get('avatar_url');

            // Prefetch avatar
            avatar.onload = function() {
                jQuery(el).find('img').attr({src: avatar_url, height: 40, width: 40});
            };
            avatar.src = avatar_url;

            stargazers.append(el);
        }
    });

    /* Repos */

    var RepoModel = Backbone.Model.extend({
        initialize: function() {}
    });

    var ReposCollection = Backbone.Collection.extend({
        model: RepoModel,
        initialize: function(models, options) {
            this.options = options;
        },
        url: function() {
            return this.options.url;
        }
    });

    // Single repo view
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

    // All repos view
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

                stargazer_view = new StargazersView({
                    url: repo.get('stargazers_url') + token + '&page=1&per_page=100',
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
});