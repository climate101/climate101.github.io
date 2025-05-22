/* chart.js chart examples */

// chart colors
var colors = ['#007bff', '#28a745', '#333333', '#c3e6cb', '#dc3545', '#6c757d'];

function cumSum(a) {
    let result = [a[0]];

    for(let i = 1; i < a.length; i++) {
      result[i] = result[i - 1] + a[i];
      if (i==1) {
	 result[i]=result[i]+81; // cumulative_co2_emissions_to_1959 = 81 Pg C
      }
    }

    return result;
};

gdp_in_lce_from_form_vector=Array(0).fill().map((element, index) => index*NaN ) // initialize empty array of length zero
gdp_in_lce_from_form_vector[0]=0.0;

growth_rate_for_base_scenario=3.0;
year_start_simulation=1960;
start_year_set=0

function climate_change_function(gdp_in_lce_in, years_to_simulate, scenario) {

	co2_emis_parameter1=0.54;
        co2_emis_parameter2=0.66;
        infrastructure_growth_rate_constant=6.10;
	temperature_change_parameter1=500; // TCRE, =2 degree C/1000 Pg C, which means denominator = 1000/2 = 500
        min_temp_for_decay=1.0; // temperature change above which decay kicks in
	cumulative_co2_emissions_to_1959 = 81 // Pg C
	lce_efficiency=0.5; // low carbon economy efficiency, typically lower than for high C economy

	// initialize arrays
	
	gwp_hce=Array(years_to_simulate).fill().map((element, index) => index*NaN )
	actual_gwp_lce=Array(years_to_simulate).fill().map((element, index) => index*NaN )
	gwp_total=Array(years_to_simulate).fill().map((element, index) => index*NaN )
	co2_emissions=Array(years_to_simulate).fill().map((element, index) => index*NaN )
	cumsum_co2_emissions=Array(years_to_simulate).fill().map((element, index) => index*NaN )
	temperature_change=Array(years_to_simulate).fill().map((element, index) => index*NaN )
	growth_rate_hce=Array(years_to_simulate).fill().map((element, index) => index*NaN )
	growth_rate_total=Array(years_to_simulate).fill().map((element, index) => index*NaN )
	decay_rate=Array(years_to_simulate).fill().map((element, index) => index*NaN )
	decay_amount=Array(years_to_simulate).fill().map((element, index) => index*NaN )
	
	
	years=Array(years_to_simulate).fill().map((element, index) => index + 1959 + 1)
	gwp=Array(years_to_simulate).fill().map((element, index) => index*NaN ) // useless later
	growth_rate=Array(years_to_simulate).fill().map((element, index) => index*NaN ) // useless later


	// first value of all variables
	gwp_hce[0]=11.5; // Trillion $/yr
	gwp_total[0]=gwp_hce[0]; // Trillion $/yr
	co2_emissions[0]=co2_emis_parameter1*Math.pow(gwp_hce[0],co2_emis_parameter2);
	cumsum_co2_emissions[0]=cumulative_co2_emissions_to_1959;
	temperature_change[0]=cumsum_co2_emissions[0]/temperature_change_parameter1;
	decay_rate[0]=3+0.5*Math.max(temperature_change[0]-min_temp_for_decay,0); // temperature change above 1 causes more decay
	decay_amount[0]=gwp_total[0]*decay_rate[0];
	growth_rate_hce[0]=infrastructure_growth_rate_constant-decay_rate[0];
        growth_rate_total[0]=growth_rate_hce[0];


	// now the remaining years

	for(y = 1960; y <= 1959+years_to_simulate+1; y++){

		  i1=y-1959;
		  s1='year = ';
		  s2=i1.toString();
		  s3=s1.concat(s2);

		  if (scenario ==2 ) {
		     a=Math.round((y-1960)) / 10;
                     b=Math.floor(a);
		     use_gdp_in_lce=gdp_in_lce_in[b]
	             //document.getElementById("geog_2d_delta_t").innerHTML = use_gdp_in_lce; 
	             document.getElementById("geog_2d_delta_t").innerHTML = gdp_in_lce_in; 
		  }

	          gwp_hce[i1]=gwp_hce[i1-1]*(1+(growth_rate_hce[i1-1]/100.0));; // Trillion $/yr
	          co2_emissions[i1]=co2_emis_parameter1*Math.pow(gwp_hce[i1],co2_emis_parameter2);

	          cumsum_co2_emissions=cumSum(co2_emissions);
		  temperature_change[i1]=cumsum_co2_emissions[i1]/temperature_change_parameter1;
		  decay_rate[i1]=3+0.5*Math.max(temperature_change[i1]-min_temp_for_decay,0); // temperature change above 1 causes more decay
		  decay_amount[i1]=gwp_total[i1-1]*decay_rate[i1];

		  //if (scenario == 2) { infrastructure_growth_rate_constant=5; }
		  growth_rate_hce[i1]=infrastructure_growth_rate_constant-decay_rate[i1];


		  if ( scenario == 2 && use_gdp_in_lce>0.0 ) {
			  growth_rate_total[i1]=growth_rate_hce[i1]*(1.0-use_gdp_in_lce/100.0) +
                             growth_rate_hce[i1]*(use_gdp_in_lce/100.0)*lce_efficiency
			  growth_rate_hce[i1]=infrastructure_growth_rate_constant*(1.0-use_gdp_in_lce/100.0) -
                             (gwp_hce[i1]/gwp_total[i1-1])*(decay_amount[i1]/gwp_hce[i1])
		  } else {
			  growth_rate_total[i1]=growth_rate_hce[i1];
		  }


		  gwp_total[i1]=gwp_total[i1-1]*(1.0 + growth_rate_total[i1]/100.0)
                  actual_gwp_lce[i1]= gwp_total[i1]-gwp_hce[i1]

		  growth_rate[i1]=growth_rate_total[i1];
	} // y year loop



	return {
               gwp_total,
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
		     if(which_quantity=="gwp_total"){
		       t1=out.gwp_total;
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
	                 out=climate_change_function(gdp_in_lce_from_form_vector,year_counter, scenario)		
		         if(which_quantity=="gwp_total"){
		           t1=out.gwp_total;
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
		     //if(which_quantity=="gwp"){
	             //  str = JSON.stringify(data, null, 4);
	             //  alert(str);
		     //}
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
				label: 'Your scenario',
				backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
				borderColor: window.chartColors.blue,
				data: generateData(growth_rate, 2,which_quantity), // for Scenario 1 this growth_rate from form doesn't matter 
				type: 'line',
				pointRadius: 0,
				pointStyle: 'line',
				fill: false,
				lineTension: 0,
				borderWidth: 3
		        }, {
				label: 'Baseline simulation',
				backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
				borderColor: window.chartColors.red,
				data: generateData(growth_rate, 1,which_quantity),
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
cfg=generateCFG(growth_rate_for_base_scenario, "gwp_total",10, true);
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

	      year_start_simulation=Number(p1);
	      gdp_in_lce_from_form=Number(p2);


	      if (start_year_set==0) {
                      years_missed_in_beginning=year_counter+year_start_simulation-1960-1;
                      year_counter=year_counter+year_start_simulation-1960;
		      start_year_set=1;
		      //document.getElementById("start_year_div").className = "d-none";
		      //document.getElementById("gdp_in_lce_div").className = "d-block";
		      str2=" for the period "+(year_counter+1960).toString()+"-"+(year_counter+10+1960-1).toString()+".";
	              document.getElementById("next_10_years").innerHTML = str2; 

		      a1=Math.round((years_missed_in_beginning)) / 10;
		      if ( a1>0 ) {
			      for (k=1; k<=a1; k++ ) {
	                          gdp_in_lce_from_form_vector.push(Number(0.0));
			      }
		      }

              } else {
	              gdp_in_lce_from_form_vector.push(gdp_in_lce_from_form);
                      year_counter=year_counter+10;
		      if ( (year_counter+1960)>=2100 ) {
		        str2="Simulation over!" 
	                document.getElementById("gdp_in_lce_div").innerHTML = str2; 
		      } else {
		        str2=" for the period "+(year_counter+1960).toString()+"-"+(year_counter+10+1960-1).toString()+".";
	                document.getElementById("next_10_years").innerHTML = str2; 
		      }

	      }



	      if(year_counter<=145){
                cfg1=generateCFG(gdp_in_lce_from_form_vector, "gwp_total",10, true);
                var chart = new Chart(ctx1, cfg1);
                cfg1=generateCFG(gdp_in_lce_from_form_vector, "co2_emissions",10, true);
                var chart = new Chart(ctx2, cfg1);
                cfg1=generateCFG(gdp_in_lce_from_form_vector, "temperature_change",10, true);
                var chart = new Chart(ctx3, cfg1);
                cfg1=generateCFG(gdp_in_lce_from_form_vector, "growth_rate",30, false);
                var chart = new Chart(ctx4, cfg1);
              }
	      
	      t1=Math.round(current_temperature_change_value * 100) / 100;
	      t2=Math.round(current_temperature_change_value * 10) / 10;
	      t3=Number(current_temperature_change_year)+1959; 
	      t2=t2.toFixed(2);
	      //filename for geographical delta T
	      file_delta_t="st_change_"+t2.toString()+".jpg"
	      string1="Temperature increase of "+t1.toString()+" <sup>o</sup>C by "+t3.toString();
	      document.getElementById("temperature_change").innerHTML = string1; 
	      string2="<img class='card-img-top' src='images/"+file_delta_t+"'>"
	      //document.getElementById("geog_2d_delta_t").innerHTML = string2; 



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


$(document).ready(function(){
  $("#button1").click(function(){
    $("#start_year_div").fadeOut();
    $("#start_year_div").removeClass("d-block");
    $("#start_year_div").addClass("d-none");
    $("#gdp_in_lce_div").fadeIn(1000);
    $("#gdp_in_lce_div").removeClass("d-none");
    $("#gdp_in_lce_div").addClass("d-block");
  });
});

