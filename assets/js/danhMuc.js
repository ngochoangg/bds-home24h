// property-grid.html
jQuery(($) => {
  window.localStorage.setItem("current", "property-grid.html");
  console.log("Khu vực danh sách nhà đang bán");

  let gPage = 0;

  const gURL = "https://hom24h.up.railway.app/api";

  getData();


  $(document).on("click", ".link-load-more", (e) => {
    setPage(getPage() + 1);
    getData();
  })

  $(document).on("click", ".btn-link-phone", (e) => {
    let phoneNo = e.target.innerText;
    window.location.href = "tel:" + phoneNo;
  })

  //Set page
  function setPage(page) {
    gPage = page;
  }

  //Get page
  function getPage() {
    return gPage;
  }

  //Get Data
  function getData() {
    $.ajax({
      type: "GET",
      url: gURL + `/post?p=${getPage()}&s=9`,
      dataType: "json",
      success: function (response) {
        loadDataToCard(response);
        if (response.length === 0 || response.length < 9) {
          $(".div-end-list").removeClass("d-none");
          $(".link-load-more").addClass("d-none");
        } else {
          $(".div-end-list").addClass("d-none");
          $(".link-load-more").removeClass("d-none");
        }
      }
    });
  }
  function loadDataToCard(paramData) {
    for (const post of paramData) {

      let cardPost = $(`<div class="card m-4 col-sm-12">
            <div class="row g-0">
              <div class="card-header">
                  <h5 class="card-title text-center">${post.soNha ? post.soNha + " " : ""} ${post.quanHuyen.name}, ${post.tinhThanh.provinceName}</h5>
              </div>
              <div class="col-sm-4 text-center">
                <img src="${post.linkAnh}" class="img-fluid rounded-start" style="max-height:300px" alt="...">
              </div>
              <div class="col-sm-8">
                <div class="card-body">
                  <p class="card-text">Loại: ${post.loaiNhaDat}</p>
                  <p class="card-text">Hình thức: ${post.hinhThuc}</p>
                  <p class="card-text">Giá tiền: ${post.giaTien}</p>
                  <p class="card-text">Số điện thoại: <button class="btn btn-link btn-link-phone">${post.user.soDienThoai} </button><span class="badge bg-danger"><i class="bi bi-arrow-left"></i> Gọi ngay</span></p>
                  <p class="card-text">Dự án: ${post.duAn}</p>
                  <p class="card-text">Thông tin thêm: ${post.ghiChu}</p>
                </div>
              </div>
              <div class="card-footer">
                <p class="card-text text-center"><small class="text-muted">Đăng bởi: ${post.user.username} | vào lúc:  ${post.ngayTao ? new Date(post.ngayTao).toLocaleString() : "N/A"}</small></p>
              </div>
            </div>
          </div>`);
      cardPost.appendTo("#row-main-div");

    }
  }
})
