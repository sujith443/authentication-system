import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UploadStatsWidget = () => {
  // Mock data - replace with actual API call
  const data = [
    { month: 'Jan', uploads: 4, approved: 3, rejected: 1 },
    { month: 'Feb', uploads: 7, approved: 5, rejected: 2 },
    { month: 'Mar', uploads: 12, approved: 8, rejected: 1 },
    { month: 'Apr', uploads: 0, approved: 0, rejected: 0 },
    { month: 'May', uploads: 0, approved: 0, rejected: 0 },
    { month: 'Jun', uploads: 0, approved: 0, rejected: 0 }
  ];

  return (
    <div className="upload-stats-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="uploads" stroke="#3b82f6" activeDot={{ r: 8 }} name="Total Uploads" />
          <Line type="monotone" dataKey="approved" stroke="#10b981" name="Approved" />
          <Line type="monotone" dataKey="rejected" stroke="#ef4444" name="Rejected" />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="upload-stats-summary text-center mt-3">
        <p className="mb-1">Total Uploads this Quarter: <strong>23</strong></p>
        <p className="text-muted small">Statistics are updated daily</p>
      </div>
    </div>
  );
};

export default UploadStatsWidget;