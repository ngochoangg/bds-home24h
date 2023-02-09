jQuery(($) => {
    // const gURL = "http://127.0.0.1:8080/register";
    const gURL = "https://hom24h.up.railway.app/api";

    $(document).on("click", ".btn-signup", (e) => {
        let user = {
            hoTen: $(".inp-fullname").val(),
            email: $("#email").val(),
            diaChi: $("#address").val(),
            soDienThoai: $("#phone").val(),
            username: $(".inp-username").val(),
            password: $("#password").val(),
        }
        if (dataValid(user)) {
            apiProcess(user);
        }



    })

    function apiProcess(dataObject) {
        $.ajax({
            type: "POST",
            url: gURL + "/register",
            data: JSON.stringify(dataObject),
            processData: false,
            dataType: false,
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*"
            },
            success: (response) => {
                $("#span-id").html(response.id);
                $("#span-username").html(response.username);
                $("#span-email").html(response.email);
                $(':input').val('');
                $("#modalRegistered").modal("show");
            },
            error: (error) => {
                $("#resError").html(error.responseText);
                $("#errorRegister").toast("show");
            }
        })
    }


    //Validate user
    function dataValid(dataObject) {
        if (!dataObject.username) {
            alert("Username!");
            return false;
        }
        if (!dataObject.hoTen) {
            alert("hoTen!");
            return false;
        }
        if (!dataObject.password) {
            alert("password!");
            return false;
        }
        if (!dataObject.password.match($("#confirm-password").val())) {
            alert("Mật khẩu nhập lại chưa khớp!");
            return false;
        }
        if (!dataObject.email) {
            alert("email!");
            return false;
        }
        if (!$("#accept-terms").is(":checked")) {
            alert("Chưa chấp nhận điều khoản và điều kiện!");
            return false;
        }
        return true;
    }

})

/**
 * 
 * {
    "id": 60003,
    "hoTen": "string",
    "soDienThoai": null,
    "email": "string2@test.com",
    "diaChi": null,
    "username": "string2",
    "password": "$2a$10$MjUjQCT7e85Nh65XtsTXouwDCSXDOsNzhiN9Cp3/F.qNLaOb6bTpG"
}
 */