import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Akun = ({ email: initialEmail }) => {
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [profilePicture, setProfilePicture] = useState('/images/default-profile-pic.jpg');
  const [submittedData, setSubmittedData] = useState(null);
  const [savedData, setSavedData] = useState(null);

  useEffect(() => {
    const savedDataFromStorage = JSON.parse(localStorage.getItem('savedData'));
    if (savedDataFromStorage) {
      setSavedData(savedDataFromStorage);
    }

    return () => {
      clearInputs();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name, phone, address, email, profilePicture };
    setSubmittedData(data);
    setSavedData(data); // Save data to display later
    localStorage.setItem('savedData', JSON.stringify(data)); // Save data to localStorage
    console.log('Data yang dimasukkan:', data);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePicture(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setSubmittedData(null);
  };

  const handleSave = () => {
    setSubmittedData(null);
  };

  const handleDelete = () => {
    localStorage.removeItem('savedData');
    setSavedData(null);
  };

  const clearInputs = () => {
    setName('');
    setPhone('');
    setAddress('');
    setEmail('');
    setProfilePicture('/images/default-profile-pic.jpg');
  };

  return (
    <div style={{
      backgroundColor:'lavenderblush',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Container>
        <h2 style={{ textAlign: 'center', color: 'black' }}>Akun</h2>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Img
                variant="top"
                src={profilePicture}
                alt="Profil"
              />
              <Card.Body>
                <Card.Title style={{ textAlign: 'center' }}>Bunga Gardenias</Card.Title>
                <Card.Text>
                  {submittedData || savedData ? (
                    <div>
                      {submittedData && (
                        <div>
                          <h2>Data yang telah disubmit</h2>
                          <div>
                            <strong>Nama:</strong> {submittedData.name}
                          </div>
                          <div>
                            <strong>No Telepon:</strong> {submittedData.phone}
                          </div>
                          <div>
                            <strong>Alamat:</strong> {submittedData.address}
                          </div>
                          <div>
                            <strong>Email:</strong> {submittedData.email}
                          </div>
                          <button onClick={handleEdit} className="btn btn-secondary">Edit</button>
                        </div>
                      )}
                      {savedData && (
                        <div>
                          <h2>Data yang telah disimpan</h2>
                          <div>
                            <strong>Nama:</strong> {savedData.name}
                          </div>
                          <div>
                            <strong>No Telepon:</strong> {savedData.phone}
                          </div>
                          <div>
                            <strong>Alamat:</strong> {savedData.address}
                          </div>
                          <div>
                            <strong>Email:</strong> {savedData.email}
                          </div>
                          <button onClick={handleEdit} className="btn btn-secondary">Edit</button>
                          <button onClick={handleDelete} className="btn btn-danger">Delete</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nama:</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="phone" className="form-label">No Telepon:</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="address" className="form-label">Alamat:</label>
                        <textarea
                          className="form-control"
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="profilePicture" className="form-label">Foto Profil:</label>
                        <input
                          type="file"
                          className="form-control"
                          id="profilePicture"
                          accept="image/*"
                          onChange={handleProfilePictureChange} 
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                  )}
                </Card.Text>
                {submittedData && (
                  <button onClick={handleSave} className="btn btn-success">Save</button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Akun;
