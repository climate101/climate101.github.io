/* chart.js chart examples */

// chart colors
var colors = ['#007bff', '#28a745', '#333333', '#c3e6cb', '#dc3545', '#6c757d'];

function cumSum(a) {
    let result = [a[0]];

    for(let i = 1; i < a.length; i++) {
      result[i] = result[i - 1] + a[i];
    }

    return result;
};

growth_rate_from_form_vector=Array(0).fill().map((element, index) => index*NaN ) // initialize empty array of length zero

growth_rate_for_base_scenario=3.0;

function climate_change_function(growth_rate_in, years_to_simulate, scenario) {

	co2_emis_parameter1=0.54
        co2_emis_parameter2=0.66
        infrastructure_growth_rate_constant=6.00

	// initialize arrays
	years=Array(years_to_simulate).fill().map((element, index) => index + 1959 + 1)
	gwp=Array(years_to_simulate).fill().map((element, index) => index*NaN )
	co2_emissions=Array(years_to_simulate).fill().map((element, index) => index*NaN )
	cumsum_co2_emissions=Array(years_to_simulate).fill().map((element, index) => index*NaN )
	temperature_change=Array(years_to_simulate).fill().map((element, index) => index*NaN )
	growth_rate=Array(years_to_simulate).fill().map((element, index) => index*NaN )


	// first value
	gwp[0]=11.0;
	co2_emissions[0]=0.54*Math.pow(gwp[0],0.66);


        if (scenario ==1 ) {
	   growth_rate[0]=growth_rate_in;
	} else if (scenario==2 ) {
	   growth_rate[0]=growth_rate_in[0];
	}



	for(y = 1960; y < 1959+years_to_simulate+1; y++){

		  i1=y-1959;
		  s1='year = ';
		  s2=i1.toString();
		  s3=s1.concat(s2);
		  gwp[i1]=gwp[i1-1]*(1+(growth_rate[i1-1]/100.0));
		  co2_emissions[i1]=0.54*Math.pow(gwp[i1],0.66);
		  if (scenario ==1 ) {
		     growth_rate[i1]=growth_rate_in;
		  } else if (scenario==2 ) {
		     a=Math.round((y-1960)) / 10;
                     b=Math.floor(a);
		     use_growth_rate=growth_rate_in[b]
		     growth_rate[i1]=use_growth_rate;
		  }
	}

        str1="Scenario = "+scenario.toString()+" year_counter = "+year_counter.toString()+" b = "+b.toString();
	//document.getElementById("geog_2d_delta_t").innerHTML = str1; 

	cumsum_co2_emissions=cumSum(co2_emissions);

	for(j=1; j<=cumsum_co2_emissions.length; ++j) {
		temperature_change[j]=cumsum_co2_emissions[j]/555.0
	}


	return {
               gwp,
               co2_emissions,
	       growth_rate,
	       temperature_change
        };

}


function generateData(growth_rate, scenario,which_quantity) { // which_quantity is a string, like gwp, co2_emissions, etc
		var unit = 'year';

	        str1=scenario.toString()+" "+which_quantity;
	        //alert(str1);

		function unitLessThanDay() {
			return unit === 'second' || unit === 'minute' || unit === 'hour';
		}

		function beforeNineThirty(date) {
			return date.hour() < 9 || (date.hour() === 9 && date.minute() < 30);
		}

		// Returns true if outside 9:30am-4pm on a weekday
		function outsideMarketHours(date) {
			if (date.isoWeekday() > 5) {
				return true;
			}
			if (unitLessThanDay() && (beforeNineThirty(date) || date.hour() > 16)) {
				return true;
			}
			return false;
		}

		function randomNumber(min, max) {
			return Math.random() * (max - min) + min;
		}

		function randomBar(date, lastClose) {
			var open = randomNumber(lastClose * 0.95, lastClose * 1.05).toFixed(2);
			var close = randomNumber(open * 0.95, open * 1.05).toFixed(2);
			return {
				t: date.valueOf(),
				y: close
			};
		}

		var date = moment('1959', 'YYYY');
		var now = moment();
		var data = [];
		var lessThanDay = unitLessThanDay();
		//for (; data.length < 2000 && date.isBefore(now); date = date.clone().add(1, unit).startOf(unit)) {
		for (; data.length < 142 ; date = date.clone().add(1, unit).startOf(unit)) {
			if (outsideMarketHours(date)) {
				if (!lessThanDay || !beforeNineThirty(date)) {
					date = date.clone().add(date.isoWeekday() >= 5 ? 8 - date.isoWeekday() : 1, 'day');
				}
				if (lessThanDay) {
					date = date.hour(9).minute(30).second(0);
				}
			}
			data.push(randomBar(date, data.length > 0 ? data[data.length - 1].y : 30));
		}


		if (scenario==1) { // Scenario 1 is baseline
	             out=climate_change_function(growth_rate_for_base_scenario ,141, scenario)		
		     if(which_quantity=="gwp"){
		       t1=out.gwp;
		     } else if (which_quantity=="co2_emissions"){
		       t1=out.co2_emissions;
		     } else if (which_quantity=="growth_rate"){
		       t1=out.growth_rate;
		     } else if (which_quantity=="temperature_change"){
		       t1=out.temperature_change;
		     }
	             for (var i in data) {
                          data[i].y= t1[i]
                     }
	             //str = JSON.stringify(data, null, 4);
	             //alert(str);
		} else if(scenario==2) { // Scenario 2 is user's scenario
	             for (var i in data) {
	                 out=climate_change_function(growth_rate,year_counter, scenario)		
		         if(which_quantity=="gwp"){
		           t1=out.gwp;
		         } else if (which_quantity=="co2_emissions"){
		           t1=out.co2_emissions;
		         } else if (which_quantity=="growth_rate"){
		           t1=out.growth_rate;
		         } else if (which_quantity=="temperature_change"){
		           t1=out.temperature_change;
		         }
			 if (i<=year_counter) {
                              //data[i].y= i**1 + Math.round(Samples.utils.rand(-10, 10));;
                              data[i].y= t1[i]
		              if (which_quantity=="temperature_change"){
				current_temperature_change_value=t1[i];
				current_temperature_change_year=i;
			      }
                         } else {
                               data[i].y= NaN
                         }
                     }
	             //str = JSON.stringify(data, null, 4);
	             //alert(str);
		}

	        //str = JSON.stringify(data, null, 4);
	        //alert(str);

		return data;
}


//ctx.canvas.width = 800;
//ctx.canvas.height = 300;
//
var color = Chart.helpers.color;

function generateCFG(growth_rate, which_quantity, y_axis_auto_skip_padding, legend_yes_or_no) {
     var cfg = {
		data: {
			datasets: [{
				label: 'Your simulation',
				backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
				borderColor: window.chartColors.red,
				data: generateData(growth_rate, 2,which_quantity),
				type: 'line',
				pointRadius: 0,
				pointStyle: 'line',
				fill: false,
				lineTension: 0,
				borderWidth: 3
		        }, {
				label: 'Baseline scenario',
				backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
				borderColor: window.chartColors.blue,
				data: generateData(growth_rate, 1,which_quantity), // for Scenario 1 this growth_rate from form doesn't matter 
				type: 'line',
				pointRadius: 0,
				pointStyle: 'line',
				fill: false,
				lineTension: 0,
				borderWidth: 3
			}]
		},
		options: {
			tooltips: {enabled: false},
                        hover: {mode: null},
			animation: {
				duration: 0
			},
			legend: {
                                display: legend_yes_or_no,
				labels: {
				     boxWidth: 12,
                                 }
                        },
			scales: {
				xAxes: [{
					type: 'time',
					distribution: 'series',
					offset: true,
					ticks: {
						major: {
							enabled: true,
							fontStyle: 'bold'
						},
						source: 'data',
						autoSkip: true,
						autoSkipPadding: 19,
						maxRotation: 0,
					},
					afterBuildTicks: function(scale, ticks) {
						var majorUnit = scale._majorUnit;
						var firstTick = ticks[0];
						var i, ilen, val, tick, currMajor, lastMajor;

						val = moment(ticks[0].value);
						if ((majorUnit === 'minute' && val.second() === 0)
								|| (majorUnit === 'hour' && val.minute() === 0)
								|| (majorUnit === 'day' && val.hour() === 9)
								|| (majorUnit === 'month' && val.date() <= 3 && val.isoWeekday() === 1)
								|| (majorUnit === 'year' && val.month() === 0)) {
							firstTick.major = true;
						} else {
							firstTick.major = false;
						}
						lastMajor = val.get(majorUnit);

						for (i = 1, ilen = ticks.length; i < ilen; i++) {
							tick = ticks[i];
							val = moment(tick.value);
							currMajor = val.get(majorUnit);
							tick.major = currMajor !== lastMajor;
							lastMajor = currMajor;
						}
						return ticks;
					}
				}],
				yAxes: [{
					gridLines: {
						drawBorder: false
					},
					scaleLabel: {
						display: false,
						labelString: ''
					},
					ticks: {
						major: {
							enabled: true,
							fontStyle: 'bold'
						},
						source: 'data',
						autoSkipPadding: y_axis_auto_skip_padding,
						maxRotation: 0,
						suggestedMin: 0,
						suggestedMax: 4
					}
				}]
			},
			tooltips: {
				enabled: false, // it makes the data labels go away but the plot still jitters with mouse over
				intersect: false,
				mode: 'index',
				callbacks: {
					label: function(tooltipItem, myData) {
						var label = myData.datasets[tooltipItem.datasetIndex].label || '';
						if (label) {
							label += ': ';
						}
						label += parseFloat(tooltipItem.value).toFixed(2);
						return label;
					}
				}
			}
		}
        };
       return cfg;
} // generateCFG


// Chart A
year_counter=1;
var ctx1 = document.getElementById('chart-A').getContext('2d');
ctx1.canvas.height = 200;
cfg=generateCFG(growth_rate_for_base_scenario, "gwp",10, true);
var chart = new Chart(ctx1, cfg);

// Chart B
year_counter=1;
var ctx2 = document.getElementById('chart-B').getContext('2d');
ctx2.canvas.height = 200;
cfg=generateCFG(growth_rate_for_base_scenario, "co2_emissions",10, true);
var chart = new Chart(ctx2, cfg);

	      
// Chart C
year_counter=1;
var ctx3 = document.getElementById('chart-C').getContext('2d');
ctx3.canvas.height = 200;
cfg=generateCFG(growth_rate_for_base_scenario, "temperature_change",10, true);
var chart = new Chart(ctx3, cfg);

// Chart D
year_counter=1;
var ctx4 = document.getElementById('chart-D').getContext('2d');
//ctx4.canvas.height = 250;
cfg=generateCFG(growth_rate_for_base_scenario,"growth_rate",30, false);
var chart = new Chart(ctx4, cfg);




document.getElementById('button1').addEventListener('click', function() {
              var ctx1 = document.getElementById('chart-A').getContext('2d');
              var ctx2 = document.getElementById('chart-B').getContext('2d');
              var ctx3 = document.getElementById('chart-C').getContext('2d');
              var ctx4 = document.getElementById('chart-D').getContext('2d');
              //ctx1.canvas.width = 800;
	      

	      var p1=Form1.elements[0].value; // parameters from Form1, 1st field
	      var p2=Form1.elements[1].value; // parameters from Form1, 2nd field

	      growth_rate_from_form=Number(p2);

	      growth_rate_from_form_vector.push(growth_rate_from_form);

              year_counter=year_counter+10;
	      if(year_counter<=145){
                cfg1=generateCFG(growth_rate_from_form_vector, "gwp",10, true);
                var chart = new Chart(ctx1, cfg1);
                cfg1=generateCFG(growth_rate_from_form_vector, "co2_emissions",10, true);
                var chart = new Chart(ctx2, cfg1);
                cfg1=generateCFG(growth_rate_from_form_vector, "temperature_change",10, true);
                var chart = new Chart(ctx3, cfg1);
                cfg1=generateCFG(growth_rate_from_form_vector, "growth_rate",30, false);
                var chart = new Chart(ctx4, cfg1);
              }
	      
	      t1=Math.round(current_temperature_change_value * 100) / 100;
	      t2=Math.round(current_temperature_change_value * 10) / 10;
	      t3=Number(current_temperature_change_year)+1959; 
	      t2=t2.toFixed(2);
	      file_delta_t="st_change_"+t2.toString()+".jpg"
	      string1="Temperature increase of "+t1.toString()+" <sup>o</sup>C by "+t3.toString();
	      document.getElementById("temperature_change").innerHTML = string1; 
	      string2="<img class='card-img-top' src='images/"+file_delta_t+"'>"
	      document.getElementById("geog_2d_delta_t").innerHTML = string2; 


	      //filename for geographical delta T

	      /*
	      new_data=generateData(2);
	      for(j = 0; j < 140; j++){
	        //str = JSON.stringify(new_data[j], null, 4);
	        //alert(str);
	        ctx1.data.datasets[1].data[j] = new_data[j];
	      }
	      //str = JSON.stringify(new_data, null, 4);
	      //alert(str);
              ctx1.update();
	      */
});

	      


