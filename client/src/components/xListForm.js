// NOT SURE WHOSE BUT SAVING THIS CODE -tim

import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  wrapper: {}
});

function ListForm(props) {
  const headers = {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_SENDGRID_API_KEY}`
    },
    'content-type': 'application/json'
  };
  const listId = 7061139; // test3
  // const recipient_id = 'YXN0dXJpYXN4aUBnbWFpbC5jb20='; // Timmy
  // const recipient_ids = [
  //   'YXJlbGkuYXRoZW5zQGNvd3N0b3JlLm5ldA==',
  //   'YXN0dXJpYXN4aUBnbWFpbC5jb20='
  // ]; // Magda, Timmy
  // const sender_id = 425702; // The Refreshr Team
  // const campaign_id = 5001224; // March Newsletter
  const [list, setList] = useState([]);
  const [inputText, setInputText] = useState([]);

  const addList = event => {
    event.preventDefault();
    const url = 'https://api.sendgrid.com/v3/contactdb/lists';
    let newID = Math.floor(Math.random() * (100000 - 10000));
    const body = {
      id: newID,
      name: inputText,
      recipient_count: 0
    };
    axios
      .post(url, body, headers)
      .then(res => {
        console.log(`===addList: ${res.data.name}===`);
        console.log(res.data.id);
      })
      .catch(err => console.log(err));
  };

  const getListByID = item => {
    const url = `https://api.sendgrid.com/v3/contactdb/lists/${item.id}`;
    axios
      .get(url, headers)
      .then(res => {
        console.log(`===getList: ${res.data.name}===`);
        console.log(res.data);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    const url = 'https://api.sendgrid.com/v3/contactdb/lists';
    axios
      .get(url, headers)
      .then(res => {
        console.log(`===getLists: all===`);
        console.log(res.data.lists);
        setList(res.data.lists);
      })
      .catch(err => console.log(err));
  }, []);

  const updateList = () => {
    const url = `https://api.sendgrid.com/v3/contactdb/lists/${listId}`;
    const body = {
      name: 'modifiedListName'
    };
    axios
      .patch(url, body, headers)
      .then(res => {
        console.log(`===updateList: ${res.data.name}===`);
        console.log(res);
      })
      .catch(err => console.log(err));
  };

  const deleteList = item => {
    const url = `https://api.sendgrid.com/v3/contactdb/lists/${
      item.id
      }?delete_contacts=true`;
    axios
      .delete(url, headers)
      .then(res => {
        console.log(`===deleteList: ${res.statusText}===`);
        console.log(res);
      })
      .catch(err => console.log(err));
  };

  const handleChange = event => {
    setInputText(event.target.value);
  };

  return (
    <Grid className={props.classes.wrapper}>
      <div>
        {list.map(item => (
          <ul key={item.id}>
            {item.name}
            <button onClick={() => deleteList(item)}>
              {<i className="fas fa-times" />}
            </button>
          </ul>
        ))}
      </div>

      <form onSubmit={addList}>
        <label>
          Add student:
            <input type="text" name="name" onChange={handleChange} />
        </label>
        <input type="submit" />
      </form>
    </Grid>
  );
}

export default withStyles(styles)(ListForm);
