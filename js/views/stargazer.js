define('views/stargazer', function() {
    'use strict';

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

    return StargazerView;
});