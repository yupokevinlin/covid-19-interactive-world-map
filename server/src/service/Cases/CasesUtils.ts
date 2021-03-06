
import {Moment} from "moment";
import {
  CasesData,
  CasesDataObject,
  CasesInformationDataObject,
  CountriesSummary,
  CasesSummaryData,
  CasesSummaryTypeData,
  CurrentCasesSummary,
  DailyCasesData,
  DailyCasesDataObject,
  DailyCasesInformationData,
  DailyCasesInformationDataObject,
  WorldSummary
} from "../../../../shared/types/data/Cases/CasesTypes";
import {MapPolygon, MapPolygonsObject} from "../../../../shared/types/data/Map/MapTypes";
import {getHierarchicalName, getName, getNameArray} from "../../../../shared/helpers/General";
import {PopulationData, PopulationObject} from "../../../../data/population/type";

const csv = require("csv-string");
const axios = require("axios").default;
const moment = require("moment");
const mapLayer0: Array<MapPolygon> = require("../../../../data/map/gadm/gadm36_0_processed_array.json");
const mapLayer1: MapPolygonsObject = require("../../../../data/map/gadm/gadm36_1_processed_object.json");
const mapLayer2: MapPolygonsObject = require("../../../../data/map/gadm/gadm36_2_processed_object.json");
const worldPopulationObject: PopulationObject = require("../../../../data/population/united-nations-world-population.json");
const earlyCases: Array<any> = require("../../../../data/cases/early-cases.json");

export namespace CasesUtils {
  export let data: CasesDataObject = {};
  export let dailyInfoData: CasesInformationDataObject = {};
  export let weeklyInfoData: CasesInformationDataObject = {};
  export let monthlyInfoData: CasesInformationDataObject = {};
  export let yearlyInfoData: CasesInformationDataObject = {};
  export let summaryData: CurrentCasesSummary | null = null;
  export const fetchCasesData = async (): Promise<boolean> => {
    try {
      data = {};
      const createRegionData = (name: Array<string>, hierarchicalName: string, countryCode: string): void => {
        if (!data[hierarchicalName]) {
          data[hierarchicalName] = {
            name: name,
            hierarchicalName: hierarchicalName,
            countryCode: countryCode,
            isMissingData: false,
            population: 0,
            data: {},
          }
        }
      };
      const createDailyData = (dailyDataObject: DailyCasesDataObject, date: string): void => {
        if (!dailyDataObject[date]) {
          dailyDataObject[date] = {
            totalCases: 0,
            totalRecoveries: 0,
            totalDeaths: 0,
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

        const layer1SpecialProcessor = (convertedCountry: string, convertedProvince: string): MapPolygon | undefined => {
          switch (convertedCountry) {
            case "China": {
              switch (convertedProvince) {
                case "Hong Kong": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Hong Kong");
                }
                case "Macao": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Macao");
                }
              }
              break;
            }
            case "Denmark": {
              switch (convertedProvince) {
                case "Faroe Islands": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Faroe Islands");
                }
                case "Greenland": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Greenland");
                }
              }
              break;
            }
            case "France": {
              switch (convertedProvince) {
                case "French Guiana": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_French Guiana");
                }
                case "French Polynesia": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_French Polynesia");
                }
                case "Guadeloupe": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Guadeloupe");
                }
                case "Martinique": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Martinique");
                }
                case "Mayotte": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Mayotte");
                }
                case "New Caledonia": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_New Caledonia");
                }
                case "Reunion": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Reunion");
                }
                case "Saint Barthelemy": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Saint Barthélemy");
                }
                case "Saint Pierre and Miquelon": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Saint Pierre and Miquelon");
                }
                case "St Martin": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Saint Martin (French part)");
                }
              }
              break;
            }
            case "Netherlands": {
              switch (convertedProvince) {
                case "Aruba": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Aruba");
                }
                case "Bonaire, Sint Eustatius and Saba": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Bonaire, Sint Eustatius and Saba");
                }
                case "Curacao": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Curaçao");
                }
                case "Sint Maarten": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Sint Maarten (Dutch part)");
                }
              }
              break;
            }
            case "United Kingdom": {
              switch (convertedProvince) {
                case "Anguilla": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Anguilla");
                }
                case "Bermuda": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Bermuda");
                }
                case "British Virgin Islands": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Virgin Islands, British");
                }
                case "Cayman Islands": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Cayman Islands");
                }
                case "Channel Islands": {
                  return undefined;
                }
                case "Falkland Islands (Malvinas)": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Falkland Islands (Malvinas)");
                }
                case "Gibraltar": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Gibraltar");
                }
                case "Isle of Man": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Isle of Man");
                }
                case "Montserrat": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Montserrat");
                }
                case "Turks and Caicos Islands": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Turks and Caicos Islands");
                }
              }
              break;
            }
            case "United States of America": {
              switch (convertedProvince) {
                case "American Samoa": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_American Samoa");
                }
                case "Guam": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Guam");
                }
                case "Northern Mariana Islands": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Northern Mariana Islands");
                }
                case "Virgin Islands": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Virgin Islands, U.S.");
                }
                case "Puerto Rico": {
                  return mapLayer0.find((layer) => layer.hierarchicalName === "World_Puerto Rico");
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
          const layer0MapPolygon: MapPolygon | undefined = mapLayer0.find((mapLayer) => mapLayer.hierarchicalName === layer0HierarchicalName);
          if (layer0MapPolygon) {
            return [layer0MapPolygon.name, layer0MapPolygon.hierarchicalName, layer0MapPolygon.countryCode];
          } else {
            console.log(`Unable to find map polygon for country: ${convertedCountry}, province: ${convertedProvince}, county: ${convertedCounty}.`);
            return [[], "", ""];
          }
        } else {
          if (!!convertedCountry && !!convertedProvince && !convertedCounty) {
            const layer0Name: Array<string> = ["World", convertedCountry];
            const layer0HierarchicalName: string = getHierarchicalName(layer0Name);
            const layer1Name: Array<string> = ["World", convertedCountry, convertedProvince];
            const layer1HierarchicalName: string = getHierarchicalName(layer1Name);
            const layer1MapPolygon: MapPolygon | undefined = mapLayer1[layer0HierarchicalName] ? mapLayer1[layer0HierarchicalName].find((mapLayer) => mapLayer.hierarchicalName === layer1HierarchicalName) : undefined;
            if (layer1MapPolygon) {
              return [layer1MapPolygon.name, layer1MapPolygon.hierarchicalName, layer1MapPolygon.countryCode];
            } else {
              const specialLayer1MapPolygon: MapPolygon | undefined = layer1SpecialProcessor(convertedCountry, convertedProvince);
              if (specialLayer1MapPolygon) {
                return [specialLayer1MapPolygon.name, specialLayer1MapPolygon.hierarchicalName, specialLayer1MapPolygon.countryCode];
              } else {
                console.log(`Unable to find map polygon for country: ${convertedCountry}, province: ${convertedProvince}, county: ${convertedCounty}.`);
                return [[], "", ""];
              }
            }
          } else {
            if (!!convertedCountry && !!convertedProvince && !!convertedCounty) {
              const layer1Name: Array<string> = ["World", convertedCountry, convertedProvince];
              const layer1HierarchicalName: string = getHierarchicalName(layer1Name);
              const layer2Name: Array<string> = ["World", convertedCountry, convertedProvince, convertedCounty];
              const layer2HierarchicalName: string = getHierarchicalName(layer2Name);
              const layer2MapPolygon: MapPolygon | undefined = mapLayer2[layer1HierarchicalName] ? mapLayer2[layer1HierarchicalName].find((mapLayer) => mapLayer.hierarchicalName === layer2HierarchicalName) : undefined;
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

      const processGlobalArray = (array: Array<Array<string>>): Array<Array<string>> => {
        const countriesToIgnore: Array<string> = ["Diamond Princess", "MS Zaandam"];
        const provincesToIgnore: Array<string> = ["Diamond Princess", "Grand Princess", "Repatriated Travellers"];
        const populationCountryConversionObject: any = {
          "Burma": "Myanmar",
          "Bolivia": "Bolivia (Plurinational State of)",
          "Brunei": "Brunei Darussalam",
          "Congo (Brazzaville)": "Congo",
          "Congo (Kinshasa)": "Democratic Republic of the Congo",
          "Cote d'Ivoire": "Côte d'Ivoire",
          "Iran": "Iran (Islamic Republic of)",
          "Korea, South": "Republic of Korea",
          "Laos": "Lao People's Democratic Republic",
          "Moldova": "Republic of Moldova",
          "Russia": "Russian Federation",
          "Syria": "Syrian Arab Republic",
          "Taiwan*": "Taiwan",
          "Tanzania": "United Republic of Tanzania",
          "US": "United States of America",
          "Venezuela": "Venezuela (Bolivarian Republic of)",
          "Vietnam": "Viet Nam",
          "West Bank and Gaza": "State of Palestine",
        };
        const populationProvinceConversionObject: any = {
          "Reunion": "Réunion",
          "Saint Barthelemy" : "Saint Barthélemy",
          "St Martin": "Saint Martin (French part)",
          "Curacao": "Curaçao",
          "Sint Maarten": "Sint Maarten (Dutch part)",
        };
        const australiaPopulationObject: any = {
          "Australian Capital Territory": 429800,
          "New South Wales": 8157700,
          "Northern Territory": 245400,
          "Queensland": 5160000,
          "South Australia": 1767200,
          "Tasmania": 539600,
          "Victoria": 6689400,
          "Western Australia": 2656200,
        };
        const canadaPopulationObject: any = {
          "Alberta": 4402045,
          "British Columbia": 5131575,
          "Manitoba": 1377004,
          "New Brunswick": 780040,
          "Newfoundland and Labrador": 523631,
          "Northwest Territories": 45119,
          "Nova Scotia": 975898,
          "Ontario": 14689075,
          "Prince Edward Island": 158629,
          "Quebec": 8556650,
          "Saskatchewan": 1179154,
          "Yukon": 41731,
          "Nunavut": 38726,
        };
        const chinaPopulationObject: any = {
          "Anhui": 59500510,
          "Beijing": 19612368,
          "Chongqing": 28846170,
          "Fujian": 36894216,
          "Gansu": 25575254,
          "Guangdong": 104303132,
          "Guangxi": 46026629,
          "Guizhou": 35806468,
          "Hainan": 9261518,
          "Hebei": 71854202,
          "Heilongjiang": 38312224,
          "Henan": 94023567,
          "Hong Kong": 7061200,
          "Hubei": 57237740,
          "Hunan": 65683722,
          "Inner Mongolia": 24706321,
          "Jiangsu": 78659903,
          "Jiangxi": 44567475,
          "Jilin": 27462297,
          "Liaoning": 43746323,
          "Macau": 552503,
          "Ningxia": 6176900,
          "Qinghai": 5626722,
          "Shaanxi": 37327378,
          "Shandong": 100063065,
          "Shanghai": 23019148,
          "Shanxi": 37022111,
          "Sichuan": 80418200,
          "Tianjin": 12938224,
          "Tibet": 3002166,
          "Xinjiang": 21813334,
          "Yunnan": 45966239,
          "Zhejiang": 54426891,
        };

        const addMissingRows = (oldArray: Array<Array<string>>): Array<Array<string>> => {
          const rowLength: number = oldArray[0].length;
          const completeArray: Array<Array<string>> = oldArray.map(row => [...row]);
          const canadaProvinces: Array<string> = [
            "Alberta",
            "British Columbia",
            "Manitoba",
            "New Brunswick",
            "Newfoundland and Labrador",
            "Northwest Territories",
            "Nova Scotia",
            "Ontario",
            "Prince Edward Island",
            "Quebec",
            "Saskatchewan",
            "Yukon",
            "Nunavut",
          ];

          canadaProvinces.forEach((province) => {
            let isIncluded: boolean = false;
            completeArray.forEach((row) => {
              const completeArrayCountry: string = row[1];
              const completeArrayProvince: string = row[0];
              if (completeArrayCountry === "Canada") {
                if (completeArrayProvince === province) {
                  isIncluded = true;
                }
              }
            });
            if (!isIncluded) {
              const arrayToAdd: Array<string> = [...new Array(4).fill(""), ...new Array(rowLength - 4).fill("0")];
              arrayToAdd[0] = province;
              arrayToAdd[1] = "Canada";
              completeArray.push(arrayToAdd);
            }
          });

          return completeArray;
        };

        const splicedArray: Array<Array<string>> = addMissingRows(array).map((row, index) => {
          if (index === 0) {
            row.splice(4, 0, "Population");
            return row;
          } else {
            row.splice(4, 0, "0");
            return row;
          }
        });

        const rowLength: number = splicedArray[0].length;
        const specialArrayGenerator = (dataArray: Array<Array<string>>, country: string, province?: string): Array<string> => {
          const specialArray: Array<string> = new Array(rowLength).fill("");
          if (!!country) {
            specialArray[1] = country;
          }
          if (!!province) {
            specialArray[0] = province;
          }
          for (let i = 4; i < rowLength; i++) {
            let value: number = 0;
            dataArray.forEach(row => {
              value = value + parseInt(row[i]);
            });
            specialArray[i] = value.toString();
          }
          return specialArray;
        };

        const newArray: Array<Array<string>> = splicedArray.filter((row) => {
          const country: string = row[1];
          if (countriesToIgnore.includes(country)) {
            return false;
          }
          const province: string = row[0];
          if (provincesToIgnore.includes(province)) {
            return false;
          }
          return true;
        });

        newArray.map((row, index) => {
          if (index === 0) {
            return row;
          } else {
            const country: string = populationCountryConversionObject[row[1]] ? populationCountryConversionObject[row[1]] : row[1];
            const province: string = populationProvinceConversionObject[row[0]] ? populationProvinceConversionObject[row[0]] : row[0];
            const populationData: PopulationData | undefined = worldPopulationObject[country];
            let population: number = 0;
            if (province) {
              switch (country) {
                case "Australia": {
                  population = australiaPopulationObject[province];
                  break;
                }
                case "Canada": {
                  population = canadaPopulationObject[province];
                  break;
                }
                case "China": {
                  population = chinaPopulationObject[province];
                  break;
                }
                default: {
                  const specialPopulationData: PopulationData | undefined = worldPopulationObject[province];
                  if (specialPopulationData) {
                    population = specialPopulationData.PopTotal;
                  }
                }
              }
            } else {
              if (populationData) {
                population = populationData.PopTotal;
              }
            }
            if (population === undefined) {
              population = 0;
            }
            if (population === 0) {
              console.log(`Unable to get population for country: ${country}, province: ${province}.`);
            }
            row[4] = population.toString();
            return row;
          }
        });

        const australiaDataArray: Array<Array<string>> = splicedArray.filter((row) => row[1] === "Australia");
        const australiaArray: Array<string> = specialArrayGenerator(australiaDataArray, "Australia");
        newArray.push(australiaArray);

        const canadaDataArray: Array<Array<string>> = splicedArray.filter((row) => row[1] === "Canada");
        const canadaArray: Array<string> = specialArrayGenerator(canadaDataArray, "Canada");
        newArray.push(canadaArray);

        const chinaDataArray: Array<Array<string>> = splicedArray.filter((row) => row[1] === "China" && row[0] !== "Macau" && row[0] !== "Hong Kong");
        const chinaArray: Array<string> = specialArrayGenerator(chinaDataArray, "China");
        newArray.push(chinaArray);

        return newArray;
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
                default: {
                  return false;
                }
              }
            }
            case "Maryland": {
              switch (convertedCounty) {
                case "Baltimore": //Valid Counties
                case "Baltimore City": {
                  return true;
                }
                default: {
                  return false;
                }
              }
            }
            case "Massachusetts": {
              switch (convertedCounty) {
                case "Dukes and Nantucket": {
                  return true;
                }
                default: {
                  return false;
                }
              }
            }
            case "Michigan": {
              switch (convertedCounty) {
                case "Federal Correctional Institution (FCI)":
                case "Michigan Department of Corrections (MDOC)": {
                  return true;
                }
                default: {
                  return false;
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
                default: {
                  return false;
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
                default: {
                  return false;
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
                default: {
                  return false;
                }
              }
            }
            default: {
              return false;
            }
          }
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
            if (!county.includes("Out of") && state !== "Grand Princess" && state !== "Diamond Princess" && county !== "Unassigned" && !ignoreUSLayer2(state, county)) {
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

      const generateUSStatesData = (): void => {
        console.log("Generating US states data...");
        const uniqueStates: Array<string> = [];
        Object.keys(data).forEach((key) => {
          if (key.includes("United States of America")) {
            const name: Array<string> = getNameArray(key);
            if (name.length === 4) {
              const state: string = name[2];
              if (!uniqueStates.includes(state)) {
                uniqueStates.push(state);
              }
            }
          }
        });
        uniqueStates.forEach((uniqueState) => {
          const [name, hierarchicalName, countryCode]: [Array<string>, string, string] = getName("United States of America", uniqueState);
          if (!!hierarchicalName) {
            const matchingCountiesData: Array<CasesData> = [];
            Object.entries(data).forEach(([key, value]) => {
              if (key.includes(hierarchicalName)) {
                matchingCountiesData.push(value);
              }
            });
            createRegionData(name, hierarchicalName, countryCode);
            const dailyCasesData: DailyCasesDataObject = data[hierarchicalName] ? data[hierarchicalName].data : {};
            let population: number = 0;
            matchingCountiesData.forEach((matchingCountyData) => {
              population = population + matchingCountyData.population;
            });
            dateStringArray.forEach((date, index) => {
              createDailyData(dailyCasesData, date);
              let totalCases: number = 0;
              let totalDeaths: number = 0;
              let totalRecoveries: number = 0;
              matchingCountiesData.forEach((matchingCountyData) => {
                totalCases = totalCases + matchingCountyData.data[date].totalCases;
                totalDeaths = totalDeaths + matchingCountyData.data[date].totalDeaths;
                totalRecoveries = totalRecoveries + matchingCountyData.data[date].totalRecoveries;
              });
              dailyCasesData[date] = {
                ...dailyCasesData[date],
                totalCases: totalCases,
                totalDeaths: totalDeaths,
                totalRecoveries: totalRecoveries,
              };
            });
            data[hierarchicalName] = {
              ...data[hierarchicalName],
              population: population,
              data: dailyCasesData,
            };
          }
        });
      };

      const checkData = (): void => {
        console.log("Checking data...");
        //Check if all layers have data.
        const existingLayers: Array<MapPolygon> = [];
        mapLayer0.forEach((layer0) => {
          if (layer0.hasChildren) {
            mapLayer1[layer0.hierarchicalName].forEach((layer1) => {
              if (layer1.hasChildren) {
                mapLayer2[layer1.hierarchicalName].forEach((layer2) => {
                  existingLayers.push(layer2);
                });
              }
              existingLayers.push(layer1);
            });
          }
          existingLayers.push(layer0);
        });
        const dataExistingLayerNames: Array<string> = Object.entries(data).map(([key, data]) => key);

        //Add empty data if missing
        existingLayers.forEach((layer) => {
          if (!dataExistingLayerNames.includes(layer.hierarchicalName)) {
            console.log(`Missing data for layer: ${layer.hierarchicalName}.`);
            createRegionData(layer.name, layer.hierarchicalName, layer.countryCode);
            const dailyCasesData: DailyCasesDataObject = {};
            dateStringArray.forEach((date, index) => {
              createDailyData(dailyCasesData, date);
            });
            data[layer.hierarchicalName] = {
              ...data[layer.hierarchicalName],
              isMissingData: true,
              data: dailyCasesData,
            };
          }
        });
      };

      const fixUSData = (): void => {
        const hierarchicalName: string = "World_United States of America";
        const casesData: CasesData = data[hierarchicalName];
        const dailyCasesDataObject: DailyCasesDataObject = casesData.data;
        const newDailyCasesDataObject: DailyCasesDataObject = {};
        let previousRecoveries: number = 0;
        Object.entries(dailyCasesDataObject).forEach(([date, data], index) => {
          let newRecoveries: number = data.totalRecoveries;
          if (index > 0) {
            if (newRecoveries < previousRecoveries) {
              newRecoveries = previousRecoveries;
            }
            previousRecoveries = newRecoveries;
          }
          newDailyCasesDataObject[date] = {
            totalCases: data.totalCases,
            totalDeaths: data.totalDeaths,
            totalRecoveries: newRecoveries,
          }
        });

        data[hierarchicalName] = {
          ...casesData,
          data: newDailyCasesDataObject,
        }
      };

      const generateWorldData = (): void => {
        console.log("Generating world data...");
        //Generate World Data
        const layer0Data: Array<CasesData> = Object.entries(data).map(([key, data]) => data).filter((data) => getNameArray(data.hierarchicalName).length === 2);
        const worldPopulation: number = layer0Data.map(layer => layer.population).reduce((accumulator, value) => accumulator + value);
        const worldDailyCasesData: DailyCasesDataObject = {};
        dateStringArray.forEach((date, index) => {
          createDailyData(worldDailyCasesData, date);
          layer0Data.forEach((layer0) => {
            worldDailyCasesData[date] = {
              totalCases: worldDailyCasesData[date].totalCases + layer0.data[date].totalCases,
              totalDeaths: worldDailyCasesData[date].totalDeaths + layer0.data[date].totalDeaths,
              totalRecoveries: worldDailyCasesData[date].totalRecoveries + layer0.data[date].totalRecoveries,
            };
          });
        });
        data["World"] = {
          name: ["World"],
          hierarchicalName: "World",
          countryCode: "World",
          isMissingData: false,
          population: worldPopulation,
          data: worldDailyCasesData,
        };
      };

      const addEarlyCasesData = (): void => {
        console.log("Adding early cases data...");
        //Add data not present in JHU data
        const earlyDateStringArray: Array<string> = getDateStringArray("1/1/20", "1/21/20");
        Object.entries(data).forEach(([key, regionData]) => {
          const dailyCasesData: DailyCasesDataObject = regionData.data;
          earlyDateStringArray.forEach((date) => {
            createDailyData(dailyCasesData, date);
          });
        });
        earlyCases.forEach((earlyCase) => {
          const type: string = earlyCase.type;
          const name: Array<string> = ["World"];
          const country: string = earlyCase.country;
          const province: string = earlyCase.province;
          const county: string = earlyCase.county;
          if (country) {
            name.push(country);
          }
          if (province) {
            name.push(province);
          }
          if (county) {
            name.push(county);
          }
          const hierarchicalName: string = getHierarchicalName(name);
          const casesData: CasesData = data[hierarchicalName];
          if (!!casesData) {
            const dataObject: DailyCasesDataObject = casesData.data;
            earlyDateStringArray.forEach((date) => {
              const count: number = earlyCase[date];
              switch (type) {
                case "cases": {
                  dataObject[date].totalCases = count;
                    break;
                }
                case "deaths": {
                  dataObject[date].totalDeaths = count;
                  break;
                }
                case "recoveries": {
                  dataObject[date].totalRecoveries = count;
                  break;
                }
              }
            });
          }
        });
      };

      const sortData = (): void => {
        console.log("Sorting data...");
        Object.entries(data).forEach(([key, value]) => {
          const oldDataObject: DailyCasesDataObject = data[key].data;
          const newDataObject: DailyCasesDataObject = {};
          Object.keys(oldDataObject).sort((a, b) => {
            if (a === b) {
              return 0;
            }
            const dateA: Moment = getMomentDateFromDateString(a);
            const dateB: Moment = getMomentDateFromDateString(b);
            const isALaterThanB: boolean = dateA.isAfter(dateB);
            return isALaterThanB ? 1 : -1;
          }).forEach((key) => {
            newDataObject[key] = oldDataObject[key];
          });

          data[key] = {
            ...value,
            data: newDataObject,
          };
        });
      };

      const generateCasesInformationData = (): void => {
        const daily: number = 1;
        const weekly: number = 7;
        const monthly: number = 30;
        const yearly: number = 365;

        console.log("Generating extra cases information...");
        Object.entries(data).forEach(([hierarchicalName, casesData]) => {
          if (!casesData.isMissingData) {
            console.log(`Generating extra cases info for: ${hierarchicalName}`);
            const dailyDailyCasesInformationDataObject: DailyCasesInformationDataObject = {};
            const weeklyDailyCasesInformationDataObject: DailyCasesInformationDataObject = {};
            const monthlyDailyCasesInformationDataObject: DailyCasesInformationDataObject = {};
            const yearlyDailyCasesInformationDataObject: DailyCasesInformationDataObject = {};

            Object.entries(casesData.data).forEach(([date, dailyCasesData], index) => {

              const dailyCases: number = getPastDataSum(daily, date, "totalCases", casesData.data);
              const weeklyCases: number = getPastDataSum(weekly, date, "totalCases", casesData.data);
              const monthlyCases: number = getPastDataSum(monthly, date, "totalCases", casesData.data);
              const yearlyCases: number = getPastDataSum(yearly, date, "totalCases", casesData.data);

              const dailyRecoveries: number = getPastDataSum(daily, date, "totalRecoveries", casesData.data);
              const weeklyRecoveries: number = getPastDataSum(weekly, date, "totalRecoveries", casesData.data);
              const monthlyRecoveries: number = getPastDataSum(monthly, date, "totalRecoveries", casesData.data);
              const yearlyRecoveries: number = getPastDataSum(yearly, date, "totalRecoveries", casesData.data);

              const dailyDeaths: number = getPastDataSum(daily, date, "totalDeaths", casesData.data);
              const weeklyDeaths: number = getPastDataSum(weekly, date, "totalDeaths", casesData.data);
              const monthlyDeaths: number = getPastDataSum(monthly, date, "totalDeaths", casesData.data);
              const yearlyDeaths: number = getPastDataSum(yearly, date, "totalDeaths", casesData.data);


              dailyDailyCasesInformationDataObject[date] = {
                cases: dailyCases,
                recoveries: dailyRecoveries,
                deaths: dailyDeaths,
              };
              weeklyDailyCasesInformationDataObject[date] = {
                cases: weeklyCases,
                recoveries: weeklyRecoveries,
                deaths: weeklyDeaths,
              }
              monthlyDailyCasesInformationDataObject[date] = {
                cases: monthlyCases,
                recoveries: monthlyRecoveries,
                deaths: monthlyDeaths,
              }
              yearlyDailyCasesInformationDataObject[date] = {
                cases: yearlyCases,
                recoveries: yearlyRecoveries,
                deaths: yearlyDeaths,
              }
            });

            Object.entries(dailyDailyCasesInformationDataObject).forEach(([date, dailyDailyCasesInformationData], index) => {
              const weeklyAverageCases: number = getPastDataAverage(weekly, date, "cases", dailyDailyCasesInformationDataObject);
              const weeklyAverageRecoveries: number = getPastDataAverage(weekly, date, "recoveries", dailyDailyCasesInformationDataObject);
              const weeklyAverageDeaths: number = getPastDataAverage(weekly, date, "deaths", dailyDailyCasesInformationDataObject);

              dailyDailyCasesInformationDataObject[date] = {
                ...dailyDailyCasesInformationDataObject[date],
                weeklyCasesAverage: weeklyAverageCases,
                weeklyRecoveriesAverage: weeklyAverageRecoveries,
                weeklyDeathsAverage: weeklyAverageDeaths,
              }
            });
            dailyInfoData[hierarchicalName] = dailyDailyCasesInformationDataObject;
            weeklyInfoData[hierarchicalName] = weeklyDailyCasesInformationDataObject;
            monthlyInfoData[hierarchicalName] = monthlyDailyCasesInformationDataObject;
            yearlyInfoData[hierarchicalName] = yearlyDailyCasesInformationDataObject;
          }
        });
      };

      const globalCasesArray: Array<Array<string>> = processGlobalArray(await getCsvArray("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"));
      const globalDeathsArray: Array<Array<string>> = processGlobalArray(await getCsvArray("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv"));
      const globalRecoveriesArray: Array<Array<string>> = processGlobalArray(await getCsvArray("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv"));
      const usCasesArray: Array<Array<string>> = processUsArray(await getCsvArray("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"));
      const usDeathsArray: Array<Array<string>> = processUsArray(await getCsvArray("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv"));
      const globalTotalCasesFirstRow: Array<string> = globalCasesArray[0];
      const firstDateString: string = globalTotalCasesFirstRow[5];
      const lastDateString: string = globalTotalCasesFirstRow[globalTotalCasesFirstRow.length - 1];
      const dateStringArray: Array<string> = getDateStringArray(firstDateString, lastDateString);

      for (let globalTotalCasesArrayIndex = 1; globalTotalCasesArrayIndex < globalCasesArray.length; globalTotalCasesArrayIndex++) {
        const row: Array<string> = globalCasesArray[globalTotalCasesArrayIndex];
        const [name, hierarchicalName, countryCode]: [Array<string>, string, string] = getName(row[1], row[0]);
        if (!!hierarchicalName) {
          createRegionData(name, hierarchicalName, countryCode);
          const dailyCasesData: DailyCasesDataObject = data[hierarchicalName] ? data[hierarchicalName].data : {};
          const population: number = parseInt(row[4]);
          if (isNaN(population)) {
            throw `Population is NaN for: ${hierarchicalName}.`;
          }
          dateStringArray.forEach((date, index) => {
            createDailyData(dailyCasesData, date);

            const totalCases: number = parseInt(row[index + 5]);
            if (isNaN(totalCases)) {
              throw `Total Cases is NaN for: ${hierarchicalName} date: ${date}.`;
            }
            dailyCasesData[date] = {
              ...dailyCasesData[date],
              totalCases: totalCases,
            };
          });
          data[hierarchicalName] = {
            ...data[hierarchicalName],
            population: population,
            data: dailyCasesData,
          };
        }
      }

      for (let globalDeathsArrayIndex = 1; globalDeathsArrayIndex < globalDeathsArray.length; globalDeathsArrayIndex++) {
        const row: Array<string> = globalDeathsArray[globalDeathsArrayIndex];
        const [name, hierarchicalName, countryCode]: [Array<string>, string, string] = getName(row[1], row[0]);
        if (!!hierarchicalName) {
          createRegionData(name, hierarchicalName, countryCode);
          const dailyCasesData: DailyCasesDataObject = data[hierarchicalName] ? data[hierarchicalName].data : {};
          dateStringArray.forEach((date, index) => {
            createDailyData(dailyCasesData, date);
            const totalDeaths: number = parseInt(row[index + 5]);
            if (isNaN(totalDeaths)) {
              throw `Total Deaths is NaN for: ${hierarchicalName} date: ${date}.`;
            }
            dailyCasesData[date] = {
              ...dailyCasesData[date],
              totalDeaths: totalDeaths,
            };
          });
        }
      }

      for (let globalRecoveredArrayIndex = 1; globalRecoveredArrayIndex < globalRecoveriesArray.length; globalRecoveredArrayIndex++) {
        const row: Array<string> = globalRecoveriesArray[globalRecoveredArrayIndex];
        const [name, hierarchicalName, countryCode]: [Array<string>, string, string] = getName(row[1], row[0]);
        if (!!hierarchicalName) {
          createRegionData(name, hierarchicalName, countryCode);
          const dailyCasesData: DailyCasesDataObject = data[hierarchicalName] ? data[hierarchicalName].data : {};
          dateStringArray.forEach((date, index) => {
            createDailyData(dailyCasesData, date);
            const totalRecoveries: number = parseInt(row[index + 5]);
            if (isNaN(totalRecoveries)) {
              throw `Total Recoveries is NaN for: ${hierarchicalName} date: ${date}.`;
            }
            dailyCasesData[date] = {
              ...dailyCasesData[date],
              totalRecoveries: totalRecoveries,
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
          const dailyCasesData: DailyCasesDataObject = data[hierarchicalName] ? data[hierarchicalName].data : {};
          dateStringArray.forEach((date, index) => {
            createDailyData(dailyCasesData, date);
            const totalCases: number = parseInt(row[index + 11]);
            if (isNaN(totalCases)) {
              throw `Total Cases is NaN for: ${hierarchicalName} date: ${date}.`;
            }
            dailyCasesData[date] = {
              ...dailyCasesData[date],
              totalCases: totalCases,
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
          const dailyCasesData: DailyCasesDataObject = data[hierarchicalName] ? data[hierarchicalName].data : {};
          const population: number = parseInt(row[11]);
          if (isNaN(population)) {
            throw `Population is NaN for: ${hierarchicalName}.`;
          }
          dateStringArray.forEach((date, index) => {
            createDailyData(dailyCasesData, date);
            const totalDeaths: number = parseInt(row[index + 12]);
            if (isNaN(totalDeaths)) {
              throw `Total Deaths is NaN for: ${hierarchicalName} date: ${date}.`;
            }
            dailyCasesData[date] = {
              ...dailyCasesData[date],
              totalDeaths: totalDeaths,
            };
          });
          data[hierarchicalName] = {
            ...data[hierarchicalName],
            population: population,
            data: dailyCasesData,
          };
        }
      }

      generateUSStatesData();
      checkData();
      addEarlyCasesData();
      sortData();
      fixUSData();
      generateWorldData();
      generateCasesInformationData();

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const getCsvArray = async (url: string): Promise<Array<Array<string>>> => {
    const result: any = await axios.get(url);
    const resultString: string = result.data;
    const resultArray: Array<Array<string>> = csv.parse(resultString);
    return resultArray;
  };

  const getMomentDateFromDateString = (dateString: string): Moment => {
    const date: Moment = moment(dateString, "M/D/YY").startOf("day");
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

  const getOffsetDateString = (dateString: string, offset: number): string => {
    const date: Moment = getMomentDateFromDateString(dateString);
    return date.add(offset, "days").format("M/D/YY");
  };

  const getPastDataSum = (days: number, date: string, key: keyof DailyCasesData, dailyCasesDataObject: DailyCasesDataObject): number => {
    const endDailyCasesData: DailyCasesData | undefined = dailyCasesDataObject[date];
    if (!endDailyCasesData) {
      return 0;
    } else {
      const endNumber: number = endDailyCasesData[key];
      const startDate: string = getOffsetDateString(date, -days);
      const startDailyCasesData: DailyCasesData | undefined = dailyCasesDataObject[startDate];
      if (!startDailyCasesData) {
        return endNumber;
      } else {
        const startNumber: number = startDailyCasesData[key];
        return endNumber - startNumber;
      }
    }
  };

  const getPastDataAverage = (days: number, date: string, key: keyof DailyCasesInformationData, dailyCasesInformationDataObject: DailyCasesInformationDataObject): number => {
    let sum: number = 0;
    for (let i = 0; i < days; i++) {
      const offsetDate: string = getOffsetDateString(date, -i);
      const data: DailyCasesInformationData = dailyCasesInformationDataObject[offsetDate];
      if (data) {
        sum = sum + (data[key] || 0);
      }
    }
    return Math.floor(sum / days);
  };

  export const getSummaryData = (): void => {
    const worldData: CasesData = data["World"];
    const worldDailyData: DailyCasesDataObject = worldData.data;
    const dateKeys: Array<string> = Object.keys(worldDailyData);
    const currentDateString: string = dateKeys[dateKeys.length - 1];
    const worldSummary: WorldSummary = getWorldSummary(currentDateString);
    const countriesSummary: CountriesSummary = getCountriesSummary(currentDateString);
    summaryData = {
      currentDate: currentDateString,
      world: worldSummary,
      countries: countriesSummary,
    };
  };

  export const getWorldSummary = (currentDateString: string): WorldSummary => {
    const worldData: CasesData = data["World"];
    const worldDailyData: DailyCasesDataObject = worldData.data;
    const lastDayString: string = getOffsetDateString(currentDateString, -1);
    const lastWeekString: string = getOffsetDateString(currentDateString, -7);
    const lastMonthString: string = getOffsetDateString(currentDateString, -30);
    const lastYearString: string = getOffsetDateString(currentDateString, -365);
    const beforeLastDayString: string = getOffsetDateString(currentDateString, -2);
    const beforeLastWeekString: string = getOffsetDateString(currentDateString, -14);
    const beforeLastMonthString: string = getOffsetDateString(currentDateString, -60);
    const beforeLastYearString: string = getOffsetDateString(currentDateString, -730);

    const currentCases: number = worldDailyData[currentDateString].totalCases;
    const currentDeaths: number = worldDailyData[currentDateString].totalDeaths;
    const currentRecoveries: number = worldDailyData[currentDateString].totalRecoveries;

    const lastDayCases: number = worldDailyData[lastDayString].totalCases;
    const lastDayDeaths: number = worldDailyData[lastDayString].totalDeaths;
    const lastDayRecoveries: number = worldDailyData[lastDayString].totalRecoveries;

    const lastWeekCases: number = worldDailyData[lastWeekString].totalCases;
    const lastWeekDeaths: number = worldDailyData[lastWeekString].totalDeaths;
    const lastWeekRecoveries: number = worldDailyData[lastWeekString].totalRecoveries;

    const lastMonthCases: number = worldDailyData[lastMonthString].totalCases;
    const lastMonthDeaths: number = worldDailyData[lastMonthString].totalDeaths;
    const lastMonthRecoveries: number = worldDailyData[lastMonthString].totalRecoveries;

    const lastYearCases: number = worldDailyData[lastYearString].totalCases;
    const lastYearDeaths: number = worldDailyData[lastYearString].totalDeaths;
    const lastYearRecoveries: number = worldDailyData[lastYearString].totalRecoveries;

    const beforeLastDayCases: number = worldDailyData[beforeLastDayString].totalCases;
    const beforeLastDayDeaths: number = worldDailyData[beforeLastDayString].totalDeaths;
    const beforeLastDayRecoveries: number = worldDailyData[beforeLastDayString].totalRecoveries;

    const beforeLastWeekCases: number = worldDailyData[beforeLastWeekString].totalCases;
    const beforeLastWeekDeaths: number = worldDailyData[beforeLastWeekString].totalDeaths;
    const beforeLastWeekRecoveries: number = worldDailyData[beforeLastWeekString].totalRecoveries;

    const beforeLastMonthCases: number = worldDailyData[beforeLastMonthString].totalCases;
    const beforeLastMonthDeaths: number = worldDailyData[beforeLastMonthString].totalDeaths;
    const beforeLastMonthRecoveries: number = worldDailyData[beforeLastMonthString].totalRecoveries;

    const beforeLastYearCases: number = worldDailyData[beforeLastYearString]?.totalCases || 0;
    const beforeLastYearDeaths: number = worldDailyData[beforeLastYearString]?.totalDeaths || 0;
    const beforeLastYearRecoveries: number = worldDailyData[beforeLastYearString]?.totalRecoveries || 0;

    return {
      daily: {
        previousCasesChange: lastDayCases - beforeLastDayCases,
        previousDeathsChange: lastDayDeaths - beforeLastDayDeaths,
        previousRecoveriesChange: lastDayRecoveries - beforeLastDayRecoveries,
        casesChange: currentCases - lastDayCases,
        deathsChange: currentDeaths - lastDayDeaths,
        recoveriesChange: currentRecoveries - lastDayRecoveries,
      },
      weekly: {
        previousCasesChange: lastWeekCases - beforeLastWeekCases,
        previousDeathsChange: lastWeekDeaths - beforeLastWeekDeaths,
        previousRecoveriesChange: lastWeekRecoveries - beforeLastWeekRecoveries,
        casesChange: currentCases - lastWeekCases,
        deathsChange: currentDeaths - lastWeekDeaths,
        recoveriesChange: currentRecoveries - lastWeekRecoveries,
      },
      monthly: {
        previousCasesChange: lastMonthCases - beforeLastMonthCases,
        previousDeathsChange: lastMonthDeaths - beforeLastMonthDeaths,
        previousRecoveriesChange: lastMonthRecoveries - beforeLastMonthRecoveries,
        casesChange: currentCases - lastMonthCases,
        deathsChange: currentDeaths - lastMonthDeaths,
        recoveriesChange: currentRecoveries - lastMonthRecoveries,
      },
      yearly: {
        previousCasesChange: lastYearCases - beforeLastYearCases,
        previousDeathsChange: lastYearDeaths - beforeLastYearDeaths,
        previousRecoveriesChange: lastYearRecoveries - beforeLastYearRecoveries,
        casesChange: currentCases - lastYearCases,
        deathsChange: currentDeaths - lastYearDeaths,
        recoveriesChange: currentRecoveries - lastYearRecoveries,
      },
      all: {
        previousCasesChange: 0,
        previousDeathsChange: 0,
        previousRecoveriesChange: 0,
        casesChange: currentCases,
        deathsChange: currentDeaths,
        recoveriesChange: currentRecoveries,
      }
    };
  };

  export const getCountriesSummary = (currentDateString: string): CountriesSummary => {
    const countriesData: Array<CasesData> = Object.entries(data)
    .filter(([hierarchicalName, casesData]) => {
      const name: Array<string> = getNameArray(hierarchicalName);
      return name.length === 2;
    }).map(([hierarchicalName, casesData]) => casesData);

    const dailyCasesChange: Array<CasesSummaryTypeData> = [];
    const dailyDeathsChange: Array<CasesSummaryTypeData> = [];
    const dailyRecoveriesChange: Array<CasesSummaryTypeData> = [];

    const weeklyCasesChange: Array<CasesSummaryTypeData> = [];
    const weeklyDeathsChange: Array<CasesSummaryTypeData> = [];
    const weeklyRecoveriesChange: Array<CasesSummaryTypeData> = [];

    const monthlyCasesChange: Array<CasesSummaryTypeData> = [];
    const monthlyDeathsChange: Array<CasesSummaryTypeData> = [];
    const monthlyRecoveriesChange: Array<CasesSummaryTypeData> = [];

    const yearlyCasesChange: Array<CasesSummaryTypeData> = [];
    const yearlyDeathsChange: Array<CasesSummaryTypeData> = [];
    const yearlyRecoveriesChange: Array<CasesSummaryTypeData> = [];

    const allCasesChange: Array<CasesSummaryTypeData> = [];
    const allDeathsChange: Array<CasesSummaryTypeData> = [];
    const allRecoveriesChange: Array<CasesSummaryTypeData> = [];

    countriesData.forEach((countryData) => {
      const nameString: string = getName(countryData.hierarchicalName);
      const countryDailyData: DailyCasesDataObject = countryData.data;
      const lastDayString: string = getOffsetDateString(currentDateString, -1);
      const lastWeekString: string = getOffsetDateString(currentDateString, -7);
      const lastMonthString: string = getOffsetDateString(currentDateString, -30);
      const lastYearString: string = getOffsetDateString(currentDateString, -365);
      const beforeLastDayString: string = getOffsetDateString(currentDateString, -2);
      const beforeLastWeekString: string = getOffsetDateString(currentDateString, -14);
      const beforeLastMonthString: string = getOffsetDateString(currentDateString, -60);
      const beforeLastYearString: string = getOffsetDateString(currentDateString, -730);

      const currentCases: number = countryDailyData[currentDateString].totalCases;
      const currentDeaths: number = countryDailyData[currentDateString].totalDeaths;
      const currentRecoveries: number = countryDailyData[currentDateString].totalRecoveries;

      const lastDayCases: number = countryDailyData[lastDayString].totalCases;
      const lastDayDeaths: number = countryDailyData[lastDayString].totalDeaths;
      const lastDayRecoveries: number = countryDailyData[lastDayString].totalRecoveries;

      const lastWeekCases: number = countryDailyData[lastWeekString].totalCases;
      const lastWeekDeaths: number = countryDailyData[lastWeekString].totalDeaths;
      const lastWeekRecoveries: number = countryDailyData[lastWeekString].totalRecoveries;

      const lastMonthCases: number = countryDailyData[lastMonthString].totalCases;
      const lastMonthDeaths: number = countryDailyData[lastMonthString].totalDeaths;
      const lastMonthRecoveries: number = countryDailyData[lastMonthString].totalRecoveries;

      const lastYearCases: number = countryDailyData[lastYearString].totalCases;
      const lastYearDeaths: number = countryDailyData[lastYearString].totalDeaths;
      const lastYearRecoveries: number = countryDailyData[lastYearString].totalRecoveries;

      const beforeLastDayCases: number = countryDailyData[beforeLastDayString].totalCases;
      const beforeLastDayDeaths: number = countryDailyData[beforeLastDayString].totalDeaths;
      const beforeLastDayRecoveries: number = countryDailyData[beforeLastDayString].totalRecoveries;

      const beforeLastWeekCases: number = countryDailyData[beforeLastWeekString].totalCases;
      const beforeLastWeekDeaths: number = countryDailyData[beforeLastWeekString].totalDeaths;
      const beforeLastWeekRecoveries: number = countryDailyData[beforeLastWeekString].totalRecoveries;

      const beforeLastMonthCases: number = countryDailyData[beforeLastMonthString].totalCases;
      const beforeLastMonthDeaths: number = countryDailyData[beforeLastMonthString].totalDeaths;
      const beforeLastMonthRecoveries: number = countryDailyData[beforeLastMonthString].totalRecoveries;

      const beforeLastYearCases: number = countryDailyData[beforeLastYearString]?.totalCases || 0;
      const beforeLastYearDeaths: number = countryDailyData[beforeLastYearString]?.totalDeaths || 0;
      const beforeLastYearRecoveries: number = countryDailyData[beforeLastYearString]?.totalRecoveries || 0;

      dailyCasesChange.push({
        nameString: nameString,
        countryCode: countryData.countryCode,
        change: currentCases - lastDayCases,
        previousChange: lastDayCases - beforeLastDayCases,
      });
      dailyDeathsChange.push({
        nameString: nameString,
        countryCode: countryData.countryCode,
        change: currentDeaths - lastDayDeaths,
        previousChange: lastDayDeaths - beforeLastDayDeaths,
      });
      dailyRecoveriesChange.push({
        nameString: nameString,
        countryCode: countryData.countryCode,
        change: currentRecoveries - lastDayRecoveries,
        previousChange: lastDayRecoveries - beforeLastDayRecoveries,
      });

      weeklyCasesChange.push({
        nameString: nameString,
        countryCode: countryData.countryCode,
        change: currentCases - lastWeekCases,
        previousChange: lastWeekCases - beforeLastWeekCases,
      });
      weeklyDeathsChange.push({
        nameString: nameString,
        countryCode: countryData.countryCode,
        change: currentDeaths - lastWeekDeaths,
        previousChange: lastWeekDeaths - beforeLastWeekDeaths,
      });
      weeklyRecoveriesChange.push({
        nameString: nameString,
        countryCode: countryData.countryCode,
        change: currentRecoveries - lastWeekRecoveries,
        previousChange: lastWeekRecoveries - beforeLastWeekRecoveries,
      });

      monthlyCasesChange.push({
        nameString: nameString,
        countryCode: countryData.countryCode,
        change: currentCases - lastMonthCases,
        previousChange: lastMonthCases - beforeLastMonthCases,
      });
      monthlyDeathsChange.push({
        nameString: nameString,
        countryCode: countryData.countryCode,
        change: currentDeaths - lastMonthDeaths,
        previousChange: lastMonthDeaths - beforeLastMonthDeaths,
      });
      monthlyRecoveriesChange.push({
        nameString: nameString,
        countryCode: countryData.countryCode,
        change: currentRecoveries - lastMonthRecoveries,
        previousChange: lastMonthRecoveries - beforeLastMonthRecoveries,
      });

      yearlyCasesChange.push({
        nameString: nameString,
        countryCode: countryData.countryCode,
        change: currentCases - lastYearCases,
        previousChange: lastYearCases - beforeLastYearCases,
      });
      yearlyDeathsChange.push({
        nameString: nameString,
        countryCode: countryData.countryCode,
        change: currentDeaths - lastYearDeaths,
        previousChange: lastYearDeaths - beforeLastYearDeaths,
      });
      yearlyRecoveriesChange.push({
        nameString: nameString,
        countryCode: countryData.countryCode,
        change: currentRecoveries - lastYearRecoveries,
        previousChange: lastYearRecoveries - beforeLastYearRecoveries,
      });

      allCasesChange.push({
        nameString: nameString,
        countryCode: countryData.countryCode,
        change: currentCases,
        previousChange: 0,
      });
      allDeathsChange.push({
        nameString: nameString,
        countryCode: countryData.countryCode,
        change: currentDeaths,
        previousChange: 0,
      });
      allRecoveriesChange.push({
        nameString: nameString,
        countryCode: countryData.countryCode,
        change: currentRecoveries,
        previousChange: 0,
      });
    });

    const addTopCount: number = 10;

    const dailyCasesChangeLeaders: Array<CasesSummaryTypeData> = [];
    const dailyDeathsChangeLeaders: Array<CasesSummaryTypeData> = [];
    const dailyRecoveriesChangeLeaders: Array<CasesSummaryTypeData> = [];

    const weeklyCasesChangeLeaders: Array<CasesSummaryTypeData> = [];
    const weeklyDeathsChangeLeaders: Array<CasesSummaryTypeData> = [];
    const weeklyRecoveriesChangeLeaders: Array<CasesSummaryTypeData> = [];

    const monthlyCasesChangeLeaders: Array<CasesSummaryTypeData> = [];
    const monthlyDeathsChangeLeaders: Array<CasesSummaryTypeData> = [];
    const monthlyRecoveriesChangeLeaders: Array<CasesSummaryTypeData> = [];

    const yearlyCasesChangeLeaders: Array<CasesSummaryTypeData> = [];
    const yearlyDeathsChangeLeaders: Array<CasesSummaryTypeData> = [];
    const yearlyRecoveriesChangeLeaders: Array<CasesSummaryTypeData> = [];

    const allCasesChangeLeaders: Array<CasesSummaryTypeData> = [];
    const allDeathsChangeLeaders: Array<CasesSummaryTypeData> = [];
    const allRecoveriesChangeLeaders: Array<CasesSummaryTypeData> = [];

    const changeSortFunction = (a: CasesSummaryTypeData, b: CasesSummaryTypeData): number => {
      return b.change - a.change;
    };

    dailyCasesChange.sort(changeSortFunction);
    dailyCasesChange.forEach((change, index) => {
      if (index < addTopCount) {
        dailyCasesChangeLeaders.push({
          ...change,
        });
      }
    });
    dailyDeathsChange.sort(changeSortFunction);
    dailyDeathsChange.forEach((change, index) => {
      if (index < addTopCount) {
        dailyDeathsChangeLeaders.push({
          ...change,
        });
      }
    });
    dailyRecoveriesChange.sort(changeSortFunction);
    dailyRecoveriesChange.forEach((change, index) => {
      if (index < addTopCount) {
        dailyRecoveriesChangeLeaders.push({
          ...change,
        });
      }
    });

    weeklyCasesChange.sort(changeSortFunction);
    weeklyCasesChange.forEach((change, index) => {
      if (index < addTopCount) {
        weeklyCasesChangeLeaders.push({
          ...change,
        });
      }
    });
    weeklyDeathsChange.sort(changeSortFunction);
    weeklyDeathsChange.forEach((change, index) => {
      if (index < addTopCount) {
        weeklyDeathsChangeLeaders.push({
          ...change,
        });
      }
    });
    weeklyRecoveriesChange.sort(changeSortFunction);
    weeklyRecoveriesChange.forEach((change, index) => {
      if (index < addTopCount) {
        weeklyRecoveriesChangeLeaders.push({
          ...change,
        });
      }
    });

    monthlyCasesChange.sort(changeSortFunction);
    monthlyCasesChange.forEach((change, index) => {
      if (index < addTopCount) {
        monthlyCasesChangeLeaders.push({
          ...change,
        });
      }
    });
    monthlyDeathsChange.sort(changeSortFunction);
    monthlyDeathsChange.forEach((change, index) => {
      if (index < addTopCount) {
        monthlyDeathsChangeLeaders.push({
          ...change,
        });
      }
    });
    monthlyRecoveriesChange.sort(changeSortFunction);
    monthlyRecoveriesChange.forEach((change, index) => {
      if (index < addTopCount) {
        monthlyRecoveriesChangeLeaders.push({
          ...change,
        });
      }
    });

    yearlyCasesChange.sort(changeSortFunction);
    yearlyCasesChange.forEach((change, index) => {
      if (index < addTopCount) {
        yearlyCasesChangeLeaders.push({
          ...change,
        });
      }
    });
    yearlyDeathsChange.sort(changeSortFunction);
    yearlyDeathsChange.forEach((change, index) => {
      if (index < addTopCount) {
        yearlyDeathsChangeLeaders.push({
          ...change,
        });
      }
    });
    yearlyRecoveriesChange.sort(changeSortFunction);
    yearlyRecoveriesChange.forEach((change, index) => {
      if (index < addTopCount) {
        yearlyRecoveriesChangeLeaders.push({
          ...change,
        });
      }
    });

    allCasesChange.sort(changeSortFunction);
    allCasesChange.forEach((change, index) => {
      if (index < addTopCount) {
        allCasesChangeLeaders.push({
          ...change,
        });
      }
    });
    allDeathsChange.sort(changeSortFunction);
    allDeathsChange.forEach((change, index) => {
      if (index < addTopCount) {
        allDeathsChangeLeaders.push({
          ...change,
        });
      }
    });
    allRecoveriesChange.sort(changeSortFunction);
    allRecoveriesChange.forEach((change, index) => {
      if (index < addTopCount) {
        allRecoveriesChangeLeaders.push({
          ...change,
        });
      }
    });

    return {
      daily: {
        casesChange: dailyCasesChangeLeaders,
        deathsChange: dailyDeathsChangeLeaders,
        recoveriesChange: dailyRecoveriesChangeLeaders,
      },
      weekly: {
        casesChange: weeklyCasesChangeLeaders,
        deathsChange: weeklyDeathsChangeLeaders,
        recoveriesChange: weeklyRecoveriesChangeLeaders,
      },
      monthly: {
        casesChange: monthlyCasesChangeLeaders,
        deathsChange: monthlyDeathsChangeLeaders,
        recoveriesChange: monthlyRecoveriesChangeLeaders,
      },
      yearly: {
        casesChange: yearlyCasesChangeLeaders,
        deathsChange: yearlyDeathsChangeLeaders,
        recoveriesChange: yearlyRecoveriesChangeLeaders,
      },
      all: {
        casesChange: allCasesChangeLeaders,
        deathsChange: allDeathsChangeLeaders,
        recoveriesChange: allRecoveriesChangeLeaders,
      },
    };
  };

  export const getChangePercent = (start: number, end: number): number => {
    if (start === 0) {
      return 100;
    } else {
      return (end - start) * 100 / start;
    }
  };
  export const getChangeAmount = (start: number, end: number): number => {
    return end - start;
  };
}
