import React, { useState } from 'react';
import { Container, Row, Col, ListGroup, Form, Button, Alert } from 'react-bootstrap';

const ChatsST = () => {
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState('');
  const [connectedStudents, setConnectedStudents] = useState([
    { id: 1, name: 'Alice', online: true },
    { id: 2, name: 'Bob', online: false },
    { id: 3, name: 'Charlie', online: true },
  ]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && selectedStudent) {
      const studentId = selectedStudent.id;
      setMessages(prevMessages => ({
        ...prevMessages,
        [studentId]: [...(prevMessages[studentId] || []), { text: input, id: (prevMessages[studentId] || []).length }]
      }));
      setInput('');
    }
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  return (
    <Container>
      <Row>
        <Col md={4}>
          <h3>Students</h3>
          <ListGroup>
            {connectedStudents.map(student => (
              <ListGroup.Item
                key={student.id}
                onClick={() => handleStudentSelect(student)}
                style={{ cursor: 'pointer', backgroundColor: student.online ? '#d4edda' : '#f8d7da' }}
              >
                {student.name} {student.online ? <span className="text-success">(Online)</span> : <span className="text-danger">(Offline)</span>}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={8}>
          <h1>Chat with {selectedStudent ? selectedStudent.name : 'Select a student'}</h1>
          {selectedStudent ? (
            <>
              <div
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  padding: '10px',
                  height: '400px',
                  overflowY: 'scroll',
                  marginBottom: '20px',
                }}
              >
                {messages[selectedStudent.id]?.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      marginBottom: '10px',
                      padding: '10px',
                      borderRadius: '5px',
                      backgroundColor: '#f1f1f1',
                    }}
                  >
                    {message.text}
                  </div>
                ))}
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
                <Button type="submit" variant="primary">Enviar</Button>
              </Form>
            </>
          ) : (
            <Alert variant="info">
              Please select a student to start chatting.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ChatsST;
