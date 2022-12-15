jQuery(($) => {
    const gURL = "http://question-env.eba-es2s4tgm.ap-southeast-1.elasticbeanstalk.com";//"http://localhost:8080";
    console.log("Trang dang nhap");
    const localToken = getLocalStorage("Token");
    let prevPage = localStorage.getItem("current");

    if (localToken) {
        checkToken(localToken);
    }
    $(document).on("click", ".btn-login", (e) => {
        console.log("login", e.which);

        let userData = {
            username: $("#inp-username").val(),
            password: $("#inp-password").val()
        }

        if (userLoginValid(userData)) {
            formLogin(userData);
        }

    });

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
                console.log(prevPage);
                window.location.assign(prevPage);
            },
            error: (error) => {
                console.log("Phiên đăng nhập hết hạn", error);
                window.localStorage.removeItem("Token");
                window.localStorage.removeItem("username");
            }

        })
    }



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
            contentType: false,
            success: async function (response) {
                console.log(response);
                window.localStorage.setItem("Token", await response);
                checkToken(response);
            },
            error: function (error) {
                console.log(error, error.responseText);
            }
        });
    }

    //Get local stored
    function getLocalStorage(itemKey) {
        return localStorage.getItem(itemKey);
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
})