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
    $("#error_msg").addClass("hide");
    $('#'+show).removeClass("hide");
    $('#'+hide).addClass("hide");
}
function validEmail(v) {
    var r = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    return (v.match(r) == null) ? false : true;
}
function setErrorMsg(errorMsg, msgId){
    $("#"+msgId).html("<span class='glyphicon glyphicon-warning-sign'></span> "+errorMsg);
    $("#"+msgId).removeClass("hide");    
}
$(document).ready(function() 
{
    $('ul.nav li').click(function(e) { 
        $('ul.nav li').each(function() {
            $( this ).removeClass("active");
        });
        $(this).addClass("active");
    });
    $( "#signup_form" ).submit(function( event ) {
        var email = $('input[name="signup_email"]').val();    
        if (!validEmail(email)){
            setErrorMsg("Email format is not valid!", "signup_error_msg");
            event.preventDefault();
            return false;
        }
        var pwd1 = $('input[name="signup_password"]').val(); 
        var pwd2 = $('input[name="signup_password_confirmation"]').val(); 
        if (pwd1.length<4){
            setErrorMsg("Password is too short!", "signup_error_msg");
            event.preventDefault();
            return false;   
        }
        if (pwd1 != pwd2){
            $('input[name="signup_password"]').val("");
            $('input[name="signup_password_confirmation"]').val("");
            setErrorMsg("Two password is not equal!", "signup_error_msg");
            event.preventDefault();
            return;
        }
        return true; 
    });
    $( "#signin_form" ).submit(function( event ) {
        var email = $('input[name="signin_email"]').val();    
        if (!validEmail(email)){
            setErrorMsg("Email format is not valid!", "signin_error_msg");
            event.preventDefault();
            return false;
        }
        var pwd = $('input[name="signin_password"]').val();
        if (pwd.length<4){
            setErrorMsg("Password is too short!", "signin_error_msg");
            event.preventDefault();
            return false;   
        }
        return true; 
    });
});

//<div class="alert alert-warning">Warning ! Dont submit this.</div>