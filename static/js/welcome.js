var slideIndex = 1;
showSlides(slideIndex);

function slideTimer() {
  plusSlides(1);
}

var timer = setInterval(slideTimer, 5000);

function plusSlides(n) {
  clearInterval(timer);
  timer = setInterval(slideTimer, 5000);

  showSlides(slideIndex += n);
}

function currentSlide(n){
  clearInterval(timer);
  timer = setInterval(slideTimer, 5000);

  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName('slide');
  var dots = document.getElementsByClassName('dot');
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(' active', '');
  }
  slides[slideIndex-1].style.display = 'block';  
  dots[slideIndex-1].className += ' active';
}

// document.getElementById('imagePrev').addEventListener('click', plusImageSlides.bind(null,-1));
// document.getElementById('imageNext').addEventListener('click', plusImageSlides.bind(null,1));

document.getElementById('firstDot').addEventListener('click', currentSlide.bind(null,1));
document.getElementById('secondDot').addEventListener('click', currentSlide.bind(null,2));
document.getElementById('thirdDot').addEventListener('click', currentSlide.bind(null,3));
document.getElementById('forthDot').addEventListener('click', currentSlide.bind(null,4));
