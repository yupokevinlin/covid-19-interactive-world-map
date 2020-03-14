using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using System.Text.RegularExpressions;

namespace WHO_Data_Parser
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            string path = "../../../../docx/";
            string[] filePathArray = Directory.GetFiles(path, "*.docx*", SearchOption.TopDirectoryOnly);
            List<WHOData> overallData = new List<WHOData>();
            for (int i = 0; i < filePathArray.Length; i++)
            {
                string filePath = filePathArray[i];
                string date = getBetween(filePath, "/docx/", "-sitrep-");
                WHOData whoData = new WHOData(date);
                List<List<List<string>>> tablesContents = new List<List<List<string>>>();
                using (WordprocessingDocument wDoc = WordprocessingDocument.Open(filePath, false))
                {
                    IEnumerable<Table> parts = wDoc.MainDocumentPart.Document.Descendants<DocumentFormat.OpenXml.Wordprocessing.Table>();
                    List<Table> tables = parts.ToList();
                    tables.ForEach(table =>
                    {
                        List<List<string>> tableContents = new List<List<string>>();
                        foreach (TableRow row in table.Descendants<TableRow>())
                        {
                            List<string> rowContents = new List<string>();
                            foreach (TableCell cell in row.Descendants<TableCell>())
                            {
                                string text = cell.InnerText.Trim();
                                if (text != "")
                                {
                                    rowContents.Add(text);
                                }
                            }
                            if (rowContents.Count > 0)
                            {
                                tableContents.Add(rowContents);
                            }
                        }
                        tablesContents.Add(tableContents);
                    });

                }
                Debug.WriteLine(i + 1);
                if (i == 0)
                {
                    porcessTablesContents1(whoData, tablesContents);
                } else if (i > 0 && i <= 3)
                {
                    porcessTablesContents2(whoData, tablesContents);
                }
                else if (i > 3 && i <= 10)
                {
                    porcessTablesContents3(whoData, tablesContents);
                }
                else if (i > 10 && i <= 12)
                {
                    porcessTablesContents4(whoData, tablesContents, i);
                }
                else if (i > 12 && i <= 21)
                {
                    porcessTablesContents5(whoData, tablesContents);
                }
                else if (i > 21 && i <= 22)
                {
                    porcessTablesContents6(whoData, tablesContents);
                }
                else if (i > 22 && i <= 23)
                {
                    porcessTablesContents7(whoData, tablesContents);
                }
                else if (i > 23 && i <= 26)
                {
                    porcessTablesContents8(whoData, tablesContents);
                }
                else if (i > 26 && i <= 28)
                {
                    porcessTablesContents9(whoData, tablesContents);
                }
                else if (i > 28 && i <= 31)
                {
                    porcessTablesContents10(whoData, tablesContents);
                }
                else if (i > 31 && i <= 32)
                {
                    porcessTablesContents11(whoData, tablesContents);
                }
                else if (i > 32 && i <= 37)
                {
                    porcessTablesContents12(whoData, tablesContents, i);
                }
                else if (i > 37 && i <= 40)
                {
                    porcessTablesContents13(whoData, tablesContents, i);
                }
                else if (i > 40 && i <= 48)
                {
                    porcessTablesContents14(whoData, tablesContents, i);
                }
                overallData.Add(whoData);
                
            }
            string jsonString = JsonConvert.SerializeObject(overallData);
            Debug.WriteLine(jsonString);
            string outputFileLocation = "../../../../who_output.json";
            bool fileExists = File.Exists(outputFileLocation);
            if (fileExists)
            {
                File.Delete(outputFileLocation);
            }
            File.WriteAllText(outputFileLocation, jsonString);
        }

        private void porcessTablesContents1(WHOData whoData, List<List<List<string>>> tables)
        {
            List<int> tablesToRemove = new List<int> { };
            List<string> rowsToRemove = new List<string> { "WHO Regional", "Office", "Total confirmed", "cases" };
            List<string> cellsToRemove = new List<string> { "WPRO", "SEARO" };
            List<List<List<string>>> newTables = filterTableContents(tables, tablesToRemove, rowsToRemove, cellsToRemove);
            string jsonString = JsonConvert.SerializeObject(newTables);
            Debug.WriteLine(jsonString);

            Dictionary<string, CountryData> countriesData = new Dictionary<string, CountryData>();
            CountryData chinaData = new CountryData("China");
            chinaData.SubDivisionName = "Province";
            int chinaConfirmedCasesCount = 0;
            Dictionary<string, CountrySubdivisionData> chinaSubdivisionsData = new Dictionary<string, CountrySubdivisionData>();
            
            for (int t = 0; t < newTables.Count; t++)
            {
                List<List<string>> table = newTables[t];

                for (int r = 0; r < table.Count; r++)
                {
                    List<string> row = table[r];
                    string countryKey = row[0];
                    int confirmedCasesCount = Int32.Parse(row[1]);
                    if (countryKey.Contains("China"))
                    {
                        string provinceKey = countryKey.Replace("China – ", "");
                        CountrySubdivisionData subDivisionData = new CountrySubdivisionData(provinceKey);
                        subDivisionData.ConfirmedCases = confirmedCasesCount;
                        chinaSubdivisionsData.Add(provinceKey, subDivisionData);
                        chinaConfirmedCasesCount = chinaConfirmedCasesCount + confirmedCasesCount;
                    } else
                    {
                        CountryData countryData = new CountryData(countryKey);
                        countryData.ConfirmedCases = confirmedCasesCount;
                        countriesData.Add(countryKey, countryData);
                    }
                }
                
            }
            chinaData.SubDivisionData = chinaSubdivisionsData;
            chinaData.ConfirmedCases = chinaConfirmedCasesCount;
            countriesData.Add("China", chinaData);
            whoData.CountriesData = countriesData;
        }

        private void porcessTablesContents2(WHOData whoData, List<List<List<string>>> tables)
        {
            List<int> tablesToRemove = new List<int> { };
            List<string> rowsToRemove = new List<string> { "WHO Regional Office", "Cases", "Total", "Total Confirmed cases", "Region" };
            List<string> cellsToRemove = new List<string> { "WHO WPRO Region", "WHO SEARO Region", "WHO AMRO Region" };
            List<List<List<string>>> newTables = filterTableContents(tables, tablesToRemove, rowsToRemove, cellsToRemove);
            string jsonString = JsonConvert.SerializeObject(newTables);
            Debug.WriteLine(jsonString);

            Dictionary<string, CountryData> countriesData = new Dictionary<string, CountryData>();
            CountryData chinaData = new CountryData("China");
            chinaData.SubDivisionName = "Province";
            int chinaConfirmedCasesCount = 0;
            Dictionary<string, CountrySubdivisionData> chinaSubdivisionsData = new Dictionary<string, CountrySubdivisionData>();

            for (int t = 0; t < newTables.Count; t++)
            {
                List<List<string>> table = newTables[t];
                bool isChina = true;
                for (int r = 0; r < table.Count; r++)
                {
                    List<string> row = table[r];
                    string countryKey = row[0];
                    int confirmedCasesCount = Int32.Parse(row[1]);
                    if (countryKey == "Japan")
                    {
                        isChina = false;
                    }
                    if (isChina)
                    {
                        string provinceKey = countryKey;
                        if (provinceKey == "Unspecified4")
                        {
                            provinceKey = "Unspecified";
                        }
                        CountrySubdivisionData subDivisionData = new CountrySubdivisionData(provinceKey);
                        subDivisionData.ConfirmedCases = confirmedCasesCount;
                        chinaSubdivisionsData.Add(provinceKey, subDivisionData);
                        chinaConfirmedCasesCount = chinaConfirmedCasesCount + confirmedCasesCount;
                    }
                    else
                    {
                        CountryData countryData = new CountryData(countryKey);
                        countryData.ConfirmedCases = confirmedCasesCount;
                        countriesData.Add(countryKey, countryData);
                    }
                }

            }
            chinaData.SubDivisionData = chinaSubdivisionsData;
            chinaData.ConfirmedCases = chinaConfirmedCasesCount;
            countriesData.Add("China", chinaData);
            whoData.CountriesData = countriesData;
        }

        private void porcessTablesContents3(WHOData whoData, List<List<List<string>>> tables)
        {
            List<int> tablesToRemove = new List<int> { };
            List<string> rowsToRemove = new List<string> { "WHO Regional Office", "Cases", "WHO WPRO Region", "WHO SEARO Region", "WHO PAHO Region", "WHO EURO Region", "Total Confirmed", "cases", "Total Confirmed cases" };
            List<string> cellsToRemove = new List<string> { "Total", "Western Pacific", "Region of the Americas", "European Region", "South-East Asia", "Eastern Mediterranean" };
            List<List<List<string>>> newTables = filterTableContents(tables, tablesToRemove, rowsToRemove, cellsToRemove);
            string jsonString = JsonConvert.SerializeObject(newTables);
            Debug.WriteLine(jsonString);

            Dictionary<string, CountryData> countriesData = new Dictionary<string, CountryData>();
            for (int t = 0; t < newTables.Count; t++)
            {
                List<List<string>> table = newTables[t];
                for (int r = 0; r < table.Count; r++)
                {
                    List<string> row = table[r];
                    string countryKey = row[0].Replace("*", "");
                    if (row.Count == 1)
                    {
                        if (countryKey == "Nepal")
                        {
                            break;
                        }
                    }
                    if (countryKey == "Federal Democratic Republic of")
                    {
                        countryKey = "Nepal";
                    }
                    int confirmedCasesCount = Int32.Parse(row[1].Replace("*", "").Replace(",", ""));
                    CountryData countryData = new CountryData(countryKey);
                    countryData.ConfirmedCases = confirmedCasesCount;
                    countriesData.Add(countryKey, countryData);
                }

            }
            whoData.CountriesData = countriesData;
        }


        private void porcessTablesContents4(WHOData whoData, List<List<List<string>>> tables, int index)
        {
            List<int> tablesToRemove = index == 11 ? new List<int> { 0 } : new List<int> { };
            List<string> rowsToRemove = new List<string> { "Province/Region/City", "Total", "WHO Regional Office", "China*" };
            List<string> cellsToRemove = new List<string> { "Western Pacific", "South-East Asia", "Region of the Americas", "European Region", "Eastern Mediterranean" };
            List<List<List<string>>> newTables = filterTableContents(tables, tablesToRemove, rowsToRemove, cellsToRemove);
            string jsonString = JsonConvert.SerializeObject(newTables);
            Debug.WriteLine(jsonString);

            Dictionary<string, CountryData> countriesData = new Dictionary<string, CountryData>();
            CountryData chinaData = new CountryData("China");
            chinaData.SubDivisionName = "Province";
            int chinaConfirmedCasesCount = 0;
            Dictionary<string, CountrySubdivisionData> chinaSubdivisionsData = new Dictionary<string, CountrySubdivisionData>();

            for (int t = 0; t < newTables.Count; t++)
            {
                List<List<string>> table = newTables[t];
                for (int r = 0; r < table.Count; r++)
                {
                    List<string> row = table[r];
                    string countryKey = row[0];
                    int confirmedCasesCount = Int32.Parse(row[1]);
                    if (t == 0)
                    {
                        string provinceKey = countryKey;
                        CountrySubdivisionData subDivisionData = new CountrySubdivisionData(provinceKey);
                        subDivisionData.ConfirmedCases = confirmedCasesCount;
                        chinaSubdivisionsData.Add(provinceKey, subDivisionData);
                        chinaConfirmedCasesCount = chinaConfirmedCasesCount + confirmedCasesCount;
                    }
                    else
                    {
                        CountryData countryData = new CountryData(countryKey);
                        countryData.ConfirmedCases = confirmedCasesCount;
                        countriesData.Add(countryKey, countryData);
                    }
                }

            }
            chinaData.SubDivisionData = chinaSubdivisionsData;
            chinaData.ConfirmedCases = chinaConfirmedCasesCount;
            countriesData.Add("China", chinaData);
            whoData.CountriesData = countriesData;
        }

        private void porcessTablesContents5(WHOData whoData, List<List<List<string>>> tables)
        {
            List<int> tablesToRemove = new List<int> { };
            List<string> rowsToRemove = new List<string> { "cases with", "international", "investigation", "under", "transmission", "Confirmed*", "Province/Region/City", "Total", "WHO Region", "WHO Regional Office", "Total (new)", "Confirmed", "WHO Regional", "Country/Territory/Area", "Office", "cases", "outside of China", "Mediterranean", "to China", "Area", "history to", "Region", "(new) cases" };
            List<string> cellsToRemove = new List<string> { "Other", "Western Pacific", "Western Pacific Region", "South-East Asia", "South-East Asia Region", "Region of the Americas", "European Region", "Eastern Mediterranean", "Region of the", "Eastern", "Americas"};
            List<List<List<string>>> newTables = filterTableContents(tables, tablesToRemove, rowsToRemove, cellsToRemove);
            string jsonString = JsonConvert.SerializeObject(newTables);
            Debug.WriteLine(jsonString);

            Dictionary<string, CountryData> countriesData = new Dictionary<string, CountryData>();
            CountryData chinaData = new CountryData("China");
            chinaData.SubDivisionName = "Province";
            int chinaConfirmedCasesCount = 0;
            Dictionary<string, CountrySubdivisionData> chinaSubdivisionsData = new Dictionary<string, CountrySubdivisionData>();

            for (int t = 0; t < newTables.Count; t++)
            {
                List<List<string>> table = newTables[t];
                for (int r = 0; r < table.Count; r++)
                {
                    List<string> row = table[r];
                    string countryKey = row[0];
                    if (countryKey.Contains("(") || countryKey.Contains(")") || int.TryParse(countryKey, out int n) || row.Count == 1)
                    {
                        if (!countryKey.Contains("(Japan)"))
                        {
                            continue;
                        }
                    }
                    if (countryKey == "United States of" || countryKey == "America")
                    {
                        countryKey = "United States of America";
                    }
                    if (countryKey == "United Arab")
                    {
                        countryKey = "United Arab Emirates";
                    }
                    if (countryKey == "China*" || countryKey == "China‡")
                    {
                        countryKey = "China";
                    }
                    if (countryKey == "International conveyance (Japan)" || countryKey == "conveyance (Japan)")
                    {
                        countryKey = "International Conveyance Diamond Princess";
                    }

                    string regexToRemoveBrackets = "(\\[.*\\])|(\".*\")|('.*')|(\\(.*\\))";
                    int confirmedCasesCount = Int32.Parse(Regex.Replace(row[1], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", ""));
                    if (t == 0)
                    {
                        string provinceKey = countryKey;
                        CountrySubdivisionData subDivisionData = new CountrySubdivisionData(provinceKey);
                        subDivisionData.ConfirmedCases = confirmedCasesCount;
                        chinaSubdivisionsData.Add(provinceKey, subDivisionData);
                        chinaConfirmedCasesCount = chinaConfirmedCasesCount + confirmedCasesCount;
                    }
                    else
                    {
                        if (countryKey == "China")
                        {
                            int deathsCount = Int32.Parse(Regex.Replace(row[2], regexToRemoveBrackets, "").Replace(" ", ""));
                            chinaData.Deaths = deathsCount;
                        }
                        else
                        {
                            int deathsCountIndex = row.Count == 7 ? 6 : 5;
                            int deathsCount = Int32.Parse(Regex.Replace(row[deathsCountIndex], regexToRemoveBrackets, "").Replace(" ", ""));
                            CountryData countryData = new CountryData(countryKey);
                            countryData.ConfirmedCases = confirmedCasesCount;
                            countryData.Deaths = deathsCount;
                            countriesData.Add(countryKey, countryData);
                        }
                    }
                }

            }
            chinaData.SubDivisionData = chinaSubdivisionsData;
            chinaData.ConfirmedCases = chinaConfirmedCasesCount;
            countriesData.Add("China", chinaData);
            whoData.CountriesData = countriesData;
        }

        private void porcessTablesContents6(WHOData whoData, List<List<List<string>>> tables)
        {
            List<int> tablesToRemove = new List<int> { };
            List<string> rowsToRemove = new List<string> { "Total", "cases with", "WHO Region", "cases (new)", "investigation", "(new)", "Province/Region/City1", "Cases2", "International" };
            List<string> cellsToRemove = new List<string> { "Western Pacific Region", "South-East Asia Region", "Region of the Americas", "United States of", "European Region", "Eastern Mediterranean", "Region", "Other" };
            List<List<List<string>>> newTables = filterTableContents(tables, tablesToRemove, rowsToRemove, cellsToRemove);
            string jsonString = JsonConvert.SerializeObject(newTables);
            Debug.WriteLine(jsonString);

            Dictionary<string, CountryData> countriesData = new Dictionary<string, CountryData>();
            CountryData chinaData = new CountryData("China");
            chinaData.SubDivisionName = "Province";
            int chinaConfirmedCasesCount = 0;
            Dictionary<string, CountrySubdivisionData> chinaSubdivisionsData = new Dictionary<string, CountrySubdivisionData>();

            for (int t = 0; t < newTables.Count; t++)
            {
                List<List<string>> table = newTables[t];
                for (int r = 0; r < table.Count; r++)
                {
                    List<string> row = table[r];
                    string countryKey = row[0];

                    if (t == 0)
                    {
                        string provinceKey = countryKey;
                        CountrySubdivisionData subDivisionData = new CountrySubdivisionData(provinceKey);
                        int confirmedCasesCount = Int32.Parse(row[2]);
                        subDivisionData.ConfirmedCases = confirmedCasesCount;
                        chinaSubdivisionsData.Add(provinceKey, subDivisionData);
                        chinaConfirmedCasesCount = chinaConfirmedCasesCount + confirmedCasesCount;
                    }
                    else
                    {
                        if (countryKey == "China‡")
                        {
                            countryKey = "China";
                        }
                        if (countryKey == "conveyance (Japan)")
                        {
                            countryKey = "International Conveyance Diamond Princess";
                        }
                        if (countryKey == "America")
                        {
                            countryKey = "United States of America";
                        }
                        string regexToRemoveBrackets = "(\\[.*\\])|(\".*\")|('.*')|(\\(.*\\))";
                        if (countryKey == "China")
                        {
                            int deathsCount = Int32.Parse(Regex.Replace(row[2], regexToRemoveBrackets, "").Replace(" ", ""));
                            chinaData.Deaths = deathsCount;
                        }
                        else
                        {
                            int confirmedCasesCount = Int32.Parse(Regex.Replace(row[1], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));
                            int deathsCount = Int32.Parse(Regex.Replace(row[5], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));
                            CountryData countryData = new CountryData(countryKey);
                            countryData.ConfirmedCases = confirmedCasesCount;
                            countryData.Deaths = deathsCount;
                            countriesData.Add(countryKey, countryData);
                        }
                    }
                }

            }
            chinaData.SubDivisionData = chinaSubdivisionsData;
            chinaData.ConfirmedCases = chinaConfirmedCasesCount;
            countriesData.Add("China", chinaData);
            whoData.CountriesData = countriesData;
        }

        private void porcessTablesContents7(WHOData whoData, List<List<List<string>>> tables)
        {
            List<int> tablesToRemove = new List<int> { 0 };
            List<string> rowsToRemove = new List<string> { "Province/Region/City1", "Total", "cases with", "WHO Region", "cases (new)", "outside of China†", "(new)", "China‡", "Other" };
            List<string> cellsToRemove = new List<string> { "Western Pacific Region", "South-East Asia Region", "United States of", "Region of the Americas", "European Region", "Eastern Mediterranean", "Region" };
            List<List<List<string>>> newTables = filterTableContents(tables, tablesToRemove, rowsToRemove, cellsToRemove);
            string jsonString = JsonConvert.SerializeObject(newTables);
            Debug.WriteLine(jsonString);

            Dictionary<string, CountryData> countriesData = new Dictionary<string, CountryData>();
            CountryData chinaData = new CountryData("China");
            chinaData.SubDivisionName = "Province";
            int chinaConfirmedCasesCount = 0;
            Dictionary<string, CountrySubdivisionData> chinaSubdivisionsData = new Dictionary<string, CountrySubdivisionData>();

            for (int t = 0; t < newTables.Count; t++)
            {
                List<List<string>> table = newTables[t];
                for (int r = 0; r < table.Count; r++)
                {
                    List<string> row = table[r];
                    string countryKey = row[0];
                    if (countryKey == "America")
                    {
                        countryKey = "United States of America";
                    }
                    if (countryKey == "conveyance (Japan)")
                    {
                        countryKey = "International Conveyance Diamond Princess";
                    }

                    if (t == 0)
                    {
                        string provinceKey = countryKey;
                        CountrySubdivisionData subDivisionData = new CountrySubdivisionData(provinceKey);
                        int confirmedCasesCount = Int32.Parse(row[2]);
                        subDivisionData.ConfirmedCases = confirmedCasesCount;
                        chinaSubdivisionsData.Add(provinceKey, subDivisionData);
                        chinaConfirmedCasesCount = chinaConfirmedCasesCount + confirmedCasesCount;
                    }
                    else
                    {
                        CountryData countryData = new CountryData(countryKey);
                        string regexToRemoveBrackets = "(\\[.*\\])|(\".*\")|('.*')|(\\(.*\\))";
                        int confirmedCasesCount = Int32.Parse(Regex.Replace(row[1], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));
                        countryData.ConfirmedCases = confirmedCasesCount;
                        countriesData.Add(countryKey, countryData);
                    }
                }

            }
            chinaData.SubDivisionData = chinaSubdivisionsData;
            chinaData.ConfirmedCases = chinaConfirmedCasesCount;
            countriesData.Add("China", chinaData);
            whoData.CountriesData = countriesData;
        }

        private void porcessTablesContents8(WHOData whoData, List<List<List<string>>> tables)
        {
            List<int> tablesToRemove = new List<int> { };
            List<string> rowsToRemove = new List<string> { "Population", "Region/", "Lab-", "cases", "Totals", "Total", "site of", "WHO Region", "(new)", "investigation", "International" };
            List<string> cellsToRemove = new List<string> { "Western Pacific Region", "South-East Asia Region", "United States of", "Region of the Americas", "European Region", "Eastern Mediterranean", "Region",  };
            List<List<List<string>>> newTables = filterTableContents(tables, tablesToRemove, rowsToRemove, cellsToRemove);
            string jsonString = JsonConvert.SerializeObject(newTables);
            Debug.WriteLine(jsonString);

            Dictionary<string, CountryData> countriesData = new Dictionary<string, CountryData>();
            CountryData chinaData = new CountryData("China");
            chinaData.SubDivisionName = "Province";
            int chinaConfirmedCasesCount = 0;
            int chinaDeathsCount = 0;
            int chinaNewConfirmedCasesCount = 0;
            int chinaNewDeathsCount = 0;
            Dictionary<string, CountrySubdivisionData> chinaSubdivisionsData = new Dictionary<string, CountrySubdivisionData>();

            for (int t = 0; t < newTables.Count; t++)
            {
                List<List<string>> table = newTables[t];
                for (int r = 0; r < table.Count; r++)
                {
                    List<string> row = table[r];
                    string countryKey = row[0];

                    if (t == 0)
                    {
                        string provinceKey = countryKey;
                        CountrySubdivisionData subDivisionData = new CountrySubdivisionData(provinceKey);
                        int confirmedCasesCount = Int32.Parse(row[9].Replace(" ", ""));
                        int deathsCount = Int32.Parse(row[10].Replace(" ", ""));
                        int newConfirmedCasesCount = Int32.Parse(row[4].Replace(" ", ""));
                        int newDeathsCount = Int32.Parse(row[6].Replace(" ", ""));
                        chinaSubdivisionsData.Add(provinceKey, subDivisionData);
                        subDivisionData.ConfirmedCases = confirmedCasesCount;
                        subDivisionData.Deaths = deathsCount;
                        subDivisionData.NewConfirmedCases = newConfirmedCasesCount;
                        subDivisionData.NewDeaths = newDeathsCount;
                        chinaConfirmedCasesCount = chinaConfirmedCasesCount + confirmedCasesCount;
                        chinaDeathsCount = chinaDeathsCount + deathsCount;
                        chinaNewConfirmedCasesCount = chinaNewConfirmedCasesCount + newConfirmedCasesCount;
                        chinaNewDeathsCount = chinaNewDeathsCount + newDeathsCount;
                    }
                    else
                    {
                        if (countryKey == "conveyance (Japan)")
                        {
                            countryKey = "International Conveyance Diamond Princess";
                        }
                        if (countryKey == "America")
                        {
                            countryKey = "United States of America";
                        }
                        string regexToRemoveBrackets = "(\\[.*\\])|(\".*\")|('.*')|(\\(.*\\))";
                        if (countryKey == "China")
                        {
                        }
                        else
                        {
                            int confirmedCasesCount = Int32.Parse(Regex.Replace(row[1], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));
                            int deathsCount = Int32.Parse(Regex.Replace(row[5], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));
                            CountryData countryData = new CountryData(countryKey);
                            countryData.ConfirmedCases = confirmedCasesCount;
                            countryData.Deaths = deathsCount;
                            countriesData.Add(countryKey, countryData);
                        }
                    }
                }

            }
            chinaData.SubDivisionData = chinaSubdivisionsData;
            chinaData.ConfirmedCases = chinaConfirmedCasesCount;
            chinaData.Deaths = chinaDeathsCount;
            chinaData.NewConfirmedCases = chinaNewConfirmedCasesCount;
            chinaData.NewDeaths = chinaNewDeathsCount;
            countriesData.Add("China", chinaData);
            whoData.CountriesData = countriesData;
        }

        private void porcessTablesContents9(WHOData whoData, List<List<List<string>>> tables)
        {
            List<int> tablesToRemove = new List<int> { };
            List<string> rowsToRemove = new List<string> { "Deaths", "Population", "Region/", "Lab-", "cases", "Totals", "Total", "site of", "WHO Region", "(new)", "investigation", "International" };
            List<string> cellsToRemove = new List<string> { "Western Pacific Region", "South-East Asia Region", "Region of the Americas", "European Region", "Eastern Mediterranean", "Region", };
            List<List<List<string>>> newTables = filterTableContents(tables, tablesToRemove, rowsToRemove, cellsToRemove);
            string jsonString = JsonConvert.SerializeObject(newTables);
            Debug.WriteLine(jsonString);

            Dictionary<string, CountryData> countriesData = new Dictionary<string, CountryData>();
            CountryData chinaData = new CountryData("China");
            chinaData.SubDivisionName = "Province";
            int chinaConfirmedCasesCount = 0;
            int chinaDeathsCount = 0;
            int chinaNewConfirmedCasesCount = 0;
            int chinaNewDeathsCount = 0;
            Dictionary<string, CountrySubdivisionData> chinaSubdivisionsData = new Dictionary<string, CountrySubdivisionData>();

            for (int t = 0; t < newTables.Count; t++)
            {
                List<List<string>> table = newTables[t];
                for (int r = 0; r < table.Count; r++)
                {
                    List<string> row = table[r];
                    string countryKey = row[0];

                    if (t == 0)
                    {
                        string provinceKey = countryKey;
                        CountrySubdivisionData subDivisionData = new CountrySubdivisionData(provinceKey);
                        int confirmedCasesCount = Int32.Parse(row[5].Replace(" ", ""));
                        int deathsCount = Int32.Parse(row[6].Replace(" ", ""));
                        int newConfirmedCasesCount = Int32.Parse(row[2].Replace(" ", ""));
                        int newDeathsCount = Int32.Parse(row[4].Replace(" ", ""));
                        chinaSubdivisionsData.Add(provinceKey, subDivisionData);
                        subDivisionData.ConfirmedCases = confirmedCasesCount;
                        subDivisionData.Deaths = deathsCount;
                        subDivisionData.NewConfirmedCases = newConfirmedCasesCount;
                        subDivisionData.NewDeaths = newDeathsCount;
                        chinaConfirmedCasesCount = chinaConfirmedCasesCount + confirmedCasesCount;
                        chinaDeathsCount = chinaDeathsCount + deathsCount;
                        chinaNewConfirmedCasesCount = chinaNewConfirmedCasesCount + newConfirmedCasesCount;
                        chinaNewDeathsCount = chinaNewDeathsCount + newDeathsCount;
                    }
                    else
                    {
                        if (countryKey == "conveyance (Japan)")
                        {
                            countryKey = "International Conveyance Diamond Princess";
                        }
                        if (countryKey == "America" || countryKey == "United States of")
                        {
                            countryKey = "United States of America";
                        }
                        string regexToRemoveBrackets = "(\\[.*\\])|(\".*\")|('.*')|(\\(.*\\))";
                        if (countryKey == "China")
                        {
                        }
                        else
                        {
                            if (row.Count == 1)
                            {
                                continue;
                            }
                            int confirmedCasesCount = Int32.Parse(Regex.Replace(row[1], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));
                            int deathsCount = Int32.Parse(Regex.Replace(row[5], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));
                            CountryData countryData = new CountryData(countryKey);
                            countryData.ConfirmedCases = confirmedCasesCount;
                            countryData.Deaths = deathsCount;
                            countriesData.Add(countryKey, countryData);
                        }
                    }
                }

            }
            chinaData.SubDivisionData = chinaSubdivisionsData;
            chinaData.ConfirmedCases = chinaConfirmedCasesCount;
            chinaData.Deaths = chinaDeathsCount;
            chinaData.NewConfirmedCases = chinaNewConfirmedCasesCount;
            chinaData.NewDeaths = chinaNewDeathsCount;
            countriesData.Add("China", chinaData);
            whoData.CountriesData = countriesData;
        }

        private void porcessTablesContents10(WHOData whoData, List<List<List<string>>> tables)
        {
            List<int> tablesToRemove = new List<int> { };
            List<string> rowsToRemove = new List<string> { "Subtotal for all regions", "Grand total", "reporting", "In", "Area", "outside", "China (new)", "Deaths", "Population", "Region/", "Lab-", "cases", "Totals", "Total", "site of", "WHO Region", "(new)", "investigation" };
            List<string> cellsToRemove = new List<string> { "Western Pacific Region", "South-East Asia Region", "Region of the Americas", "European Region", "Eastern Mediterranean", "Region", };
            List<List<List<string>>> newTables = filterTableContents(tables, tablesToRemove, rowsToRemove, cellsToRemove);
            string jsonString = JsonConvert.SerializeObject(newTables);
            Debug.WriteLine(jsonString);

            Dictionary<string, CountryData> countriesData = new Dictionary<string, CountryData>();
            CountryData chinaData = new CountryData("China");
            chinaData.SubDivisionName = "Province";
            int chinaConfirmedCasesCount = 0;
            int chinaDeathsCount = 0;
            int chinaNewConfirmedCasesCount = 0;
            int chinaNewDeathsCount = 0;
            Dictionary<string, CountrySubdivisionData> chinaSubdivisionsData = new Dictionary<string, CountrySubdivisionData>();

            for (int t = 0; t < newTables.Count; t++)
            {
                List<List<string>> table = newTables[t];
                for (int r = 0; r < table.Count; r++)
                {
                    List<string> row = table[r];
                    string countryKey = row[0];

                    if (t == 0)
                    {
                        string provinceKey = countryKey;
                        CountrySubdivisionData subDivisionData = new CountrySubdivisionData(provinceKey);
                        int confirmedCasesCount = Int32.Parse(row[5].Replace(" ", ""));
                        int deathsCount = Int32.Parse(row[6].Replace(" ", ""));
                        int newConfirmedCasesCount = Int32.Parse(row[2].Replace(" ", ""));
                        int newDeathsCount = Int32.Parse(row[4].Replace(" ", ""));
                        chinaSubdivisionsData.Add(provinceKey, subDivisionData);
                        subDivisionData.ConfirmedCases = confirmedCasesCount;
                        subDivisionData.Deaths = deathsCount;
                        subDivisionData.NewConfirmedCases = newConfirmedCasesCount;
                        subDivisionData.NewDeaths = newDeathsCount;
                        chinaConfirmedCasesCount = chinaConfirmedCasesCount + confirmedCasesCount;
                        chinaDeathsCount = chinaDeathsCount + deathsCount;
                        chinaNewConfirmedCasesCount = chinaNewConfirmedCasesCount + newConfirmedCasesCount;
                        chinaNewDeathsCount = chinaNewDeathsCount + newDeathsCount;
                    }
                    else
                    {
                        if (countryKey == "conveyance (Japan)" || countryKey == "International" || countryKey == "conveyance‡" || countryKey == "conveyance‡ (Diamond")
                        {
                            countryKey = "International Conveyance Diamond Princess";
                        }
                        if (countryKey == "America" || countryKey == "United States of")
                        {
                            countryKey = "United States of America";
                        }
                        if (countryKey == "The United")
                        {
                            countryKey = "The United Kingdom";
                        }
                        if (countryKey == "United Arab")
                        {
                            countryKey = "United Arab Emirates";
                        }
                        if (countryKey == "Iran (Islamic")
                        {
                            countryKey = "Iran (Islamic Republic of)";
                        }
                        string regexToRemoveBrackets = "(\\[.*\\])|(\".*\")|('.*')|(\\(.*\\))";
                        if (countryKey == "China")
                        {
                        }
                        else
                        {
                            if (row.Count == 1)
                            {
                                continue;
                            }
                            int confirmedCasesCount = Int32.Parse(Regex.Replace(row[1], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));
                            int deathsCount = Int32.Parse(Regex.Replace(row[6], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));
                            CountryData countryData = new CountryData(countryKey);
                            countryData.ConfirmedCases = confirmedCasesCount;
                            countryData.Deaths = deathsCount;
                            countriesData.Add(countryKey, countryData);
                        }
                    }
                }

            }
            chinaData.SubDivisionData = chinaSubdivisionsData;
            chinaData.ConfirmedCases = chinaConfirmedCasesCount;
            chinaData.Deaths = chinaDeathsCount;
            chinaData.NewConfirmedCases = chinaNewConfirmedCasesCount;
            chinaData.NewDeaths = chinaNewDeathsCount;
            countriesData.Add("China", chinaData);
            whoData.CountriesData = countriesData;
        }

        private void porcessTablesContents11(WHOData whoData, List<List<List<string>>> tables)
        {
            List<int> tablesToRemove = new List<int> { 0 };
            List<string> rowsToRemove = new List<string> { "Confirmed", "Subtotal for all regions", "Grand total", "reporting", "In", "Area", "outside", "China (new)", "Deaths", "Population", "Region/", "Lab-", "cases", "Totals", "Total", "site of", "WHO Region", "(new)", "investigation" };
            List<string> cellsToRemove = new List<string> { "Western Pacific Region", "South-East Asia Region", "Region of the Americas", "European Region", "Eastern Mediterranean", "Region", };
            List<List<List<string>>> newTables = filterTableContents(tables, tablesToRemove, rowsToRemove, cellsToRemove);
            string jsonString = JsonConvert.SerializeObject(newTables);
            Debug.WriteLine(jsonString);

            Dictionary<string, CountryData> countriesData = new Dictionary<string, CountryData>();
            CountryData chinaData = new CountryData("China");
            chinaData.SubDivisionName = "Province";
            int chinaConfirmedCasesCount = 0;
            int chinaDeathsCount = 0;
            int chinaNewConfirmedCasesCount = 0;
            int chinaNewDeathsCount = 0;
            Dictionary<string, CountrySubdivisionData> chinaSubdivisionsData = new Dictionary<string, CountrySubdivisionData>();

            for (int t = 0; t < newTables.Count; t++)
            {
                List<List<string>> table = newTables[t];
                for (int r = 0; r < table.Count; r++)
                {
                    List<string> row = table[r];
                    string countryKey = row[0];

                    if (t == 0)
                    {
                        string provinceKey = countryKey;
                    
                        CountrySubdivisionData subDivisionData = new CountrySubdivisionData(provinceKey);
                        int confirmedCasesCount = Int32.Parse(row[5].Replace(" ", "").Replace("*", ""));
                        int deathsCount = Int32.Parse(row[6].Replace(" ", "").Replace("*", ""));
                        int newConfirmedCasesCount = Int32.Parse(row[2].Replace(" ", "").Replace("*", ""));
                        int newDeathsCount = Int32.Parse(row[4].Replace(" ", "").Replace("*", ""));
                        chinaSubdivisionsData.Add(provinceKey, subDivisionData);
                        subDivisionData.ConfirmedCases = confirmedCasesCount;
                        subDivisionData.Deaths = deathsCount;
                        subDivisionData.NewConfirmedCases = newConfirmedCasesCount;
                        subDivisionData.NewDeaths = newDeathsCount;
                        chinaConfirmedCasesCount = chinaConfirmedCasesCount + confirmedCasesCount;
                        chinaDeathsCount = chinaDeathsCount + deathsCount;
                        chinaNewConfirmedCasesCount = chinaNewConfirmedCasesCount + newConfirmedCasesCount;
                        chinaNewDeathsCount = chinaNewDeathsCount + newDeathsCount;
                    }
                    else
                    {
                        if (countryKey == "conveyance (Japan)" || countryKey == "International" || countryKey == "conveyance‡" || countryKey == "conveyance‡ (Diamond" || countryKey == "Princess)")
                        {
                            countryKey = "International Conveyance Diamond Princess";
                        }
                        if (countryKey == "America" || countryKey == "United States of")
                        {
                            countryKey = "United States of America";
                        }
                        if (countryKey == "The United")
                        {
                            countryKey = "The United Kingdom";
                        }
                        if (countryKey == "United Arab")
                        {
                            countryKey = "United Arab Emirates";
                        }
                        if (countryKey == "Iran (Islamic")
                        {
                            countryKey = "Iran (Islamic Republic of)";
                        }
                        string regexToRemoveBrackets = "(\\[.*\\])|(\".*\")|('.*')|(\\(.*\\))";
                        if (countryKey == "China")
                        {
                        }
                        else
                        {
                            if (row.Count == 1)
                            {
                                continue;
                            }
                            int confirmedCasesCount = Int32.Parse(Regex.Replace(row[1], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));
                            int deathsCount = Int32.Parse(Regex.Replace(row[6], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));
                            CountryData countryData = new CountryData(countryKey);
                            countryData.ConfirmedCases = confirmedCasesCount;
                            countryData.Deaths = deathsCount;
                            countriesData.Add(countryKey, countryData);
                        }
                    }
                }

            }
            chinaData.SubDivisionData = chinaSubdivisionsData;
            chinaData.ConfirmedCases = chinaConfirmedCasesCount;
            chinaData.Deaths = chinaDeathsCount;
            chinaData.NewConfirmedCases = chinaNewConfirmedCasesCount;
            chinaData.NewDeaths = chinaNewDeathsCount;
            countriesData.Add("China", chinaData);
            whoData.CountriesData = countriesData;
        }

        private void porcessTablesContents12(WHOData whoData, List<List<List<string>>> tables, int index)
        {
            List<int> tablesToRemove = new List<int> { };
            if (index == 38)
            {
                tablesToRemove.Add(0);
            }
            List<string> rowsToRemove = new List<string> { "Grand total§", "City", "country and", "Confirmed", "Subtotal for all regions", "Grand total", "reporting", "In", "Area", "outside", "China (new)", "Deaths", "Population", "Region/", "Lab-", "cases", "Totals", "Total", "site of", "WHO Region", "(new)", "investigation" };
            List<string> cellsToRemove = new List<string> { "Western Pacific Region", "South-East Asia Region", "Region of the Americas", "European Region", "Eastern Mediterranean", "Region", };
            List<List<List<string>>> newTables = filterTableContents(tables, tablesToRemove, rowsToRemove, cellsToRemove);
            string jsonString = JsonConvert.SerializeObject(newTables);
            Debug.WriteLine(jsonString);

            Dictionary<string, CountryData> countriesData = new Dictionary<string, CountryData>();
            CountryData chinaData = new CountryData("China");
            chinaData.SubDivisionName = "Province";
            int chinaConfirmedCasesCount = 0;
            int chinaDeathsCount = 0;
            int chinaNewConfirmedCasesCount = 0;
            int chinaNewDeathsCount = 0;
            Dictionary<string, CountrySubdivisionData> chinaSubdivisionsData = new Dictionary<string, CountrySubdivisionData>();

            for (int t = 0; t < newTables.Count; t++)
            {
                List<List<string>> table = newTables[t];
                for (int r = 0; r < table.Count; r++)
                {
                    List<string> row = table[r];
                    string countryKey = row[0];

                    if (t == 0)
                    {
                        string provinceKey = countryKey;

                        CountrySubdivisionData subDivisionData = new CountrySubdivisionData(provinceKey);
                        int confirmedCasesCount = Int32.Parse(row[5].Replace(" ", "").Replace("*", ""));
                        int deathsCount = Int32.Parse(row[6].Replace(" ", "").Replace("*", ""));
                        int newConfirmedCasesCount = Int32.Parse(row[2].Replace(" ", "").Replace("*", ""));
                        int newDeathsCount = Int32.Parse(row[4].Replace(" ", "").Replace("*", ""));
                        chinaSubdivisionsData.Add(provinceKey, subDivisionData);
                        subDivisionData.ConfirmedCases = confirmedCasesCount;
                        subDivisionData.Deaths = deathsCount;
                        subDivisionData.NewConfirmedCases = newConfirmedCasesCount;
                        subDivisionData.NewDeaths = newDeathsCount;
                        chinaConfirmedCasesCount = chinaConfirmedCasesCount + confirmedCasesCount;
                        chinaDeathsCount = chinaDeathsCount + deathsCount;
                        chinaNewConfirmedCasesCount = chinaNewConfirmedCasesCount + newConfirmedCasesCount;
                        chinaNewDeathsCount = chinaNewDeathsCount + newDeathsCount;
                    }
                    else
                    {
                        if (countryKey == "conveyance (Japan)" || countryKey == "International conveyance§" || countryKey == "International" || countryKey == "conveyance‡" || countryKey == "conveyance‡ (Diamond" || countryKey == "Princess)")
                        {
                            countryKey = "International Conveyance Diamond Princess";
                        }
                        if (countryKey == "America" || countryKey == "United States of")
                        {
                            countryKey = "United States of America";
                        }
                        if (countryKey == "The United")
                        {
                            countryKey = "The United Kingdom";
                        }
                        if (countryKey == "United Arab")
                        {
                            countryKey = "United Arab Emirates";
                        }
                        if (countryKey == "Iran (Islamic")
                        {
                            countryKey = "Iran (Islamic Republic of)";
                        }
                        string regexToRemoveBrackets = "(\\[.*\\])|(\".*\")|('.*')|(\\(.*\\))";
                        if (countryKey == "China")
                        {
                        }
                        else
                        {
                            if (row.Count == 1)
                            {
                                continue;
                            }
                            int confirmedCasesCount = Int32.Parse(Regex.Replace(row[1], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));
                            int deathsCount = Int32.Parse(Regex.Replace(row[6], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));
                            CountryData countryData = new CountryData(countryKey);
                            countryData.ConfirmedCases = confirmedCasesCount;
                            countryData.Deaths = deathsCount;
                            countriesData.Add(countryKey, countryData);
                        }
                    }
                }

            }
            chinaData.SubDivisionData = chinaSubdivisionsData;
            chinaData.ConfirmedCases = chinaConfirmedCasesCount;
            chinaData.Deaths = chinaDeathsCount;
            chinaData.NewConfirmedCases = chinaNewConfirmedCasesCount;
            chinaData.NewDeaths = chinaNewDeathsCount;
            countriesData.Add("China", chinaData);
            whoData.CountriesData = countriesData;
        }

        private void porcessTablesContents13(WHOData whoData, List<List<List<string>>> tables, int index)
        {
            List<int> tablesToRemove = new List<int> { };
            if (index == 38)
            {
                tablesToRemove.Add(0);
            }
            List<string> rowsToRemove = new List<string> { "Country", "Grand total§", "City", "country and", "Confirmed", "Subtotal for all regions", "Grand total", "reporting", "In", "Area", "outside", "China (new)", "Deaths", "Population", "Region/", "Lab-", "cases", "Totals", "Total", "site of", "WHO Region", "(new)", "investigation" };
            List<string> cellsToRemove = new List<string> { "Western Pacific Region", "South-East Asia Region", "Region of the Americas", "European Region", "Eastern Mediterranean", "Region", };
            List<List<List<string>>> newTables = filterTableContents(tables, tablesToRemove, rowsToRemove, cellsToRemove);
            string jsonString = JsonConvert.SerializeObject(newTables);
            Debug.WriteLine(jsonString);

            Dictionary<string, CountryData> countriesData = new Dictionary<string, CountryData>();
            CountryData chinaData = new CountryData("China");
            chinaData.SubDivisionName = "Province";
            chinaData.TransmissionClassification = "Local transmission";
            int chinaConfirmedCasesCount = 0;
            int chinaDeathsCount = 0;
            int chinaNewConfirmedCasesCount = 0;
            int chinaNewDeathsCount = 0;
            Dictionary<string, CountrySubdivisionData> chinaSubdivisionsData = new Dictionary<string, CountrySubdivisionData>();

            for (int t = 0; t < newTables.Count; t++)
            {
                List<List<string>> table = newTables[t];
                for (int r = 0; r < table.Count; r++)
                {
                    List<string> row = table[r];
                    string countryKey = row[0];

                    if (t == 0)
                    {
                        string provinceKey = countryKey;

                        CountrySubdivisionData subDivisionData = new CountrySubdivisionData(provinceKey);
                        int confirmedCasesCount = Int32.Parse(row[5].Replace(" ", "").Replace("*", ""));
                        int deathsCount = Int32.Parse(row[6].Replace(" ", "").Replace("*", ""));
                        int newConfirmedCasesCount = Int32.Parse(row[2].Replace(" ", "").Replace("*", ""));
                        int newDeathsCount = Int32.Parse(row[4].Replace(" ", "").Replace("*", ""));
                        chinaSubdivisionsData.Add(provinceKey, subDivisionData);
                        subDivisionData.ConfirmedCases = confirmedCasesCount;
                        subDivisionData.Deaths = deathsCount;
                        subDivisionData.NewConfirmedCases = newConfirmedCasesCount;
                        subDivisionData.NewDeaths = newDeathsCount;
                        chinaConfirmedCasesCount = chinaConfirmedCasesCount + confirmedCasesCount;
                        chinaDeathsCount = chinaDeathsCount + deathsCount;
                        chinaNewConfirmedCasesCount = chinaNewConfirmedCasesCount + newConfirmedCasesCount;
                        chinaNewDeathsCount = chinaNewDeathsCount + newDeathsCount;
                    }
                    else
                    {
                        if (countryKey == "conveyance (Japan)" || countryKey == "International conveyance" || countryKey == "International conveyance§" || countryKey == "International" || countryKey == "conveyance‡" || countryKey == "conveyance‡ (Diamond" || countryKey == "Princess)")
                        {
                            countryKey = "International Conveyance Diamond Princess";
                        }
                        if (countryKey == "America" || countryKey == "United States of")
                        {
                            countryKey = "United States of America";
                        }
                        if (countryKey == "The United")
                        {
                            countryKey = "The United Kingdom";
                        }
                        if (countryKey == "United Arab")
                        {
                            countryKey = "United Arab Emirates";
                        }
                        if (countryKey == "Iran (Islamic")
                        {
                            countryKey = "Iran (Islamic Republic of)";
                        }
                        string regexToRemoveBrackets = "(\\[.*\\])|(\".*\")|('.*')|(\\(.*\\))";
                        if (countryKey == "China")
                        {
                        }
                        else
                        {
                            if (row.Count == 1)
                            {
                                continue;
                            }
                            int confirmedCasesCount = Int32.Parse(Regex.Replace(row[1], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));
                            int deathsCount = Int32.Parse(Regex.Replace(row[2], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));
                            String transmissionClassification = row[3];
                            CountryData countryData = new CountryData(countryKey);
                            countryData.ConfirmedCases = confirmedCasesCount;
                            countryData.Deaths = deathsCount;
                            countryData.TransmissionClassification = transmissionClassification;
                            countriesData.Add(countryKey, countryData);
                        }
                    }
                }

            }
            chinaData.SubDivisionData = chinaSubdivisionsData;
            chinaData.ConfirmedCases = chinaConfirmedCasesCount;
            chinaData.Deaths = chinaDeathsCount;
            chinaData.NewConfirmedCases = chinaNewConfirmedCasesCount;
            chinaData.NewDeaths = chinaNewDeathsCount;
            countriesData.Add("China", chinaData);
            whoData.CountriesData = countriesData;
        }


        private void porcessTablesContents14(WHOData whoData, List<List<List<string>>> tables, int index)
        {
            List<int> tablesToRemove = new List<int> { };
            List<string> rowsToRemove = new List<string> { "regions", "the United", "confirmed", "Reporting Country", "Subtotal for all", "deaths", "Country", "Grand total§", "City", "country and", "Confirmed", "Subtotal for all regions", "Grand total", "reporting", "In", "Area", "outside", "China (new)", "Deaths", "Population", "Region/", "Lab-", "cases", "Totals", "Total", "site of", "WHO Region", "(new)", "investigation" };
            List<string> cellsToRemove = new List<string> { "Western Pacific Region", "South-East Asia Region", "Region of the Americas", "European Region", "Eastern Mediterranean", "Region", };
            List<List<List<string>>> newTables = filterTableContents(tables, tablesToRemove, rowsToRemove, cellsToRemove);
            string jsonString = JsonConvert.SerializeObject(newTables);
            Debug.WriteLine(jsonString);

            Dictionary<string, CountryData> countriesData = new Dictionary<string, CountryData>();
            CountryData chinaData = new CountryData("China");
            chinaData.SubDivisionName = "Province";
            chinaData.TransmissionClassification = "Local transmission";
            int chinaConfirmedCasesCount = 0;
            int chinaDeathsCount = 0;
            int chinaNewConfirmedCasesCount = 0;
            int chinaNewDeathsCount = 0;
            Dictionary<string, CountrySubdivisionData> chinaSubdivisionsData = new Dictionary<string, CountrySubdivisionData>();

            for (int t = 0; t < newTables.Count; t++)
            {
                List<List<string>> table = newTables[t];
                for (int r = 0; r < table.Count; r++)
                {
                    List<string> row = table[r];
                    string countryKey = row[0];

                    if (t == 0)
                    {
                        string provinceKey = countryKey;

                        CountrySubdivisionData subDivisionData = new CountrySubdivisionData(provinceKey);
                        int confirmedCasesCount = Int32.Parse(row[5].Replace(" ", "").Replace("*", ""));
                        int deathsCount = Int32.Parse(row[6].Replace(" ", "").Replace("*", ""));
                        int newConfirmedCasesCount = Int32.Parse(row[2].Replace(" ", "").Replace("*", ""));
                        int newDeathsCount = Int32.Parse(row[4].Replace(" ", "").Replace("*", ""));
                        chinaSubdivisionsData.Add(provinceKey, subDivisionData);
                        subDivisionData.ConfirmedCases = confirmedCasesCount;
                        subDivisionData.Deaths = deathsCount;
                        subDivisionData.NewConfirmedCases = newConfirmedCasesCount;
                        subDivisionData.NewDeaths = newDeathsCount;
                        chinaConfirmedCasesCount = chinaConfirmedCasesCount + confirmedCasesCount;
                        chinaDeathsCount = chinaDeathsCount + deathsCount;
                        chinaNewConfirmedCasesCount = chinaNewConfirmedCasesCount + newConfirmedCasesCount;
                        chinaNewDeathsCount = chinaNewDeathsCount + newDeathsCount;
                    }
                    else
                    {
                        if (countryKey == "conveyance (Japan)" || countryKey == "conveyance" || countryKey == "International conveyance" || countryKey == "International conveyance§" || countryKey == "International" || countryKey == "conveyance‡" || countryKey == "conveyance‡ (Diamond" || countryKey == "Princess)")
                        {
                            countryKey = "International Conveyance Diamond Princess";
                        }
                        if (countryKey == "America" || countryKey == "United States of" || countryKey == "the United States")
                        {
                            countryKey = "United States of America";
                        }
                        if (countryKey == "The United")
                        {
                            countryKey = "The United Kingdom";
                        }
                        if (countryKey == "United Arab")
                        {
                            countryKey = "United Arab Emirates";
                        }
                        if (countryKey == "Iran (Islamic")
                        {
                            countryKey = "Iran (Islamic Republic of)";
                        }
                        string regexToRemoveBrackets = "(\\[.*\\])|(\".*\")|('.*')|(\\(.*\\))";
                        if (countryKey == "China")
                        {
                        }
                        else
                        {
                            if (row.Count == 1)
                            {
                                continue;
                            }
                            int confirmedCasesCount = Int32.Parse(Regex.Replace(row[1], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));
                            int newConfirmedCasesCount = Int32.Parse(Regex.Replace(row[2], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));
                            int deathsCount = Int32.Parse(Regex.Replace(row[3], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));
                            int newDeathsCount = Int32.Parse(Regex.Replace(row[4], regexToRemoveBrackets, "").Replace(" ", "").Replace("*", "").Replace("†", "").Replace("‡", "").Replace("§", ""));

                            String transmissionClassification = row[5];
                            CountryData countryData = new CountryData(countryKey);
                            countryData.ConfirmedCases = confirmedCasesCount;
                            countryData.NewConfirmedCases = newConfirmedCasesCount;
                            countryData.Deaths = deathsCount;
                            countryData.NewDeaths = newDeathsCount;
                            countryData.TransmissionClassification = transmissionClassification;
                            countriesData.Add(countryKey, countryData);
                        }
                    }
                }

            }
            chinaData.SubDivisionData = chinaSubdivisionsData;
            chinaData.ConfirmedCases = chinaConfirmedCasesCount;
            chinaData.Deaths = chinaDeathsCount;
            chinaData.NewConfirmedCases = chinaNewConfirmedCasesCount;
            chinaData.NewDeaths = chinaNewDeathsCount;
            countriesData.Add("China", chinaData);
            whoData.CountriesData = countriesData;
        }

        private List<List<List<string>>> filterTableContents(List<List<List<string>>> tables, List<int> tablesToRemove, List<string> rowsToRemove, List<string> cellsToRemove)
        {
            List<List<List<string>>> newTables = new List<List<List<string>>>();
            for (int t = 0; t < tables.Count; t++)
            {
                List<List<string>> table = tables[t];
                List<List<string>> newTable = new List<List<string>>();
                if (!tablesToRemove.Contains(t))
                {
                    for (int r = 0; r < table.Count; r++)
                    {
                        List<string> row = table[r];
                        List<string> newRow = new List<string>();
                        bool removeRow = false;
                        for (int c = 0; c < row.Count; c++)
                        {
                            string cell = row[c];
                            if (rowsToRemove.Contains(cell))
                            {
                                removeRow = true;
                                break;
                            }
                            if (!cellsToRemove.Contains(cell))
                            {
                                newRow.Add(cell);
                            }

                        }
                        if (newRow.Count > 0 && !removeRow)
                        {
                            newTable.Add(newRow);
                        }
                    }
                    if (newTable.Count > 0)
                    {
                        newTables.Add(newTable);
                    }
                }
            }
            return newTables;
        }

        public static string getBetween(string strSource, string strStart, string strEnd)
        {
            int Start, End;
            if (strSource.Contains(strStart) && strSource.Contains(strEnd))
            {
                Start = strSource.IndexOf(strStart, 0) + strStart.Length;
                End = strSource.IndexOf(strEnd, Start);
                return strSource.Substring(Start, End - Start);
            }
            else
            {
                return "";
            }
        }
    }

    public class WHOData
    {
        private string _date;
        private Dictionary<string, CountryData> _countriesdata;

        public WHOData(string date)
        {
            _date = date;
            _countriesdata = new Dictionary<string, CountryData>();
        }

        public string Date
        {
            get { return _date; }
            set { _date = value; }
        }
        public Dictionary<string, CountryData> CountriesData
        {
            get { return _countriesdata; }
            set { _countriesdata = value; }
        }
    }

    public class CountryData
    {
        private string _name;
        private int _confirmedCases;
        private int _newConfirmedCases;
        private int _deaths;
        private int _newDeaths;
        private string _transmissionClassification;
        private string _subDivisionName;
        private Dictionary<string, CountrySubdivisionData> _subDivisionData;
        
        public CountryData(string name)
        {
            _name = name;
            _confirmedCases = -1;
            _newConfirmedCases = -1;
            _deaths = -1;
            _newDeaths = -1;
            _transmissionClassification = "";
            _subDivisionName = "";
            _subDivisionData = new Dictionary<string, CountrySubdivisionData>();
        }

        public CountryData(string name, string subDivisionName)
        {
            _name = name;
            _confirmedCases = -1;
            _newConfirmedCases = -1;
            _deaths = -1;
            _newDeaths = -1;
            _transmissionClassification = "";
            _subDivisionName = subDivisionName;
            _subDivisionData = new Dictionary<string, CountrySubdivisionData>();
        }

        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }
        public int ConfirmedCases
        {
            get { return _confirmedCases; }
            set { _confirmedCases = value; }
        }
        public int NewConfirmedCases
        {
            get { return _newConfirmedCases; }
            set { _newConfirmedCases = value; }
        }
        public int Deaths
        {
            get { return _deaths; }
            set { _deaths = value; }
        }
        public int NewDeaths
        {
            get { return _newDeaths; }
            set { _newDeaths = value; }
        }
        public string TransmissionClassification
        {
            get { return _transmissionClassification; }
            set { _transmissionClassification = value; }
        }
        public string SubDivisionName
        {
            get { return _subDivisionName; }
            set { _subDivisionName = value; }
        }
        public Dictionary<string, CountrySubdivisionData> SubDivisionData
        {
            get { return _subDivisionData; }
            set { _subDivisionData = value; }
        }
    }

    public class CountrySubdivisionData
    {
        private string _name;
        private int _confirmedCases;
        private int _newConfirmedCases;
        private int _deaths;
        private int _newDeaths;
        private string _subDivisionName;
        private Dictionary<string, CountrySubdivisionData> _subDivisionData;

        public CountrySubdivisionData(string name)
        {
            _name = name;
            _confirmedCases = -1;
            _newConfirmedCases = -1;
            _deaths = -1;
            _newDeaths = -1;
            _subDivisionName = "";
            _subDivisionData = new Dictionary<string, CountrySubdivisionData>();
        }

        public CountrySubdivisionData(string name, string subDivisionName)
        {
            _name = name;
            _confirmedCases = -1;
            _newConfirmedCases = -1;
            _deaths = -1;
            _newDeaths = -1;
            _subDivisionName = subDivisionName;
            _subDivisionData = new Dictionary<string, CountrySubdivisionData>();
        }

        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }
        public int ConfirmedCases
        {
            get { return _confirmedCases; }
            set { _confirmedCases = value; }
        }
        public int NewConfirmedCases
        {
            get { return _newConfirmedCases; }
            set { _newConfirmedCases = value; }
        }
        public int Deaths
        {
            get { return _deaths; }
            set { _deaths = value; }
        }
        public int NewDeaths
        {
            get { return _newDeaths; }
            set { _newDeaths = value; }
        }
        public string SubDivisionName
        {
            get { return _subDivisionName; }
            set { _subDivisionName = value; }
        }
        public Dictionary<string, CountrySubdivisionData> SubDivisionData
        {
            get { return _subDivisionData; }
            set { _subDivisionData = value; }
        }
    }

}
