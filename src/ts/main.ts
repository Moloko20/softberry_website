import { sum } from './button';
console.log(sum(3, 7));

const buttons = document.querySelectorAll('.button');
for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    button.addEventListener('click', () => {
        alert('Карточка добавлена в корзину');
    });
}
