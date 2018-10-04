var app = new Vue({
    el: "#app",
    data: {
      chart: null,
      city: "",
      dates: [],
      temperature: "",
      pressure: '',
      humidity: '',
      wind: '',
      overcast: '', 
      temps: [],
      loading: false,
      errored: false
    },
    methods: {
      getData: function() {
        this.loading = true;
  
        if (this.chart != null) {
          this.chart.destroy();
        }
        axios
          .get("https://api.openweathermap.org/data/2.5/forecast", {
            params: {
              q: this.city,
              units: "metric",
              appid: "88d2151398a5960afd2b42a1bb914c39"
            }
          })
          .then(response => {
            this.dates = response.data.list.map(list => {
              return list.dt_txt;
            });
  
            this.temps = response.data.list.map(list => {
              return list.main.temp;
            });
            console.log(response.data.list[0]);
          
          this.temperature = response.data.list[0].main.temp;
          this.humidity = response.data.list[0].main.humidity + '%';
          this.pressure = response.data.list[0].main.pressure;
          this.wind = response.data.list[0].wind.speed + 'm/s';
          this.overcast = response.data.list[0].weather[0].description;
    
        
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