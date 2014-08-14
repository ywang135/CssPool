function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) {
            return c.substring(name.length+1, c.length-1);
        }
    }
    return "";
}
function checkCookie() {
    var user=getCookie("csspool_username");
    if (user == "") {
        window.location = "";
    }
    chooseCSS();
}
function validEmail(v) {
    var r = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    return (v.match(r) == null) ? false : true;
}
function buttonClick(show, hide) {
    $('#showCss').hide();
    $("#error_msg").addClass("hide");
    $('#'+show).removeClass("hide");
    $('#'+hide).addClass("hide");
    $('html, body').animate({ scrollTop: 0 }, 'slow');
}
function convertSourseCode(codestrr) {
   // str = str.replace(/\b(the|over|and|into)\b/g, "_")
    codestrr = codestrr.replace(/(<)/g, "&lt;"); 
    codestrr = codestrr.replace(/(>)/g, "&gt;"); 
    codestrr = codestrr.replace(/(\n)/g, "<br>");
    codestrr = codestrr.replace(/(\t)/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
    codestrr = codestrr.replace(/ /g, "&nbsp;");
    return codestrr;
}
function testCss(){
    $("#error_msg").addClass("hide");
    var csstype = $('#css_type').val(); 
    var cssname = $('input[name="addcss_name"]').val().trim();
    if (cssname == ""){
        $("#error_msg").removeClass("hide");
        setErrorMsg("css name should not be empty.");
        return;
    }
    var csscontent = $('textarea#css_content').val();
    var cssStr = convertSourseCode(csscontent);
    //alert(cssStr);
    if( !$('#useBootstrap').is(':checked') && csscontent.trim() == ""){
        $("#error_msg").removeClass("hide");
        setErrorMsg("css content should not be empty or you can choose Bootstrap.");
        return;
    }
    var testcontent = $('textarea#css_testcode').val(); 
    if (testcontent.trim() == ""){
        $("#error_msg").removeClass("hide");
        setErrorMsg("test code should not be empty.");
        return;
    }
    $('#showCss').fadeIn();
    var csscode = "<pre>" + cssname + ":\n" + cssStr + "</pre>";
    $("#css_code").html(csscode);
    //$("style").append(csscontent);
    var testcode="<style>"+csscontent+"</style>";
    testcode += testcontent;
    $("#test_area").html(testcode);
    var testCodeStr = convertSourseCode(testcontent);
    $("#chose_test").html("<pre>" + testCodeStr + "</pre>");
}
function setErrorMsg(errorMsg){
    $("#error_msg").fadeIn(); 
    $("#error_msg").html("<span class='glyphicon glyphicon-warning-sign'></span> "+errorMsg);    
}
function checkAndSubmit() { 
    $("#error_msg").hide();
    var email = getCookie("csspool_username");
    if (!validEmail(email)){
        $.cookie("csspool_username", null, { path: '/' });
        alert("Cookie invalid!");
        window.location = "";
    }    
    $('input[name="addcss_email"]').val(email);
    var pwd = $('input[name="addcss_password"]').val(); 
    //alert(email+"+"+pwd);
    if (pwd.length<4){
        setErrorMsg("Password is too short!");
        return;   
    }
    var csscontent = $('textarea#css_content').val();
    var cssContentStr = convertSourseCode(csscontent);
    var csstestcode = $('textarea#css_testcode').val();
    var cssTestCodeStr = convertSourseCode(csstestcode);
    $('input[name="css_content"]').val(cssContentStr);  
    $('input[name="addcss_testcode"]').val(cssTestCodeStr); 
    alert("submit form");
    $("#addCssForm").submit();
}
function chooseCSS(){
    var id = $("#choose_css_type").val();   
    if (id == undefined){
        return;   
    }
    $('#showCss').fadeIn();
    var request = new XMLHttpRequest();
    request.open('GET', 'ajaxaccesscss/'+id, true);
    fd = new FormData();
    request.send(fd);
    request.addEventListener('load', function(e){
        if (request.status == 200) {
            var content = request.responseText;
            var data = JSON.parse(content);  
            if (data != null){
                var name = data["name"];
                $("#chose_css_name").html("Name: <pre>"+name+"</pre>");
                var type = data["type"];
                $("#chose_css_type").html("Type: <pre>"+type+"</pre>");
                var description = data["description"];
                $("#chose_css_description").html("Description: <textarea disabled=\"true\" style=\"display:inline-block;vertical-align:middle;background-color:white;\">"+description+"</textarea>");               
                $("#chose_css_testcode").html("Test Code: <textarea disabled=\"true\" rows=\"10\" cols=\"30\" style=\"display:inline-block;vertical-align:middle;background-color:white;\">"+data["testCode"]+"</textarea>")
                var content = data["content"];
                $("#chose_css_code").html("css Code: "+content);             
                var testContent = "Test: <style>"+content+"</style>";
                testContent += data["testCode"]
                $("#chose_test").html(testContent);  
            }
            else{
                alert("no returns!");
            }
        } else {
            alert("Connection failed!");							
        }
    }, false); 
//    alert("chooose: ajaxaccesscss/"+id);
}
$(document).ready(function() {
    $('#showCss').hide();
    $('ul.nav li').click(function(e) { 
        $('ul.nav li').each(function() {
            $( this ).removeClass("active");
        });
        $(this).addClass("active");
    });
    $('#choose_css_type').change(function(){
        //chooseCSS();
    });
    
});