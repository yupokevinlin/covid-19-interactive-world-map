import {
  ServerDailyCasesDataObject,
  ServerTimeSeriesCasesData,
  ServerTimeSeriesCasesDataObject
} from "../../../../shared/types/data/Cases/CasesTypes";

const csv = require("csv-string");
const axios = require('axios').default;


export namespace CasesUtils {
  const layer0CasesTimeSeries: ServerTimeSeriesCasesDataObject = {};
  const layer1CasesTimeSeries: ServerTimeSeriesCasesDataObject = {};
  const layer2CasesTimeSeries: ServerTimeSeriesCasesDataObject = {};
  export const getCasesTimeSeries = async (): Promise<boolean> => {
    const confirmedCasesUrl: string = "https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_19-covid-Confirmed.csv&filename=time_series_2019-ncov-Confirmed.csv";
    const deathsUrl: string = "https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_19-covid-Deaths.csv&filename=time_series_2019-ncov-Deaths.csv";
    const recoveredCasesUrl: string = "https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_19-covid-Recovered.csv&filename=time_series_2019-ncov-Recovered.csv";

    const confirmedCasesResult: any = await axios.get(confirmedCasesUrl);
    const confirmedCasesResultCsvString: string = confirmedCasesResult.data;
    const confirmedCasesResultArray: Array<Array<string>> = csv.parse(confirmedCasesResultCsvString);
    const deathsResult: any = await axios.get(deathsUrl);
    const deathsResultCsvString: string = deathsResult.data;
    const deathsResultArray: Array<Array<string>> = csv.parse(deathsResultCsvString);
    const recoveredCasesResult: any = await axios.get(recoveredCasesUrl);
    const recoveredCasesResultCsvString: string = recoveredCasesResult.data;
    const recoveredCasesResultArray: Array<Array<string>> = csv.parse(recoveredCasesResultCsvString);

    confirmedCasesResultArray.forEach((row, rowIndex) => {
      if (rowIndex > 0) {
        const name: Array<string> = nameConverter(row[0], row[1]);
        const nameString: string = JSON.stringify(name);
        const confirmedCasesRow: Array<string> = row;
        const deathsRow: Array<string> = deathsResultArray.find(deathsResultRow => deathsResultRow[0] === confirmedCasesRow[0] && deathsResultRow[1] === confirmedCasesRow[1]) || [];
        const recoveredCasesRow: Array<string> = recoveredCasesResultArray.find(recoveredCasesResultRow => recoveredCasesResultRow[0] === confirmedCasesRow[0] && recoveredCasesResultRow[1] === confirmedCasesRow[1]) || [];
        const dailyCasesDataObject: ServerDailyCasesDataObject = {};
        for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
          if (columnIndex > 3) {
            const date: string = confirmedCasesResultArray[0][columnIndex];
            dailyCasesDataObject[date] = {
              date: date,
              deaths: parseInt(deathsRow[columnIndex]),
              confirmedCases: parseInt(confirmedCasesRow[columnIndex]),
              recoveredCases: parseInt(recoveredCasesRow[columnIndex])
            }
          }
        }
        switch (name.length) {
          case 1: {
            if (layer0CasesTimeSeries[nameString]) {
              const newDailyCasesDataObject: ServerDailyCasesDataObject = {};
              Object.entries(layer0CasesTimeSeries[nameString].data).forEach(([key, entry]) => {
                newDailyCasesDataObject[key] = {
                  date: entry.date,
                  confirmedCases: entry.confirmedCases + (dailyCasesDataObject[key].confirmedCases || 0),
                  deaths: entry.deaths + (dailyCasesDataObject[key].deaths || 0),
                  recoveredCases: entry.recoveredCases + (dailyCasesDataObject[key].recoveredCases || 0),
                }
              });
              layer0CasesTimeSeries[nameString] = {
                ...layer0CasesTimeSeries[nameString],
                data: newDailyCasesDataObject
              };
            } else {
              layer0CasesTimeSeries[nameString] = {
                name: name,
                hasChildren: false,
                data: dailyCasesDataObject
              };
            }
            break;
          }
          case 2: {
            layer1CasesTimeSeries[nameString] = {
              name: name,
              hasChildren: false,
              data: dailyCasesDataObject
            };
            const parentName: Array<string> = [name[0]];
            const parentNameString: string = JSON.stringify(parentName);
            if (layer0CasesTimeSeries[parentNameString]) {
              const newDailyCasesDataObject: ServerDailyCasesDataObject = {};
              Object.entries(layer0CasesTimeSeries[parentNameString].data).forEach(([key, entry]) => {
                newDailyCasesDataObject[key] = {
                  date: entry.date,
                  confirmedCases: entry.confirmedCases + (dailyCasesDataObject[key].confirmedCases || 0),
                  deaths: entry.deaths + (dailyCasesDataObject[key].deaths || 0),
                  recoveredCases: entry.recoveredCases + (dailyCasesDataObject[key].recoveredCases || 0),
                }
              });
              layer0CasesTimeSeries[parentNameString] = {
                ...layer0CasesTimeSeries[parentNameString],
                data: newDailyCasesDataObject
              };
            } else {
              layer0CasesTimeSeries[parentNameString] = {
                name: parentName,
                hasChildren: false,
                data: dailyCasesDataObject
              };
            }
            break;
          }
          case 3: {
            layer2CasesTimeSeries[nameString] = {
              name: name,
              hasChildren: false,
              data: dailyCasesDataObject
            };
            break;
          }
        }
      }
    });
    return true;
  };

  export const nameConverter = (country: string, region: string): Array<string> => {
    const countryNameTranslation: any = {
      "Bahamas, The": "Bahamas",
      "Cabo Verde": "Cape Verde",
      "Congo (Brazzaville)": "Congo",
      "Congo (Kinshasa)": "Congo, the Democratic Republic of the",
      "Cote d'Ivoire": "Cote D'Ivoire",
      "Czechia": "Czech Republic",
      "Eswatini": "Swaziland",
      "Gambia, The": "Gambia",
      "Holy See": "Holy See (Vatican City State)",
      "Korea, South": "South Korea",
      "North Macedonia": "North Macedonia, Republic of",
      "Russia": "Russian Federation",
      "Taiwan*": "Taiwan",
      "Tanzania": "Tanzania, United Republic of",
      "US": "United States of America",
    };
    const usStates: any = {
      "AL": "Alabama",
      "AK": "Alaska",
      "AZ": "Arizona",
      "AR": "Arkansas",
      "CA": "California",
      "CO": "Colorado",
      "CT": "Connecticut",
      "DE": "Delaware",
      "FL": "Florida",
      "GA": "Georgia",
      "HI": "Hawaii",
      "ID": "Idaho",
      "IL": "Illinois",
      "IN": "Indiana",
      "IA": "Iowa",
      "KS": "Kansas",
      "KY": "Kentucky",
      "LA": "Louisiana",
      "ME": "Maine",
      "MD": "Maryland",
      "MA": "Massachusetts",
      "MI": "Michigan",
      "MN": "Minnesota",
      "MS": "Mississippi",
      "MO": "Missouri",
      "MT": "Montana",
      "NE": "Nebraska",
      "NV": "Nevada",
      "NH": "New Hampshire",
      "NJ": "New Jersey",
      "NM": "New Mexico",
      "NY": "New York",
      "NC": "North Carolina",
      "ND": "North Dakota",
      "OH": "Ohio",
      "OK": "Oklahoma",
      "OR": "Oregon",
      "PA": "Pennsylvania",
      "RI": "Rhode Island",
      "SC": "South Carolina",
      "SD": "South Dakota",
      "TN": "Tennessee",
      "TX": "Texas",
      "UT": "Utah",
      "VT": "Vermont",
      "VA": "Virginia",
      "WA": "Washington",
      "WV": "West Virginia",
      "WI": "Wisconsin",
      "WY": "Wyoming"
    };
    let newCountryName: string = countryNameTranslation[country] ? countryNameTranslation[country] : country;
    let newRegionName: string = region;
    let newDistrictName: string = "";
    if (newCountryName === "United States of America") {
      const regionNameArray: Array<string> = region.split(",");
      if (regionNameArray.length === 2) {
        const usStateCode: string = regionNameArray[0].trim();
        newRegionName = usStates[usStateCode];
        newDistrictName = regionNameArray[1].replace("County", "").trim();
      }
    }
    switch (region) {
      case "From Diamond Princess": {
        newRegionName = "Cruise Ship";
        break;
      }
      case "Grand Princess": {
        newRegionName = "Cruise Ship";
        break;
      }
      case "Hong Kong": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "Macau": {
        newCountryName = "Macao";
        newRegionName = "";
        break;
      }
      case "Faroe Islands": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "Greenland": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "France": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "St Martin": {
        newCountryName = "Saint Martin (French part)";
        newRegionName = "";
        break;
      }
      case "Saint Barthelemy": {
        newCountryName = "Saint Barthélemy";
        newRegionName = "";
        break;
      }
      case "French Polynesia": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "French Guiana": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "Mayotte": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "Guadeloupe": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "Reunion": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "New Caledonia": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "Netherlands": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "Curacao": {
        newCountryName = "Curaçao";
        newRegionName = "";
        break;
      }
      case "Aruba": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "Sint Maarten": {
        newCountryName = "Sint Maarten (Dutch part)";
        newRegionName = "";
        break;
      }
      case "Channel Islands": {
        newRegionName = "";
        break;
      }
      case "Gibraltar": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "United Kingdom": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "Cayman Islands": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "Montserrat": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "Bermuda": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "Isle of Man": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "Guam": {
        newCountryName = region;
        newRegionName = "";
        break;
      }
      case "Virgin Islands": {
        newCountryName = "Virgin Islands, U.S.";
        newRegionName = "";
        break;
      }
      default: {

      }
    }
    const returnArray: Array<string> = [newCountryName];
    if (!!newRegionName) {
      returnArray.push(newRegionName);
    }
    if (!!newRegionName && !!newDistrictName) {
      returnArray.push(newDistrictName);
    }
    return returnArray;
  };
}