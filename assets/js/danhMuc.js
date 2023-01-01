// property-grid.html
jQuery(($) => {
  window.localStorage.setItem("current", "property-grid.html");
  console.log("Khu vực danh sách nhà đang bán");

  const gURL = "http://question-env.eba-es2s4tgm.ap-southeast-1.elasticbeanstalk.com";
  $.ajax({
    type: "GET",
    url: gURL + `/post/lts?p=${0}&s=${9}`,
    dataType: "json",
    success: function (response) {
      loadDataToCard(response);
    }
  });

  function loadDataToCard(paramData) {
    for (const post of paramData) {
      let colPost = $("<div class='col-md-4'>");
      colPost.appendTo($("#row-main-div"));

      let card = $("<div class='card-box-a card-shadow'>").appendTo(colPost);
      let imgBox = $("<div class='img-box-a'>").appendTo(card);
      $(imgBox).html(`<img src='${post.linkAnh}' class='img-a img-fluid'>`);

      let cardOverlay = $("<div class='card-overlay'>").appendTo(card);

      let overLayContent = $("<div class='card-overlay-a-content'>").appendTo(cardOverlay);

      let contentHeader = $("<div class='card-header-a'>").appendTo(overLayContent);

      $(contentHeader).html(`<h2 class='card-title-a'>${post.soNha ? post.soNha : ""} ${post.quanHuyen.name} ${post.tinhThanh.provinceName}`);

      let cardBody = $("<div class='card-body'>").appendTo(overLayContent);

      let priceBox = $("<div class='price-box d-flex ps-3 m-1'>").appendTo(cardBody);
      $(priceBox).html(`<span class='price-a p-3'>${post.hinhThuc} | ${post.giaTien} VND</span>`);
      $("<div>", {
        class: "row ps-3 m-1",
        html: `<a href='#' class='link-a'>Chi tiết <span class="bi bi-chevron-right"></span></a>`
      }).appendTo(cardBody);

      let overlayFooter = $("<div class='card-footer-a'>").appendTo(overLayContent);
      overlayFooter.html(`<ul class="card-info d-flex justify-content-around">
                      <li>
                        <h4 class="card-info-title">Diện tích</h4>
                        <span>${post.dienTich}m
                          <sup>2</sup>
                        </span>
                      </li>
                      <li>
                        <h4 class="card-info-title">Số phòng</h4>
                        <span>${post.soPhong}</span>
                      </li>
                      <li>
                        <h4 class="card-info-title">Số tầng</h4>
                        <span>${post.soTang}</span>
                      </li>
                    </ul>`);


    }
  }
})
