requirejs.config({
    baseUrl: 'js/'
});
 
require(['views/repos', 'stargazers'], function(ReposView, stargazers) {
    jQuery(document).ready(function() {
        'use strict';
 
        // Listen on form submit
        jQuery(document).on('submit', 'form', function(e) {
            e.preventDefault();
            var $input = jQuery(this).find('input'),
                user = $input.val().toLowerCase(),
                repos;
 
            // Make the text inside the input field lowercase, just for looks
            $input.val(user);
            if (!user) {
                alert('Enter a user...');
                return;
            }

            // Initialize the search
            jQuery('.form-control').blur();
            stargazers.init();
            var repos = new ReposView({
                url: 'https://api.github.com/users/' + user + '/repos' + stargazers.token,
                el: $('.all-stargazers')
            });
        });
    });
});