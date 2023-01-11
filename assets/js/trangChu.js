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
      const carouselSlide = $(`<div class="swiper-slide">
                <div class="card bg-gradient text-white align-items-center">
                  <img src="${lstPost.linkAnh}" class="card-img" alt="..." style="max-height:500px;object-fit: cover;object-position: 50% 50%;">
                  <div class="card-img-overlay">
                    <h5 class="card-title text-center">${lstPost.soNha} ${lstPost.quanHuyen.name} ${lstPost.tinhThanh.provinceName}</h5>
                    <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                  </div>
                </div>
            </div>`);

      carouselSlide.appendTo("#carousel-lastest-post");
    }
  }
  // Carousel
  const swiper = new Swiper('#property-carousel', {
    effect: "default",
    lazy: true,
    zoom: true,
    transform: 3000,
    grabCursor: true,
    autoplay: {
      delay: 3000,
    },
    centeredSlides: true,
    slidesPerView: "auto",
    pagination: {
      el: '.propery-carousel-pagination',
      type: 'fraction',
    },
  });
})