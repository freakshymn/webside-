//form 1

function Tamil() {
    var uname = document.forms["form"]["uname"].value;
    var upswd = document.forms["form"]["upswd"].value;

    if (uname == null || uname == "") {
        document.getElementById("errorBox").innerHTML = "Enter the username";
        return false;
    }

    if (upswd == null || upswd == "") {
        document.getElementById("errorBox").innerHTML = "Enter the password";
        return false;
    }

    if (uname != '' && upswd != '') {
        alert("Login successfully");
    }
}

//form 2

function Tamil1() {
    var uname1 = document.forms["form1"]["uname1"].value;
    var email1 = document.forms["form1"]["email1"].value;
    var upswd1 = document.forms["form1"]["upswd1"].value;
    var upswd2 = document.forms["form1"]["upswd2"].value;

    if (uname1 == null || uname1 == "") {
        document.getElementById("errorBox").innerHTML = "Enter the username";
        return false;
    }

    if (email1 == null || email1 == "") {
        document.getElementById("errorBox").innerHTML = "Enter the email";
        return false;
    }

    if (upswd1 == null || upswd1 == "") {
        document.getElementById("errorBox").innerHTML = "Enter the password";
        return false;
    }

    if (upswd2 == null || upswd2 == "") {
        document.getElementById("errorBox").innerHTML = "Enter the confirm password";
        return false;
    }

    if (upswd1 != upswd2) {
        document.getElementById("errorBox").innerHTML = "Passwords don't match";
        return false;
    }

    if (uname1 != '' && email1 != '' && upswd1 != '' && upswd2 != '' && upswd1 == upswd2) {
        alert("Register successful");
    }
}

        function loadNav() {
            fetch('head.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('nav-placeholder').innerHTML = data;
                })
                .catch(error => console.error('Error loading head.html:', error));
        }
        document.addEventListener("DOMContentLoaded", loadNav);
    