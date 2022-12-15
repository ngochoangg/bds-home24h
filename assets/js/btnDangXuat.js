jQuery(($) => {
    let username = window.localStorage.getItem("username");
    let prevPage = window.localStorage.getItem("current");

    $(document).on("click", "#btn-nhap-xuat", (e) => {
        username = window.localStorage.getItem("username");

        if (!username) {
            window.location.assign("login.html");
        }
        window.localStorage.removeItem("username");
        window.localStorage.removeItem("Token");
        window.location.assign(prevPage);

    })
})