//tables-data - Quan ly nguoi dung

jQuery(($) => {
    const gToken = window.localStorage.getItem("Token");

    const gURL = "https://hom24h.up.railway.app/api";

    const gHEADER_TABLE = ['id', 'username', 'password', 'email', 'soDienThoai', 'diaChi', 'hoTen', 'action'];

    const gUSERS_TABLE = $('#table-users').DataTable({
        columns: [
            { data: gHEADER_TABLE[0] },
            { data: gHEADER_TABLE[1] },
            {
                data: gHEADER_TABLE[2],
                render: (data) => `<span class='text-break text-decoration-line-through'>${data}</span>`
            },
            { data: gHEADER_TABLE[3] },
            { data: gHEADER_TABLE[4] },
            { data: gHEADER_TABLE[5] },
            { data: gHEADER_TABLE[6] },
            {
                data: gHEADER_TABLE[7],
                defaultContent: `<div class='btn-group'>
                    <button class='btn btn-info btn-user-edit'>Edit</button>
                    <button class='btn btn-danger btn-user-delete'>Delete</button>
                </div>`
            }
        ],
        paging: false,
        searching: false
    }).clear();

    initTable();

    function initTable() {

        $.ajax({
            method: "GET",
            url: `${gURL}/user`,
            headers: {
                "Authorization": `Token ${gToken}`,
                "Content-Type": "application/json"
            },
            // processData: false,
            // dataType: "json",
            success: async (response) => {
                loadDataToTable(await response);
            },
            error: (error) => {
                errorHandler(error);
            }
        });
    }

    function loadDataToTable(data) {
        gUSERS_TABLE.clear();
        gUSERS_TABLE.rows.add(data).draw();
    }

    function errorHandler(error) {
        let status = error.status;
        let data = [{
            id: "Error",
            username: "Cannot Access",
            password: "Cannot Access",
            email: "Cannot Access",
            soDienThoai: 'Error code: ' + status,
            diaChi: "Cannot Access",
            hoTen: "Cannot Access"
        }]
        loadDataToTable(data);
    }

})