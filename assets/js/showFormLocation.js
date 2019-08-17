const inputLocation = document.getElementById('locationInput');
const btnTrigger = document.getElementById('btnTrigger');

const languageElement = document.getElementById('language');
const languageSelected = languageElement.options[languageElement.selectedIndex].value;
const btnTextShow = languageSelected === 'pt' ? 'Pesquisa manual' : 'Manual search';
const btnTextHide = languageSelected === 'pt' ? 'Esconder pesquisa manual' : 'Hide manual search';

if (btnTrigger) {
    btnTrigger.addEventListener('click', () => {
        if (inputLocation) {
            inputLocation.classList.toggle('d-none');
        }
        if (inputLocation.classList.contains('d-none')) {
            btnTrigger.innerText = btnTextShow;
            btnTrigger.classList.toggle('btn-danger');
        } else {
            btnTrigger.innerText = btnTextHide;
            btnTrigger.classList.toggle('btn-danger');
        }
    });
}
