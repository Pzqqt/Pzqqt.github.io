$(document).ready(function() {
    let totop_btn = $('#totop');
    let _fs = true;
    let _menu_flag = false;
    const darkModeToggle = document.querySelector('dark-mode-toggle');

    function is_night_mode() {
        return darkModeToggle.mode == "dark";
    }

    const zooming = new Zooming({
        bgColor: is_night_mode() ? '#000' : '#fff',
        scaleExtra: window.innerWidth < 768 ? 2 : 1,
    });

    if (is_night_mode())
        $('#night_toggle').html('<i class="ri-sun-fill"></i>').attr("title", "Light mode");

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
        darkModeToggle.mode = is_night_mode() ? "light" : "dark";
        zooming.config({bgColor: is_night_mode() ? '#000' : '#fff'});
        if (is_night_mode())
            $('#night_toggle').html('<i class="ri-sun-fill"></i>').attr("title", "Light mode");
        else
            $('#night_toggle').html('<i class="ri-moon-line"></i>').attr("title", "Night mode");
        if (_menu_flag)
            $('#menu_button').css("color", is_night_mode() ? "#fff" : "#222");
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
