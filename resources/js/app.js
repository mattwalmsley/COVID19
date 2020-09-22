const area_name_element = document.querySelector(".area .name");
const daily_cases_element = document.querySelector(".daily-cases .value");
const uk_cases_daily_element = document.querySelector(".daily-cases .uk-cases-daily");
const total_active_element = document.querySelector(".active .value");
const old_active_element = document.querySelector(".active .old-value");
const total_cases_element = document.querySelector(".total-cases .value");
const uk_cases_total_element = document.querySelector(".total-cases .uk-cases-total");
const days_element = document.querySelector(".days .value");
const last_updated_element = document.querySelector(".last-updated .value");
const location_result_element = document.querySelector(".location-result .value");
const go_btn = document.querySelector(".go");
const increasing_element = document.querySelector(".days .increasing");
const decreasing_element = document.querySelector(".days .decreasing");
const no_change_element = document.querySelector(".days .no-change");

const ctx = document.getElementById("axes_line_chart").getContext("2d");

var specimenDates = [],
	dailyCases = [],
	totalCases = [];

var areaName,
	url,
	lastUpdate,
	ukCasesDaily,
	ukCasesTotal;

fetchData(area = "England")

function updateUI(){
	updateStats();
	axesLinearChart();
}

function updateStats() {
	increasing_element.innerHTML = null;
	decreasing_element.innerHTML = null;
	no_change_element.innerHTML = null;

	let latest_entry_totalCases = totalCases[0];

	let active_cases = dailyCases.slice(0,7).reduce(function(a, b){return a + b}, 0);
	let active_cases_last_week = dailyCases.slice(7,14).reduce(function(a, b){return a + b}, 0);

	function checkCases(cases) {return cases > 0};
	let days_without_case = dailyCases.indexOf(dailyCases.find(checkCases));

	area_name_element.innerHTML = areaName;

	function thousands_separators(num) {
		var num_parts = num.toString().split(".");
		num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return num_parts.join(".");
	}

	daily_cases_element.innerHTML = thousands_separators(dailyCases[0]);
	uk_cases_daily_element.innerHTML = ("(UK: " + thousands_separators(ukCasesDaily) + ")");

	total_active_element.innerHTML = thousands_separators(active_cases);
	old_active_element.innerHTML = (thousands_separators(active_cases_last_week) + " Last Week");

	total_cases_element.innerHTML = thousands_separators(latest_entry_totalCases);
	uk_cases_total_element.innerHTML = ("(UK: " + thousands_separators(ukCasesTotal) + ")");

	if (days_without_case === 1){days = " Day"}else days = " Days";
	if (days_without_case === -1){days_without_case = 0};
	days_element.innerHTML = ((days_without_case) + days);

	active_cases_three_to_nine_days_ago = dailyCases.slice(3,10).reduce(function(a, b){return a + b}, 0);
	active_cases_ten_to_sixteen_days_ago = dailyCases.slice(10,17).reduce(function(a, b){return a + b}, 0);

	percentage_change =  100 * ( ( ( active_cases_three_to_nine_days_ago -  active_cases_ten_to_sixteen_days_ago ) / 7 ) / ( active_cases_ten_to_sixteen_days_ago / 7) );

	if (percentage_change > 0.5){
		increasing_element.innerHTML = (percentage_change.toFixed(0) + "% Increase in Daily Cases");
	}

	else if (percentage_change < -0.5){
	decreasing_element.innerHTML = (-1*percentage_change.toFixed(0) + "% Decrease in Daily Cases");
	}

	else if (percentage_change >= -0.5 && percentage_change <= 0.5){
		no_change_element.innerHTML = ("No % Change in Daily Cases");
	}

	last_updated_element.innerHTML = ("Last Updated " + moment(lastUpdate).format(("MMMM Do YYYY, HH:mm")));

}

let my_chart;
function axesLinearChart(){

	if(my_chart){
		my_chart.destroy();
	}
	

	my_chart = new Chart(ctx, {
		type: 'bar',
		data: {
			datasets: [{
				label: 'Daily Cases',
				data: dailyCases,
				fill: false,
				backgroundColor: 'rgba(255,0,0,1)',
				hoverBackgroundColor: 'rgba(255,255,255,1)',
				order: 1
			}, {
				label: 'Total Cases',
				data: totalCases,
				type: 'line',
				fill: 'origin',
				backgroundColor: 'rgba(255,255,0,0.2)',
				borderColor: 'rgba(255,255,0,1)',
				borderWidth: 1,
				pointStyle: 'circle',
				pointRadius: 2,
				pointBackgroundColor: 'rgba(255,255,0,0.75)',	
				pointBorderColor: 'rgba(255,255,0,0.75)',	
				pointHoverRadius: 7.5,
				pointHoverBackgroundColor: 'rgba(255,255,0,1)',
				order: 2
			}],
			labels: specimenDates
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			legend: {
				display: true,
				labels: {
					fontColor: 'rgb(255,255,255,1)',
					usePointStyle: true,
					padding: 20
				}
			},
			tooltips: {
				mode: 'index',
				position: 'nearest',
				callbacks: {
					title: function(tooltipItem, data) {
						var title = data.labels[tooltipItem[0].index];
						title = moment(title).format("MMM DD YYYY");
						return title;
					}
				}
			},
			scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'week'
                    }
            }]
        }
		}
	});
}

function fetchData(area){
	location_result_element.innerHTML = null;
	area_name_element.innerHTML = "Loading...";

	specimenDates = [],	dailyCases = [], totalCases = [], url = null;
	let ltla_lowercase = ltla.map(area => area.toLowerCase());
	let regions_lowercase = regions.map(area => area.toLowerCase());
	if(ltla_lowercase.includes(area.toLowerCase())){
		url = (
			'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=ltla;areaName=' + 
			area + 
			'&structure={"date":"date","areaName":"areaName","newCasesBySpecimenDate":"newCasesBySpecimenDate","cumCasesBySpecimenDate":"cumCasesBySpecimenDate"}'
			)
	}
	else if(regions_lowercase.includes(area.toLowerCase())){
		url = (
			'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=region;areaName=' + 
			area + 
			'&structure={"date":"date","areaName":"areaName","newCasesBySpecimenDate":"newCasesBySpecimenDate","cumCasesBySpecimenDate":"cumCasesBySpecimenDate"}'
			)
	}
	else if((area.toLowerCase()) === "england"){
		url = (
			'https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=nation;areaName=' + 
			area + 
			'&structure={"date":"date","areaName":"areaName","newCasesBySpecimenDate":"newCasesBySpecimenDate","cumCasesBySpecimenDate":"cumCasesBySpecimenDate"}'
			)
	}

	fetch('https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=overview&structure={"newCasesByPublishDate":"newCasesByPublishDate","cumCasesByPublishDate":"cumCasesByPublishDate"}&latestBy=date')
	.then( response => {
		return response.json();
	})
	.then( data => {
		cases = data.data[0];

		ukCasesDaily = cases.newCasesByPublishDate;
		ukCasesTotal = cases.cumCasesByPublishDate;
	})
	.then(() => fetch(url))
	.then( response => {
		lastUpdate = response.headers.get('Last-Modified');
		return response.json();
	})
	.then( data => {
		cases = data.data;

		areaName = cases[0].areaName;

		cases.forEach( entry => {
			specimenDates.push(moment(entry.date, "YYYY-MM-DD"))
		});

		cases.forEach( entry => {
			dailyCases.push(entry.newCasesBySpecimenDate)
		});

		cases.forEach( entry => {
			totalCases.push(entry.cumCasesBySpecimenDate)
		});
	})
	.then(() => {
		updateUI(area);
	})
	.catch( error => {
		console.log("Error:", error);
	});
	
}
let user_area
function findLocation() {
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			fetch("https://api.postcodes.io/postcodes?lon=" + position.coords.longitude + "&lat=" + position.coords.latitude)
			.then( response => {
				return response.json();
			})
			.then (data => {
			user_area = data.result[0].admin_district;
			})
			.then(() => fetchData(user_area))
			.catch( error => {
				console.log("Error:", error);
				fetchData("England");
			});
		});
	}
	else {fetchData("England");
	};
};

function pressEnter(event){
	var key=event.keyCode || event.which;
	 if (key==13){
		findBySearch(input.value);
		search_area_element.classList.toggle("hide");
	 }
   }

go_btn.addEventListener("click", function(){
	findBySearch(input.value);
	search_area_element.classList.toggle("hide");
});	


function findBySearch(searchTerm) {
	let postcode = searchTerm.replace(/\s/g, '');
	let area_list_cases_lower = area_list_cases.map(area => area.toLowerCase());
	if(area_list_cases_lower.includes(searchTerm.trim().toLowerCase())){
				fetchData(searchTerm.trim())
	}
	else {
		fetch("https://api.postcodes.io/postcodes/" + postcode)
		.then( response => {
			return response.json();
		})
		.then (data => {
			areaByPostcode = data.result.admin_district;
		})
		.then(() => fetchData(areaByPostcode))
		.catch( error => {
			fetchData("England");
			console.log("Error:", error);
			location_result_element.innerHTML = (searchTerm + " Not Found");
		});
	}
}


