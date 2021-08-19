const leftButton = document.querySelector('.slider__button--left');
const rightButton = document.querySelector('.slider__button--right');

const sliderScroller = <HTMLElement>document.querySelector('.slider-scroller');
let currentSlide: number = 0;

console.log(sliderScroller);

rightButton.addEventListener('click', slideRight);

leftButton.addEventListener('click', slideLeft);

function slideRight() {
    currentSlide++;

    switch (currentSlide) {
        case 1:
            leftButton.removeAttribute('disabled');
            break;

        case 3:
            rightButton.setAttribute('disabled', 'disabled');
            break;
    }

    sliderScroller.style.transform = `translateX(-${25 * currentSlide}%)`;
    console.log(currentSlide);
}

function slideLeft() {
    currentSlide--;

    switch (currentSlide) {
        case 0:
            leftButton.setAttribute('disabled', 'disabled');
            break;
        case 2:
            rightButton.removeAttribute('disabled');
            break;
    }

    sliderScroller.style.transform = `translateX(-${25 * currentSlide}%)`;
    console.log(currentSlide);
}
