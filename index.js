const language = document.getElementById('language').value;
const units = language === 'pt' ? "metric" : 'imperial';
let apiKey = '88d2151398a5960afd2b42a1bb914c39';
let city = 'Funchal';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}&lang=${language}`;

