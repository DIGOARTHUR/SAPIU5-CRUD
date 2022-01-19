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
  const { nome, endereco, telefone } = request.body;

  const userExists = users.find(user => user.nome === nome);

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
app.delete('/todos/:index', (request, response) => {
 
  const {id} = request.params;
  
  users.splice(id, 1);

  return response.json({message:"O contato foi deletado"});

});

module.exports = app;