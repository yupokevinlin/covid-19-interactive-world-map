import moment from "moment";

export namespace DateUtils {
  export const getCurrentDate = (): string => {
    return moment().format("M/D/YY");
  };
}