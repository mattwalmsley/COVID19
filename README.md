# COVID19
Application to track COVID-19 using data from gov.uk

Deaths are recorded by country (England, Wales, Scotland, Northern Ireland).
Cases are recorded by local administration authority.

data.py is property of Matthew Walmsley 2020.

Python will need to be installed from: https://www.python.org/

Additional librabies will also need installing by running the Command Prompt as an administrator (right click) and running the following commands one by one:
  pip install numpy
  python -m pip install -U pip
  python -m pip install -U matplotlib
 
JSON data from:
Cases: https://c19downloads.azureedge.net/downloads/json/coronavirus-cases_latest.json  
Deaths: https://c19downloads.azureedge.net/downloads/json/coronavirus-deaths_latest.json
Disclaimer: Disclaimer: Deaths and lab-confirmed case counts and rates for England and subnational areas are provided by Public Health England. 
            All data for the rest of the UK are provided by the devolved administrations. Maps include Ordnance Survey data \u00a9 Crown 
            copyright and database right 2020 and Office for National Statistics data \u00a9 Crown copyright and database right 2020.