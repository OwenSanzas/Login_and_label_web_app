import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import config from '../../config.json';
import './UserPage.css';

const User = (props) => {
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState('');
  const [renameLabel, setRenameLabel] = useState({ oldLabel: '', newLabel: '' });
  // In case all labels share the input, we create renameInputs for all labels
  const [renameInputs, setRenameInputs] = useState({});
  const [searchParams] = useSearchParams();
  const username = searchParams.get('name');



  // when the website is loaded, it get all the history labels
  useEffect(() => {
    fetchLabels();
  }, []);


  // Service 1: get the history labels
  const fetchLabels = async () => {
    const response = await fetch(`http://${config.server_host}:${config.server_port}/getLabels?username=${username}`);
    const data = await response.json();
    console.log(data.data[0].labels);
    setLabels(JSON.parse(data.data[0].labels));
  };


  // Service 2: add new labels 
  const handleAddLabel = async (e) => {
    e.preventDefault();

    if (newLabel.trim() === '') {
      alert('Please input a normal string!');
      return;
    }

    let newLabelTrim = newLabel.trim();

    const response = await fetch(`http://${config.server_host}:${config.server_port}/addLabels`, {
      method: 'POST',
      body: JSON.stringify({ username: username, newLabel: newLabelTrim }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 200) {
      setNewLabel('');
      fetchLabels();
    } else if (response.status === 400) {
      const errorMessage = await response.text();
      alert(errorMessage);
    } else if (response.status === 500) {
      alert('Server error. Please try again later.');
    }
  };

  // Service 3: delete labels
  const handleDeleteLabel = async (label) => {
    const response = await fetch(`http://${config.server_host}:${config.server_port}/deleteLabels`, {
      method: 'DELETE',
      body: JSON.stringify({ username: username, label: label }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 200) {
      fetchLabels();
    } else if (response.status === 400) {
      const errorMessage = await response.text();
      alert(errorMessage);
    } else if (response.status === 500) {
      alert('Server error. Please try again later.');
    }
  };


  // Service 4: rename labels
  const handleRenameLabel = async (oldLabel, newLabel) => {
    if (newLabel.trim() === '') {
      alert('Please input a normal string!');
      return;
    }
    
    const response = await fetch(`http://${config.server_host}:${config.server_port}/updateLabels`, {
      method: 'PUT',
      body: JSON.stringify({ username: username, oldLabel: oldLabel, newLabel: newLabel }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 200) {
      setRenameLabel({ ...renameLabel, newLabel: '' });
      fetchLabels();
      setRenameInputs({});
    } else if (response.status === 400) {
      const errorMessage = await response.text();
      alert(errorMessage);
    } else if (response.status === 500) {
      alert('Server error. Please try again later.');
    }
  };

  const handleRenameInputChange = (label, value) => {
    setRenameInputs({ ...renameInputs, [label]: value });
  };

  // return the component
  return (
    <div className="user-container">
      <h1>Welcome, {username}!</h1>
      <h2>Your Labels:</h2>
      <ul>
        {labels.map((label, index) => (
          <li key={index}>
            {label}
            <button onClick={() => handleDeleteLabel(label)}>Delete</button>
            <input
              type="text"
              placeholder="New label name"
              value={renameInputs[label] || ''}
              onChange={(e) => handleRenameInputChange(label, e.target.value)}
            />
            <button onClick={() => handleRenameLabel(label, renameInputs[label] || '')}>Rename</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddLabel}>
        <input
          type="text"
          placeholder="Add new label"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default User;