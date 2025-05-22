

/* large line chart */
var chartA = document.getElementById("chart-A");
var dataA = {
    labels: [1990, 1991, 1995, 2000, 2005 , 2010, 2015, 2020],
    datasets: [{ 
        data: [86,100, 114,106,106,107,111,133],
        label: "Emission",
        backgroundColor: 'transparent',
            borderColor: colors[0],
            borderWidth: 4,
            pointBackgroundColor: colors[0]
      }
    ]
  }
if (chartA) {
    new Chart(chartA, {
        type: 'line',
        data: dataA,
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            },
            legend: {
                display: false
            },
            responsive: true
        }
    });
}

/* bar chart */
var chartB = document.getElementById("chart-B");
var dataB = {
    labels: [1990, 1995, 2000, 2005 , 2010, 2015, 2020],
    datasets: [{ 
        data: [86,114,106,106,107,111,133],
        label: "Emission",
        backgroundColor: 'transparent',
            borderColor: colors[0],
            borderWidth: 4,
            pointBackgroundColor: colors[0]
      }
    ]
  }
if (chartB) {
    new Chart(chartB, {
        type: 'line',
        data: dataB,
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            },
            legend: {
                display: false
            },
            responsive: true
        }
    });
}

//-------Chart C----------------------
var chartC= document.getElementById("chart-C"); 
var dataC = {
    labels: [1990, 1995, 2000, 2005 , 2010, 2015, 2020],
    datasets: [{ 
        data: [86,114,106,106,107,111,133],
        label: "Emission",
        backgroundColor: 'transparent',
            borderColor: colors[0],
            borderWidth: 4,
            pointBackgroundColor: colors[0]
      }
    ]
  }

if (chartC) {   
    new Chart(document.getElementById("chart-C"), {
        type: 'line',
        data: dataC,
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            },
            legend: {
                display: false
            },
            responsive: true
        }
      });
}
