import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';

const AdminNotificationsWidget = () => {
  // This component starts with no notifications - they will be added as admins use the system
  const notifications = [];

  // Function to format date
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'upload':
        return 'bi bi-file-earmark-arrow-up';
      case 'user':
        return 'bi bi-person';
      case 'security':
        return 'bi bi-shield-exclamation';
      case 'system':
        return 'bi bi-gear';
      case 'warning':
        return 'bi bi-exclamation-triangle';
      default:
        return 'bi bi-bell';
    }
  };

  // Function to get notification badge color based on priority
  const getNotificationBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="admin-notifications-widget">
      <ListGroup variant="flush">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <ListGroup.Item key={notification.id} className="px-3 py-3 border-bottom">
              <div className="d-flex">
                <div className="notification-icon me-3">
                  <i className={`${getNotificationIcon(notification.type)} fs-5`}></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <h6 className="mb-1 fw-bold d-flex align-items-center">
                      {notification.title}
                      {notification.isNew && (
                        <Badge bg="danger" className="ms-2" pill>New</Badge>
                      )}
                      {notification.priority && (
                        <Badge bg={getNotificationBadge(notification.priority)} className="ms-2" pill>
                          {notification.priority}
                        </Badge>
                      )}
                    </h6>
                    <small className="text-muted">{formatDate(notification.date)}</small>
                  </div>
                  <p className="mb-0 text-muted">{notification.content}</p>
                  {notification.actionUrl && (
                    <div className="mt-2">
                      <a href={notification.actionUrl} className="btn btn-sm btn-outline-primary">
                        {notification.actionText || 'View'}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item className="px-3 py-5 text-center">
            <i className="bi bi-bell-slash text-muted" style={{ fontSize: '2rem' }}></i>
            <h6 className="mt-3 mb-1">No Notifications</h6>
            <p className="text-muted mb-0">You don't have any notifications at the moment</p>
          </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
};

export default AdminNotificationsWidget;