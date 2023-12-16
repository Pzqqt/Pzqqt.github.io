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
function apply_night_mode() {
    if (Cookies.get("ui_night_mode") === "true") {
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
    const zooming = new Zooming({
        bgColor: Cookies.get("ui_night_mode") === "true" ? '#000' : '#fff'
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
        Cookies.set("ui_night_mode", Cookies.get("ui_night_mode") !== "true");
        apply_night_mode();
        zooming.config({bgColor: Cookies.get("ui_night_mode") === "true" ? '#000' : '#fff'});
    });

    zooming.listen('.pure-img-responsive');
});
