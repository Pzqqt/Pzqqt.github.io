function toggle_night_css(enable) {
    let custom_night_css_href = "/static/custom-night.css";
    let highlight_light_css_href = "/static/colorful.css";
    let highlight_night_css_href = "/static/monokai.css";
    if (enable === "true") {
        $('head > link[href="/static/custom.css"]').after(
            $('<link rel="stylesheet" type="text/css" href="' + custom_night_css_href + '">')
        );
        $('head > link#_highlight_css').attr({"href": highlight_night_css_href});
    } else {
        $('head > link[href="' + custom_night_css_href + '"]').remove();
        $('head > link#_highlight_css').attr({"href": highlight_light_css_href});
    }
}
function is_night_mode() {
    return Cookies.get("ui_night_mode") === "true";
}
function apply_night_mode(night_mode) {
    if (night_mode === undefined)
        night_mode = is_night_mode();
    if (night_mode) {
        $('#night_toggle').html('<i class="ri-sun-fill"></i>').attr("title", "Light mode");
        toggle_night_css("true");
    } else {
        $('#night_toggle').html('<i class="ri-moon-line"></i>').attr("title", "Night mode");
        toggle_night_css();
    }
}

$(document).ready(function() {
    let totop_btn = $('#totop');
    let _fs = true;
    let _menu_flag = false;
    const zooming = new Zooming({
        bgColor: is_night_mode() ? '#000' : '#fff',
        scaleExtra: window.innerWidth < 768 ? 2 : 1,
    });

    $(window).resize(function(){
        zooming.config({scaleExtra: window.innerWidth < 768 ? 2 : 1});
        $('.content').attr("style", "");
        $('.sidebar').attr("style", "");
        if (window.innerWidth >= 768) {
            $('#menu_button').css("right", ".25em");
            if (! is_night_mode())
                $('#menu_button').css("color", "#fff");
            _menu_flag = false;
        };
    });

    $(window).scroll(function() {
        if ($(window).scrollTop() > 200) {
            if (_fs) {
                totop_btn.stop().animate({"right": "40px"}, 300);
                _fs = false;
            }
        } else {
            if (!_fs) {
                totop_btn.stop().animate({"right": "-60px"}, 300);
                _fs = true;
            }
        }
    });

    totop_btn.click(function() {
        $('html, body').animate({"scrollTop": 0}, 300);
    });

    $('#night_toggle').click(function() {
        let new_night_mode = !is_night_mode();
        Cookies.set("ui_night_mode", new_night_mode);
        apply_night_mode(new_night_mode);
        zooming.config({bgColor: new_night_mode ? '#000' : '#fff'});
        if (_menu_flag)
            $('#menu_button').css("color", new_night_mode ? "#fff" : "#222");
    });

    $('#menu_button').click(function() {
        if (window.innerWidth < 768) return;
        if (_menu_flag) {
            $('.content').stop().animate({"margin-left": "25%"}, "slow");
            $('.sidebar').stop().animate({"margin-left": 0}, "slow");
            $('#menu_button').stop().animate({"right": ".25em"}, "slow");
            if (! is_night_mode())
                $('#menu_button').css("color", "");
            _menu_flag = false;
        } else {
            $('.content').stop().animate({"margin-left": "12.5%"}, "slow");
            $('.sidebar').stop().animate({"margin-left": "-25%"}, "slow", function() {
                if (! is_night_mode())
                    $('#menu_button').css("color", "#222");
                $('#menu_button').stop().animate({"right": "-1.25em"}, "slow");
            });
            _menu_flag = true;
        };
    });

    zooming.listen('.pure-img-responsive');
});
