import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

export default function LogsTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch logs data when the component mounts
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Replace with your API endpoint to fetch logs
        const response = await axios.get('http://localhost:5000/api/security/getLogs');
        setLogs(response.data); // Assuming response contains the logs data
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Handle remove user
  const handleRemoveUser = async (ip) => {
    try {
      // Replace with your API endpoint to remove the user
      const payLoad = { ipAddress:ip , reason:"Suspecious Activity" }
      console.log(payLoad)
      await axios.post(`http://localhost:5000/api/security/block-ip`, payLoad);
      // Remove the user from the table after successful removal
      setLogs((prevLogs) => prevLogs.filter(log => log.userIp !== ip));
      alert('User removed successfully');
    } catch (error) {
      console.error('Error removing user:', error.response);
    }
  };

  // Columns for DataGrid
  const columns = [
    { field: 'userIp', headerName: 'IP Address', width: 250 },
    { field: 'message', headerName: 'End Point', width: 250 },
    { field: 'isSuspicious', headerName: 'Suspecious', width: 250 },


    { field: 'action', headerName: 'Action', width: 150, renderCell: (params) => (
      <button
        onClick={() => handleRemoveUser(params.row.userIp)}
        className="bg-red-500 text-white  px-4 rounded-md hover:bg-red-600"
      >
        Block IP
      </button>
    )}
  ];

  return (
    <div className="min-h-screen p-5 bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-4">Admin Logs</h1>
        <div className="h-96">
          {loading ? (
            <div className="text-center text-xl text-gray-500">Loading...</div>
          ) : (
            <DataGrid
              rows={logs}
              columns={columns}
              getRowId={(row) => row._id} 
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              disableSelectionOnClick
            />
          )}
        </div>
      </div>
    </div>
  );
}
