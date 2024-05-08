import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Row, Col, Card, Form } from 'react-bootstrap';
import Login from './login';
import Informasi from './informasi';
import './App.css';

const App = () => {
  const [dataMakanan, setDataMakanan] = useState([]);
  const [keranjang, setKeranjang] = useState([]);
  const [saldoDompet, setSaldoDompet] = useState(0);
  const [totalHarga, setTotalHarga] = useState(0);
  const [inputDompet, setInputDompet] = useState('');
  const [address, setAddress] = useState('');
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://172.16.100.39:8080/food?search=chicken');
      setDataMakanan(response.data.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setKeranjang([]);
    setSaldoDompet(0);
    setTotalHarga(0);
    setInputDompet('');
  };

  const tambahKeKeranjang = (makanan) => {
    setKeranjang([...keranjang, makanan]);
    setTotalHarga(totalHarga + makanan.harga);
  };

  const handleRemoveItem = (index) => {
    const updatedKeranjang = [...keranjang];
    const removedItem = updatedKeranjang.splice(index, 1)[0];
    setKeranjang(updatedKeranjang);
    setTotalHarga(totalHarga - removedItem.harga);
  };

  const prosesPembelian = () => {
    if (saldoDompet >= totalHarga) {
      setSaldoDompet(saldoDompet - totalHarga);
      setKeranjang([]);
      setTotalHarga(0);
      const newTransaction = {
        items: keranjang,
        totalHarga: totalHarga,
        address: address,
        timestamp: new Date().toISOString(),
      };
      setTransactionHistory([...transactionHistory, newTransaction]);
      setAddress('');
      alert('Transaksi berhasil!');
    } else {
      alert('Saldo dompet tidak mencukupi!');
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  return (
    <Router>
      <Navbar className='navbar'>
        <Container>
          <Link to="/">
            <Button variant="link">
              <h1 id="food-center">Food center</h1>
            </Button>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto" id="nav-links">
              <Link to="/" className="nav-link">
                <Button variant="link">Pesan</Button>
              </Link>
              <Link to="/informasi" className="nav-link">
                <Button variant="link">Admin</Button>
              </Link>
              {isLoggedIn ? (
                <Button variant="link" onClick={handleLogout}>Sign Out</Button>
              ) : (
                <Link to="/login" className="nav-link">
                  <Button variant="link">Sign In</Button>
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Switch>
          <Route path="/" exact>
            <h1 style={{ color: 'black', textAlign: 'center' }}>Food Ordering System</h1>
            <Row>
              {dataMakanan.map((makanan) => (
                <Col key={makanan.id} md={4}>
                  <Card>
                    <Card.Img variant="top" src={makanan.gambar} alt={makanan.nama} />
                    <Card.Body>
                      <Card.Title>{makanan.nama}</Card.Title>
                      <Card.Text>{makanan.harga}</Card.Text>
                      <Button variant="primary" onClick={() => tambahKeKeranjang(makanan)}>Add to Cart</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="box">
              <h2>Dompet : </h2>
              <h1>Rp.{saldoDompet}</h1>
            </div>

            <Form className='box1'>
              <Form.Group controlId="formDompet">
                <Form.Label>Masukkan Jumlah Uang:</Form.Label>
                <Row>
                  <Col>
                    <Form.Control type="number" placeholder="Jumlah Uang" value={inputDompet} onChange={(e) => setInputDompet(e.target.value)} />
                  </Col>
                  <Col>
                    <Button variant="primary" onClick={() => setSaldoDompet(saldoDompet + parseFloat(inputDompet))}>
                      <h3 className='button'>Tambah</h3>
                    </Button>
                  </Col>
                </Row>
              </Form.Group>
            </Form>

            <div>
              <Form.Group controlId="formAddress" className='box1'>
                <Form.Label>Nama dan Alamat Pengiriman:</Form.Label>
                <Form.Control type="text" placeholder="Alamat Pengiriman" value={address} onChange={handleAddressChange} />
              </Form.Group>

              <div className='box'>
                <h2 className="mt-5">Keranjang</h2>
                {keranjang.length === 0 ? (
                  <p>Keranjang kosong</p>
                ) : (
                  <>
                    <ul>
                      {keranjang.map((item, index) => (
                        <li key={index}>
                          {item.nama} - Rp.{item.harga}
                          <Button variant="danger" onClick={() => handleRemoveItem(index)}>Delete</Button>
                        </li>
                      ))}
                    </ul>
                    <p>Total Harga: {totalHarga}</p>
                    <Button variant="success" onClick={prosesPembelian}>Pay</Button>
                  </>
                )}
              </div>
            </div>

            <div className='box'>
              <h2>Transaction History</h2>
              {transactionHistory.length === 0 ? (
                <p>Kosong</p>
              ) : (
                <ul>
                  {transactionHistory.map((transaction, index) => (
                    <li key={index}>
                      <p>Items:</p>
                      <ul>
                        {transaction.items.map((item, index) => (
                          <li key={index}>
                            {item.nama} - Rp.{item.harga}
                          </li>
                        ))}
                      </ul>
                      <p>Total Harga: {transaction.totalHarga}</p>
                      <p>Nama dan Alamat: {transaction.address}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Route>
        </Switch>
      </Container>

      {isLoggedIn ? (
        <div style={{ backgroundColor: 'lavenderblush' }}>
          <Route path="/informasi" exact>
            <Informasi onDataAdded={(newData) => setDataMakanan([...dataMakanan, newData])} />
          </Route>
        </div>
      ) : (
        <Login onLogin={handleLogin} />
      )}

    </Router>
  );
}

export default App;
