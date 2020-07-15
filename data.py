import urllib.request
import json
import numpy as np
import datetime
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from matplotlib.dates import MO
from matplotlib.backends.backend_agg import FigureCanvasAgg
from matplotlib.figure import Figure

#URLs for government data
urlData_Deaths = "https://c19downloads.azureedge.net/downloads/json/coronavirus-deaths_latest.json"
urlData_Cases = "https://c19downloads.azureedge.net/downloads/json/coronavirus-cases_latest.json"
webUrl_Deaths = urllib.request.urlopen(urlData_Deaths)
webUrl_Cases = urllib.request.urlopen(urlData_Cases)

#read data
data_Deaths = webUrl_Deaths.read()
data_Cases = webUrl_Cases.read()

#deaths data
theJSON_Deaths = json.loads(data_Deaths)
deaths = []
dates_Deaths = []
cumulative_Deaths = []
area_Names_Deaths = []
for i in theJSON_Deaths["countries"]:
        deaths.append((i["areaName"], i["reportingDate"], i["dailyChangeInDeaths"], i["cumulativeDeaths"]))

#cases data
theJSON_Cases = json.loads(data_Cases) 
cases = []
dates_Cases = []
cumulative_Cases = []
area_Names_Cases = []
for i in theJSON_Cases["ltlas"]:
    cases.append((i["areaName"], i["specimenDate"], i["dailyLabConfirmedCases"], i["previouslyReportedDailyCases"],
        i["changeInDailyCases"], i["totalLabConfirmedCases"], i["previouslyReportedTotalCases"], i["changeInTotalCases"], 
        i["dailyTotalLabConfirmedCasesRate"]))

def printData_Deaths(data):
    for areaName, reportingDate, dailyChangeInDeaths, cumulativeDeaths in deaths:  
        area_Names_Deaths.append(areaName)  
        if areaName == location:
            print(f"Area:{areaName}, Date:{reportingDate}, Change:{dailyChangeInDeaths}, Cumulative Deaths:{cumulativeDeaths}")
            dates_Deaths.append(reportingDate)
            cumulative_Deaths.append(cumulativeDeaths)
            
    if location not in area_Names_Deaths:
        print(str(location) + " not found. Data not shown")
        
def printGraph_Deaths(data):
    if location in area_Names_Deaths:
        x = [datetime.datetime.strptime(d, '%Y-%m-%d').date() for d in dates_Deaths]
        y = cumulative_Deaths
        plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%d-%b'))
        plt.gca().xaxis.set_major_locator(mdates.WeekdayLocator(MO))
        plt.plot(x,y)
        plt.gcf().autofmt_xdate()
        plt.ylabel('Cumulative Deaths', fontsize = 12, fontweight ='bold') 
        plt.title('Total Deaths in ' + str(location) + ': ' + str(cumulative_Deaths[0]) + ' - Last updated ' + str((datetime.datetime.strptime(dates_Deaths[0], '%Y-%m-%d')).strftime('%a %d-%b-%Y')), fontsize = 12, fontweight ='bold')
        plt.xlabel('Date', fontsize = 12, fontweight ='bold')
        plt.show()
    elif location not in area_Names_Deaths:
        print(str(location) + " not found. Graph not shown")

def printGraphPNG_Deaths(data):
    if location in area_Names_Deaths:
        fig = Figure(figsize=[10.0, 8.0])
        ax = fig.add_subplot()
        x = [datetime.datetime.strptime(d, '%Y-%m-%d').date() for d in dates_Deaths]
        y = cumulative_Deaths
        ax.xaxis.set_major_formatter(mdates.DateFormatter('%d-%b'))
        ax.xaxis.set_major_locator(mdates.WeekdayLocator(MO))
        ax.plot(x,y)
        fig.autofmt_xdate()
        ax.set_ylabel('Cumulative Deaths', fontsize = 12, fontweight ='bold') 
        ax.set_title('Total Deaths in ' + str(location) + ': ' + str(cumulative_Deaths[0]) + ' - Last updated ' + str((datetime.datetime.strptime(dates_Deaths[0], '%Y-%m-%d')).strftime('%a %d-%b-%Y')), fontsize = 12, fontweight ='bold')
        ax.set_xlabel('Date', fontsize = 12, fontweight ='bold')
        FigureCanvasAgg(fig).print_png(f'deaths_for_{location}.png', dpi=200)
    if location not in area_Names_Deaths:
        print(str(location) + " not found. Graph PNG not shown")
    if location not in area_Names_Cases and location not in area_Names_Deaths:
        print("Please choose from the following:")
        areas = []
        for areaName,_,_,_ in deaths:
            if areaName not in areas:
                areas.append(areaName)
        for area in sorted(areas):
            print(area)

def printData_Cases(data):
    for areaName, specimenDate, dailyLabConfirmedCases, previouslyReportedDailyCases, changeInDailyCases, totalLabConfirmedCases, \
            previouslyReportedTotalCases, changeInTotalCases, dailyTotalLabConfirmedCasesRate in cases:
        area_Names_Cases.append(areaName)    
        if areaName == location:
            print(f"Area:{areaName}, Date:{specimenDate}, Daily New Cases:{dailyLabConfirmedCases}, Previously Reported Case:{previouslyReportedDailyCases}, Change:{changeInDailyCases}, Total Confirmed:{totalLabConfirmedCases}, Previously Reported Total Cases:{previouslyReportedTotalCases}, Change:{changeInTotalCases}, Daily total confirmed cases rate:{dailyTotalLabConfirmedCasesRate}")
            dates_Cases.append(specimenDate)
            cumulative_Cases.append(totalLabConfirmedCases)
    if location not in area_Names_Cases:
        print(str(location) + " not found. Data not shown")        

def printGraph_Cases(data):
    if location in area_Names_Cases:
        x = [datetime.datetime.strptime(d, '%Y-%m-%d').date() for d in dates_Cases]
        y = cumulative_Cases
        plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%d-%b'))
        plt.gca().xaxis.set_major_locator(mdates.WeekdayLocator(MO))
        plt.plot(x,y)
        plt.gcf().autofmt_xdate()
        plt.ylabel('Cumulative Cases', fontsize = 12, fontweight ='bold')
        plt.title('Total Cases in ' + str(location) + ': ' + str(cumulative_Cases[0]) + ' - Last updated ' + str((datetime.datetime.strptime(dates_Cases[0], '%Y-%m-%d')).strftime('%a %d-%b-%Y')), fontsize = 12, fontweight ='bold')
        plt.xlabel('Date', fontsize = 12, fontweight ='bold')
        plt.show()
    elif location not in area_Names_Cases:
        print(str(location) + " not found. Graph not shown")

def printGraphPNG_Cases(data):
    if location in area_Names_Cases:
        fig = Figure(figsize=[10.0, 8.0])
        ax = fig.add_subplot()
        x = [datetime.datetime.strptime(d, '%Y-%m-%d').date() for d in dates_Cases]
        y = cumulative_Cases
        ax.xaxis.set_major_formatter(mdates.DateFormatter('%d-%b'))
        ax.xaxis.set_major_locator(mdates.WeekdayLocator(MO))
        ax.plot(x,y)
        fig.autofmt_xdate()
        ax.set_ylabel('Cumulative Cases', fontsize = 12, fontweight ='bold') 
        ax.set_title('Total Cases in ' + str(location) + ': ' + str(cumulative_Cases[0]) + ' - Last updated ' + str((datetime.datetime.strptime(dates_Cases[0], '%Y-%m-%d')).strftime('%a %d-%b-%Y')), fontsize = 12, fontweight ='bold')
        ax.set_xlabel('Date', fontsize = 12, fontweight ='bold')
        FigureCanvasAgg(fig).print_png(f'cases_for_{location}.png', dpi=200)
    if location not in area_Names_Cases:
        print(str(location) + " not found. Graph PNG not shown")
    if location not in area_Names_Cases and location not in area_Names_Deaths:
        print("Please choose from the following:")
        areas = []
        for areaName,_,_,_,_,_,_,_,_  in cases:
            if areaName not in areas:
                areas.append(areaName)
        for area in sorted(areas):
            print(area)
        main()
  
def main():
    global location
    location = input("Enter Country for Deaths or Borough for Cases:    ")
    print ("result code for deaths: " + str(webUrl_Deaths.getcode()) + " result code for cases: " + str(webUrl_Cases.getcode()))
    if (webUrl_Deaths.getcode() == 200 and webUrl_Cases.getcode() == 200):
        print("Deaths:")
        printData_Deaths(data_Deaths)
        printGraph_Deaths(data_Deaths)
        printGraphPNG_Deaths(data_Deaths)
        print ("--------------\n")
        print("Cases:")
        printData_Cases(data_Cases)
        printGraph_Cases(data_Cases)
        printGraphPNG_Cases(data_Cases)
        again = input("Find data for another area? Enter Y/N    ")
        if again.lower() == "y":
            main()
        else:
            exit()
    else:
        print ("Received an error from server, cannot retrieve results " + str(webUrl_Deaths.getcode()), str(webUrl_Cases.getcode()))

if __name__ == "__main__":
    main()
