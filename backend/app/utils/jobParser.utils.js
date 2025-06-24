import axios from "axios";
import { XMLParser } from "fast-xml-parser";

export const fetchJobs = async () => {
  try {
    const response = await axios.get("https://jobicy.com/?feed=job_feed");
    const xmlData = response.data;

    const parser = new XMLParser({
      ignoreAttributes: false,
      trimValues: true,
    });

    const jsonData = parser.parse(xmlData);
    const jobs = jsonData?.rss?.channel?.item[0] || [];
    console.log(jobs);
  } catch (err) {
    console.log("Error fetching jobs");
  }
};
