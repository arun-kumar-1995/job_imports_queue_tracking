import { useState, useEffect } from "react";
import axios from "axios";
import { formatDateToIST } from "./utils/date_format.utils";

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/app/v1/api-list/logs"
        );
        setLogs(response?.data?.data?.importLogs || []);
      } catch (err) {
        console.error("Error fetching logs", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="main">
      <h2>Import Logs</h2>
      {isLoading ? (
        <p>Loading logs...</p>
      ) : (
        <table className="logs-table">
          <thead>
            <tr>
              <th>File name</th>
              <th>Import Date time</th>
              <th>Total</th>
              <th>New</th>
              <th>Updated</th>
              <th>Failed</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{log.file_name}</td>
                <td>{formatDateToIST(log.import_date)}</td>
                <td>{log.total}</td>
                <td>{log.new}</td>
                <td>{log.updated}</td>
                <td>{log.failed_jobs.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
