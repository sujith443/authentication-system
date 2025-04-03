import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const AdminManagement = ({ user }) => {
  const [admins, setAdmins] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [adminToReset, setAdminToReset] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: 'admin',
    password: '',
    confirmPassword: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not an admin
    if (!user?.isAdmin) {
      navigate('/dashboard');
      return;
    }

    // Load admins from localStorage
    const storedAdmins = JSON.parse(localStorage.getItem('admins') || '[]');
    setAdmins(storedAdmins);
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Hash password for secure storage
  const hashPassword = (password, salt = 'svit-college-salt') => {
    return CryptoJS.SHA256(password + salt).toString();
  };

  // Generate a secure random password
  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.department.trim()) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    // Check for duplicate email
    if (admins.some(admin => admin.email === formData.email)) {
      setError('An admin with this email already exists');
      setIsSubmitting(false);
      return;
    }

    // Password validation
    if (formData.password) {
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        setIsSubmitting(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsSubmitting(false);
        return;
      }
    }

    // Use provided password or generate a secure one
    const adminPassword = formData.password || 'admin123';
    const passwordHash = hashPassword(adminPassword);

    // Create new admin
    const newAdmin = {
      id: `adm_${Date.now()}`,
      name: formData.name,
      email: formData.email,
      department: formData.department,
      role: formData.role,
      isAdmin: true,
      isSuperAdmin: false,
      passwordHash: passwordHash, // Store hashed password
      requiresPasswordChange: !formData.password, // Require password change if using default
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      lastLogin: null,
      active: true
    };

    // Add to admins list
    const updatedAdmins = [...admins, newAdmin];
    setAdmins(updatedAdmins);
    
    // Update localStorage
    localStorage.setItem('admins', JSON.stringify(updatedAdmins));

    // Reset form and close modal
    setFormData({
      name: '',
      email: '',
      department: '',
      role: 'admin',
      password: '',
      confirmPassword: ''
    });
    setShowAddModal(false);
    setIsSubmitting(false);
    
    // Show success message
    const successMsg = formData.password 
      ? 'Admin added successfully with custom password'
      : `Admin added successfully with default password: admin123`;
    setSuccess(successMsg);
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleResetPassword = () => {
    if (!adminToReset) return;
    
    const password = newPassword || generateSecurePassword();
    const passwordHash = hashPassword(password);
    
    // Update admin's password
    const updatedAdmins = admins.map(admin => {
      if (admin.id === adminToReset.id) {
        return {
          ...admin,
          passwordHash,
          requiresPasswordChange: !newPassword, // Require change if auto-generated
          passwordLastChanged: new Date().toISOString()
        };
      }
      return admin;
    });
    
    setAdmins(updatedAdmins);
    localStorage.setItem('admins', JSON.stringify(updatedAdmins));
    
    // Close modal and show success
    setShowResetModal(false);
    setAdminToReset(null);
    setNewPassword('');
    
    const successMsg = newPassword
      ? `Password reset successfully for ${adminToReset.name}`
      : `Password reset successfully. New temporary password: ${password}`;
    setSuccess(successMsg);
    setTimeout(() => setSuccess(null), 10000);
  };

  const handleDeleteAdmin = (admin) => {
    setAdminToDelete(admin);
    setShowDeleteModal(true);
  };

  const confirmDeleteAdmin = () => {
    // Don't allow deleting super admin
    if (adminToDelete.isSuperAdmin) {
      setError('Cannot delete super admin');
      setShowDeleteModal(false);
      return;
    }

    // Filter out the admin to delete
    const updatedAdmins = admins.filter(admin => admin.id !== adminToDelete.id);
    setAdmins(updatedAdmins);
    
    // Update localStorage
    localStorage.setItem('admins', JSON.stringify(updatedAdmins));
    
    // Close modal
    setShowDeleteModal(false);
    setAdminToDelete(null);
    
    // Show success message
    setSuccess('Admin removed successfully');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleToggleActive = (admin) => {
    // Don't allow deactivating super admin
    if (admin.isSuperAdmin) {
      setError('Cannot deactivate super admin');
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Update admin active status
    const updatedAdmins = admins.map(a => {
      if (a.id === admin.id) {
        return {
          ...a,
          active: !a.active
        };
      }
      return a;
    });
    
    setAdmins(updatedAdmins);
    localStorage.setItem('admins', JSON.stringify(updatedAdmins));
    
    setSuccess(`Admin ${admin.active ? 'deactivated' : 'activated'} successfully`);
    setTimeout(() => setSuccess(null), 3000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Only super admin can add/remove other admins
  const canManageAdmins = user?.isSuperAdmin;

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="mb-1">Admin Management</h1>
              <p className="text-muted">Manage administrators</p>
            </div>
            {canManageAdmins && (
              <Button 
                variant="primary" 
                onClick={() => setShowAddModal(true)}
              >
                <i className="bi bi-person-plus me-2"></i>
                Add Admin
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {success && (
        <Row className="mb-4">
          <Col>
            <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
            </Alert>
          </Col>
        </Row>
      )}
      
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Added On</th>
                      {canManageAdmins && <th className="text-center">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {admins.length > 0 ? (
                      admins.map(admin => (
                        <tr key={admin.id} className={!admin.active ? 'table-secondary' : ''}>
                          <td>
                            {admin.name}
                            {admin.isSuperAdmin && (
                              <span className="badge bg-danger ms-2">Super Admin</span>
                            )}
                          </td>
                          <td>{admin.email}</td>
                          <td>{admin.department}</td>
                          <td>{admin.role}</td>
                          <td>
                            {admin.active ? (
                              <span className="badge bg-success">Active</span>
                            ) : (
                              <span className="badge bg-secondary">Inactive</span>
                            )}
                          </td>
                          <td>{formatDate(admin.createdAt)}</td>
                          {canManageAdmins && (
                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                {!admin.isSuperAdmin && (
                                  <>
                                    <Button
                                      variant="outline-info"
                                      size="sm"
                                      onClick={() => {
                                        setAdminToReset(admin);
                                        setShowResetModal(true);
                                      }}
                                      title="Reset Password"
                                    >
                                      <i className="bi bi-key"></i>
                                    </Button>
                                    <Button
                                      variant={admin.active ? "outline-warning" : "outline-success"}
                                      size="sm"
                                      onClick={() => handleToggleActive(admin)}
                                      title={admin.active ? "Deactivate Admin" : "Activate Admin"}
                                    >
                                      <i className={`bi bi-${admin.active ? 'pause' : 'play'}`}></i>
                                    </Button>
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      onClick={() => handleDeleteAdmin(admin)}
                                      title="Delete Admin"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={canManageAdmins ? 7 : 6} className="text-center py-3">
                          No administrators found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Admin Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Administrator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddAdmin}>
            <Form.Group className="mb-3" controlId="adminName">
              <Form.Label>Name</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-person"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter admin name"
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="adminEmail">
              <Form.Label>Email</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-envelope"></i>
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter admin email"
                  required
                />
              </InputGroup>
              <Form.Text className="text-muted">
                Default password if none provided: admin123
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="adminDepartment">
              <Form.Label>Department</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-building"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Enter department"
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="adminRole">
              <Form.Label>Role</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-person-badge"></i>
                </InputGroup.Text>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="admin">Administrator</option>
                  <option value="manager">Department Manager</option>
                  <option value="supervisor">Supervisor</option>
                </Form.Select>
              </InputGroup>
            </Form.Group>

            <hr />
            <p className="text-muted mb-3 small">
              <i className="bi bi-info-circle me-1"></i>
              Optional: Set a custom password. If left empty, default password will be used.
            </p>

            <Form.Group className="mb-3" controlId="adminPassword">
              <Form.Label>Password (Optional)</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-key"></i>
                </InputGroup.Text>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter custom password"
                />
                <Button 
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                </Button>
              </InputGroup>
              <Form.Text className="text-muted">
                Password must be at least 8 characters
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="adminConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-key-fill"></i>
                </InputGroup.Text>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm custom password"
                  disabled={!formData.password}
                />
              </InputGroup>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding...
                  </>
                ) : 'Add Admin'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Admin Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Admin Removal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to remove admin <strong>{adminToDelete?.name}</strong>?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteAdmin}>
            Remove Admin
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        show={showResetModal}
        onHide={() => {
          setShowResetModal(false);
          setAdminToReset(null);
          setNewPassword('');
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Reset password for admin: <strong>{adminToReset?.name}</strong></p>
          
          <Form.Group className="mb-3" controlId="newPassword">
            <Form.Label>New Password (Optional)</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-key"></i>
              </InputGroup.Text>
              <Form.Control
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <Button 
                variant="outline-secondary"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <i className={`bi bi-eye${showNewPassword ? '-slash' : ''}`}></i>
              </Button>
            </InputGroup>
            <Form.Text className="text-muted">
              Leave blank to generate a random password
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowResetModal(false);
            setAdminToReset(null);
            setNewPassword('');
          }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleResetPassword}>
            Reset Password
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminManagement;