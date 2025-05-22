/* chart.js chart examples */

// chart colors
var colors = ['#007bff', '#28a745', '#333333', '#c3e6cb', '#dc3545', '#6c757d'];

/* large line chart */
var chartA = document.getElementById("chart-A");
var dataA = {
    labels: ["S", "M", "T", "W", "T", "F", "S"],
    datasets: [{
            data: [589, 445, 483, 503, 689, 692, 634],
            backgroundColor: 'transparent',
            borderColor: colors[0],
            borderWidth: 4,
            pointBackgroundColor: colors[0]
        }    ]
};
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
    labels: ["S", "M", "T", "W", "T", "F", "S"],
    datasets: [{
            data: [589, 445, 483, 503, 689, 692, 634],
            backgroundColor: colors[0]
        },
        {
            data: [639, 465, 493, 478, 589, 632, 674],
            backgroundColor: colors[1]
        }
    ]
}
if (chartB) {
    new Chart(chartB, {
        type: 'bar',
        data: dataB,
        options: {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    barPercentage: 0.4,
                    categoryPercentage: 0.5
                }]
            }
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