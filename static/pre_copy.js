let icon_copy = '<i class="ri-file-copy-line"></i>';
let icon_check = '<i class="ri-check-line" style="color: green;"></i>';

for (let pre of $(".post-description pre")) {
    $('<span class="btn-pre-copy" style="display: none;">' + icon_copy + '</span>').prependTo($(pre).parent());
}

$(document).ready(function() {
    $(".post-description div.highlight").mouseenter(function(event) {
        $(event.currentTarget).find("span.btn-pre-copy").show();
    });
    $(".post-description div.highlight").mouseleave(function(event) {
        $(event.currentTarget).find("span.btn-pre-copy").hide();
    });
    $("span.btn-pre-copy").click(function() {
        let btn = $(this);
        let pre = btn.next("pre");

        function _btn_change() {
            btn.html(icon_check);
            setTimeout(() => {
                btn.html(icon_copy);
            }, 1500);
        }

        if ("clipboard" in navigator) {
            navigator.clipboard.writeText(pre.text()).then(_btn_change);
            return;
        }
        let textarea_tmp = $('<textarea></textarea>');
        textarea_tmp.css({width: "1px", height: "1px", position: "fixed", top: "5px"});
        textarea_tmp.text(pre.text());
        textarea_tmp.appendTo($("body"));
        textarea_tmp.select();
        document.execCommand("Copy");
        textarea_tmp.remove();
        _btn_change();
    });
});
