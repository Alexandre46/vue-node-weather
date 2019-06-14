const API = "https://api.darksky.net/forecast/ecb011fa534de8867e6376f625f30a42";
const KEY = "ecb011fa534de8867e6376f625f30a42";
const hours = 8;

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
      "datetime": "Date & Time:",
      "min-temp": "Min. Temperature:",
      "max-temp": "Max. Temperature:",
      "humidity": "Humidity",
      "description": "Description",
      "population" : "People",
      "last-update" : "Last update 1 minute ago",
      "week-summary" : "Week forecast",
      "day-summary" : "Day forecast",
      "temperature-now" : "Now",

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
      "datetime" : "Dia e hora:",
      "min-temp" : "Temperatura mínima:",
      "max-temp" : "Temperatura máxima:",
      "humidity" : "Humidade:",
      "description" : "Descrição:",
      "population" : "Pessoas",
      "last-update" : "Ultima actualização há 1 min atrás",
      "week-summary" : "Previsão semanal",
      "day-summary" : "Previsão para hoje",
      "temperature-now" : "Agora:",
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
        i18n.locale = locale()
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

            console.log(response);

            //weather info
            this.nowDatetime = response.headers.date;
            this.weekSummary = response.data.daily.summary;
            this.daySummary = response.data.hourly.summary;
            this.nowTemperature = response.data.currently.temperature;
            this.maxTemperature  = response.data.daily.data[0].temperatureMax;
            this.minTemperature = response.data.daily.data[0].temperatureMin;
            this.humidity = (response.data.currently.humidity) * 100 + '%';
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
              list.dailyIcon = list.icon;
              list.dailySummary = list.summary;
              list.dailyHumidity = list.humidity;
              list.dailyDateTime = timeConverter(list.time);
              list.dailyTempMin = list.temperatureMin;
              list.dailyTempMax = list.temperatureMax;
              return list;
            });


          //icons
          var icons = new Skycons({"color": "black"});
          const currentWeather = response.data.currently.icon;
          const currentWeatherDesc =   response.data.list[0].weather[0].description;

          //change background img
          ChangeBgImage(currentWeather);

          if(currentWeather === 'rain'){
          icons.set("icon1", Skycons.RAIN);
          }
          if(currentWeather === 'partly-cloudy-day'){
              icons.set("icon1", Skycons.PARTLY_CLOUD_DAY);
          }
          if(currentWeather === 'partly-cloudy-night'){
            icons.set("icon1", Skycons.PARTLY_CLOUD_NIGHT);
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
          if(currentWeather === 'clear-day' || currentWeatherDesc === '%Clear%sky%'){
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
          console.log(error);
          this.error = true;
        })
        .finally(() => (this.loading = false));
      }
    }
  });


//Change div app background img pending on weather
function ChangeBgImage(currentWeather) {
    document.getElementById('app').style.backgroundImage =  'url(images/' + currentWeather + '.png)';
    document.getElementById('app').style.backgroundPosition = 'center';
    document.getElementById('app').style.backgroundRepeat = 'no-repeat';
    document.getElementById('app').style.overflow = 'hidden';
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
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
}
