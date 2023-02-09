// index.html
jQuery(($) => {
  window.localStorage.setItem("current", "index.html");
  console.log("Trang index");

  const gURL = "https://hom24h.up.railway.app/api";

  //Init page, load lastest post
  init();

  //Get lastest post
  function init() {
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
  }


  function loadDataToCarousel(postOfSix) {
    for (const lstPost of postOfSix) {
      const carouselSlide = $(`<div class="swiper-slide">
                <div class="card bg-gradient text-white align-items-center">
                  <img src="${lstPost.linkAnh}" class="card-img" alt="..." style="height:600px;object-fit: cover;">
                  <div class="card-img-overlay d-flex align-items-end">
                    <div style="background-color: #000000ad;" class="col-sm-4 p-3">
                      <h5 class="h2 text-white">${lstPost.soNha} ${lstPost.quanHuyen.name} ${lstPost.tinhThanh.provinceName}</h5>
                      <p class="card-text">Giá tiền: ${lstPost.giaTien}</p>
                      <p class="card-text">Liên hệ: <a class="text-white" href="tel:${lstPost.user.soDienThoai}">${lstPost.user.soDienThoai}</a></p>
                      <p class="card-text">Hình thức: ${lstPost.hinhThuc}</p>
                      <p class="card-text">Phân loại: ${lstPost.loaiNhaDat}</p>
                      <p class="card-text text-break">Thông tin thêm: ${lstPost.ghiChu}</p>
                    </div>
                  </div>
                </div>
            </div>`);

      carouselSlide.appendTo("#carousel-lastest-post");
    }
  }
  // Carousel
  const swiper = new Swiper('#property-carousel', {
    effect: "fade",
    lazy: {
      loadPrevNext: true, // pre-loads the next image to avoid showing a loading placeholder if possible
      loadPrevNextAmount: 2, //or, if you wish, preload the next 2 images
      // loadOnTransitionStart: true,
    },
    speed: 1500,
    autoplay: {
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
      delay: 5000,
    },
    slidesPerView: "auto",
    pagination: {
      el: '.propery-carousel-pagination',
      type: 'bullets',
      clickable: true,
    },
  });
})