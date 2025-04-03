import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Table, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FileUploadForm from './FileUploadForm';

const UploadManager = ({ user }) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  useEffect(() => {
    // Load uploads from localStorage
    const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    setFiles(storedFiles);
    setIsLoading(false);
  }, []);

  const handleUploadSuccess = (newFile) => {
    if (newFile) {
      // Add admin info to the file
      const fileWithAdmin = {
        ...newFile,
        uploadedBy: user.name,
        uploadedById: user.id
      };
      
      const updatedFiles = [fileWithAdmin, ...files];
      setFiles(updatedFiles);
      
      // Update localStorage
      localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    }
    setShowUploadModal(false);
  };

  const handleDeleteFile = (file) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const confirmDeleteFile = () => {
    // Remove file
    const updatedFiles = files.filter(file => file.id !== fileToDelete.id);
    
    // If the file has a URL created with URL.createObjectURL, revoke it
    if (fileToDelete.url && fileToDelete.url.startsWith('blob:')) {
      URL.revokeObjectURL(fileToDelete.url);
    }
    
    setFiles(updatedFiles);
    
    // Update localStorage
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  const handleViewFile = (file) => {
    setSelectedFile(file);
  };

  const handleDownloadFile = (file) => {
    try {
      // Create an anchor element
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      setError("Error downloading file. Please try again.");
      
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  const handlePrintFile = (file) => {
    try {
      // Open file URL in a new window and print
      const printWindow = window.open(file.url, '_blank');
      if (printWindow) {
        setTimeout(() => {
          printWindow.print();
        }, 1000); // Give it time to load before printing
      } else {
        setError("Please allow pop-ups to print the file");
        
        // Clear error after 3 seconds
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error("Error printing file:", error);
      setError("There was an error printing the file. Please try downloading it first.");
      
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  // Get file type to handle preview correctly
  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
      return 'image';
    } else if (['pdf'].includes(extension)) {
      return 'pdf';
    } else if (['doc', 'docx'].includes(extension)) {
      return 'word';
    } else if (['xls', 'xlsx'].includes(extension)) {
      return 'excel';
    } else if (['ppt', 'pptx'].includes(extension)) {
      return 'powerpoint';
    } else if (['txt', 'csv'].includes(extension)) {
      return 'text';
    } else {
      return 'other';
    }
  };

  // Function to render the appropriate preview based on file type
  const renderFilePreview = (file) => {
    const fileType = getFileType(file.name);
    
    switch (fileType) {
      case 'image':
        return (
          <div className="text-center">
            <img 
              src={file.url} 
              alt={file.name} 
              className="img-fluid rounded" 
              style={{ maxHeight: '500px' }}
            />
          </div>
        );
      case 'pdf':
        return (
          <div className="ratio ratio-16x9">
            <iframe 
              src={file.url}
              title={file.name}
              className="border rounded"
              allowFullScreen
            ></iframe>
          </div>
        );
      case 'text':
        return (
          <div className="p-3 border rounded bg-light">
            <div className="text-center mb-3">
              <p>Text preview is not available directly. Please use the buttons below to view this file.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center p-4 border rounded">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {fileType === 'word' ? '📄' : 
               fileType === 'excel' ? '📊' :
               fileType === 'powerpoint' ? '📑' : '📁'}
            </div>
            <h5>{file.name}</h5>
            <p className="text-muted">Preview not available for this file type.</p>
            <p>Please use the buttons below to open or download this file.</p>
          </div>
        );
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-1">Upload Manager</h1>
              <p className="text-muted">Manage document uploads</p>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowUploadModal(true)}
            >
              <i className="bi bi-upload me-2"></i>
              Upload New File
            </Button>
          </div>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col lg={12}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">All Uploads</h5>
              </div>
              
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}
              
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading files...</p>
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-4">
                  <div className="mb-3">
                    <i className="bi bi-folder2 text-muted" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h5>No files found</h5>
                  <p className="text-muted">
                    No files have been uploaded yet
                  </p>
                  <Button 
                    variant="primary" 
                    onClick={() => setShowUploadModal(true)}
                  >
                    <i className="bi bi-upload me-2"></i>
                    Upload First File
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0">
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Category</th>
                        <th>Uploaded By</th>
                        <th>Upload Date</th>
                        <th>Size</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((file) => (
                        <tr key={file.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-2">
                                {getFileType(file.name) === 'image' ? '🖼️' :
                                 getFileType(file.name) === 'pdf' ? '📄' :
                                 getFileType(file.name) === 'word' ? '📝' :
                                 getFileType(file.name) === 'excel' ? '📊' :
                                 getFileType(file.name) === 'powerpoint' ? '📑' : '📁'}
                              </div>
                              <div>
                                <span className="fw-medium">{file.name}</span>
                                <div className="small text-muted">{file.description}</div>
                              </div>
                            </div>
                          </td>
                          <td>{file.category || 'Uncategorized'}</td>
                          <td>{file.uploadedBy || 'Admin'}</td>
                          <td>{formatDate(file.uploadDate)}</td>
                          <td>{file.size}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleViewFile(file)}
                                title="View File"
                              >
                                <i className="bi bi-eye"></i>
                              </Button>
                              <Button 
                                variant="outline-success" 
                                size="sm"
                                onClick={() => handleDownloadFile(file)}
                                title="Download File"
                              >
                                <i className="bi bi-download"></i>
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDeleteFile(file)}
                                title="Delete File"
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Upload Modal */}
      <Modal
        show={showUploadModal}
        onHide={() => setShowUploadModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload New File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FileUploadForm onUploadSuccess={handleUploadSuccess} user={user} />
        </Modal.Body>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the file <strong>{fileToDelete?.name}</strong>?</p>
          <p className="text-danger mb-0">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteFile}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* File View Modal with Enhanced Preview */}
      <Modal
        show={selectedFile !== null}
        onHide={() => setSelectedFile(null)}
        size="lg"
        centered
      >
        {selectedFile && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedFile.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* File Preview Section */}
              <div className="mb-4">
                {renderFilePreview(selectedFile)}
              </div>
              
              {/* File Info Section */}
              <div className="mb-3">
                <h6>File Information</h6>
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Size:</strong> {selectedFile.size}</p>
                    <p className="mb-1"><strong>Upload Date:</strong> {formatDate(selectedFile.uploadDate)}</p>
                    <p className="mb-1"><strong>Category:</strong> {selectedFile.category || 'Uncategorized'}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Uploaded By:</strong> {selectedFile.uploadedBy || 'Admin'}</p>
                    <p className="mb-1"><strong>Description:</strong> {selectedFile.description}</p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="d-flex justify-content-center gap-3 mt-4">
                <Button 
                  variant="primary"
                  onClick={() => handleDownloadFile(selectedFile)}
                >
                  <i className="bi bi-download me-2"></i>
                  Download
                </Button>
                <Button 
                  variant="success"
                  onClick={() => window.open(selectedFile.url, '_blank')}
                >
                  <i className="bi bi-box-arrow-up-right me-2"></i>
                  Open in New Tab
                </Button>
                <Button 
                  variant="outline-secondary"
                  onClick={() => handlePrintFile(selectedFile)}
                >
                  <i className="bi bi-printer me-2"></i>
                  Print
                </Button>
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default UploadManager;