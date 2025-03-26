import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';

const AnnouncementsWidget = () => {
  // Mock data - replace with actual API call
  const announcements = [
    {
      id: 1,
      title: 'System Maintenance',
      content: 'The upload system will be under maintenance on March 30th from 2:00 AM to 4:00 AM IST.',
      date: '2025-03-25',
      isNew: true
    },
    {
      id: 2,
      title: 'New File Size Limits',
      content: 'Maximum file size has been increased to 50MB for all document uploads.',
      date: '2025-03-20',
      isNew: false
    },
    {
      id: 3,
      title: 'Semester Registration Deadline',
      content: 'Don\'t forget to upload your semester registration forms by April 5th.',
      date: '2025-03-18',
      isNew: false
    },
    {
      id: 4,
      title: 'Updated Privacy Policy',
      content: 'We have updated our privacy policy. Please review the changes.',
      date: '2025-03-10',
      isNew: false
    }
  ];

  // Function to format date
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="announcements-widget">
      <ListGroup variant="flush">
        {announcements.map((announcement) => (
          <ListGroup.Item key={announcement.id} className="px-0 py-3 border-bottom">
            <div className="d-flex justify-content-between align-items-start mb-1">
              <h6 className="mb-0 fw-bold">
                {announcement.title}
                {announcement.isNew && (
                  <Badge bg="danger" className="ms-2" pill>New</Badge>
                )}
              </h6>
              <small className="text-muted">{formatDate(announcement.date)}</small>
            </div>
            <p className="mb-0 text-muted">{announcement.content}</p>
          </ListGroup.Item>
        ))}
        {announcements.length === 0 && (
          <ListGroup.Item className="px-0 py-3 text-center">
            No announcements available
          </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
};

export default AnnouncementsWidget;