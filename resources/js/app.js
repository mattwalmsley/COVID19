const area_name_element = document.querySelector(".area .name");
const daily_cases_element = document.querySelector(".daily-cases .value");
const uk_cases_daily_element = document.querySelector(".daily-cases .uk-cases-daily");
const total_active_element = document.querySelector(".active .value");
const old_active_element = document.querySelector(".active .old-value");
const total_cases_element = document.querySelector(".total-cases .value");
const uk_cases_total_element = document.querySelector(".total-cases .uk-cases-total");
const days_element = document.querySelector(".days .value");
const last_updated_element = document.querySelector(".last-updated .value");


const ctx = document.getElementById("axes_line_chart").getContext("2d");

var specimenDates = [],
	dailyCases = [],
	totalCases = [];
var lastUpdate,
	ukCasesDaily,
	ukCasesTotal;

function updateUI(area){
	updateStats(area);
	axesLinearChart();
}

function updateStats(area) {
	let latest_entry_totalCases = totalCases[0];
	let previous_entry_totalCases = totalCases[1];

	let active_cases = dailyCases.slice(0,7).reduce(function(a, b){return a + b}, 0);
	let active_cases_last_week = dailyCases.slice(7,14).reduce(function(a, b){return a + b}, 0);

	function checkCases(cases) {return cases > 0};
	let days_without_case = dailyCases.indexOf(dailyCases.find(checkCases));

	area_name_element.innerHTML = area;

	function thousands_separators(num) {
		var num_parts = num.toString().split(".");
		num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return num_parts.join(".");
	}

	daily_cases_element.innerHTML = thousands_separators(latest_entry_totalCases - previous_entry_totalCases);
	uk_cases_daily_element.innerHTML = ("(UK: " + thousands_separators(ukCasesDaily) + ")");

	total_active_element.innerHTML = thousands_separators(active_cases);
	old_active_element.innerHTML = (thousands_separators(active_cases_last_week) + " Last Week");

	total_cases_element.innerHTML = thousands_separators(latest_entry_totalCases);
	uk_cases_total_element.innerHTML = ("(UK: " + thousands_separators(ukCasesTotal) + ")");

	
	
	if (days_without_case === 1){days = " Day"}else days = " Days";
	if (days_without_case === -1){days_without_case = 0}
	days_element.innerHTML = ((days_without_case) + days);

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

function fetchData(area){
	area_name_element.innerHTML = "Loading...";

	specimenDates = [],	dailyCases = [], totalCases = [];
	


	fetch("https://c19downloads.azureedge.net/downloads/json/coronavirus-cases_latest.json")
	.then( response => {
		return response.json();
	})
	.then( cases => {
		england_entries =  cases.countries;
		region_entries =  cases.regions;
		borough_entries = cases.ltlas;

		let england_cases_data = [];
		england_entries.forEach( entry => {
			england_cases_data.push([entry.areaName, entry.specimenDate, entry.dailyLabConfirmedCases, entry.totalLabConfirmedCases])
		});
		let regions_cases_data = [];
		region_entries.forEach( entry => {
			regions_cases_data.push([entry.areaName, entry.specimenDate, entry.dailyLabConfirmedCases, entry.totalLabConfirmedCases])
		});
		let boroughs_cases_data = [];
		borough_entries.forEach( entry => {
			boroughs_cases_data.push([entry.areaName, entry.specimenDate, entry.dailyLabConfirmedCases, entry.totalLabConfirmedCases])
		});
		
		lastUpdate = moment(cases.metadata.lastUpdatedAt).format();
		ukCasesDaily = cases.dailyRecords.dailyLabConfirmedCases;
		ukCasesTotal = cases.dailyRecords.totalLabConfirmedCases;
		console.log(lastUpdate, ukCasesDaily, ukCasesTotal);

		var cases_data = england_cases_data.concat(regions_cases_data, boroughs_cases_data);

		for ([areaName, specimenDate, dailyLabConfirmedCases, totalLabConfirmedCases] of cases_data) {
			if (areaName == area) {
				specimenDates.push(moment(specimenDate, "YYYY-MM-DD"));
				dailyCases.push(parseInt(dailyLabConfirmedCases));
				totalCases.push(totalLabConfirmedCases);
			}
		} return area
	})
	.then(() => {
		updateUI(area);
	})
	.catch( error => {
		console.log("Error:", error);
	});
};

fetchData(area = "England");
