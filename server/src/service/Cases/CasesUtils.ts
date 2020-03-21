import {ServerCasesDataTimeSeries} from "../../../../shared/types/data/Cases/CasesTypes";
const csv = require("csv-string");
const request = require("request");
const axios = require('axios').default;


export namespace CasesUtils {
  const casesDataTimeSeries: ServerCasesDataTimeSeries = {};
  export const getCasesTimeSeries = async (): Promise<boolean> => {
    const confirmedCasesUrl: string = "https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_19-covid-Confirmed.csv&filename=time_series_2019-ncov-Confirmed.csv";
    const deathsUrl: string = "https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_19-covid-Deaths.csv&filename=time_series_2019-ncov-Deaths.csv";
    const recoveredCasesUrl: string = "https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_19-covid-Recovered.csv&filename=time_series_2019-ncov-Recovered.csv";

    const confirmedCasesResult: any = await axios.get(confirmedCasesUrl);
    const confirmedCasesResultCsvString: string = confirmedCasesResult.data;
    const conrirmedCasesResultArray: Array<Array<string>> = csv.parse(confirmedCasesResultCsvString);
    const deathsResult: any = await axios.get(deathsUrl);
    const deathsResultCsvString: string = deathsResult.data;
    const deathsCasesResultArray: Array<Array<string>> = csv.parse(deathsResultCsvString);
    const recoveredCasesResult: any = await axios.get(recoveredCasesUrl);
    const recoveredCasesResultCsvString: string = recoveredCasesResult.data;
    const recoveredCasesResultArray: Array<Array<string>> = csv.parse(recoveredCasesResultCsvString);

    
    return true;
  };
}