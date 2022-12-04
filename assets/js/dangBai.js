//blog-grid.html

jQuery(($) => {
    console.log("Khu vực để đăng bài mới");
    const gURL = "http://localhost:8080";

    const baiDang = {
        loaiNhaDat: "Nhà đất",
        hinhThuc: "Cho thuê",
        tinhThanh: "SG",
        quanHuyen: 8,
        dienTich: 1000,
        soPhong: 5,
        soTang: 1,
        duAn: "Thổ cư",
        daBan: false,
        giaTien: 2000000
    }

    //Gọi API lấy danh sách tỉnh thành, quận huyện
    $.ajax({
        type: "GET",
        url: gURL + "/province?s=63",
        dataType: "json",
        success: (data) => {
            loadProvince(data);
        },
        error: (err) => {
            console.log(err);
        }
    });

    //On province change
    $(document).on("change", "#select-tinh-thanh", (e) => {
        let provinceCode = e.target.value;
        console.log(provinceCode);
        if ($("#select-tinh-thanh").val() == "0") {
            $("#select-quan-huyen").attr("disabled", true);
            $("#select-quan-huyen").html("")
            $("<option>").val("0").text("Quận huyện").appendTo("#select-quan-huyen");
        } else {
            $.ajax({
                type: "GET",
                url: gURL + "/province/" + provinceCode + "/d",
                dataType: "json",
                success: (data) => {
                    loadDistrict(data);
                },
                error: (err) => {
                    console.log(err);
                }
            });
            $("#select-quan-huyen").attr("disabled", false);
        }

    })


    //Nút tìm kiếm
    $(document).on("click", ".btn-tim-kiem", () => {
        $.ajax({
            url: "http://localhost:8080/post",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(baiDang),
            contentType: "application/json",
            success: (data) => {
                console.log(data);
            },
            error: (err) => {
                console.log(err);
                console.log(err.responseText);
            }
        });
    })

    //Nút tạo mới bài đăng
    $(document).on("click", ".btn-create-post", () => {
        let baiDang = {
            loaiNhaDat: $("#inp-loai-nha-dat").val(),
            hinhThuc: $("#sel-hinh-thuc :selected").val(),
            tinhThanh: $("#select-tinh-thanh :selected").val(),
            quanHuyen: $("#select-quan-huyen :selected").val(),
            dienTich: $("#inp-dien-tich").val(),
            soPhong: $("#inp-so-phong").val(),
            soTang: $("#inp-so-tang").val(),
            duAn: "Thổ cư",
            daBan: false,
            giaTien: $("#inp-gia-tien").val(),
            soNha: $("#inp-so-nha").val(),
            ghiChu: $("#area-ghi-chu").val(),
            linkAnh: $("#inp-link-anh").val()
        }
        if (dataValid(baiDang)) {
            $.ajax({
                url: `${gURL}/post`,
                type: "POST",
                dataType: "json",
                data: JSON.stringify(baiDang),
                contentType: "application/json",
                success: (data) => {
                    console.log(data);
                },
                error: (err) => {
                    console.log(err);
                }
            });
        }

    })

    //validate
    function dataValid(baiDangObject) {
        if (!baiDangObject.loaiNhaDat) {
            alert("Missing loaiNhaDat");
            return false;
        }
        if (baiDangObject.hinhThuc === "0") {
            alert("Chưa chọn hình thức");
            return false;
        }
        if (!baiDangObject.dienTich) {
            alert("Diện tích ");
            return false;
        }
        if (!baiDangObject.giaTien) {
            alert("Chưa có giá cần bán");
            return false;
        }
        if (baiDangObject.tinhThanh === "0") {
            alert("Chưa có tỉnh thành");
            return false;
        }
        if (baiDangObject.quanHuyen === "0") {
            alert("Chưa chọn quận/huyện");
            return false;
        }
        if (!baiDangObject.linkAnh) {
            baiDangObject.linkAnh = "https://images.pexels.com/photos/2640604/pexels-photo-2640604.jpeg";
        }
        return true;
    }


    //Load province to select
    function loadProvince(provincesList) {
        for (const province of provincesList) {
            $("<option>").val(province.provinceCode).text(province.provinceName)
                .appendTo("#select-tinh-thanh");
        }
    }

    //Load District to select
    function loadDistrict(districtList) {
        $("#select-quan-huyen").html("")
        $("<option>").val("0").text("Quận huyện").appendTo("#select-quan-huyen");
        for (const district of districtList) {
            $("<option>").val(district.id)
                .text(`${district.prefix} ${district.name}`)
                .appendTo("#select-quan-huyen");
        }
    }
})