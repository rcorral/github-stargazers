requirejs.config({
    baseUrl: 'js/'
});

require(['views/repos', 'stargazers'], function(ReposView, stargazers) {
    jQuery(document).ready(function() {
        'use strict';

        // Listen on form submit
        jQuery(document).on('submit', 'form', function(e) {
            e.preventDefault();
            var user = jQuery(this).find('input').val(),
                repos;

            if (!user) {
                alert('Enter a user...');
                return;
            }

            jQuery('.form-control').blur();
            stargazers.init();
            var repos = new ReposView({
                url: 'https://api.github.com/users/' + user + '/repos' + stargazers.token,
                el: $('.all-stargazers')
            });
        });
    });
});