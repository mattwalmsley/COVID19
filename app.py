import urllib.request
import json
import numpy as np
import datetime
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from matplotlib.dates import MO

def printResults_Deaths(data):
    theJSON = json.loads(data)
    deaths = []
    dates = []
    cumulative_deaths = []
    area_names = []
    for i in theJSON["countries"]:
        deaths.append((i["areaName"], i["reportingDate"], i["dailyChangeInDeaths"], i["cumulativeDeaths"]))
    for areaName, reportingDate, dailyChangeInDeaths, cumulativeDeaths in deaths:  
        area_names.append(areaName)   
        if areaName == location:
            print(f"Area:{areaName}, Date:{reportingDate}, Change:{dailyChangeInDeaths}, Cumulative Deaths:{cumulativeDeaths}")
            dates.append(reportingDate)
            cumulative_deaths.append(cumulativeDeaths)
    if location in area_names:
        x = [datetime.datetime.strptime(d, '%Y-%m-%d').date() for d in dates]
        y = cumulative_deaths
        plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%a %d-%b-%Y'))
        plt.gca().xaxis.set_major_locator(mdates.WeekdayLocator(MO))
        plt.plot(x,y)
        plt.gcf().autofmt_xdate()
        plt.ylabel('Cumulative Deaths') 
        plt.title(str(location) + ' - Last updated ' + str((datetime.datetime.strptime(dates[0], '%Y-%m-%d')).strftime('%a %d-%b-%Y')))
        plt.xlabel('Date')
        plt.show()
    if location not in area_names:
        print(str(location) + " not found")

def printResults_Cases(data):
    theJSON = json.loads(data) 
    cases = []
    dates = []
    cumulative_confirmed_cases = []
    area_names = []
    for i in theJSON["ltlas"]:
        cases.append((i["areaName"], i["specimenDate"], i["dailyLabConfirmedCases"], i["previouslyReportedDailyCases"],
         i["changeInDailyCases"], i["totalLabConfirmedCases"], i["previouslyReportedTotalCases"], i["changeInTotalCases"], 
         i["dailyTotalLabConfirmedCasesRate"]))
    for areaName, specimenDate, dailyLabConfirmedCases, previouslyReportedDailyCases, changeInDailyCases, totalLabConfirmedCases, \
            previouslyReportedTotalCases, changeInTotalCases, dailyTotalLabConfirmedCasesRate in cases:
        area_names.append(areaName)    
        if areaName == location:
            print(f"Area:{areaName}, Date:{specimenDate}, Daily New Cases:{dailyLabConfirmedCases}, Previously Reported Case:{previouslyReportedDailyCases}, Change:{changeInDailyCases}, Total Confirmed:{totalLabConfirmedCases}, Previously Reported Total Cases:{previouslyReportedTotalCases}, Change:{changeInTotalCases}, Daily total confirmed cases rate:{dailyTotalLabConfirmedCasesRate}")
            dates.append(specimenDate)
            cumulative_confirmed_cases.append(totalLabConfirmedCases)
    if location in area_names:
        x = [datetime.datetime.strptime(d, '%Y-%m-%d').date() for d in dates]
        y = cumulative_confirmed_cases
        plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%a %d-%b-%Y'))
        plt.gca().xaxis.set_major_locator(mdates.WeekdayLocator(MO))
        plt.plot(x,y)
        plt.gcf().autofmt_xdate()
        plt.ylabel('Cumulative Confirmed Cases')
        plt.title(str(location) + ' - Last updated ' + str((datetime.datetime.strptime(dates[0], '%Y-%m-%d')).strftime('%a %d-%b-%Y')))
        plt.xlabel('Date')
        plt.show()
    if location not in area_names:
        print(str(location) + " not found") 
  
def main():
    #URLs for government data
    urlData_Deaths = "https://c19downloads.azureedge.net/downloads/json/coronavirus-deaths_latest.json"
    urlData_Cases = "https://c19downloads.azureedge.net/downloads/json/coronavirus-cases_latest.json"

    webUrl_Deaths = urllib.request.urlopen(urlData_Deaths)
    webUrl_Cases = urllib.request.urlopen(urlData_Cases)
    print ("result code for deaths: " + str(webUrl_Deaths.getcode()) + "result code for cases: " + str(webUrl_Cases.getcode()))
    if (webUrl_Deaths.getcode() == 200 and webUrl_Cases.getcode() == 200):
        data_Deaths = webUrl_Deaths.read()
        data_Cases = webUrl_Cases.read()
        print("Deaths:")
        printResults_Deaths(data_Deaths)
        print ("--------------\n")
        print("Cases:")
        printResults_Cases(data_Cases)
    else:
        print ("Received an error from server, cannot retrieve results " + str(webUrl_Deaths.getcode()) + str(webUrl_Cases.getcode()))

if __name__ == "__main__":
    location = input("Enter Country for Deaths or Borough for Cases:")
    main()
