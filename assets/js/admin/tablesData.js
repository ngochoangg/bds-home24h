//tables-data - Quan ly nguoi dung

jQuery(($) => {
  const gToken = window.localStorage.getItem("Token");

  const gURL = "http://42.119.89.135:8080/api"; //"https://hom24h.up.railway.app/api";

  const gHEADER_TABLE = [
    "id",
    "username",
    "password",
    "email",
    "soDienThoai",
    "diaChi",
    "hoTen",
    "action",
  ];

  const gUSERS_TABLE = $("#table-users")
    .DataTable({
      columns: [
        { data: gHEADER_TABLE[0] },
        { data: gHEADER_TABLE[1] },
        {
          data: gHEADER_TABLE[2],
          render: (data) =>
            `<span class='text-break text-decoration-line-through'>${data}</span>`,
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
                </div>`,
        },
      ],
      paging: false,
      searching: false,
    })
    .clear();

  initTable();

  //On click button edit user
  $(document).on("click", ".btn-user-edit", (e) => {
    let userID = $(e.target).closest("tr").find("td:eq(0)").text();
    getUserByID(userID);
    // console.log("Data got: ", data);
    $("#modalUser").modal("show");
  });

  //On click button delete user
  $(document).on("click", ".btn-user-delete", (e) => {
    let username = $(e.target).closest("tr").find("td:eq(1)").text();
    // console.log(username);
    confirm("Xác nhận xóa người dùng này và không thể hoàn tác?")
      ? deleteUserByUsername(username)
      : console.log("Đã hủy hành động!");
  });

  //Delete user by username
  function deleteUserByUsername(username) {
    if (isAdmin(username) === true) {
      throw "Hành động tự hủy đã kịp ngăn chặn";
    }
    let response = {
      method: "DELETE",
      async: false,
      url: `${gURL}/user/${username}`,
      headers: {
        Authorization: `Token ${gToken}`,
      },
    };
    $.ajax(response).done((e) => console.log(e));
  }

  //Check admin or not
  function isAdmin(username) {
    let res = true;
    if (username === "admin") {
      let confirmMsg = window.prompt(
        "Hãy nhập vào 'DELETE' để xác nhận hành động tự hủy này!"
      );
      confirmMsg.match("DELETE") ? (res = username) : (res = true);
    }
    return res;
  }

  //Load user data to modal
  function loadUserInfoToModal(userDetails) {
    $("#modalUserId").val(userDetails.id);
    $("#modalUserFullName").val(userDetails.hoTen);
    $("#modalPhoneNo").val(userDetails.soDienThoai);
    $("#modalEmail").val(userDetails.email);
    $("#modalAddress").val(userDetails.diaChi);
    $("#modalPassword").val(userDetails.password);
    $("#modalUsername").val(userDetails.username);
  }

  //Get user data from modal
  function getUserDetailsFromModal(objectToGet) {
    objectToGet.id = $("#modalUserId").val();
    objectToGet.hoTen = $("#modalUserFullName").val();
    objectToGet.soDienThoai = $("#modalPhoneNo").val();
    objectToGet.email = $("#modalEmail").val();
    objectToGet.diaChi = $("#modalAddress").val();
    objectToGet.password = $("#modalPassword").val();
    objectToGet.username = $("#modalUsername").val();
  }

  //Get user details by user ID
  function getUserByID(userID) {
    let response = {
      method: "GET",
      async: false,
      url: `${gURL}/user/${userID}`,
      headers: {
        Authorization: `Token ${gToken}`,
        "Content-Type": "application/json",
      },
    };

    return $.ajax(response).done((data) => {
      loadUserInfoToModal(data);
      // console.log(data);
    });
  }

  //Init table
  function initTable() {
    $.ajax({
      method: "GET",
      url: `${gURL}/user`,
      headers: {
        Authorization: `Token ${gToken}`,
        "Content-Type": "application/json",
      },
      // processData: false,
      // dataType: "json",
      success: async (response) => {
        loadDataToTable(await response);
      },
      error: (error) => {
        errorHandler(error);
      },
    });
  }

  function loadDataToTable(data) {
    gUSERS_TABLE.clear();
    gUSERS_TABLE.rows.add(data).draw();
  }

  function errorHandler(error) {
    let status = error.status;
    let data = [
      {
        id: "Error",
        username: "Cannot Access",
        password: "Cannot Access",
        email: "Cannot Access",
        soDienThoai: "Error code: " + status,
        diaChi: "Cannot Access",
        hoTen: "Cannot Access",
      },
    ];
    loadDataToTable(data);
  }
});
