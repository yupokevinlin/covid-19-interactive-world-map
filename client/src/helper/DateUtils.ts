import moment, {Moment} from "moment";

export namespace DateUtils {
  export const getCurrentDate = (): string => {
    return moment().format("M/D/YY");
  };

  export const getPreviousDate = (): string => {
    return moment().subtract(1, "days").format("M/D/YY");
  };

  export const getMomentDateFromDateString = (dateString: string): Moment => {
    const date: Moment = moment(dateString, "M/D/YY").startOf("day");
    return date;
  };

  export const getDateStringFromMomentDate = (date: Moment): string => {
    return date.format("M/D/YY");
  };

  export const getDateStringArray = (firstDateString: string, lastDateString: string): Array<string> => {
    const dateStringArray: Array<string> = [];
    const firstDate: Moment = getMomentDateFromDateString(firstDateString);
    const lastDate: Moment = getMomentDateFromDateString(lastDateString);
    const dateDifference: number = lastDate.diff(firstDate, "days");
    for (let dateIndex = 0; dateIndex < dateDifference; dateIndex++) {
      if (dateIndex === 0) {
        const firstDateString: string = getDateStringFromMomentDate(firstDate);
        dateStringArray.push(firstDateString);
      }
      firstDate.add(1, "days");
      const newDateString: string = getDateStringFromMomentDate(firstDate);
      dateStringArray.push(newDateString);
    }
    return dateStringArray;
  };

  export const getDateFromDateString = (dateString: string): Date => {
    const date: Moment = getMomentDateFromDateString(dateString);
    return new Date(date.year(), date.month(), date.date());
  };

  export const getDateStringFromDate = (date: Date): string => {
    return getDateStringFromMomentDate(moment(date));
  };
}