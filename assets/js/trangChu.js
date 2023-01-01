// index.html
jQuery(($) => {
    window.localStorage.setItem("current", "index.html");
    console.log("Trang index");

    const gURL = "http://question-env.eba-es2s4tgm.ap-southeast-1.elasticbeanstalk.com";

    $.ajax({
        type: "GET",
        url: gURL + "/post/lts?post=6",
        dataType: "json",
        success: function (response) {
            loadDataToCarousel(response);
        },
        error: function (err) {
            console.log(err);
        }
    });


    function loadDataToCarousel(postOfSix) {
        for (const lstPost of postOfSix) {
            const carouselSlide = $("<div class='carousel-item-b swiper-slide'>")
                .appendTo("#carousel-lastest-post");

            const cardbox = $("<div/>", {
                class: 'card-box-a card-shadow'
            }).appendTo(carouselSlide);

            $("<div/>", {
                class: 'img-box-a',
                html: `<img src="${lstPost.linkAnh}" alt="" class="img-a img-fluid">`
            }).appendTo(cardbox);

            const cardOverlay = $("<div class='card-overlay'>").appendTo(carouselSlide);

            const cardOverlayContent = $("<div>", {
                class: 'card-overlay-a-content'
            }).appendTo(cardOverlay);

            //Header
            $("<div>", {
                class: "card-header-a",
                html: `<h2 class="card-title-a">${lstPost.quanHuyen.name}
                          <br /> ${lstPost.tinhThanh.provinceName}
                      </h2>`
            }).appendTo(cardOverlayContent);

            //Body
            const contentBody = $("<div>", {
                class: "card-body-a"
            }).appendTo(cardOverlayContent);
            //price
            $("<div class='price-box d-flex'>")
                .html(`<span class="price-a">rent | ${lstPost.giaTien} vnd</span>`)
                .appendTo(contentBody);

            //details
            $("<div>", {
                html: `<a href='#' class='link-a'>Bấm xem chi tiết<span class= "bi bi-chevron-right" ></span><a>`
            }).appendTo(contentBody);

            //Footer
            $("<div>", {
                class: "card-footer-a",
                html: `<ul class="card-info d-flex justify-content-around">
                        <li>
                          <h4 class="card-info-title">Diện tích</h4>
                          <span>${lstPost.dienTich} m
                            <sup>2</sup>
                          </span>
                        </li>
                        <li>
                          <h4 class="card-info-title">Số phòng</h4>
                          <span>${lstPost.soPhong}</span>
                        </li>
                        <li>
                          <h4 class="card-info-title">Số tầng</h4>
                          <span>${lstPost.soTang}</span>
                        </li>
                      </ul>`
            }).appendTo(cardOverlay);

        }
    }

})