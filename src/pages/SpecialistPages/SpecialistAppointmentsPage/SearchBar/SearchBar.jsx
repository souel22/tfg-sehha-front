import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Row, Col } from 'react-bootstrap';
import './SearchBar.css';

const SearchBar = ({ onFilter, specialities, users }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = data => {
    console.log("Form Submission Data: ", data);
    onFilter(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="search-bar">
      <Row className="align-items-end">
        <Col md={3}>
          <Form.Group controlId="speciality">
            <Form.Label>Medical Specialty</Form.Label>
            <Form.Control as="select" {...register('speciality')}>
              <option value="">Select a Specialty</option>
              {specialities.map((speciality, index) => (
                <option key={index} value={speciality.id}>
                  {speciality.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="user">
            <Form.Label>User</Form.Label>
            <Form.Control as="select" {...register('user')}>
              <option value="">Select a User</option>
              {users.map((user, index) => (
                <option key={index} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group controlId="from">
            <Form.Label>From</Form.Label>
            <Form.Control type="datetime-local" {...register('from')} />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group controlId="to">
            <Form.Label>To</Form.Label>
            <Form.Control type="datetime-local" {...register('to')} />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Button type="submit" className="search-button">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBar;
