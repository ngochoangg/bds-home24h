jQuery(($) => {
    const gURL = "http://question-env.eba-es2s4tgm.ap-southeast-1.elasticbeanstalk.com";
    const token = window.localStorage.getItem("token");
    if (token) {
        checkToken(token);
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
            },
            error: (error) => {
                console.log("Phiên đăng nhập hết hạn", error);
                window.localStorage.removeItem("Token");
                window.localStorage.removeItem("username");
            }

        })
    }

})
