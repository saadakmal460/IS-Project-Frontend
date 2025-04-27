import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function LogsTable() {
  const [logs, setLogs] = useState([]);
  const [blockedIps, setBlockedIps] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [loadingBlockedIps, setLoadingBlockedIps] = useState(true);

  const { data } = useSelector((state) => state.user);
  console.log(data.token)

  // Fetch logs when the component mounts
  useEffect(() => {
    fetchLogs();
    fetchBlockedIps();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/security/getLogs', {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchBlockedIps = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/security/getblockedips', {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      console.log('Blocked IPs fetched:', response.data);

      setBlockedIps(response.data.blockedIps || []);
    } catch (error) {
      console.error('Error fetching blocked IPs:', error);
    } finally {
      setLoadingBlockedIps(false);
    }
  };


  const handleBlockUser = async (ip) => {
    try {
      const payload = { ipAddress: ip, reason: "Suspicious Activity" };
      await axios.post('http://localhost:5000/api/security/block-ip', payload, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      await fetchBlockedIps(); // Refresh blocked list
      setLogs((prevLogs) => prevLogs.filter(log => log.userIp !== ip));
      toast.success('IP blocked successfully');
    } catch (error) {
      console.error('Error blocking IP:', error.response);
    }
  };

  const handleUnblockIp = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/security/unblock/${id}`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      await fetchBlockedIps(); // Refresh blocked list
      toast.success('IP unblocked successfully');
    } catch (error) {
      console.error('Error unblocking IP:', error.response);
    }
  };

  // Columns for Logs table
  const logColumns = [
    { field: 'userIp', headerName: 'IP Address', width: 200 },
    { field: 'message', headerName: 'End Point', width: 250 },
    { field: 'isSuspicious', headerName: 'Suspicious', width: 150 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <button
          onClick={() => handleBlockUser(params.row.userIp)}
          className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
        >
          Block IP
        </button>
      ),
    },
  ];

  // Columns for Blocked IPs table
  const blockedIpColumns = [
    { field: 'ipAddress', headerName: 'Blocked IP', width: 250 },
    { field: 'reason', headerName: 'Reason', width: 250 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <button
          onClick={() => handleUnblockIp(params.row._id)}
          className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600"
        >
          Unblock IP
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-5 bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-4">Admin Logs</h1>

        {/* Logs Table */}
        <div className="h-96 mb-8">
          {loadingLogs ? (
            <div className="text-center text-xl text-gray-500">Loading Logs...</div>
          ) : (
            <DataGrid
              rows={logs}
              columns={logColumns}
              getRowId={(row) => row._id}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              disableSelectionOnClick
            />
          )}
        </div>

        {/* Blocked IPs Table */}
        <h2 className="text-2xl font-semibold mb-4">Blocked IPs</h2>
        <div className="h-96">
          {loadingBlockedIps ? (
            <div className="text-center text-xl text-gray-500">Loading Blocked IPs...</div>
          ) : (
            <DataGrid
              rows={blockedIps}
              columns={blockedIpColumns}
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
