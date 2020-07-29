let area_list_cases = [];
const search_area_element = document.querySelector(".search-area");
const area_list_cases_element = document.querySelector(".area-list-cases");
const change_area_button = document.querySelector(".change-area");
const close_list_btn = document.querySelector(".close");
const input = document.getElementById('search-input');

function createAreaList(){
    let ul_list_id;

    area_list_cases.forEach( (area, index) => {
        if(index == 0){
            ul_list_id = `list-${2}`;
            area_list_cases_element.innerHTML = `<ul id='${ul_list_id}'></ul>`;
        }
        else if(index < 10){
            ul_list_id = `list-${1}`;
            area_list_cases_element.innerHTML += `<ul id='${ul_list_id}'></ul>`;
        }
        else{
            ul_list_id = `list-${0}`;
            area_list_cases_element.innerHTML += `<ul id='${ul_list_id}'></ul>`;
        }
        document.getElementById(`${ul_list_id}`).innerHTML += `
            <li onclick="fetchData('${area}')" id="${area}">
            ${area}
            </li>
        `;
    });
};

change_area_button.addEventListener("click", function(){
    input.value = "";
    resetAreaList();
    search_area_element.classList.toggle("hide");
    search_area_element.classList.add("fadeIn");
});
close_list_btn.addEventListener("click", function(){
    search_area_element.classList.toggle("hide");
});
area_list_cases_element.addEventListener("click", function(){
    search_area_element.classList.toggle("hide");
});

input.addEventListener("input", function(){
    let value = input.value.toUpperCase();

    area_list_cases.forEach( area => {
        if(area.toUpperCase().startsWith(value)){
            document.getElementById(area).classList.remove("hide")}
        else if(area.toUpperCase().includes(" " + value)){
            document.getElementById(area).classList.remove("hide");
        }else{
            document.getElementById(area).classList.add("hide");
        };
    });
});

function resetAreaList(){
    area_list_cases.forEach( area => {
        document.getElementById(area).classList.remove("hide");
    });
}

fetch("https://c19downloads.azureedge.net/downloads/json/coronavirus-cases_latest.json")
.then( response => {
    return response.json();
})
.then( areas => {
    england_entries =  areas.countries;
    region_entries =  areas.regions;
    borough_entries = areas.ltlas;
    let countries = [];
    let regions = [];
    let boroughs = [];

    england_entries.forEach( entry => {
        countries.push(entry.areaName)
    });
    region_entries.forEach( entry => {
        regions.push(entry.areaName)
    });
    borough_entries.forEach( entry => {
        boroughs.push(entry.areaName)
    });

    let unique_countries = [...new Set(countries)];
    let unique_regions = [...new Set(regions)];
    let unique_boroughs = [...new Set(boroughs)];

    unique_countries.forEach( entry => {
        area_list_cases.push(entry)
    });
    unique_regions.sort().forEach( entry => {
        area_list_cases.push(entry)
    });
    unique_boroughs.sort().forEach( entry => {
        area_list_cases.push(entry)
    });
})
.then(() => createAreaList())
.catch( error => {
    console.log("Error:", error)
})
