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
function convertSourseCodeToHtml(codestrr) {
   // str = str.replace(/\b(the|over|and|into)\b/g, "_")
    codestrr = codestrr.replace(/(<)/g, "&lt;"); 
    codestrr = codestrr.replace(/(>)/g, "&gt;"); 
    codestrr = codestrr.replace(/(\n)/g, "<br>");
    codestrr = codestrr.replace(/(\t)/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
    codestrr = codestrr.replace(/ /g, "&nbsp;");
    return codestrr;
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
    var cssContentStr = convertSourseCodeToHtml(csscontent);
    var csstestcode = $('textarea#css_testcode').val();
    var cssTestCodeStr = convertSourseCodeToHtml(csstestcode);
    $('input[name="css_content"]').val(cssContentStr);  
    $('input[name="addcss_testcode"]').val(cssTestCodeStr); 
    //alert("submit form");
    $("#addCssForm").submit();
}
function testCss(){
    $("#error_msg").hide();
    var csstype = $('#css_type').val(); 
    var cssname = $('input[name="addcss_name"]').val().trim();
    if (cssname == ""){
        setErrorMsg("css name should not be empty.");
        return;
    }
    var csscontent = $('textarea#css_content').val();
    var cssStr = convertSourseCodeToHtml(csscontent);
    //alert(cssStr);
    if( !$('#useBootstrap').is(':checked') && csscontent.trim() == ""){
        setErrorMsg("css content should not be empty or you can choose Bootstrap.");
        return;
    }
    var testcontent = $('textarea#css_testcode').val(); 
    if (testcontent.trim() == ""){
        setErrorMsg("test code should not be empty.");
        return;
    }
    var testCodeStr = convertSourseCodeToHtml(testcontent);
    var description = $('input[name="addcss_description"]').val();
    data = {}
    data["name"] = cssname;
    data["type"] = csstype;
    data["description"] = description;
    data["content"] = cssStr;
    data["testCode"] = testCodeStr;
    if($('#useBootstrap').is(':checked')){
        data["useBootstrap"] = "Yes";
    }
    else{
        data["useBootstrap"] = "No";   
    }
    showTest(data);
}
function showTest(data){
    $('#showCss').fadeIn();
    $("#chose_css_name").html("<pre>"+data["name"]+"</pre>");
    $("#chose_css_type").html("<pre>"+data["type"]+"</pre>");
    $("#chose_css_description").html("<pre>"+data["description"]+"</pre>");   
    $("#chose_css_useBootstrap").html("<pre>"+data["useBootstrap"]+"</pre>");
    var content = data["content"];
    $("#css_code").html("<pre>"+content+"</pre>");   
    var testCode = data["testCode"];
    $("#chose_testcode").html("<pre>" + testCode + "</pre>");  
    var test = createTest(content, testCode, data["useBootstrap"]=="Yes");
    $("#test_area").html(test);
}
function createTest(cssCode, testCode, useBootstrap){
    var css = convertHtmlToSourceCode(cssCode);
    var code = convertHtmlToSourceCode(testCode);
    var mainCode = "<style>"+css+"</style>"+code;
    var suffixUrl = encodeURIComponent(mainCode);
    var bootstrap = useBootstrap?1:0
    return "<iframe id=\"test_iframe\" class=\"col-md-10\" src=\"/csspool/frame/"+bootstrap+"?code="+suffixUrl+"\"><noframes><body>"+mainCode+"</body></noframes></iframe>"; 
}
function convertHtmlToSourceCode(htmlcode){
    var codestrr = htmlcode.replace(/&nbsp;/g, " ");
    codestrr = codestrr.replace(/&lt;/g, "<"); 
    codestrr = codestrr.replace(/&gt;/g, ">"); 
    codestrr = codestrr.replace(/<br>/g, "");
    return codestrr;
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
                showTest(data);
            }
            else{
                alert("no returns!");
            }
        } else {
            alert("Connection failed!");							
        }
    }, false); 
    //alert("chooose: ajaxaccesscss/"+id);
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
        chooseCSS();
    });
    chooseCSS(); 
});