function basketAdd() {
    alert('Товар добавлена в корзину');
}

function domReady() {
    const basketAddButtons = document.querySelectorAll('.js-basket_add');
    basketAddButtons.forEach((button) =>
        button.addEventListener('click', basketAdd)
    );
}

document.addEventListener('DOMContentLoaded', domReady);
