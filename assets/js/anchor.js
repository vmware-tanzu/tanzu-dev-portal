/*
 * Copyright 2018 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

(function ($) {
    'use strict';

    $(function () {
        // Handle in-page anchor links with fixed header
        $('a[href^="#"]').click(function(e) {
            if (this.hash.length > 1) { // don't do this for empty # links
                window.location.href = this.href;
                e.preventDefault();
                scrollToTarget(this.hash);
            }
        });

        // Scroll to the right place when loading in-page anchor links
        $(window).on('load', function(e){
            var target = window.location.hash;
            if (target) {
                scrollToTarget(target);
            }
        });
    });

    function scrollToTarget(target) {
        var headerHeight = 80; 
        if (document.getElementById("live-notify") != null)
            if (document.getElementById("live-notify").style.display == "block")
                headerHeight = headerHeight + 40;
        var targetId = target.replace(":","\\:");
        $('html, body').animate(
            { scrollTop: $(targetId).offset().top - headerHeight },
            0,
            'linear'
        );
    }


}(jQuery));
