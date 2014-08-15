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
function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}
function checkValid(){
    if (!checkCookie("csspool_username"))
        window.location = "/csspool";
}
function checkCookie(cname) {
    var cvalue=getCookie(cname);
    if (cvalue == "") {
        return false;
    }
    return true;
}
function validEmail(v) {
    var r = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    return (v.match(r) == null) ? false : true;
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
                bootbox.alert("no returns!");
            }
        } else {
            bootbox.alert("Connection failed!");							
        }
    }, false);
}
function submitRemoveAction(id){
    $('input[name="remove_id"]').val(id);
    $("#removeForm").submit();
}
function removeCss() {
    var id = $("#choose_css_type").val();   
    if (id == undefined){
        return;   
    }
    $("#error_msg").fadeOut();
    var html_code = '<h4>Your password timeout. Please type in your Password</h4><input type="password" class="form-control" placeholder="password input" size="20" name="password" id="password"/>';
    bootbox.confirm(html_code,  function(result) {
        var pwd = $('input[name="password"]').val();
        if (result) {
            if (pwd.length<4){
                setErrorMsg("The password you typed in was too short!");
            }
            else {
                setCookie(("password", password, 0.01));
                email = getCookie("csspool_username");
                cpwd = getCookie("password");
                password = $.md5(email+pwd);
                password = password.substr(1, password.length-2);
                if (password == cpwd){
                    bootbox.confirm("You want to delete this Css. Are your sure? ", function(confirm){
                        if (confirm){
                            submitRemoveAction(id);
                        }
                    });
                }
                else {
                    setErrorMsg("re-check your password! ");
                }
            }
        }
    });        
}

$(document).ready(function() {
    $("#error_msg").hide();
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