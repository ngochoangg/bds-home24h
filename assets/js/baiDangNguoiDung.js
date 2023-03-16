console.log("Danh sách bài đăng của người dùng");

//contact.html
const API_URI = "https://hom24h.up.railway.app/api";
const token = getTokenFromLocal();

if (getUserNameFromLocal() !== null) {
  $("#span-username")
    .attr("class", "text-success")
    .html(getUserNameFromLocal());
  getUserPosts();

  provinceLoad();
} else {
  console.log("User not found");
  confirm("Bạn chưa đăng nhập, đăng nhập ngay để xem?")
    ? window.location.assign("login.html")
    : window.location.assign("property-grid.html");
}

function getUserPosts() {
  $.ajax({
    type: "GET",
    url: `${API_URI}/${getUserNameFromLocal()}/posts`,
    headers: {
      Authorization: `Token ${token}`,
    },
    dataType: "json",
    success: function (response) {
      loadUserPosts(response);
    },
    error: (e) => {
      console.log(e);
    },
  });
}

//On btn edit click
$(document).on('click','.btn-edit-post',()=>{
  console.log("Clicked btn edit");
})

//Khi tỉnh thành trên modal bị thay đổi
$(document).on("change", "#selectModalTinhThanh", (e) => {
  const provinceCode = e.target.value;
  getDistricts(provinceCode);
});

// #################################
function loadUserPosts(posts) {
  console.log(posts);
}

function getTokenFromLocal() {
  return window.localStorage.getItem("Token");
}
function getUserNameFromLocal() {
  return window.localStorage.getItem("username");
}

//Tải danh sách 63 tỉnh thành vào option
function provinceLoad() {
  $.ajax({
    url: `${API_URI}/province?s=63`,
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
    },
  });
}

//Tải danh sách quận huyện khi có mã tỉnh thành
function getDistricts(provinceCode) {
  $.ajax({
    url: `${API_URI}/province/${provinceCode}/d`,
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
    },
  });
}
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