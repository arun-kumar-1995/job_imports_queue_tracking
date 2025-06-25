import axios from "axios";
import { XMLParser } from "fast-xml-parser";

export const fetchJobs = async (api_url) => {
  try {
    const response = await axios.get(api_url);
    const xmlData = response.data;

    const parser = new XMLParser({
      ignoreAttributes: false,
      trimValues: true,
    });

    const jsonData = parser.parse(xmlData);
    const jobs = jsonData?.rss?.channel?.item || [];
    return jobs;
  } catch (err) {
    console.log("Error fetching jobs");
  }
};
