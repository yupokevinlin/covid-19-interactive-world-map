import moment, {Moment} from "moment";

export namespace DateUtils {
  export const getCurrentDate = (): string => {
    return moment().format("M/D/YY");
  };

  export const getMomentDateFromDateString = (dateString: string): Moment => {
    const date: Moment = moment(dateString, "M/D/YY").startOf("day");
    return date;
  };

  export const getDateStringArray = (firstDateString: string, lastDateString: string): Array<string> => {
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