jQuery(() => {
    const username = window.localStorage.getItem("username");

    if (username) {
        $("#user-name").html(username);
        $("#btn-nhap-xuat").html("Đăng xuất");

    } else {
        $("#user-name").html("Guest");
        $("#btn-nhap-xuat")
            .attr("href", "login.html")
            .html("Đăng nhập");
    }

})