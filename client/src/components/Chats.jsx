import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, ListGroup, Form, Button, Alert, Accordion, Card, Offcanvas } from 'react-bootstrap';

import axios from 'axios';
import { FaChevronLeft, FaArrowLeft } from "react-icons/fa";
import {  urichat, URIUser } from './Urls';

const Chats = ({ userId }) => {
  const UserId = parseInt(userId);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState('');
  const [connectedStudents, setConnectedStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const messagesEndRef = useRef(null);
  const [screenMid] = useState(window.innerHeight);
  


  const fetchChatHistory = async (user1, user2) => {
    try {
      const response = await axios.get(`${urichat}/${user1}/${user2}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(URIUser);
        const usuarios = response.data.filter(user => user.id !== UserId);
        setUsers(usuarios);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [UserId]);

  useEffect(() => {
    const filterUsers = async () => {
      const usersWithHistory = [];
      for (const user of users) {
        const chatHistory = await fetchChatHistory(UserId, user.id);
        //if (chatHistory.length > 0 /*|| connectedStudents.includes(user.id)*/) {
          usersWithHistory.push(user);
        //}
      }
      setFilteredUsers(usersWithHistory);
    };

    filterUsers();
  }, [users, connectedStudents]);

  useEffect(() => {
    if (selectedStudent) {
      fetchChatHistory(UserId, selectedStudent.id).then(chatHistory => {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedStudent.id]: chatHistory
        }));
      });
    }
  }, [selectedStudent]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedStudent) {
        fetchChatHistory(UserId, selectedStudent.id).then(chatHistory => {
          setMessages((prevMessages) => ({
            ...prevMessages,
            [selectedStudent.id]: chatHistory
          }));
        });
      }
    }, 5000); // Verifica cada 5 segundos

    return () => clearInterval(interval);
  }, [selectedStudent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() && selectedStudent) {
      const msg = { emisor: UserId, mensaje: input, receptor: selectedStudent.id };

      try {
        await axios.post(urichat, msg);
        setMessages((prevMessages) => {
          const studentId = selectedStudent.id;
          return {
            ...prevMessages,
            [studentId]: [...(prevMessages[studentId] || []), msg],
          };
        });
        setInput('');
      } catch (error) {
        console.error('Error al enviar el mensaje:', error);
      }
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    if (window.innerWidth < 768) {
      setShowUsers(false); // Hide the user list on small screens after selecting a user
    }
  };

  return (
    <div>
      <div className='mb-3'><span className='h3 Principal f_principal'>Tus Chats</span></div>
      <div className='container-fluid'>
        <div className='d-flex'>
          <div className='w-100'>
            <div className=''>
              <h1 className='mb-2 Principal'>Chatear con {selectedStudent ? selectedStudent.name : 'Selecciona un estudiante'}</h1>
              {selectedStudent ? (
                <>
                  <div
                    style={{
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      padding: '10px',
                      height: '400px',
                      overflowY: 'auto',
                      marginBottom: '20px',
                    }
                  }
                  className='bg_secundario'
                  >
                    {messages[selectedStudent.id]?.map((message, index) => (
                      <div
                        key={index}
                        className={`d-flex mb-2 ${message.emisor === UserId ? 'justify-content-end' : 'justify-content-start'}`}
                      >
                        <div
                          style={{
                            maxWidth: '60%',
                            padding: '10px',
                            borderRadius: '15px',
                            border: '1px solid black',
                            backgroundColor:'rgba(255, 255, 255, 0.5)',
                            wordBreak: 'break-word',
                          }}
                        >
                          {message.mensaje}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Escribe un mensaje..."
                      />
                    </Form.Group>
                    <Button type="submit" variant="primary" className='bg_secundario mt-2'>Enviar</Button>
                  </Form>
                </>
              ) : (
                <Alert variant="info" className='bg_secundario Blanco'>
                  <div>No tienes ningun chat abierto.</div>
                  <div>Selecciona un usuario para empezar a chatear.</div>
                </Alert>

              )}
            </div>
          </div>
          <div className='d-none d-md-block ms-4 w-50'>
            <div className="">
              <h3 className='mb-2 Principal'>Usuarios</h3>
              <Accordion defaultActiveKey="0">
                {['administrador', 'tutor', 'estudiante'].map((role, idx) => (
                  <Accordion.Item eventKey={String(idx)} key={role}>
                    <Accordion.Header>{role.charAt(0).toUpperCase() + role.slice(1)}</Accordion.Header>
                    <Accordion.Body>
                      <ListGroup variant="flush">
                        {filteredUsers
                          .filter(user => user.role === role)
                          .map(user => (
                            <ListGroup.Item
                              key={user.id}
                              onClick={() => handleStudentSelect(user)}
                              style={{ cursor: 'pointer', position: 'relative' }}
                            >
                              <span
                                style={{
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '50%',
                                  display: 'inline-block',
                                  marginRight: '10px',
                                }}
                                className='bg_secundario'
                              />
                              {user.name + ' ' + user.last}
                            </ListGroup.Item>
                          ))}
                      </ListGroup>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
      <button
        className="btn d-md-none border-none Negro px-1"
        style={{ position: 'fixed', top: 0, right: '0px', backgroundColor:'rgba(255, 255, 255, 0.5)',height:screenMid }}
        onClick={() => setShowUsers(true)}
      >
        <FaChevronLeft/>
      </button>

      <Offcanvas show={showUsers} onHide={() => setShowUsers(false)} placement="end">
        <Offcanvas.Header>
          <Offcanvas.Title>
            <div className='d-flex align-items-center '>
              <Button type="button" variant="primary" className='bg_secundario' onClick={()=>setShowUsers(false)}><FaArrowLeft /></Button>
              <span className='ms-2'>Usuarios</span>  
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Accordion defaultActiveKey="0">
            {['administrador', 'tutor', 'estudiante'].map((role, idx) => (
              <Accordion.Item eventKey={String(idx)} key={role}>
                <Accordion.Header>{role.charAt(0).toUpperCase() + role.slice(1)}</Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush">
                    {filteredUsers
                      .filter(user => user.role === role)
                      .map(user => (
                        <ListGroup.Item
                          key={user.id}
                          onClick={() => handleStudentSelect(user)}
                          style={{ cursor: 'pointer', position: 'relative' }}
                        >
                          <span
                            style={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              display: 'inline-block',
                              marginRight: '10px',
                            }}
                            className='bg_secundario'
                          />
                          {user.name + ' ' + user.last}
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
         
        </Offcanvas.Body>
        
      </Offcanvas>
    </div>
  );
};

export default Chats;
