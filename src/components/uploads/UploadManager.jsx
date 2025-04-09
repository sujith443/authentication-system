import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Table, Modal, Nav, InputGroup, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FileUploadForm from './FileUploadForm';
import CryptoJS from 'crypto-js';

const UploadManager = ({ user }) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [activeFormat, setActiveFormat] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [filePassword, setFilePassword] = useState('');
  const [protectedFileId, setProtectedFileId] = useState(null);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    // Load uploads from localStorage
    const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    setFiles(storedFiles);
    setIsLoading(false);
  }, []);

  const handleUploadSuccess = (newFile) => {
    if (newFile) {
      // Add admin info and file protection status to the file
      const fileWithAdmin = {
        ...newFile,
        uploadedBy: user.name,
        uploadedById: user.id,
        isPasswordProtected: !!filePassword,
        passwordHash: filePassword ? hashPassword(filePassword) : null,
        uploadedAt: new Date().toISOString()
      };
      
      const updatedFiles = [fileWithAdmin, ...files];
      setFiles(updatedFiles);
      
      // Update localStorage
      localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
      
      // Reset the file password
      setFilePassword('');
    }
    setShowUploadModal(false);
  };

  const hashPassword = (password) => {
    return CryptoJS.SHA256(password).toString();
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
    if (file.isPasswordProtected) {
      setProtectedFileId(file.id);
      setShowPasswordModal(true);
      setEnteredPassword('');
      setPasswordError(false);
    } else {
      setSelectedFile(file);
    }
  };

  const handlePasswordCheck = () => {
    const file = files.find(f => f.id === protectedFileId);
    if (file && hashPassword(enteredPassword) === file.passwordHash) {
      setShowPasswordModal(false);
      setEnteredPassword('');
      setPasswordError(false);
      setSelectedFile(file);
    } else {
      setPasswordError(true);
    }
  };

  const handleDownloadFile = (file) => {
    if (file.isPasswordProtected && selectedFile?.id !== file.id) {
      // If password protected and not already verified
      handleViewFile(file);
      return;
    }

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
    if (file.isPasswordProtected && selectedFile?.id !== file.id) {
      // If password protected and not already verified
      handleViewFile(file);
      return;
    }

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

  // Get file format for categorization
  const getFileFormat = (fileName) => {
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
    const fileFormat = getFileFormat(file.name);
    
    switch (fileFormat) {
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
              {fileFormat === 'word' ? '📄' : 
               fileFormat === 'excel' ? '📊' :
               fileFormat === 'powerpoint' ? '📑' : '📁'}
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

  // Get unique file formats for tab navigation
  const getFileFormats = () => {
    const formats = new Set(['all']);
    
    files.forEach(file => {
      formats.add(getFileFormat(file.name));
    });
    
    return Array.from(formats);
  };

  // Filter files based on active format and search term
  const filteredFiles = files.filter(file => {
    const matchesFormat = activeFormat === 'all' || getFileFormat(file.name) === activeFormat;
                          
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        file.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (file.uploadedBy && file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()));
                        
    return matchesFormat && matchesSearch;
  });

  // Format names for better display
  const formatDisplayName = (format) => {
    if (format === 'all') return 'All Files';
    
    const formatDisplayNames = {
      'pdf': 'PDF',
      'word': 'Word',
      'excel': 'Excel',
      'powerpoint': 'PowerPoint',
      'image': 'Images',
      'text': 'Text',
      'other': 'Other'
    };
    
    return formatDisplayNames[format] || format.charAt(0).toUpperCase() + format.slice(1);
  };

  // Get file icon based on format
  const getFileIcon = (fileName) => {
    const format = getFileFormat(fileName);
    
    const icons = {
      'image': '🖼️',
      'pdf': '📄',
      'word': '📝',
      'excel': '📊',
      'powerpoint': '📑',
      'text': '📃',
      'other': '📁'
    };
    
    return icons[format] || '📁';
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
        <Col>
          <Card>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <Button 
                        variant="outline-secondary"
                        onClick={() => setSearchTerm('')}
                      >
                        <i className="bi bi-x"></i>
                      </Button>
                    )}
                  </InputGroup>
                </Col>
              </Row>
              
              <Tab.Container activeKey={activeFormat} onSelect={(key) => setActiveFormat(key)}>
                <Nav variant="tabs" className="mb-3">
                  {getFileFormats().map((format) => (
                    <Nav.Item key={format}>
                      <Nav.Link eventKey={format}>
                        {format === 'all' ? (
                          <>All Files</>
                        ) : (
                          <>{getFileIcon(format + '.x')} {formatDisplayName(format)}</>
                        )}
                        <span className="ms-1 badge bg-secondary rounded-pill">
                          {format === 'all' 
                            ? files.length 
                            : files.filter(file => getFileFormat(file.name) === format).length
                          }
                        </span>
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
                
                <Tab.Content>
                  <Tab.Pane eventKey={activeFormat}>
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
                    ) : filteredFiles.length === 0 ? (
                      <div className="text-center py-4">
                        <div className="mb-3">
                          <i className="bi bi-folder2 text-muted" style={{ fontSize: '3rem' }}></i>
                        </div>
                        <h5>No files found</h5>
                        <p className="text-muted">
                          {searchTerm 
                            ? 'No matching files found for your search' 
                            : activeFormat === 'all' 
                              ? 'No files have been uploaded yet' 
                              : `No ${formatDisplayName(activeFormat)} files found`}
                        </p>
                        <Button 
                          variant="primary" 
                          onClick={() => setShowUploadModal(true)}
                        >
                          <i className="bi bi-upload me-2"></i>
                          Upload New File
                        </Button>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <Table hover className="align-middle mb-0">
                          <thead>
                            <tr>
                              <th>File Name</th>
                              <th>Description</th>
                              <th>Uploaded By</th>
                              <th>Upload Date</th>
                              <th>Size</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredFiles.map((file) => (
                              <tr key={file.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div className="me-2">
                                      {getFileIcon(file.name)}
                                    </div>
                                    <div>
                                      <span className="fw-medium">{file.name}</span>
                                      {file.isPasswordProtected && (
                                        <span className="ms-2 badge bg-warning">
                                          <i className="bi bi-lock-fill"></i> Protected
                                        </span>
                                      )}
                                      <div className="small text-muted">{file.description}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="text-muted small">{file.description}</td>
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
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Upload Modal */}
      <Modal
        show={showUploadModal}
        onHide={() => {
          setShowUploadModal(false);
          setFilePassword('');
        }}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload New File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FileUploadForm onUploadSuccess={handleUploadSuccess} user={user} />
          
          <hr className="my-3" />
          
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-lock me-1"></i>
              Password Protection (Optional)
            </Form.Label>
            <InputGroup>
              <Form.Control 
                type="password"
                placeholder="Add password to protect this file"
                value={filePassword}
                onChange={(e) => setFilePassword(e.target.value)}
              />
              <Button
                variant={filePassword ? "success" : "outline-secondary"}
                onClick={() => setFilePassword('')}
                disabled={!filePassword}
              >
                {filePassword ? (
                  <><i className="bi bi-lock-fill me-1"></i> Protected</>
                ) : (
                  <><i className="bi bi-unlock me-1"></i> No Password</>
                )}
              </Button>
            </InputGroup>
            <Form.Text className="text-muted">
              Add a password to restrict access to sensitive files
            </Form.Text>
          </Form.Group>
        </Modal.Body>
      </Modal>
      
      {/* Password Modal */}
      <Modal
        show={showPasswordModal}
        onHide={() => {
          setShowPasswordModal(false);
          setEnteredPassword('');
          setPasswordError(false);
          setProtectedFileId(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-lock-fill me-2"></i>
            Password Protected File
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {passwordError && (
            <Alert variant="danger">
              Incorrect password. Please try again.
            </Alert>
          )}
          
          <p>This file is password protected. Please enter the password to access it.</p>
          
          <Form.Group>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-key"></i>
              </InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Enter file password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                isInvalid={passwordError}
              />
            </InputGroup>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowPasswordModal(false);
            setEnteredPassword('');
            setPasswordError(false);
            setProtectedFileId(null);
          }}>
            Cancel
          </Button>
          <Button 
            variant="primary"
            onClick={handlePasswordCheck}
          >
            <i className="bi bi-unlock me-2"></i>
            Unlock
          </Button>
        </Modal.Footer>
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
        onHide={() => setSelectedFile(null)}
        size="lg"
        centered
      >
        {selectedFile && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                {selectedFile.name}
                {selectedFile.isPasswordProtected && (
                  <span className="ms-2 badge bg-warning">
                    <i className="bi bi-lock-fill"></i> Protected
                  </span>
                )}
              </Modal.Title>
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
                    <p className="mb-1"><strong>Format:</strong> {formatDisplayName(getFileFormat(selectedFile.name))}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Uploaded By:</strong> {selectedFile.uploadedBy || 'Admin'}</p>
                    <p className="mb-1"><strong>Category:</strong> {selectedFile.category || 'Uncategorized'}</p>
                    <p className="mb-1">
                      <strong>Protection:</strong> {selectedFile.isPasswordProtected ? 'Password Protected' : 'No Password'}
                    </p>
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