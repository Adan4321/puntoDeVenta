const inputLogin = document.querySelectorAll('.input');
for (let input of inputLogin) {
    input.addEventListener('input', () => {
        input.style.borderBottom = "#4e8 2px solid";
        input.style.color='#fff'
    })
}
