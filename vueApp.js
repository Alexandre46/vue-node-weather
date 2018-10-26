const API = "https://api.openweathermap.org/data/2.5/forecast";
const KEY = "88d2151398a5960afd2b42a1bb914c39";

var app = new Vue({
    el: "#app",
    data: {
      chart: null,
      city: "...",
      dates: [],
      temperature: "",
      pressure: '',
      humidity: '',
      wind: '',
      overcast: '', 
      temps: [],
      loading: false,
      errored: false,
      description:''
    },
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
        this.debouncedGetAnswer = _.debounce(this.getData, 500)
    },
    methods: {

        getCity(){
           axios.get('https://ipapi.co/json/',{

           }).then( response =>{
               console.log(response.data.city);
               this.city = response.data.city;
               return this.city;
           })
        },

      getData: function() {
        this.loading = true;
  
        if (this.chart != null) {
          this.chart.destroy();
        }


        axios
          .get(API, {
            params: {
              q: this.city,
              units: "metric",
              appid: KEY
            }
          })
          .then(response => {
            this.dates = response.data.list.map(list => {
              return list.dt_txt;
            });
  
            this.temps = response.data.list.map(list => {
              return list.main.temp;
            });

          //debug
          console.log(response.data);

          this.temperature  = response.data.list[0].main.temp;
          this.humidity     = response.data.list[0].main.humidity + '%';
          this.pressure     = response.data.list[0].main.pressure;
          this.wind         = response.data.list[0].wind.speed + 'm/s';
          this.overcast     = response.data.list[0].weather[0].description;

          //description
          this.description = response.data.list[0].weather[0].description;

          //icons
          var icons = new Skycons({"color": "black"});

          const currentWeather = response.data.list[0].weather[0].main;
          const currentWeatherDesc =   response.data.list[0].weather[0].description;

          if(currentWeather === 'Rain'){
              icons.set("rain", Skycons.RAIN);
          }
          if(currentWeather === 'Clouds'){
              icons.set("cloudy", Skycons.CLOUDY);
          }
          if(currentWeather === 'Snow'){
              icons.set("snow", Skycons.SNOW);
          }
          if(currentWeather === 'Windy'){
              icons.set("wind", Skycons.WIND);
          }
          if(currentWeather === 'Clear' || currentWeatherDesc === '%Clear%sky%'){
                  icons.set("clear-day", Skycons.CLEAR_DAY);
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
            this.errored = true;
          })
          .finally(() => (this.loading = false));
      }
    }
  });


