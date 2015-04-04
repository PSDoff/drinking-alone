// GLobals
var token;

// app
;(function($, undefined) {
    'use strict';
    // global app declaration
    window.app = {};
    /**
    * app "global" vars
    */
    app.hasTouch = 'ontouchstart' in document;
    app.w = document.documentElement.clientWidth;
    app.isMobile = app.w < 768;
})(jQuery);

// initMapAccessToken
;(function($, undefined) {
    'use strict';

    app.initMapToken = function(){
        var config = {
            apiKey: 'YXCHQUX2IOPLPKH1UOCFUS023RVNVN0UQXJDXESUNYFPHR0S',
            authUrl: 'https://foursquare.com/',
            apiUrl: 'https://api.foursquare.com/'
        };

        function doAuthRedirect() {
            var redirect = window.location.href.replace(window.location.hash, '');
            var url = config.authUrl + 'oauth2/authenticate?response_type=token&client_id=' + config.apiKey +
            '&redirect_uri=' + encodeURIComponent(redirect) +
            '&state=' + encodeURIComponent($.bbq.getState('req') || 'users/self');
            window.location.href = url;
        };

        if ($.bbq.getState('access_token')) {
            // If there is a token in the state, consume it
            token = $.bbq.getState('access_token');
            $.bbq.pushState({}, 2)
        } else if ($.bbq.getState('error')) {
        } else {
            doAuthRedirect();
        }
    };

})(jQuery);

;(function($, undefined) {
    'use strict';

    app.initGenerateSimpleMap = function(){
        var config = {
            apiKey: 'YXCHQUX2IOPLPKH1UOCFUS023RVNVN0UQXJDXESUNYFPHR0S',
            authUrl: 'https://foursquare.com/',
            apiUrl: 'https://api.foursquare.com/'
        };


        var map = L.mapbox.map('map_canvas', 'psdoff.lkp96ga7').setView([40, -74.50], 9);
    }

    app.initGenerateMap = function(){
        var config = {
            apiKey: 'YXCHQUX2IOPLPKH1UOCFUS023RVNVN0UQXJDXESUNYFPHR0S',
            authUrl: 'https://foursquare.com/',
            apiUrl: 'https://api.foursquare.com/'
        };


        /* HTML 5 geolocation. */
        navigator.geolocation.getCurrentPosition(function(data) {
            var lat = data['coords']['latitude'];
            var lng = data['coords']['longitude'];
            console.log(lat + ':Lat');
            console.log(lng + ':lng');
            /* Create map. */
            L.mapbox.accessToken = 'pk.eyJ1IjoicHNkb2ZmIiwiYSI6IkVZMG1GaTAifQ.TEGGgSox89VgszguosKMPA';

            var map = L.mapbox.map('map_canvas', 'psdoff.lkp96ga7').setView(new L.LatLng(lat, lng), 15);

            /* Query foursquare API for venue recommendations near the current location. */
            $.getJSON(config.apiUrl + 'v2/venues/explore?ll=' + lat + ',' + lng + '&oauth_token=' + window.token + '&v=20140601', {}, function(data) {
                console.log(data['response']['groups'][0]['items']);
                var venues = data['response']['groups'][0]['items'];
                /* Place marker for each venue. */
                for (var i = 0; i < venues.length; i++) {
                    /* Get marker's location */
                    var latLng = new L.LatLng(
                        venues[i]['venue']['location']['lat'],
                        venues[i]['venue']['location']['lng']
                    );
                    /* Build icon for each icon */
                    var myIcon = L.divIcon({className: 'drinking-alone-marker'}); 

                    var marker = new L.Marker(latLng, {icon: myIcon})
                    .bindPopup(venues[i]['venue']['name'], { closeButton: false })
                    .on('mouseover', function(e) { this.openPopup(); })
                    .on('mouseout', function(e) { this.closePopup(); });
                    map.addLayer(marker);
                }
            })
        })
    }

})(jQuery);

// init on doc.ready
;(function($, undefined) {
    'use strict';

    // fix prototype console hack (comment out for production)
    delete window.console;

    app.init = function() {
        app.initMapToken();
        // app.initGenerateSimpleMap();
        app.initGenerateMap();
    };

    $(app.init);
})(jQuery);
