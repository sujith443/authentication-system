import React from 'react';
import { Badge, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RecentUploadsWidget = () => {
  // Mock data - replace with actual API call
  const recentUploads = [
    {
      id: 'file1',
      name: 'Assignment1_CSE303.pdf',
      date: '2025-03-20',
      status: 'approved',
      size: '2.4 MB'
    },
    {
      id: 'file2',
      name: 'Project_Proposal.docx',
      date: '2025-03-18',
      status: 'pending',
      size: '1.8 MB'
    },
    {
      id: 'file3',
      name: 'Lab_Report_ECE206.pdf',
      date: '2025-03-15',
      status: 'approved',
      size: '3.2 MB'
    },
    {
      id: 'file4',
      name: 'Semester_Registration.pdf',
      date: '2025-03-10',
      status: 'rejected',
      size: '0.9 MB'
    },
    {
      id: 'file5',
      name: 'Research_Paper_Draft.pdf',
      date: '2025-03-05',
      status: 'approved',
      size: '4.6 MB'
    }
  ];

  // Function to get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="table-responsive">
      <Table hover className="align-middle mb-0">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Upload Date</th>
            <th>Size</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {recentUploads.map((file) => (
            <tr key={file.id}>
              <td>
                <div className="d-flex align-items-center">
                  <div className="file-icon me-2">
                    <i className={`bi bi-file-earmark-${file.name.endsWith('.pdf') ? 'pdf' : 'word'} text-primary fs-5`}></i>
                  </div>
                  <Link to={`/uploads/${file.id}`} className="text-decoration-none text-reset">
                    {file.name}
                  </Link>
                </div>
              </td>
              <td>{formatDate(file.date)}</td>
              <td>{file.size}</td>
              <td>
                <Badge 
                  bg={getStatusBadgeVariant(file.status)}
                  className="text-capitalize"
                >
                  {file.status}
                </Badge>
              </td>
            </tr>
          ))}
          {recentUploads.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-3">
                No uploads found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default RecentUploadsWidget;