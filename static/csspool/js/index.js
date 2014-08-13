function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function checkCookie() {
    var user=getCookie("csspool_username");
    if (user != "") {
        window.location = "showcss";
    }
}
function buttonClick(show, hide){
    $('#'+show).removeClass("hide");
    $('#'+hide).addClass("hide");
}
$(document).ready(function() 
{
    $('ul.nav li').click(function(e) 
    { 
        $('ul.nav li').each(function() {
            $( this ).removeClass("active");
        });
        $(this).addClass("active");
    });
});