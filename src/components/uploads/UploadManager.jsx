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
  const [showContent, setShowContent] = useState(false);
  const [fileContent, setFileContent] = useState('');

  useEffect(() => {
    // Fetch files - replace with actual API call
    const fetchFiles = async () => {
      try {
        // Mock API call with timeout
        setTimeout(() => {
          // Mock data with URLs for demo content
          const mockFiles = [
            {
              id: 'file1',
              name: 'Assignment1_CSE303.pdf',
              uploadDate: '2025-03-20',
              size: '2.4 MB',
              description: 'Assignment submission for CSE303 course',
              url: 'https://www.africau.edu/images/default/sample.pdf', // Sample PDF URL for demo
              demoContent: 'This is a sample assignment about data structures and algorithms. The assignment covers topics like sorting algorithms, binary search trees, and graph traversal methods.'
            },
            {
              id: 'file2',
              name: 'Project_Proposal.docx',
              uploadDate: '2025-03-18',
              size: '1.8 MB',
              description: 'Final year project proposal',
              url: 'https://file-examples.com/storage/feaab43882587570228d9a6/2017/02/file-sample_100kB.docx', // Sample DOCX URL for demo
              demoContent: 'Project proposal for a Smart Campus Application that includes features like attendance tracking, campus navigation, and real-time class notifications.'
            },
            {
              id: 'file3',
              name: 'Lab_Report_ECE206.pdf',
              uploadDate: '2025-03-15',
              size: '3.2 MB',
              description: 'Lab report for ECE206 practical',
              url: 'https://www.africau.edu/images/default/sample.pdf', // Sample PDF URL for demo
              demoContent: 'Lab report documenting experiments on digital circuit design, including truth tables, circuit diagrams, and oscilloscope readings.'
            },
            {
              id: 'file4',
              name: 'Semester_Registration.pdf',
              uploadDate: '2025-03-10',
              size: '0.9 MB',
              description: 'Semester registration form',
              url: 'https://www.africau.edu/images/default/sample.pdf', // Sample PDF URL for demo
              demoContent: 'Registration form for the 6th semester with selected core and elective courses.'
            },
            {
              id: 'file5',
              name: 'Research_Paper_Draft.pdf',
              uploadDate: '2025-03-05',
              size: '4.6 MB',
              description: 'Draft of research paper for publication',
              url: 'https://www.africau.edu/images/default/sample.pdf', // Sample PDF URL for demo
              demoContent: 'Research paper on Machine Learning applications in healthcare, focusing on predictive analytics for patient outcomes.'
            }
          ];
          
          setFiles(mockFiles);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load files');
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleUploadSuccess = (newFile) => {
    if (newFile) {
      setFiles([newFile, ...files]);
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
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  const handleViewFile = (file) => {
    setSelectedFile(file);
    
    // For demo files, show their content
    if (file.demoContent) {
      setFileContent(file.demoContent);
      setShowContent(true);
    }
  };

  const handleDownloadFile = (file) => {
    // Create an anchor element
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintFile = (file) => {
    // Open file URL in a new window and print
    const printWindow = window.open(file.url, '_blank');
    printWindow.onload = function() {
      printWindow.print();
    };
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
              <p className="text-muted">Manage your document uploads</p>
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
                <h5 className="mb-0">Your Uploads</h5>
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
                  <p className="mt-2 text-muted">Loading your files...</p>
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-4">
                  <div className="mb-3">
                    <i className="bi bi-file-earmark-x text-muted" style={{ fontSize: '3rem' }}></i>
                  </div>
                  <h5>No files found</h5>
                  <p className="text-muted">
                    You haven't uploaded any files yet
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0">
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>Description</th>
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
                              <div className="file-icon me-2">
                                <i className={`bi bi-file-earmark-${file.name.endsWith('.pdf') ? 'pdf' : 'word'} text-primary fs-5`}></i>
                              </div>
                              <div>
                                <span className="fw-medium">{file.name}</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-muted small">{file.description}</td>
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
      
      {/* File View Modal */}
      <Modal
        show={selectedFile !== null}
        onHide={() => {
          setSelectedFile(null);
          setShowContent(false);
          setFileContent('');
        }}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedFile?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showContent ? (
            <div className="p-3 border rounded">
              <h5 className="mb-3">File Content Preview</h5>
              <p>{fileContent}</p>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => {
                  setShowContent(false);
                  // Open file in a new tab
                  window.open(selectedFile.url, '_blank');
                }}
              >
                View Full Document
              </Button>
            </div>
          ) : (
            <div className="text-center p-5">
              <i className={`bi bi-file-earmark-${selectedFile?.name.endsWith('.pdf') ? 'pdf' : 'word'} text-primary`} style={{ fontSize: '4rem' }}></i>
              <h5 className="mt-3">{selectedFile?.name}</h5>
              <p className="mb-4 text-muted">{selectedFile?.description}</p>
              <div className="d-flex justify-content-center gap-3">
                <Button 
                  variant="primary"
                  onClick={() => handleDownloadFile(selectedFile)}
                >
                  <i className="bi bi-download me-2"></i>
                  Download
                </Button>
                <Button 
                  variant="outline-secondary"
                  onClick={() => handlePrintFile(selectedFile)}
                >
                  <i className="bi bi-printer me-2"></i>
                  Print
                </Button>
                {selectedFile?.demoContent && (
                  <Button 
                    variant="outline-info"
                    onClick={() => setShowContent(true)}
                  >
                    <i className="bi bi-file-text me-2"></i>
                    View Content
                  </Button>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UploadManager;