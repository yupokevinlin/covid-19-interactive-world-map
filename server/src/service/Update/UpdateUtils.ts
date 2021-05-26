import {CasesUtils} from "../Cases/CasesUtils";
import {TreeUtils} from "../Tree/TreeUtils";

const moment = require("moment");

export namespace UpdateUtils {
  export let lastUpdate: string = moment().format("M/D/YY");

  export const setupUpdate = () => {
    console.log("Setting up update timer...");
    setInterval(() => {
      const lastUpdateMomentDate = moment(lastUpdate, "M/D/YY").startOf("day");
      const currentMomentDate = moment();
      const difference: number = currentMomentDate.diff(lastUpdateMomentDate);
      const shouldUpdate: boolean = difference < 3600000 - 1;
      if (shouldUpdate) {
        updateData();
      }
    }, 3600000);
  };

  export const updateData = async () => {
    try {
      console.log(`Starting update. Time: ${moment().format("MMMM Do YYYY, h:mm:ss a")}.`);
      //Clearing Data
      CasesUtils.data = {};
      CasesUtils.dailyInfoData = {};
      CasesUtils.weeklyInfoData = {};
      CasesUtils.monthlyInfoData = {};
      CasesUtils.yearlyInfoData = {};
      TreeUtils.data = {
        hierarchicalName: "World",
        countryCode: "World",
        children: [],
      };

      await CasesUtils.fetchCasesData();
      TreeUtils.getTreeData();
      CasesUtils.getSummaryData();

      lastUpdate = moment().format("M/D/YY");
      console.log(`Update Successful. Time: ${moment().format("MMMM Do YYYY, h:mm:ss a")}.`);
      return true;
    } catch (e) {
      console.log(`Update Failed! Last Update: ${lastUpdate}. Current Time: ${moment().format("MMMM Do YYYY, h:mm:ss a")}.`);
      console.log(e);
      return false;
    }
  }
}
