//Quan ly Bai Dang
jQuery(($) => {
    const gToken = getTokenFromLocal();
    const gURL = "https://hoangvn.azurewebsites.net";//"http://question-env.eba-es2s4tgm.ap-southeast-1.elasticbeanstalk.com";
    const gTABLE_HEADER = ['id', 'loaiNhaDat', 'hinhThuc', 'dienTich', 'soNha', 'quanHuyen', 'tinhThanh', 'duAn', 'giaTien', 'user', 'daBan', 'status', 'ngayTao', 'ngayCapNhat', 'action'];

    let gPostData = null;
    let gPage = 0;
    const gPOST_TABLE = $("#table-post").DataTable({

        columns: [
            { data: gTABLE_HEADER[0] },
            { data: gTABLE_HEADER[1] },
            { data: gTABLE_HEADER[2] },
            { data: gTABLE_HEADER[3] },
            { data: gTABLE_HEADER[4] },
            {
                data: gTABLE_HEADER[5],
                render: data => `${data.prefix} ${data.name}`
            },
            {
                data: gTABLE_HEADER[6],
                render: data => data.provinceName
            },
            {
                data: gTABLE_HEADER[7]
            },
            {
                data: gTABLE_HEADER[8]
            },
            {
                data: gTABLE_HEADER[9],
                render: data => data.username
            },
            {
                data: gTABLE_HEADER[10]
            },
            {
                data: gTABLE_HEADER[11]
            },
            {
                data: gTABLE_HEADER[12],
                render: e => e ? new Date(e).toLocaleString() : "N/A"
            },
            {
                data: gTABLE_HEADER[13],
                render: e => e ? new Date(e).toLocaleString() : "N/A"
            },
            {
                data: gTABLE_HEADER[14],
                defaultContent: `<div class='btn-group'>
                    <button class='btn btn-info btn-table-edit'>Chi tiết</button>    
                    <button class='btn btn-danger btn-table-delete'>Xóa</button>
                </div>`
            }
        ],
        lengthChange: false,
        info: false,
        searching: false,
        processing: true,
        paging: false,
        serverSide: true,
        ajax: {
            url: `${gURL}/aposts`,
            data: function (d) {
                d.p = getCurrentPage();
            },
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + gToken
            },
            dataSrc: (data) => {
                if (gPage <= 0) {
                    gPage = 0;
                    $("#priv-page").addClass("disabled");
                    $("#next-page").removeClass("disabled");
                }
                if (data.length > 0 && gPage > 0) {
                    $("#next-page").removeClass("disabled");
                    $("#priv-page").removeClass("disabled");
                }
                if (data.length < 10) {
                    $("#priv-page").removeClass("disabled");
                    $("#next-page").addClass("disabled");

                }
                return data;
            },
            error: (error) => {
                console.log(error);
                if (error.status === 403) {
                    alert("Bạn không có quyền xem trang này");
                }
            }
        }
    })

    provinceLoad();


    //On modal change province
    $(document).on("change", "#selectModalTinhThanh", (e) => {
        const provinceCode = e.target.value;
        getDistricts(provinceCode);
    })


    //on Click btn edit
    $(document).on("click", ".btn-table-edit", (e) => {
        let thisId = $(e.target).closest("tr").find("td:eq(0)").text();
        getDistrict(thisId, getDistrictByProvinceCode);
        $("#modalPost").modal("show");
    })


    //On click btn delete
    $(document).on("click", ".btn-table-delete", (e) => {
        let thisId = $(e.target).closest("tr").find("td:eq(0)").text();
        console.log("deleting... ", thisId);
        deletePost(thisId);
    })

    //On click btn save modal

    $(document).on("click", ".btn-modal-save", (e) => {
        let data = getModalData();
        updateData(data);
        $("#modalPost").modal("hide");
    })

    //on Click btn pagination 1
    $(document).on("click", ".btn-page-1", (e) => {
        gPage = 0;
        gPOST_TABLE.ajax.reload();
    })

    //on click next pagination
    $(document).on("click", ".btn-next", (e) => {
        setPage(getCurrentPage() + 1);
        gPOST_TABLE.ajax.reload();
    })

    //on click next pagination
    $(document).on("click", ".btn-prev", (e) => {
        setPage(getCurrentPage() - 1);
        gPOST_TABLE.ajax.reload();
    })

    /* ######################################################## */

    function getCurrentPage() {
        return gPage;
    }

    function setPage(page) {
        gPage = page;
    }
    //Get Districts first
    function getDistrict(id, getAll) {
        $.ajax({
            url: `${gURL}/post/${id}`,
            method: "GET",
            headers: {
                "Authorization": "Token " + gToken,
                "Content-Type": "application/json"
            },
            dataType: "json",
            success: async (response) => {
                gPostData = await response;
                getAll(gPostData.tinhThanh.provinceCode);
            },
            error: (error) => {
                console.log(error);
            }
        })
    }
    //Tải danh sách 63 tỉnh thành vào option
    function provinceLoad() {
        $.ajax({
            url: gURL + "/province?s=63",
            method: "GET",
            dataType: "json",
            success: async (response) => {
                let data = await response;
                for (const province of data) {
                    $("<option>")
                        .val(province.provinceCode)
                        .html(province.provinceName)
                        .appendTo($("#selectModalTinhThanh"));
                }
            },
            error: (error) => {
                console.log(error);
            }
        })
    }

    //Lấy danh sách quận huyện khi đã có mã tỉnh thành
    function getDistrictByProvinceCode(province) {
        $.ajax({
            url: `${gURL}/province/${province}/d`,
            method: "GET",
            dataType: "json",
            success: async (response) => {
                $("#selectModalQuanHuyen").html("");
                for (const district of await response) {
                    $("<option>")
                        .val(district.id)
                        .html(`${district.prefix} ${district.name}`)
                        .appendTo($("#selectModalQuanHuyen"));
                }

                //Sau khi kết thúc vòng lặp thì  gọi hàm set dữ liệu vào modal
                setModalData(gPostData);

            }
        })
    }

    //Danh sanh quan huyen
    function getDistricts(provinceCode) {
        $.ajax({
            url: `${gURL}/province/${provinceCode}/d`,
            method: "GET",
            dataType: "json",
            success: async (response) => {
                $("#selectModalQuanHuyen").html("");
                for (const district of await response) {
                    $("<option>")
                        .val(district.id)
                        .html(`${district.prefix} ${district.name}`)
                        .appendTo($("#selectModalQuanHuyen"));
                }
            }
        })
    }

    //Xử lý modal cho sự kiện bấm nút chi tiết

    //Load data to Modal input and select;
    function setModalData(data) {
        $("#inpModalId").val(data.id);
        $("#inpModalLoaiNhaDat").val(data.loaiNhaDat);
        $("#selectModalHinhThuc").val(data.hinhThuc);
        $("#selectModalTinhThanh").val(data.tinhThanh.provinceCode);
        $("#selectModalQuanHuyen").val(data.quanHuyen.id);
        $("#inpModalDiaChi").val(data.soNha);
        $("#inpModalSoPhong").val(data.soPhong);
        $("#inpModalSoTang").val(data.soTang);
        $("#inpModalNgayTao").val(`${data.ngayTao ? new Date(data.ngayTao).toLocaleString() : "N/A"}`);
        $("#inpModalDienTich").val(data.dienTich);
        $("#inpModalDuAn").val(data.duAn);
        $("#selectModalDaBan").val(`${data.daBan ? 1 : 0}`);
        $("#selectModalStatus").val(data.status);
        $("#inpModalImage").val(data.linkAnh);
        $("#inpModalGiaTien").val(data.giaTien);
        $("#inpModalGhiChu").val(data.ghiChu);
        $("#inpModalNguoiDang").val(data.user.username);
        $("#inpModalNgayCapNhat").val(`${data.ngayCapNhat ? new Date(data.ngayCapNhat).toLocaleString() : "N/A"}`);

    }

    //Delete post handler
    function deletePost(postId) {
        if (confirm("Xác nhận xóa bài đăng với ID: " + postId + " ?")) {
            $.ajax({
                type: 'DELETE',
                url: `${gURL}/post/${postId}`,
                headers: {
                    "Authorization": "Token " + gToken,
                    "Content-Type": "application/json"
                },
                success: () => {
                    $("#toastDeletedText").html(`Bài đăng với ID: ${postId} đã được xóa thành công và không thể hoàn tác!`)
                    $("#deletedToast").toast("show");
                    gPOST_TABLE.ajax.reload();
                },
                error: (error) => { console.log(error); }
            })
        }
    }

    //Get data from modal
    function getModalData() {

        let postToUpdate =
        {
            id: $("#inpModalId").val(),
            loaiNhaDat: $("#inpModalLoaiNhaDat").val(),
            hinhThuc: $("#selectModalHinhThuc").val(),
            tinhThanh: $("#selectModalTinhThanh").val(),
            quanHuyen: $("#selectModalQuanHuyen").val(),
            soNha: $("#inpModalDiaChi").val(),
            soPhong: $("#inpModalSoPhong").val(),
            soTang: $("#inpModalSoTang").val(),
            dienTich: $("#inpModalDienTich").val(),
            duAn: $("#inpModalDuAn").val(),
            daBan: $("#selectModalDaBan option:selected").text(),
            status: $("#selectModalStatus").val(),
            linkAnh: $("#inpModalImage").val(),
            giaTien: $("#inpModalGiaTien").val(),
            ghiChu: $("#inpModalGhiChu").val(),
            user: $("#inpModalNguoiDang").val()
        }
        return postToUpdate;
    }

    //Update data
    function updateData(postData) {
        const postId = postData.id;
        for (const keyValue of Object.keys(postData)) {
            if (postData[keyValue] == null) {
                alert(keyValue + " - trống!")
                throw new Error(`${keyValue} empty`);
            }
        }

        $.ajax({
            url: `${gURL}/post/${postId}`,
            method: "PUT",
            headers: {
                "Authorization": "Token " + gToken,
                "Content-Type": "application/json"
            },
            dataType: "json",
            data: JSON.stringify(postData),
            success: async (response) => {
                console.log(response);
                gPOST_TABLE.ajax.reload();
            },
            error: (error) => {
                console.log(error);
            }
        })
    }

    //Get token 
    function getTokenFromLocal() {
        return window.localStorage.getItem("Token");
    }
})
/*
{
    "id": 1,
    "loaiNhaDat": "Nhà đất",
    "hinhThuc": "rent",
    "tinhThanh": {
        "id": 1,
        "provinceCode": "SG",
        "provinceName": "Hồ Chí Minh"
    },
    "quanHuyen": {
        "id": 7,
        "prefix": "Huyện",
        "name": "Hóc Môn"
    },
    "soNha": " ",
    "dienTich": 1000,
    "soPhong": 5,
    "soTang": 1,
    "duAn": "None",
    "daBan": false,
    "status": "confirmed",
    "linkAnh": "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
    "giaTien": 2300000,
    "ghiChu": null,
    "user": {
        "id": 1,
        "username": "admin"
    },
    "ngayTao": "2022-12-02T17:47:17.000+00:00",
    "ngayCapNhat": "2022-12-22T22:47:55.000+00:00"
}
*/