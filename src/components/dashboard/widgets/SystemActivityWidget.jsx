import React from 'react';
import { Table, Badge } from 'react-bootstrap';

const SystemActivityWidget = () => {
  // We start with no activity logs - they will be added as the system is used
  const activityLogs = [];

  // Function to format date
  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to get activity icon based on type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'login':
        return 'bi bi-box-arrow-in-right';
      case 'logout':
        return 'bi bi-box-arrow-left';
      case 'create':
        return 'bi bi-plus-square';
      case 'update':
        return 'bi bi-pencil-square';
      case 'delete':
        return 'bi bi-trash';
      case 'upload':
        return 'bi bi-cloud-upload';
      case 'download':
        return 'bi bi-cloud-download';
      case 'approve':
        return 'bi bi-check-circle';
      case 'reject':
        return 'bi bi-x-circle';
      case 'settings':
        return 'bi bi-gear';
      default:
        return 'bi bi-activity';
    }
  };

  // Function to get activity severity badge
  const getActivityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return { color: 'danger', label: 'Critical' };
      case 'warning':
        return { color: 'warning', label: 'Warning' };
      case 'info':
        return { color: 'info', label: 'Info' };
      case 'success':
        return { color: 'success', label: 'Success' };
      default:
        return { color: 'secondary', label: 'Normal' };
    }
  };

  return (
    <div className="system-activity-widget">
      {activityLogs.length > 0 ? (
        <div className="table-responsive">
          <Table hover className="align-middle mb-0">
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Time</th>
                <th style={{ width: '20%' }}>User</th>
                <th style={{ width: '40%' }}>Activity</th>
                <th style={{ width: '20%' }}>Severity</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.map((log) => (
                <tr key={log.id}>
                  <td>{formatDateTime(log.timestamp)}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="me-2">
                        <i className="bi bi-person-circle"></i>
                      </div>
                      <div>
                        <div className="fw-medium">{log.username}</div>
                        <small className="text-muted">{log.role}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="me-2">
                        <i className={getActivityIcon(log.type)}></i>
                      </div>
                      <div>
                        {log.description}
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg={getActivityBadge(log.severity).color}>
                      {getActivityBadge(log.severity).label}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-activity text-muted" style={{ fontSize: '2rem' }}></i>
          <h6 className="mt-3 mb-1">No Activity Logs</h6>
          <p className="text-muted mb-0">System activity will appear here as administrators use the system</p>
        </div>
      )}
    </div>
  );
};

export default SystemActivityWidget;