import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';

const Informasi = ({ onDataAdded }) => {
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodPrice, setNewFoodPrice] = useState('');
  const [newFoodImage, setNewFoodImage] = useState(null);
  const [newSpicyLevel, setNewSpicyLevel] = useState('');
  const [dataMakanan, setDataMakanan] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedFoodName, setEditedFoodName] = useState('');
  const [editedFoodPrice, setEditedFoodPrice] = useState('');
  const [editedFoodImage, setEditedFoodImage] = useState(null);
  const [editedSpicyLevel, setEditedSpicyLevel] = useState('');
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await axios.get('http://localhost:8000/menu'); // Replace with your API endpoint
      setDataMakanan(response.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    }
  };

  const handleNewFoodNameChange = (e) => {
    setNewFoodName(e.target.value);
  };

  const handleNewFoodPriceChange = (e) => {
    setNewFoodPrice(e.target.value);
  };

  const handleNewFoodImageChange = (e) => {
    setNewFoodImage(e.target.files[0]);
  };

  const handleNewSpicyLevelChange = (e) => {
    setNewSpicyLevel(e.target.value);
  };


  const handleAddNewFood = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newFoodName);
      formData.append('spicy_level', newSpicyLevel);
      formData.append('price', newFoodPrice);
      formData.append('image', newFoodImage);

      const response = await axios.post('http://172.16.100.39:8080/food', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const newFoodItem = response.data.data;
      setDataMakanan([...dataMakanan, newFoodItem]);
      onDataAdded(newFoodItem);
      setNewFoodName('');
      setNewFoodPrice('');
      setNewFoodImage(null);
      setNewSpicyLevel('');
    } catch (error) {
      console.error('Error adding new food:', error);
    }
  };

  const handleDeleteFood = async (id) => {
    try {
      await axios.delete(`http://172.16.100.39:8080/food/${id}`);
      setDataMakanan(dataMakanan.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting food:', error);
    }
  };

  const handleEditButtonClick = (id) => {
    const itemToEdit = dataMakanan.find(item => item.id === id);
    setEditItemId(id);
    setEditedFoodName(itemToEdit.name);
    setEditedFoodPrice(itemToEdit.price);
    setEditedSpicyLevel(itemToEdit.spicy_level);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditItemId(null);
  };

  const handleEditedFoodNameChange = (e) => {
    setEditedFoodName(e.target.value);
  };

  const handleEditedFoodPriceChange = (e) => {
    setEditedFoodPrice(e.target.value);
  };

  const handleEditedFoodImageChange = (e) => {
    setEditedFoodImage(e.target.files[0]);
  };

  const handleEditedSpicyLevelChange = (e) => {
    setEditedSpicyLevel(e.target.value);
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editedFoodName);
      formData.append('spicy_level', editedSpicyLevel);
      formData.append('price', editedFoodPrice);
      formData.append('image', editedFoodImage);

      const response = await axios.put(`http://172.16.100.39:8080/food/${editItemId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const updatedFoodItem = response.data.data;
      const updatedDataMakanan = dataMakanan.map(item => {
        if (item.id === editItemId) {
          return updatedFoodItem;
        }
        return item;
      });
      setDataMakanan(updatedDataMakanan);
      setShowEditModal(false);
      setEditItemId(null);
    } catch (error) {
      console.error('Error editing food:', error);
    }
  };

  return (
    <Container>
      <div className="box5 d-flex align-items-center justify-content-center">
        <Form style={{ maxWidth: '400px' }}>
          <Form.Group controlId="formNewFoodName">
            <Form.Label>Food Name:</Form.Label>
            <Form.Control type="text" value={newFoodName} onChange={handleNewFoodNameChange} />
          </Form.Group>
          <Form.Group controlId="formNewFoodPrice">
            <Form.Label>Price:</Form.Label>
            <Form.Control type="number" value={newFoodPrice} onChange={handleNewFoodPriceChange} />
          </Form.Group>
          <Form.Group controlId="formNewFoodImage" >
            <Form.Label>Food Image:</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleNewFoodImageChange} />
          </Form.Group>
          <Form.Group controlId="formNewSpicyLevel" >
            <Form.Label>Spicy Level:</Form.Label>
            <Form.Control as="select" value={newSpicyLevel} onChange={handleNewSpicyLevelChange}>
              <option value="">Select Spicy Level</option>
              <option value="Not Spicy">Not Spicy</option>
              <option value="Mild">Mild</option>
              <option value="Medium">Medium</option>
              <option value="Spicy">Spicy</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" onClick={handleAddNewFood}>
            Add Item
          </Button>
        </Form>
      </div>

      <h1 style={{ color: 'black', textAlign: 'center' }}>Food List</h1>
      <Row>
        {dataMakanan.map((makanan) => (
          <Col key={makanan.id} md={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={makanan.image} alt={makanan.name} />
              <Card.Body>
                <Card.Title>{makanan.name}</Card.Title>
                <Card.Text>{makanan.price}</Card.Text>
                <Card.Text>Spicy Level: {makanan.spicy_level}</Card.Text>
                <Button variant="danger" onClick={() => handleDeleteFood(makanan.id)}>Delete</Button>
                <Button variant="primary" onClick={() => handleEditButtonClick(makanan.id)}>Edit</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showEditModal} onHide={handleEditModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formEditFoodName">
            <Form.Label>Food Name:</Form.Label>
            <Form.Control type="text" value={editedFoodName} onChange={handleEditedFoodNameChange} />
          </Form.Group>
          <Form.Group controlId="formEditFoodPrice">
            <Form.Label>Price:</Form.Label>
            <Form.Control type="number" value={editedFoodPrice} onChange={handleEditedFoodPriceChange} />
          </Form.Group>
          <Form.Group controlId="formEditFoodImage">
            <Form.Label>Food Image:</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleEditedFoodImageChange} />
          </Form.Group>
          <Form.Group controlId="formEditSpicyLevel">
            <Form.Label>Spicy Level:</Form.Label>
            <Form.Control as="select" value={editedSpicyLevel} onChange={handleEditedSpicyLevelChange}>
              <option value="">Select Spicy Level</option>
              <option value="Not Spicy">Not Spicy</option>
              <option value="Mild">Mild</option>
              <option value="Medium">Medium</option>
              <option value="Spicy">Spicy</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModalClose}>Close</Button>
          <Button variant="primary" onClick={handleEditSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Informasi;