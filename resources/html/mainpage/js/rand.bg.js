(function($) {

    $.fn.RandBG = function(options) {

        var settings = $.extend({
            ClassPrefix: "bg",
            count: 10
        }, options);

        //var index = Math.ceil(Math.random() * settings.count * settings.count) % settings.count;
        var index = 2;
        $(this).addClass(settings.ClassPrefix + index);
    };

}(jQuery));
