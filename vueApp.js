const API = "https://api.darksky.net/forecast/ecb011fa534de8867e6376f625f30a42";
const KEY = "ecb011fa534de8867e6376f625f30a42";
const hours = 8;
const photoApiKey = "251dde3fd50b67a0fb365c394983cb4a83db666d0c3b8faddadcac37b514a3aa";


const languages = {
    en: {
      "submit" : "Submit",
      "auto-detect" : "Auto detect",
      "detect-info" : "Attention: 93% browser geolocation detection compatible, so be patience if you're using doesn't work",
      "loading" : "Loading",
      "today": "Today",
      "information": "Information",
      "additional-info": "Additional info",
      "24-hour-forecast": "24hour forecast for",
      "8-day-forecast" : "Week forecast for",
      "datetime": "Date:",
      "min-temp": "Min. Temperature:",
      "max-temp": "Max. Temperature:",
      "humidity": "Humidity",
      "description": "Description",
      "population" : "People",
      "last-update" : "Last update 1 minute ago",
      "week-summary" : "Week forecast",
      "day-summary" : "Day forecast",
      "temperature-now" : "Now",
      "pressure": "Pressure",
      "wind": "Wind",
      "manual-search" : "Manual search",
        "developed-by" : "Developed by:",

    },
    pt: {
      "submit" : "Submeter",
      "auto-detect" : "Detectar automaticamente",
      "detect-info" : "Atenção: 93% da geolocalização dos browsers faz a deteção, pedimos a sua compreensão caso não seja possível realizar no que está a usar.",
      "loading" : "Carregando",
      "today" : "Hoje",
      "information" :  "Informação",
      "additional-info" : "Informação adicional",
      "24-hour-forecast" : "Previsão meteorológica 24 horas para",
      "8-day-forecast" : "Previsão semanal para",
      "datetime" : "Data:",
      "min-temp" : "Temperatura mínima:",
      "max-temp" : "Temperatura máxima:",
      "humidity" : "Humidade:",
      "description" : "Descrição:",
      "population" : "Pessoas",
      "last-update" : "Ultima actualização há 1 min atrás",
      "week-summary" : "Previsão semanal",
      "day-summary" : "Previsão para hoje",
      "temperature-now" : "Agora:",
      "pressure": "Pressão",
      "wind": "Vento",
      "manual-search" : "Pesquisa manual",
        "developed-by" : "Desenvolvido por:",
    },
};

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: locale(),
  fallbackLocale: 'en',
  messages: languages
});


var app = new Vue({
    el: "#app",
    i18n: i18n,
    data: {
      chart: null,
      month: '',
      city: "City,Country code",
      country: "",
      dates: [],
      temperature: "",
      maxTemperature : "",
      minTemperature: "",
      pressure: '',
      humidity: '',
      wind: '',
      overcast: '',
      temps: [],
      loading: false,
      errored: false,
      description:'',
      language: 'pt',
      forecasts: [],
      nowDatetime: '',
      weekSummary: '',
      daySummary: '',
      nowTemperature:'',
      dailyDateTime: '',
      dailySummary:'',
      dailyHumidity:'',
      dailyIcon:'',
      dailyTempMin: '',
      dailyTempMax: '',
      uvIndex: '',
      tempFeelsLike:'',
      rainProb: '',
    },
    currentLocale: 'pt',
    locales: [ {id: 'en', name: 'English'}, {id: 'pt', name: 'Portugues'}],
    watch: {
        // whenever question changes, this function will run
        city: function (newQuestion, oldQuestion) {
            this.debouncedGetAnswer()
        }
    },
    created: function () {
        // _.debounce is a function provided by lodash to limit how
        // often a particularly expensive operation can be run.
        // In this case, we want to limit how often we access
        // yesno.wtf/api, waiting until the user has completely
        // finished typing before making the ajax request. To learn
        // more about the _.debounce function (and its cousin
        // _.throttle), visit: https://lodash.com/docs#debounce
        this.getCity();
      this.debouncedGetAnswer = _.debounce(this.getData, 3000)
    },
    methods: {
      onChange: function(){
        i18n.locale = locale();
        this.getData()
      },
      getLanguage() {
        locale()
      },

      month() {
        let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        now = new Date();
        return monthNames[now.getMonth()];
      },

        getCity(){
          // Geolocation API
           axios.get('https://ipapi.co/json/',{
        }).then( response =>{
             console.log(response.data);
               this.city = response.data.city;
               this.latitude = response.data.latitude;
               this.longitude = response.data.longitude;
               this.country = response.data.country_name;
             return [this.latitude, this.longitude, this.country];
         })
        },

      getData: function() {
        this.loading = true;

        if (this.chart != null) {
          this.chart.destroy();
        }
          //city without country if exists comma
          //separated city by country
          if(this.city.indexOf(',') > -1){
              var onlyCity = this.city.split(',');
              this.city = onlyCity[0];
              //country
              this.country = onlyCity[1];
          }

        // dark sky api
        axios({
          method: 'GET',
          url: 'https://cors-anywhere.herokuapp.com/'+API+'/'+this.latitude+','+this.longitude,
          params: {
            lang: locale(),
            cnt: hours,
            units: language === 'pt' ? "ca" : 'us',
            appid: KEY
          }
        })
          .then(response => {
            //weather info
              console.log('DarkSkyAPi Response->',response);

            this.nowDatetime = response.headers.date;
            this.weekSummary = response.data.daily.summary;
            this.daySummary = response.data.hourly.summary;
            this.nowTemperature = response.data.currently.temperature;
            this.maxTemperature  = response.data.daily.data[0].temperatureMax;
            this.minTemperature = response.data.daily.data[0].temperatureMin;
            this.humidity = Math.floor(response.data.currently.humidity * 100) + '%';
            this.pressure  = response.data.currently.pressure;
            this.wind = response.data.currently.windSpeed + 'm/s';

            //description
            this.description  = response.data.currently.summary;

            this.dates = response.data.hourly.data.map(list => {
              return list.time;
            });

            this.temps = response.data.hourly.data.map(list => {
              return list.temperature;
            });

            this.forecasts = response.data.daily.data.map(list => {
              list.dailyIcon = 'https://darksky.net/images/weather-icons/'+list.icon+'.png';
              list.dailySummary = list.summary;
              list.dailyHumidity = list.humidity;
              list.dailyDateTime = timeConverter(list.time);
              list.dailyTempMin = list.temperatureMin;
              list.dailyTempMax = list.temperatureMax;
              return list;
            });

            this.uvIndex = response.data.currently.uvIndex;
            this.tempFeelsLike = response.data.currently.apparentTemperature;
            this.rainProb = response.data.currently.precipProbability;
            const currentWeather = response.data.currently.icon;

          //Unsplash Photo API
          axios({
              method: 'GET',
              url: 'https://api.unsplash.com/photos/random/?query='+this.city+','+this.country+',city&client_id='+photoApiKey,
          })
          .then( response => {
              const imgUrl = response.data.urls.full;
              ChangeBgImage(imgUrl);
          })
          .catch(err => {
              console.log('Error happened during fetching!', err);
          });

          //icons
          var icons = new Skycons({"color": "white"});

          if(currentWeather === 'rain'){
            icons.set("icon1", Skycons.RAIN);
          }
          if(currentWeather === 'partly-cloudy-day'){
              icons.set("icon1", Skycons.PARTLY_CLOUDY_DAY);
          }
          if(currentWeather === 'partly-cloudy-night'){
            icons.set("icon1", Skycons.PARTLY_CLOUDY_NIGHT);
          }
          if(currentWeather === 'fog'){
            icons.set("icon1", Skycons.FOG);
          }
          if(currentWeather === 'snow'){
              icons.set("icon1", Skycons.SNOW);
          }
          if(currentWeather === 'wind'){
              icons.set("icon1", Skycons.WIND);
          }
          if(currentWeather === 'clear-day'){
              icons.set("icon1", Skycons.CLEAR_DAY);
          }
          if(currentWeather === 'clear-night'){
            icons.set("icon1", Skycons.CLEAR_NIGHT);
          }

          icons.play();


          var ctx = document.getElementById("myChart");
          this.chart = new Chart(ctx, {
            type: "line",
            data: {
              labels: this.dates,
              datasets: [
                {
                  label: "Avg. Temp",
                  backgroundColor: "rgba(54, 162, 235, 0.5)",
                  borderColor: "rgb(54, 162, 235)",
                  fill: false,
                  data: this.temps
                }
              ]
            },
            options: {
              title: {
                display: true,
                text: "Temperature graph"
              },
              tooltips: {
                callbacks: {
                  label: function(tooltipItem, data) {
                    var label =
                      data.datasets[tooltipItem.datasetIndex].label || "";

                    if (label) {
                      label += ": ";
                    }

                    label += Math.floor(tooltipItem.yLabel);
                    return label + "°C";
                  }
                }
              },
              scales: {
                xAxes: [
                  {
                    type: "time",
                    time: {
                      unit: "hour",
                      displayFormats: {
                        hour: "M/DD @ hA"
                      },
                      tooltipFormat: "MMM. DD @ hA"
                    },
                    scaleLabel: {
                      display: true,
                      labelString: "Date/Time"
                    }
                  }
                ],
                yAxes: [
                  {
                    scaleLabel: {
                      display: true,
                      labelString: "Temperature (°C)"
                    },
                    ticks: {
                      callback: function(value, index, values) {
                        return value + "°C";
                      }
                    }
                  }
                ]
              }
            }
          });
        })
        .catch(error => {
          this.error = true;
        })
        .finally(() => (this.loading = false));
      }
    }
  });


//Change div app background img pending on city/country
function ChangeBgImage(imgUrl) {
    const divElement = document.getElementById('city-info');
    if (divElement) {
        divElement.style.backgroundImage =  'linear-gradient(to bottom,rgba(255,255,255,0.3), rgba(255,255,255,0.2)), url('+imgUrl+')';
        divElement.style.backgroundPosition = 'center center';
        divElement.style.backgroundSize = 'cover';
        divElement.style.backgroundRepeat = 'no-repeat';
    }
}

function refreshPage(){
    window.location.reload();
}

function locale() {
  const languageElement = document.getElementById('language');
  return languageElement.value;
}


function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = (a.getHours() !== 0) ? a.getHours() : null;
    var min = (a.getMinutes() !== 0) ? a.getMinutes() : null;
    var sec = (a.getSeconds() !== 0) ? a.getSeconds() : null;
    var finalTime = (hour !== null && min !== null && sec !== null) ? hour + ':' + min + ':' + sec : '';
    return date + ' ' + month + ' ' + year + ' ' + finalTime ;
}
