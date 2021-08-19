const leftButton = <HTMLButtonElement>(
    document.querySelector('.slider__button--left')
);
const rightButton = <HTMLButtonElement>(
    document.querySelector('.slider__button--right')
);

const sliderScroller = <HTMLElement>document.querySelector('.slider-scroller');
const slidesCount = document.querySelectorAll('.slider-item').length;
let currentSlide: number = 0;

rightButton.addEventListener('click', slideRight);
leftButton.addEventListener('click', slideLeft);

function slideShow() {
    sliderScroller.style.transform = `translateX(-${25 * currentSlide}%)`;
    leftButton.disabled = !currentSlide;
    rightButton.disabled = currentSlide + 4 === slidesCount;
}

function slideRight() {
    currentSlide++;
    slideShow();
}

function slideLeft() {
    currentSlide--;
    slideShow();
}

slideShow();
