
import {Moment} from "moment";
import {
  ServerCasesDataObject,
  ServerDailyCasesDataObject
} from "../../../../shared/types/data/Cases/CasesTypes";
import {ServerMapPolygon, ServerMapPolygonsObject} from "../../../../shared/types/data/Map/MapTypes";
import {getHierarchicalName} from "../../../../shared/helpers/General";

const csv = require("csv-string");
const axios = require("axios").default;
const moment = require("moment");
const mapLayer0: Array<ServerMapPolygon> = require("../../../../data/map/gadm/gadm36_0_processed_array.json");
const mapLayer1: ServerMapPolygonsObject = require("../../../../data/map/gadm/gadm36_1_processed_object.json");
const mapLayer2: ServerMapPolygonsObject = require("../../../../data/map/gadm/gadm36_2_processed_object.json");

export namespace CasesUtils {
  export const fetchCasesData = async (): Promise<boolean> => {
    const data: ServerCasesDataObject = {};
    const createRegionData = (name: Array<string>, hierarchicalName: string, countryCode: string): void => {
      if (!data[hierarchicalName]) {
        data[hierarchicalName] = {
          name: name,
          hierarchicalName: hierarchicalName,
          countryCode: countryCode,
          data: {},
        }
      }
    };
    const createDailyData = (dailyDataObject: ServerDailyCasesDataObject, date: string): void => {
      if (!dailyDataObject[date]) {
        dailyDataObject[date] = {
          newCases: 0,
          newRecoveries: 0,
          newDeaths: 0,
        }
      }
    };

    const getName = (country: string, province?: string, county?: string): [Array<string>, string, string] => {
      const layer0NameConversionObject: any = {
        "Brunei": "Brunei Darussalam",
        "Burma": "Myanmar",
        "Cabo Verde": "Cape Verde",
        "Congo (Brazzaville)": "Congo",
        "Congo (Kinshasa)": "Congo, the Democratic Republic of the",
        "Cote d'Ivoire": "Cote D'Ivoire",
        "Czechia": "Czech Republic",
        "East Timor": "Timor-Leste",
        "Eswatini": "Swaziland",
        "Gambia, The": "Gambia",
        "Holy See": "Holy See (Vatican City State)",
        "Iran": "Iran, Islamic Republic of",
        "Korea, South": "South Korea",
        "Laos": "Lao People's Democratic Republic",
        "Moldova": "Moldova, Republic of",
        "North Macedonia": "North Macedonia, Republic of",
        "West Bank and Gaza": "Palestinian Territory, Occupied",
        "Russia": "Russian Federation",
        "Syria": "Syrian Arab Republic",
        "Taiwan*": "Taiwan",
        "Tanzania": "Tanzania, United Republic of",
        "US": "United States of America",
      };
      const layer1NameConversionObject: any = {
        "Quebec": "Québec",
        "Macau": "Macao",
        "Tibet": "Xizang",
      };
      const layer2NameConversionObject: any = {

      };

      const layer0NamesToIgnore: Array<string> = ["Diamond Princess", "MS Zaandam"];
      const layer1NamesToIgnore: Array<string> = ["Diamond Princess", "Grand Princess"];

      const getLayer0ConvertedName = (name: string): string => {
        return !!layer0NameConversionObject[name] ? layer0NameConversionObject[name] : name;
      };

      const getLayer1ConvertedName = (name: string | undefined): string | undefined => {
        if (!!name) {
          return !!layer1NameConversionObject[name] ? layer1NameConversionObject[name] : name;
        } else {
          return name;
        }
      };

      const getLayer2ConvertedName = (name: string | undefined): string | undefined => {
        if (!!name) {
          return !!layer2NameConversionObject[name] ? layer2NameConversionObject[name] : name;
        } else {
          return name;
        }
      };

      const layer1SpecialProcessor = (convertedCountry: string, convertedProvince: string): ServerMapPolygon | undefined => {
        switch (convertedCountry) {
          case "China": {
            switch (convertedProvince) {
              case "Hong Kong": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Hong Kong");
              }
              case "Macao": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Macao");
              }
            }
            break;
          }
          case "Denmark": {
            switch (convertedProvince) {
              case "Faroe Islands": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Faroe Islands");
              }
              case "Greenland": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Greenland");
              }
            }
            break;
          }
          case "France": {
            switch (convertedProvince) {
              case "French Guiana": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.French Guiana");
              }
              case "French Polynesia": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.French Polynesia");
              }
              case "Guadeloupe": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Guadeloupe");
              }
              case "Martinique": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Martinique");
              }
              case "Mayotte": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Mayotte");
              }
              case "New Caledonia": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.New Caledonia");
              }
              case "Reunion": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Reunion");
              }
              case "Saint Barthelemy": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Saint Barthélemy");
              }
              case "Saint Pierre and Miquelon": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Saint Pierre and Miquelon");
              }
              case "St Martin": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Saint Martin (French part)");
              }
            }
            break;
          }
          case "Netherlands": {
            switch (convertedProvince) {
              case "Aruba": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Aruba");
              }
              case "Bonaire, Sint Eustatius and Saba": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Bonaire, Sint Eustatius and Saba");
              }
              case "Curacao": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Curaçao");
              }
              case "Sint Maarten": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Sint Maarten (Dutch part)");
              }
            }
            break;
          }
          case "United Kingdom": {
            switch (convertedProvince) {
              case "Anguilla": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Anguilla");
              }
              case "Bermuda": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Bermuda");
              }
              case "British Virgin Islands": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Virgin Islands, British");
              }
              case "Cayman Islands": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Cayman Islands");
              }
              case "Channel Islands": {
                return undefined;
              }
              case "Falkland Islands (Malvinas)": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Falkland Islands (Malvinas)");
              }
              case "Gibraltar": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Gibraltar");
              }
              case "Isle of Man": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Isle of Man");
              }
              case "Montserrat": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Montserrat");
              }
              case "Turks and Caicos Islands": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Turks and Caicos Islands");
              }
            }
            break;
          }
          case "United States of America": {
            switch (convertedProvince) {
              case "American Samoa": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.American Samoa");
              }
              case "Guam": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Guam");
              }
              case "Northern Mariana Islands": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Northern Mariana Islands");
              }
              case "Virgin Islands": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Virgin Islands, U.S.");
              }
              case "Puerto Rico": {
                return mapLayer0.find((layer) => layer.hierarchicalName === "World.Puerto Rico");
              }
            }
          }
        }
        return undefined;
      };

      const layer2NameCorrector = (convertedCountry: string | undefined, convertedProvince: string | undefined, convertedCounty: string | undefined): string | undefined => {
        switch (convertedCountry) {
          case "United States of America": {
            switch (convertedProvince) {
              case "Alabama": {
                switch (convertedCounty) {
                  case "DeKalb": {
                    return "De Kalb";
                  }
                  case "St. Clair": {
                    return "Saint Clair";
                  }
                }
              }
              case "Alaska": {
                switch (convertedCounty) {
                  case "Bristol Bay plus Lake and Peninsula": {
                    return "Bristol Bay";
                  }
                }
              }
              case "Arkansas": {
                switch (convertedCounty) {
                  case "St. Francis": {
                    return "Saint Francis";
                  }
                }
              }
              case "Florida": {
                switch (convertedCounty) {
                  case "DeSoto": {
                    return "Desoto";
                  }
                  case "St. Johns": {
                    return "Saint Johns";
                  }
                  case "St. Lucie": {
                    return "Saint Lucie";
                  }
                }
              }
              case "Illinois": {
                switch (convertedCounty) {
                  case "DeKalb": {
                    return "De Kalb";
                  }
                  case "DuPage": {
                    return "Dupage";
                  }
                  case "LaSalle": {
                    return "La Salle";
                  }
                  case "St. Clair": {
                    return "Saint Clair";
                  }
                }
              }
              case "Indiana": {
                switch (convertedCounty) {
                  case "DeKalb": {
                    return "De Kalb";
                  }
                  case "St. Joseph": {
                    return "Saint Joseph";
                  }
                }
              }
              case "Louisiana": {
                switch (convertedCounty) {
                  case "LaSalle": {
                    return "La Salle";
                  }
                  case "St. Bernard": {
                    return "Saint Bernard";
                  }
                  case "St. Charles": {
                    return "Saint Charles";
                  }
                  case "St. Helena": {
                    return "Saint Helena";
                  }
                  case "St. James": {
                    return "Saint James";
                  }
                  case "St. John the Baptist": {
                    return "Saint John the Baptist";
                  }
                  case "St. Landry": {
                    return "Saint Landry";
                  }
                  case "St. Martin": {
                    return "Saint Martin";
                  }
                  case "St. Mary": {
                    return "Saint Mary";
                  }
                  case "St. Tammany": {
                    return "Saint Tammany";
                  }
                }
              }
              case "Maryland": {
                switch (convertedCounty) {
                  case "St. Mary's": {
                    return "Saint Mary's";
                  }
                }
              }
              case "Michigan": {
                switch (convertedCounty) {
                  case "St. Clair": {
                    return "Saint Clair";
                  }
                  case "St. Joseph": {
                    return "Saint Joseph";
                  }
                }
              }
              case "Minnesota": {
                switch (convertedCounty) {
                  case "St. Louis": {
                    return "Saint Louis";
                  }
                }
              }
              case "Mississippi": {
                switch (convertedCounty) {
                  case "DeSoto": {
                    return "Desoto";
                  }
                }
              }
              case "Missouri": {
                switch (convertedCounty) {
                  case "DeKalb": {
                    return "De Kalb";
                  }
                  case "St. Charles": {
                    return "Saint Charles";
                  }
                  case "St. Clair": {
                    return "Saint Clair";
                  }
                  case "St. Francois": {
                    return "Saint Francois";
                  }
                  case "St. Louis": {
                    return "Saint Louis";
                  }
                  case "Ste. Genevieve": {
                    return "Sainte Genevieve";
                  }
                }
              }
              case "New Mexico": {
                switch (convertedCounty) {
                  case "De Baca": {
                    return "Debaca";
                  }
                }
              }
              case "New York": {
                switch (convertedCounty) {
                  case "St. Lawrence": {
                    return "Saint Lawrence";
                  }
                }
              }
              case "North Dakota": {
                switch (convertedCounty) {
                  case "LaMoure": {
                    return "Lamoure";
                  }
                }
              }
              case "Pennsylvania": {
                switch (convertedCounty) {
                  case "McKean": {
                    return "Mc Kean";
                  }
                }
              }
              case "South Dakota": {
                switch (convertedCounty) {
                  case "Oglala Lakota": {
                    return "Shannon";
                  }
                }
              }
              case "Texas": {
                switch (convertedCounty) {
                  case "DeWitt": {
                    return "Dewitt";
                  }
                }
              }
              case "Wisconsin": {
                switch (convertedCounty) {
                  case "St. Croix": {
                    return "Saint Croix";
                  }
                }
              }
            }
          }
        }
        return convertedCounty;
      };

      const convertedCountry: string = getLayer0ConvertedName(country);
      const convertedProvince: string | undefined = getLayer1ConvertedName(province);
      const convertedCounty: string | undefined = layer2NameCorrector(convertedCountry, convertedProvince, getLayer2ConvertedName(county));
      if (!!convertedCountry && !convertedProvince && !convertedCounty) {
        const layer0Name: Array<string> = ["World", convertedCountry];
        const layer0HierarchicalName: string = getHierarchicalName(layer0Name);
        const layer0MapPolygon: ServerMapPolygon | undefined = mapLayer0.find((mapLayer) => mapLayer.hierarchicalName === layer0HierarchicalName);
        if (layer0MapPolygon) {
          return [layer0MapPolygon.name, layer0MapPolygon.hierarchicalName, layer0MapPolygon.countryCode];
        } else {
          if (!layer0NamesToIgnore.includes(convertedCountry)) {
            console.log(`Unable to find map polygon for country: ${convertedCountry}, province: ${convertedProvince}, county: ${convertedCounty}.`);
          }
          return [[], "", ""];
        }
      } else {
        if (!!convertedCountry && !!convertedProvince && !convertedCounty) {
          const layer0Name: Array<string> = ["World", convertedCountry];
          const layer0HierarchicalName: string = getHierarchicalName(layer0Name);
          const layer1Name: Array<string> = ["World", convertedCountry, convertedProvince];
          const layer1HierarchicalName: string = getHierarchicalName(layer1Name);
          const layer1MapPolygon: ServerMapPolygon | undefined = mapLayer1[layer0HierarchicalName] ? mapLayer1[layer0HierarchicalName].find((mapLayer) => mapLayer.hierarchicalName === layer1HierarchicalName) : undefined;
          if (layer1MapPolygon) {
            return [layer1MapPolygon.name, layer1MapPolygon.hierarchicalName, layer1MapPolygon.countryCode];
          } else {
            if (!layer1NamesToIgnore.includes(convertedProvince)) {
              const specialLayer1MapPolygon: ServerMapPolygon | undefined = layer1SpecialProcessor(convertedCountry, convertedProvince);
              if (specialLayer1MapPolygon) {
                return [specialLayer1MapPolygon.name, specialLayer1MapPolygon.hierarchicalName, specialLayer1MapPolygon.countryCode];
              }
              console.log(`Unable to find map polygon for country: ${convertedCountry}, province: ${convertedProvince}, county: ${convertedCounty}.`);
            }
            return [[], "", ""];
          }
        } else {
          if (!!convertedCountry && !!convertedProvince && !!convertedCounty) {
            const layer1Name: Array<string> = ["World", convertedCountry, convertedProvince];
            const layer1HierarchicalName: string = getHierarchicalName(layer1Name);
            const layer2Name: Array<string> = ["World", convertedCountry, convertedProvince, convertedCounty];
            const layer2HierarchicalName: string = getHierarchicalName(layer2Name);
            const layer2MapPolygon: ServerMapPolygon | undefined = mapLayer2[layer1HierarchicalName] ? mapLayer2[layer1HierarchicalName].find((mapLayer) => mapLayer.hierarchicalName === layer2HierarchicalName) : undefined;
            if (layer2MapPolygon) {
              return [layer2MapPolygon.name, layer2MapPolygon.hierarchicalName, layer2MapPolygon.countryCode];
            } else {
              console.log(`Unable to find map polygon for country: ${convertedCountry}, province: ${convertedProvince}, county: ${convertedCounty}.`);
              return [[], "", ""];
            }
          }
          return [[], "", ""];
        }
      }
    };

    const processUsArray = (array: Array<Array<string>>): Array<Array<string>> => {
      const ignoreUSLayer2 = (convertedProvince: string | undefined, convertedCounty: string | undefined): boolean => {
        switch (convertedProvince) {
          case "Alaska": {
            switch (convertedCounty) {
              case "Bristol Bay":
              case "Kusilvak":
              case "Petersburg":
              case "Prince of Wales-Hyder":
              case "Wrangell":

              case "Hoonah-Angoon": //Valid Counties
              case "Skagway":
              case "Yakutat": {
                return true;
              }
            }
          }
          case "Maryland": {
            switch (convertedCounty) {
              case "Baltimore": //Valid Counties
              case "Baltimore City": {
                return true;
              }
            }
          }
          case "Massachusetts": {
            switch (convertedCounty) {
              case "Dukes and Nantucket": {
                return true;
              }
            }
          }
          case "Michigan": {
            switch (convertedCounty) {
              case "Federal Correctional Institution (FCI)":
              case "Michigan Department of Corrections (MDOC)": {
                return true;
              }
            }
          }
          case "Missouri": {
            switch (convertedCounty) {
              case "Kansas City":

              case "St. Louis": //Valid Counties
              case "St. Louis City": {
                return true;
              }
            }
          }
          case "Puerto Rico": {
            return true; //Valid Counties
          }
          case "Utah": {
            switch (convertedCounty) {
              case "Bear River":
              case "Central Utah":
              case "Southeast Utah":
              case "Southwest Utah":
              case "TriCounty":
              case "Weber-Morgan": {
                return true;
              }
            }
          }
          case "Virginia": {
            switch (convertedCounty) {
              case "Franklin": //Valid Counties
              case "Franklin City":
              case "Richmond":
              case "Richmond City": {
                return true;
              }
            }
          }
        }
        return false;
      };

      const rowLength: number = array[0].length;
      const specialArrayGenerator = (dataArray: Array<Array<string>>, province: string, county?: string): Array<string> => {
        const specialArray: Array<string> = new Array(rowLength).fill("");
        if (!!province) {
          specialArray[6] = province;
        }
        if (!!county) {
          specialArray[5] = county;
        }
        for (let i = 11; i < rowLength; i++) {
          let value: number = 0;
          dataArray.forEach(row => {
            value = value + parseInt(row[i]);
          });
          specialArray[i] = value.toString();
        }
        return specialArray;
      };


      const newArray: Array<Array<string>> = array.filter((row, index) => {
        if (index === 0) {
          return true;
        } else {
          const fips: string = row[4];
          if (!fips) {
            return false;
          }
          const state: string = row[6];
          const county: string = row[5];
          if (!county.includes("Out of") && county !== "Unassigned" && !ignoreUSLayer2(state, county)) {
            return true;
          } else {
            return false;
          }
        }
      });
      const puertoRicoDataArray: Array<Array<string>> = array.filter((row) => row[6] === "Puerto Rico");
      const puertoRicoArray: Array<string> = specialArrayGenerator(puertoRicoDataArray, "Puerto Rico");
      newArray.push(puertoRicoArray);

      const alaskaDataArray: Array<Array<string>> = array.filter((row) => row[6] === "Alaska" && (row[5] === "Hoonah-Angoon" || row[5] === "Skagway" || row[5] === "Yakutat"));
      const alaskaArray: Array<string> = specialArrayGenerator(alaskaDataArray, "Alaska", "Skagway-Yakutat-Angoon");
      newArray.push(alaskaArray);

      const marylandDataArray: Array<Array<string>> = array.filter((row) => row[6] === "Maryland" && (row[5] === "Baltimore" || row[5] === "Baltimore City"));
      const marylandArray: Array<string> = specialArrayGenerator(marylandDataArray, "Maryland", "Baltimore");
      newArray.push(marylandArray);

      const missouriDataArray: Array<Array<string>> = array.filter((row) => row[6] === "Missouri" && (row[5] === "St. Louis" || row[5] === "St. Louis City"));
      const missouriArray: Array<string> = specialArrayGenerator(missouriDataArray, "Missouri", "St. Louis");
      newArray.push(missouriArray);

      const virginiaFranklinDataArray: Array<Array<string>> = array.filter((row) => row[6] === "Virginia" && (row[5] === "Franklin" || row[5] === "Franklin City"));
      const virginiaFranklinArray: Array<string> = specialArrayGenerator(virginiaFranklinDataArray, "Virginia", "Franklin");
      newArray.push(virginiaFranklinArray);

      const virginiaRichmondDataArray: Array<Array<string>> = array.filter((row) => row[6] === "Virginia" && (row[5] === "Richmond" || row[5] === "Richmond City"));
      const virginiaRichmondArray: Array<string> = specialArrayGenerator(virginiaRichmondDataArray, "Virginia", "Richmond");
      newArray.push(virginiaRichmondArray);

      return newArray;
    };


    const globalNewCasesArray: Array<Array<string>> = await getCsvArray("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv");
    const globalDeathsArray: Array<Array<string>> = await getCsvArray("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv");
    const globalRecoveredArray: Array<Array<string>> = await getCsvArray("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv");
    const usCasesArray: Array<Array<string>> = processUsArray(await getCsvArray("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"));
    const usDeathsArray: Array<Array<string>> = processUsArray(await getCsvArray("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv"));
    const globalNewCasesFirstRow: Array<string> = globalNewCasesArray[0];
    const firstDateString: string = globalNewCasesFirstRow[4];
    const lastDateString: string = globalNewCasesFirstRow[globalNewCasesFirstRow.length - 1];
    const dateStringArray: Array<string> = getDateStringArray(firstDateString, lastDateString);

    for (let globalNewCasesArrayIndex = 1; globalNewCasesArrayIndex < globalNewCasesArray.length; globalNewCasesArrayIndex++) {
      const row: Array<string> = globalNewCasesArray[globalNewCasesArrayIndex];
      const [name, hierarchicalName, countryCode]: [Array<string>, string, string] = getName(row[1], row[0]);
      if (!!hierarchicalName) {
        createRegionData(name, hierarchicalName, countryCode);
        const dailyCasesData: ServerDailyCasesDataObject = data[hierarchicalName] ? data[hierarchicalName].data : {};
        dateStringArray.forEach((date, index) => {
          createDailyData(dailyCasesData, date);
          dailyCasesData[date] = {
            ...dailyCasesData[date],
            newCases: parseInt(row[index + 4]),
          };
        });
        data[hierarchicalName] = {
          ...data[hierarchicalName],
          data: dailyCasesData,
        };
      }
    }

    for (let globalDeathsArrayIndex = 1; globalDeathsArrayIndex < globalDeathsArray.length; globalDeathsArrayIndex++) {
      const row: Array<string> = globalDeathsArray[globalDeathsArrayIndex];
      const [name, hierarchicalName, countryCode]: [Array<string>, string, string] = getName(row[1], row[0]);
      if (!!hierarchicalName) {
        createRegionData(name, hierarchicalName, countryCode);
        const dailyCasesData: ServerDailyCasesDataObject = data[hierarchicalName] ? data[hierarchicalName].data : {};
        dateStringArray.forEach((date, index) => {
          createDailyData(dailyCasesData, date);
          dailyCasesData[date] = {
            ...dailyCasesData[date],
            newDeaths: parseInt(row[index + 4]),
          };
        });
      }
    }

    for (let globalRecoveredArrayIndex = 1; globalRecoveredArrayIndex < globalRecoveredArray.length; globalRecoveredArrayIndex++) {
      const row: Array<string> = globalRecoveredArray[globalRecoveredArrayIndex];
      const [name, hierarchicalName, countryCode]: [Array<string>, string, string] = getName(row[1], row[0]);
      if (!!hierarchicalName) {
        createRegionData(name, hierarchicalName, countryCode);
        const dailyCasesData: ServerDailyCasesDataObject = data[hierarchicalName] ? data[hierarchicalName].data : {};
        dateStringArray.forEach((date, index) => {
          createDailyData(dailyCasesData, date);
          dailyCasesData[date] = {
            ...dailyCasesData[date],
            newRecoveries: parseInt(row[index + 4]),
          };
        });
        data[hierarchicalName] = {
          ...data[hierarchicalName],
          data: dailyCasesData,
        };
      }
    }

    for (let usCasesArrayIndex = 1; usCasesArrayIndex < usCasesArray.length; usCasesArrayIndex++) {
      const row: Array<string> = usCasesArray[usCasesArrayIndex];
      const [name, hierarchicalName, countryCode]: [Array<string>, string, string] = getName("United States of America", row[6], row[5]);
      if (!!hierarchicalName) {
        createRegionData(name, hierarchicalName, countryCode);
        const dailyCasesData: ServerDailyCasesDataObject = data[hierarchicalName] ? data[hierarchicalName].data : {};
        dateStringArray.forEach((date, index) => {
          createDailyData(dailyCasesData, date);
          dailyCasesData[date] = {
            ...dailyCasesData[date],
            newCases: parseInt(row[index + 11]),
          };
        });
        data[hierarchicalName] = {
          ...data[hierarchicalName],
          data: dailyCasesData,
        };
      }
    }

    for (let usDeathsArrayIndex = 1; usDeathsArrayIndex < usDeathsArray.length; usDeathsArrayIndex++) {
      const row: Array<string> = usDeathsArray[usDeathsArrayIndex];
      const [name, hierarchicalName, countryCode]: [Array<string>, string, string] = getName("United States of America", row[6], row[5]);
      if (!!hierarchicalName) {
        createRegionData(name, hierarchicalName, countryCode);
        const dailyCasesData: ServerDailyCasesDataObject = data[hierarchicalName] ? data[hierarchicalName].data : {};
        dateStringArray.forEach((date, index) => {
          createDailyData(dailyCasesData, date);
          dailyCasesData[date] = {
            ...dailyCasesData[date],
            newDeaths: parseInt(row[index + 12]),
          };
        });
        data[hierarchicalName] = {
          ...data[hierarchicalName],
          data: dailyCasesData,
        };
      }
    }
    return true;
  };

  const getCsvArray = async (url: string): Promise<Array<Array<string>>> => {
    const result: any = await axios.get(url);
    const resultString: string = result.data;
    const resultArray: Array<Array<string>> = csv.parse(resultString);
    return resultArray;
  };

  const getMomentDateFromDateString = (dateString: string): Moment => {
    const dateStringArray: Array<string> = dateString.split("/");
    const dateDay: number = parseInt(dateStringArray[1]);
    const dateMonth: number = parseInt(dateStringArray[0]);
    const dateYear: number = parseInt(`20${dateStringArray[2]}`);
    const date: Moment = moment().date(dateDay).month(dateMonth - 1).year(dateYear).startOf("day");
    return date;
  };

  const getDateStringArray = (firstDateString: string, lastDateString: string): Array<string> => {
    const dateStringArray: Array<string> = [];
    const firstDate: Moment = getMomentDateFromDateString(firstDateString);
    const lastDate: Moment = getMomentDateFromDateString(lastDateString);
    const dateDifference: number = lastDate.diff(firstDate, "days");
    for (let dateIndex = 0; dateIndex < dateDifference; dateIndex++) {
      if (dateIndex === 0) {
        const firstDateString: string = firstDate.format("M/D/YY");
        dateStringArray.push(firstDateString);
      }
      firstDate.add(1, "days");
      const newDateString: string = firstDate.format("M/D/YY");
      dateStringArray.push(newDateString);
    }
    return dateStringArray;
  };
}