import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, Button, Row, Col } from 'react-bootstrap';
import './SearchBar.css';  // Import the custom CSS

const SearchBar = ({ onFilter, specialists }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = data => {
    console.log("Form Submission Data: ", data);
    onFilter(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="search-bar p-3">
      <Row className="align-items-end">
        <Col md={4} className="mb-3">
          <Form.Group controlId="specialist">
            <Form.Label>Specialist</Form.Label>
            <Form.Control as="select" {...register('specialist')}>
              <option value="">Select a Specialist</option>
              {specialists ? specialists.map((specialist, index) => (
                <option key={index} value={specialist.id}>
                  {`Dr. ${specialist.name}`}
                </option>
              )):null}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3} className="mb-3">
          <Form.Group controlId="from">
            <Form.Label>From</Form.Label>
            <Form.Control type="datetime-local" {...register('from')} />
          </Form.Group>
        </Col>
        <Col md={3} className="mb-3">
          <Form.Group controlId="to">
            <Form.Label>To</Form.Label>
            <Form.Control type="datetime-local" {...register('to')} />
          </Form.Group>
        </Col>
        <Col md={2} className="text-center">
          <Button type="submit" variant="primary" className="search-button w-100">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBar;
