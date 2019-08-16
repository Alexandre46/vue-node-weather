const inputLocation = document.getElementById('locationInput');
const btnTrigger = document.getElementById('btnTrigger');
const btnTextShow = 'Show custom location';
const btnTextHide = 'Hide custom location';

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
