export const sectionSettings = (numSlides) => {
  return{
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: numSlides<4?numSlides:4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: numSlides<3?numSlides:3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: numSlides<2?numSlides:2,
          slidesToScroll: 1,
        }
      }
    ]
  }
}
    

export const headerSettings = {
  dots: true,
  infinite: true,
  speed: 2000,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000
};