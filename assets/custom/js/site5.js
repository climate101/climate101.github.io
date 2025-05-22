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
//gdp_in_lce_from_form_vector[0]=0.0;

growth_rate_for_base_scenario=3.0;
year_start_simulation=1960;
start_year_set=0;
one_degree_alert=0;
two_degree_alert=0;
actual_step_count=0;

function climate_change_function(gdp_in_lce_in, years_to_simulate, chosen_scenario) {

	co2_emis_parameter1=0.54;
        co2_emis_parameter2=0.66;
        infrastructure_growth_rate_constant=6.10;
	temperature_change_parameter1=500; // TCRE, =2 degree C/1000 Pg C, which means denominator = 1000/2 = 500
        min_temp_for_decay=1.0; // temperature change above which decay kicks in
	cumulative_co2_emissions_to_1959 = 81 // Pg C
	lce_efficiency=0.4; // low carbon economy efficiency, typically lower than for high C economy

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

	for(y = 1960; y <= 1959+years_to_simulate; y++){

		  i1=y-1959;
		  s1='year = ';
		  s2=i1.toString();
		  s3=s1.concat(s2);

		  if (chosen_scenario ==2 ) {
		     a=Math.round((y-1960)) / 10;
                     b=Math.floor(a);
		     use_gdp_in_lce=gdp_in_lce_in[b]
		     str3="years to simulate ="+years_to_simulate+", i1= "+i1 ;
	             //document.getElementById("geog_2d_delta_t").innerHTML = str3; 
	             //document.getElementById("geog_2d_delta_t").innerHTML = gdp_in_lce_in; 
		  }

	          gwp_hce[i1]=gwp_hce[i1-1]*(1+(growth_rate_hce[i1-1]/100.0));; // Trillion $/yr
	          co2_emissions[i1]=co2_emis_parameter1*Math.pow(gwp_hce[i1],co2_emis_parameter2);

	          cumsum_co2_emissions=cumSum(co2_emissions);
		  temperature_change[i1]=cumsum_co2_emissions[i1]/temperature_change_parameter1;
		  decay_rate[i1]=3+0.5*Math.max(temperature_change[i1]-min_temp_for_decay,0); // temperature change above 1 causes more decay
		  decay_amount[i1]=gwp_total[i1-1]*decay_rate[i1];

		  //if (chosen_scenario== 2) { infrastructure_growth_rate_constant=5; }
		  growth_rate_hce[i1]=infrastructure_growth_rate_constant-decay_rate[i1];


		  if ( chosen_scenario == 2 && use_gdp_in_lce>0.0 ) {
			  growth_rate_total[i1]=growth_rate_hce[i1]*(1.0-use_gdp_in_lce/100.0) +
                             growth_rate_hce[i1]*(use_gdp_in_lce/100.0)*lce_efficiency
			  growth_rate_hce[i1]=infrastructure_growth_rate_constant*(1.0-use_gdp_in_lce/100.0) -
                             (gwp_hce[i1]/gwp_total[i1-1])*(decay_amount[i1]/gwp_hce[i1])
		  } else {
			  growth_rate_total[i1]=growth_rate_hce[i1];
		  }


		  gwp_total[i1]=gwp_total[i1-1]*(1.0 + growth_rate_total[i1]/100.0)
                  actual_gwp_lce[i1]= gwp_total[i1]-gwp_hce[i1]

		  growth_rate[i1]=growth_rate_total[i1-1]; // I had to i1-1 otherwise the plot for growth_rate looks funny.
	} // y year loop

		  if ( chosen_scenario == 2 ) { // Had to do this too from keep growth_rate look reasonable
		     growth_rate[1]=growth_rate_total[3]; 
		     growth_rate[1]=growth_rate_total[2]; 
		  }


	return {
               gwp_total,
               co2_emissions,
	       growth_rate,
	       temperature_change
        };

}


function generateData(growth_rate, chosen_scenario, which_quantity) { // which_quantity is a string, like gwp, co2_emissions, etc
		var unit = 'year';

	        str1=chosen_scenario.toString()+" "+which_quantity;
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


		if (chosen_scenario==1) { // Scenario 1 is baseline
	             out=climate_change_function(growth_rate_for_base_scenario ,141, chosen_scenario)		
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
			  if (i == year_counter) {
		             if (which_quantity=="growth_rate"){
				   current_growth_rate_baseline=t1[i-1];
			     }
			  }
                     }
		     if (which_quantity=="temperature_change"){
	                   base_scenario_temperature_change_at_2100=t1[i-1]
		     }
		     if (which_quantity=="gwp_total"){
	                   base_scenario_gwp_total_at_2100=t1[i-1]
		     }
	             //str = JSON.stringify(data, null, 4);
	             //alert(str);
		} else if(chosen_scenario==2) { // Scenario 2 is user's scenario
	             for (var i in data) {
	                 out=climate_change_function(gdp_in_lce_from_form_vector,year_counter, chosen_scenario)		
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
		              if (which_quantity=="gwp_total"){
				current_gwp_total_value=t1[i];
			      }
		              if (which_quantity=="growth_rate"){
				current_growth_rate=t1[i];
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

function generateCFG(gdp_in_lce, which_quantity, y_axis_auto_skip_padding, legend_yes_or_no) {
     var cfg = {
		data: {
			datasets: [{
				label: 'Your scenario',
				backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
				borderColor: window.chartColors.blue,
				data: generateData(gdp_in_lce, 2,which_quantity), 
				type: 'line',
				pointRadius: 0,
				pointStyle: 'line',
				fill: false,
				lineTension: 0,
				borderWidth: 3
		        }, {
				label: 'Business-as-usual scenario',
				backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
				borderColor: window.chartColors.red,
				data: generateData(gdp_in_lce, 1,which_quantity), // for Scenario 1 this gdp_in_lce from form doesn't matter
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

function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}

var pop_ups=getAllUrlParams().pop_ups;
if (pop_ups!=0){
 pop_ups='1';
}


function overlay_on() {
  document.getElementById("overlay").style.display = "block";
}

function overlay_off() {
  document.getElementById("overlay").style.display = "none";
}

message1="<img class='image1' src='images2/smoke_stacks_01.jpg' width=110 height=160 align=left valign=top HSPACE='10' VSPACE='5' border=2>"+
         "Our economy and its growth are driven by burning fossil fuels (FFs). "+
	"But FFs also cause climate change. " +
	"<br><br>This simple game illustrates the balance between keeping the economy growing "+
	"and reducing climate change." +
	"<br><br>You may start your simulation as early as 1960, to see how early action helps, or as late as 2080."+
	"<br><br>Your simulation will be compared to a business-as-usual scenario with little/no investment in renewable energy.";


function flash_start_year_div() {
   var f = document.getElementById('userInputParam1');
   setTimeout(function() { f.className = 'my_choice_select2 form-control'; }, 500);
   setTimeout(function() { f.className = 'my_choice_select1 form-control'; }, 600);
   setTimeout(function() { f.className = 'my_choice_select2 form-control'; }, 700);
   setTimeout(function() { f.className = 'my_choice_select1 form-control'; }, 800);
   setTimeout(function() { f.className = 'my_choice_select2 form-control'; }, 900);
   setTimeout(function() { f.className = 'my_choice_select1 form-control'; }, 1000);
   var g = document.getElementById('userInputParam2');
   setTimeout(function() { g.className = 'my_choice_select2 form-control'; }, 500);
   setTimeout(function() { g.className = 'my_choice_select1 form-control'; }, 600);
   setTimeout(function() { g.className = 'my_choice_select2 form-control'; }, 700);
   setTimeout(function() { g.className = 'my_choice_select1 form-control'; }, 800);
   setTimeout(function() { g.className = 'my_choice_select2 form-control'; }, 900);
   setTimeout(function() { g.className = 'my_choice_select1 form-control'; }, 1000);
   var h = document.getElementById('next_10_years');
   setTimeout(function() { h.className = 'my_choice_select2 '; }, 500);
   setTimeout(function() { h.className = ''; }, 600);
   setTimeout(function() { h.className = 'my_choice_select2 '; }, 700);
   setTimeout(function() { h.className = ''; }, 800);
   setTimeout(function() { h.className = 'my_choice_select2 '; }, 900);
   setTimeout(function() { h.className = ''; }, 1000);
}




if (pop_ups!=0) {
   overlay_on();
   asAlertMsg({
      type: "default",
      title: "Background",
      message: message1,
      button: {
        title: "Close Button",
        bg: "default"
      }
   });
}



// Chart A
year_counter=0;
var ctx1 = document.getElementById('chart-A').getContext('2d');
ctx1.canvas.height = 200;
cfg=generateCFG(growth_rate_for_base_scenario, "gwp_total",10, true);
var chart = new Chart(ctx1, cfg);

// Chart B
year_counter=0;
var ctx2 = document.getElementById('chart-B').getContext('2d');
ctx2.canvas.height = 200;
cfg=generateCFG(growth_rate_for_base_scenario, "co2_emissions",10, true);
var chart = new Chart(ctx2, cfg);

	      
// Chart C
year_counter=0;
var ctx3 = document.getElementById('chart-C').getContext('2d');
ctx3.canvas.height = 200;
cfg=generateCFG(growth_rate_for_base_scenario, "temperature_change",10, true);
var chart = new Chart(ctx3, cfg);

// Chart D
year_counter=0;
var ctx4 = document.getElementById('chart-D').getContext('2d');
//ctx4.canvas.height = 250;
cfg=generateCFG(growth_rate_for_base_scenario,"growth_rate",30, false);
var chart = new Chart(ctx4, cfg);



function findMean(gradeData) {
  const filtered = gradeData.filter(item => item !== 0);
  const sum = filtered.reduce((a, b) => a + b);
  const avg = sum / filtered.length;
  return avg;
}


	
function progress_thru_game () {

	      actual_step_count++;
	      as_alert_open=0;

	      if(year_counter<141) {
	        document.getElementById("chartA").innerHTML = '&nbsp;';
                document.getElementById("chartA").innerHTML = '<canvas id="chart-A"></canvas>';
                var ctx1 = document.getElementById('chart-A').getContext('2d');
                ctx1.canvas.height = 200;

	        document.getElementById("chartB").innerHTML = '&nbsp;';
                document.getElementById("chartB").innerHTML = '<canvas id="chart-B"></canvas>';
                var ctx2 = document.getElementById('chart-B').getContext('2d');
                ctx2.canvas.height = 200;

	        document.getElementById("chartC").innerHTML = '&nbsp;';
                document.getElementById("chartC").innerHTML = '<canvas id="chart-C"></canvas>';
                var ctx3 = document.getElementById('chart-C').getContext('2d');
                ctx3.canvas.height = 200;

	        document.getElementById("chartD").innerHTML = '&nbsp;';
                document.getElementById("chartD").innerHTML = '<canvas id="chart-D"></canvas>';
                var ctx4 = document.getElementById('chart-D').getContext('2d');
                ctx4.canvas.width = 200;
              }
	      

	      var p1=Form1.elements[0].value; // parameters from Form1, 1st field
	      var p2=Form1.elements[1].value; // parameters from Form1, 2nd field

	      year_start_simulation=Number(p1);
	      gdp_in_lce_from_form=Number(p2);


	      if (start_year_set==0) {
                      years_missed_in_beginning=year_counter+year_start_simulation-1960;
                      year_counter=year_counter+year_start_simulation-1960+1;
		      //document.getElementById("start_year_div").className = "d-none";
		      //document.getElementById("gdp_in_lce_div").className = "d-block";
		      str2=" for the period "+(year_counter+1960).toString()+"-"+(year_counter+10+1960-1).toString()+" and click Continue.";
			     
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
		      btc=base_scenario_temperature_change_at_2100.toFixed(1);
		      if ( (year_counter+1960)>=2100 ) {
	                      ctc=current_temperature_change_value.toFixed(1);
			      c1=findMean(gdp_in_lce_from_form_vector);
			      c1=c1.toFixed(1);
		              end_message_1="You started your simulation in "+ year_start_simulation.toString()+" and"
			      +" invested, on an average, "+c1.toString()+"% of GDP in the low carbon economy. ";
	                      document.getElementById("gdp_in_lce_div").innerHTML = "<div style='width:100%; border-style:solid; border-width:1px 0px 0px 0px; font-weight:bold; text-align:center;'>Simulation over!</div>"; 
	                      document.getElementById("button1_enclosure").innerHTML = ""; 
		      } else {

		              str2=" for the period "+(year_counter+1960).toString()+"-"+(year_counter+10+1960-1).toString()+" and click Continue.";
	                      document.getElementById("next_10_years").innerHTML = str2; 
			      flash_start_year_div();
		      }

	      }





              if (pop_ups!=0) {
	              str10="<a href='?pop_ups=0'>Click for the version without informative pop-ups.</a>"
	      } else if (pop_ups==0) {
	              str10="<a href='?pop_ups=1'>Usual version with informative pop-ups.</a>"
	      }
	      document.getElementById("pop_up_version").innerHTML = str10; 


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
	      


              // messages based on year_counter+1960 and actual_step_count
	
	      //str66="actual_step_count="+actual_step_count.toString()+", alert_open="+as_alert_open.toString();
	      //alert(str66);

	      if (actual_step_count==2 && pop_ups!=0 && as_alert_open==0 ) {
		        cgr=current_growth_rate.toFixed(1);
		        cgr_baseline=current_growth_rate_baseline.toFixed(1);
		        cgdp_in_lce=gdp_in_lce_from_form.toFixed(1);
		        
		        if (gdp_in_lce_from_form<=5){
				sd1="You have made a reasonble investment of "+cgdp_in_lce+"% in renewable energy but you will need to invest more to combat climate change. ";
				sd3="";
			} else if (gdp_in_lce_from_form>5 && gdp_in_lce_from_form<10 ) {
				sd1="You have made a good investment of "+cgdp_in_lce+"% in renewable energy but you will need to invest more later on. ";
				sd3="<br><br>Keep an eye on your economy's growth rate as well as global temperature change. "
			} else if (gdp_in_lce_from_form>10 && gdp_in_lce_from_form<20 ) {
				sd1="Wonderful! You have made a very bold investment of "+cgdp_in_lce+"% in renewable energy. ";
				sd3="<br><br>Keep in mind this will lead to a lower growth rate for the economy but help wth climate change in the long term. "
			} else if (gdp_in_lce_from_form>20 ) {
				sd1="Bravo! You have made an extremely significant investment of "+cgdp_in_lce+"% in renewable energy. ";
				sd3="<br><br>Unfortunately, the economy will suffer quite a bit in the short term but in the long term it will help with climate mitigation. "
			}


		        sd2="<br><br>The current growth rate for economy in your scenario is "+cgr+"%, compared to "+cgr_baseline+"% in the baseline scenario.";

		        message_step_2=sd1+sd2+sd3;

			 overlay_on();
		         asAlertMsg({
                            type: "default",
                            title: "Your growth rate",
                            message: message_step_2,
                            button: {
                              title: "Close Button",
                              bg: "default"
                            }
                         });
	      }



	      t1=Math.round(current_temperature_change_value * 100) / 100;
	      t2=Math.round(current_temperature_change_value * 10) / 10;
	      t3=Number(current_temperature_change_year)+1959; 
	      t4=t2.toFixed(2);
	      t5=t2.toFixed(1);
	      //filename for geographical delta T
	      file_delta_t="st_change_"+t4.toString()+".jpg"
	      string1="Temperature increase of "+t5.toString()+" <sup>o</sup>C by "+t3.toString();
	      document.getElementById("geog_temperature_delta").innerHTML = string1; 
	      string2="<img class='card-img-top' src='images/"+file_delta_t+"'>"
	      document.getElementById("geog_2d_delta_t").innerHTML = string2; 


	      if(one_degree_alert==0 && t5>=1.0 && t5<=1.5 && start_year_set>0 && pop_ups!=0 && as_alert_open==0 ) { // if temperature change hits 1 C
			one_degree_alert=1;
		        message_1_deg="The global temperature change has now crossed 1.0 °C and economic growth rate " +
			              "from now on will reduce due to climate change impacts. "+
			              "<br><br>Hurricanes are becoming more intense, flooding and drought are becoming more frequent."+
			              "<br><img class='image1' src='images2/hurricane_satellite_01.png' HSPACE='10' VSPACE='5'>"+
			              "<br><br>Further reading:<a target='_blank' href='https://www.nationalgeographic.org/article/do-changes-our-climate-mean-more-hurricanes/'>Do changes in climate mean more hurricanes?</a>";

			 overlay_on();
		         asAlertMsg({
                            type: "default",
                            title: "Global temperature change now 1°C",
                            message: message_1_deg,
                            button: {
                              title: "Close Button",
                              bg: "default"
                            }
                         });
	      }


	      if(two_degree_alert==0 && t5>=2.0 && t5<=2.5 && start_year_set>0 && pop_ups!=0 && as_alert_open==0 && (year_counter+1960)<2100 ) { // if temperature change hits 2 C
			two_degree_alert=1;
		        message_2_deg="The global temperature change has now crossed 2.0 °C." +
			              "The upper climate target for the 2015 Paris Accord has now been exceeded."+
			              "<br><br>Effects of climate change are obvious everywhere. The warming in high latitude northern "+
			              "countries has now surpassed 3-4 °C. "+
			              "<br><br>Forest fires are now very common in Australia, United States, and even colder countries like Canada and Russia. "+
			              "<br><img class='image1' src='images2/fires_01.png' HSPACE='10' VSPACE='5'"+
			              "<br><br>Further reading:<a target='_blank' href='https://www.nationalgeographic.com/science/2020/09/climate-change-increases-risk-fires-western-us/'>The science connecting wildfires to climate change</a>";

			 overlay_on();
		         asAlertMsg({
                            type: "default",
                            title: "Global temperature change now 2°C",
                            message: message_2_deg,
                            button: {
                              title: "Close Button",
                              bg: "default"
                            }
                         });
	      }



	


	      if (start_year_set==0) {
		      start_year_set=1;
		      m1=year_counter+1960;
		      str7="<img class='image1' src='images2/economic_growth_01.png' width=180 align=left valign=top HSPACE='10' VSPACE='5' border=2>"+
			      "Starting your simulation in "+m1+". The world has warmed up by "+t5+" °C.<br><br>"+
			      "Now choose <b>a percentage of global economy to be invested in renewable energy</b>, which "+
			      "you may choose to be different for each decade, as the "+
		            "simulation progresses one decade at a time. <br><br> "+
			    "Typically, the investment in the energy sector is about 3-5% of the total economy. "+
			    "<br><br>Higher investment in renewable energy implies lower increase in fossil fuel emissions, " +
		            "mitigating climate change, but the economy will grow at a slower rate. "+
			      "<br><br><b>What would you save - the global economy or the planet?</b>";

                      if (pop_ups!=0) {
			 overlay_on();
		         asAlertMsg({
                            type: "default",
                            title: "Instructions to continue",
                            message: str7,
                            button: {
                              title: "Close Button",
                              bg: "default"
                            }
                         });
	              }
	      }

	      // end message

	      if (start_year_set!=0 && ( (year_counter+1960)>=2100 ) && pop_ups!=0 ) {
		   bgwp=base_scenario_gwp_total_at_2100.toFixed(1);
		   cgwp=current_gwp_total_value.toFixed(1);

		   percent_diff_gwp=(bgwp-cgwp)*100.0/bgwp;
		   percent_diff_gwp=percent_diff_gwp.toFixed(1);


                   delta_t_diff=btc-t2; // baseline minus user scenario
		   delta_t_diff=delta_t_diff.toFixed(1);

	           end_message_2= "<br><br>Compared to the base scenario which warmed by "+btc.toString()+" °C by 2100, your scenario warmed by "
	           +t2.toString()+" °C.";
	           if ( t2>3.5 ) {
	                   end_message_3 = "<br><br>Unfortunately, your scenario has warmed a lot more more than 2 °C the target for the 2015 Paris Accord. <b>Your efforts to mitigate climate change were not successful.</b>";
		   } else if ( t2>2.5 && t2 <=3.5 ) {
	                   end_message_3 = "<br><br>Unfortunately, your scenario has warmed up more more than 2 °C the target for the 2015 Paris Accord. <b>You mitigated some climate change but the Earth has still warmed up quite a bit.</b> ";
		   } else if ( t2>2.0 && t2 <=2.5 ) {
	                   end_message_3 = "<br><br>Your scenario has warmed up a little above the 2 °C the target for the 2015 Paris Accord. <b>You did well to mitigate climate change.</b>";
		   } else if (t2 <=2) {
	                   end_message_3 = "<br><br>Congratulations! You managed to keep the temperature increase below or at 2 °C, the target for the 2015 Paris Accord. <b>You saved the planet!</b>" ;
		   }


		   if (percent_diff_gwp <= 10 ) {
	                   end_message_4 = "<br><br>The year 2100 gross world product (GWP) in your scenario is only "+percent_diff_gwp+"% lower than that in the "+
				   "baseline scenario ("+bgwp+" Trillion $/year). <b>You managed to save the economy!</b> ";
		   } else if (percent_diff_gwp > 10 && percent_diff_gwp <= 35) {
	                   end_message_4 = "<br><br>The year 2100 gross world product (GWP) in your scenario is "+percent_diff_gwp+"% lower than that in the "+
				   "baseline scenario ("+bgwp+" Trillion $/year). <b>The global economy took some hit in your scenario.</b>";
		   } else if (percent_diff_gwp > 35 ) {
	                   end_message_4 = "<br><br>The year 2100 gross world product (GWP) in your scenario is "+percent_diff_gwp+"% lower than that in the "+
				   "baseline scenario ("+bgwp+" Trillion $/year). <b>You tanked the global economy in your scenario!</b>";
		   }

		   end_message = end_message_1 + end_message_2 + end_message_4 + end_message_3;

		   asAlertMsg({
                      type: "success",
                      title: "Simulation over!",
                      message: end_message,
                      button: {
                        title: "Close Button",
                        bg: "success"
                      }
                   });
	      }

              $("#start_year_div").fadeOut();
              $("#start_year_div").removeClass("d-block");
              $("#start_year_div").addClass("d-none");
              $("#gdp_in_lce_div").fadeIn(1000);
              $("#gdp_in_lce_div").removeClass("d-none");
              $("#gdp_in_lce_div").addClass("d-block");

}



