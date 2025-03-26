import React, { useState, useRef } from 'react';
import { Form, Button, Alert, ProgressBar } from 'react-bootstrap';

const FileUploadForm = ({ onUploadSuccess, user }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  
  const categories = [
    'Assignment',
    'Project',
    'Lab Report',
    'Research Paper',
    'Registration Form',
    'Other'
  ];
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = () => {
    setIsDragOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files.length) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };
  
  const validateAndSetFile = (selectedFile) => {
    setError(null);
    
    // Check if file is selected
    if (!selectedFile) {
      return;
    }
    
    // Check file size (limit to 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File size exceeds the 50MB limit');
      return;
    }
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only PDF and Word documents are allowed');
      return;
    }
    
    setFile(selectedFile);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!description.trim()) {
      setError('Please provide a description for the file');
      return;
    }
    
    if (!category) {
      setError('Please select a category');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    // Simulate file upload with progress
    const simulateUpload = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Mock successful upload response
          setTimeout(() => {
            const uploadedFile = {
              id: `file${Date.now()}`,
              name: file.name,
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'pending',
              size: formatFileSize(file.size),
              description: description,
              category: category,
            };
            
            onUploadSuccess(uploadedFile);
            setIsUploading(false);
            setUploadProgress(0);
          }, 500);
        }
      }, 300);
    };
    
    // Start simulated upload
    simulateUpload();
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      
      <Form.Group className="mb-3" controlId="file">
        <div
          className={`upload-dropzone ${isDragOver ? 'active' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="d-none"
            accept=".pdf,.doc,.docx"
          />
          
          {file ? (
            <div className="text-center">
              <div className="mb-2">
                <i className={`bi bi-file-earmark-${file.name.endsWith('.pdf') ? 'pdf' : 'word'} text-primary fs-3`}></i>
              </div>
              <p className="mb-1 fw-medium">{file.name}</p>
              <p className="mb-0 text-muted small">{formatFileSize(file.size)}</p>
              <p className="mt-2 text-primary small">Click to change file</p>
            </div>
          ) : (
            <div className="text-center">
              <i className="bi bi-cloud-arrow-up text-primary fs-3 mb-2"></i>
              <p className="mb-1">Drag & drop your file here</p>
              <p className="mb-0 text-muted small">or click to browse files</p>
              <p className="mt-2 text-muted small">Supported formats: PDF, DOC, DOCX (Max 50MB)</p>
            </div>
          )}
        </div>
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="category">
        <Form.Label>Category</Form.Label>
        <Form.Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </Form.Select>
      </Form.Group>
      
      <Form.Group className="mb-3" controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Provide a brief description of the file"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Form.Group>
      
      {isUploading && (
        <div className="mb-3">
          <p className="mb-1 small">Uploading: {uploadProgress}%</p>
          <ProgressBar 
            now={uploadProgress} 
            variant="primary" 
            animated 
            style={{ height: '0.5rem' }} 
          />
        </div>
      )}
      
      <div className="d-grid gap-2">
        <Button 
          variant="primary" 
          type="submit" 
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </Button>
        <Button 
          variant="outline-secondary" 
          onClick={() => onUploadSuccess(null)}
          disabled={isUploading}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
};

export default FileUploadForm;