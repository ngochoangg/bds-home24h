jQuery(($) => {
    const token = getTokenFromLocal();
    const gURL = "https://hoangvn.azurewebsites.net";


    if (token) {
        checkToken(token);
    }

    $(document).on("click", ".btn-login-admin", () => {

        let userData = {
            username: $("#yourUsername").val(),
            password: $("#yourPassword").val()
        }

        if (userLoginValid(userData)) {
            formLogin(userData);
        }
    })

    $(document).keypress((e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            let userData = {
                username: $("#yourUsername").val(),
                password: $("#yourPassword").val()
            }

            if (userLoginValid(userData)) {
                formLogin(userData);
            }
        }
    })

    //Signin
    function formLogin(userData) {

        $.ajax({
            method: "POST",
            url: gURL + "/login",
            data: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 0,
            processData: false,
            success: async function (response) {
                console.log(response);
                window.localStorage.setItem("Token", await response);
                window.location.assign("index.html");
            },
            error: function (error) {
                $("#toastText").html(`${error.responseText} : error ${error.status}`);
                $("#liveToast").toast("show");
            }
        });
    }
    //Validate data
    function userLoginValid(userData) {
        if (!userData.username) {
            alert("Tên đăng nhập không được bỏ trống!");
            return false;
        }
        if (!userData.password) {
            alert("Mật khẩu chưa điền!");
            return false;
        }
        return true;
    }

    //Check username by token
    function checkToken(token) {
        $.ajax({
            url: gURL + "/who",
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            data: token,
            success: async (response) => {
                window.localStorage.setItem("username", await response);
                console.log(response);
                window.location.assign("index.html");
            },
            error: (error) => {
                console.log(error);
                if (error.status === 422) {
                    $("#toastText").html(`Phiên đăng nhập hết hạn, hãy đăng nhập lại!`);
                    window.localStorage.removeItem("Token");
                    window.localStorage.removeItem("username");
                } else {
                    $("#toastText").html(`${error.responseText} : error ${error.status}`);
                }
                $("#liveToast").toast("show");
            }

        })
    }

    //Get token 
    function getTokenFromLocal() {
        return window.localStorage.getItem("Token");
    }

})