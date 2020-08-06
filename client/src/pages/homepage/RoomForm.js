import React, { useState } from 'react';
import { Form, Button, Label, FormGroup, Input } from 'reactstrap';

const RoomForm = () => {
  const [enterRoomName, setEnterRoomName] = useState(false);

  const toggleEnterRoomName = () => setEnterRoomName((prevState) => !prevState);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('The form has been submitted');
  };

  return (
    <Form onSubmit={handleSubmit} className="form">
      <FormGroup>
        <Label for="roomName">
          {enterRoomName ? 'Create a room' : 'Join a room'}
        </Label>
        <Input
          type="text"
          name="roomName"
          id="roomName"
          placeholder="enter a room name"
        />
      </FormGroup>
      <Button>Submit</Button>
      <p>Already know a room name?</p>
      <Button onClick={toggleEnterRoomName}>Join a room</Button>
    </Form>
  );
};

export default RoomForm;
