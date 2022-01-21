const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];


//**************************** */
//             POST
//**************************** */
app.post('/cadastrarContato', (request, response) => {
  const { namePerson, address, phone } = request.body;

  const userExists = users.find(user => user.namePerson === namePerson);

  if (userExists) {
    return response.status(400).json({ error: 'Username already exists' })
  }

  const user = {
    id: uuidv4(),
    namePerson,
    address,
    phone
  }

  users.push(user);

  return response.status(201).json(user);

});


//**************************** */
//             GET
//**************************** */
app.get('/obterContatos', (request, response) => {


  return response.json(users);
});


//**************************** */
//             DELETE
//**************************** */


app.delete('/todos/:id', (request, response) => {
  
  const { id } = request.params;

  const todoIndex = users.findIndex(function (elem, index, array) {
    if (elem.id == id) {
      return index
    }
  });
  
  

  users.splice(todoIndex, 1);

  return response.status(204).send();

});

module.exports = app;