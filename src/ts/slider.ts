type SliderData = {
    currentSlide: number;
    buttonPrev: HTMLButtonElement;
    buttonNext: HTMLButtonElement;
    scroller: HTMLElement;
    slidesCount: number;
    update: () => void;
    prev: () => void;
    next: () => void;
    init: () => void;
};

function Slider(sliderBlock: Element) {
    const data: SliderData = {
        currentSlide: 0,
        buttonPrev: sliderBlock.querySelector('.controls__button--left'),
        buttonNext: sliderBlock.querySelector('.controls__button--right'),
        scroller: sliderBlock.querySelector('.slider-scroller'),
        slidesCount: sliderBlock.querySelectorAll('.slider-item').length,
        update: function () {
            this.scroller.style.transform = `translateX(-${
                25 * this.currentSlide
            }%)`;
            this.buttonPrev.disabled = !this.currentSlide;
            this.buttonNext.disabled =
                this.currentSlide + 4 === this.slidesCount;
        },
        prev: function () {
            this.currentSlide--;
            this.update();
        },
        next: function () {
            this.currentSlide++;
            this.update();
        },
        init: function () {
            this.prev = this.prev.bind(this)
            this.next = this.next.bind(this)

            this.buttonPrev.addEventListener('click', this.prev);
            this.buttonNext.addEventListener('click', this.next);
            this.update();
        },
    };

    data.init();
}

document.querySelectorAll('.news').forEach((slider) => Slider(slider));
