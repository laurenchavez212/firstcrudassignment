var express = require('express');
var app = express();
var port = process.env.PORT || 8000;
var fs = require('fs');
var bodyParser = require("body-parser");

app.use(bodyParser.json());

app.post('/users', (req, res)=> {
  var user = {
    content: req.body.name,
    author: req.body.email,
    state: req.body.state
  };
  fs.readFile("storage.json", 'utf8', (err, data)=> {
    let userArr = JSON.parse(data);
    userArr.push(user);
    fs.writeFile('./storage.json', JSON.stringify(userArr), (err, data)=> {
      if(err){
        throw err;
      }
      res.sendStatus(200)
    })
  })
})

app.get('/users', (req, res)=> {
  fs.readFile('storage.json', 'utf8', (err, data)=> {
    let parsedUsers = JSON.parse(data);
    res.send(parsedUsers)
  })
})

app.get('/users/:name', (req, res)=> {
  fs.readFile('storage.json', 'utf8', (err, data)=> {
    let parsedData = JSON.parse(data);
    let match = parsedData.filter((item)=> {
      return item.name == req.params.name;
    })
    if(match.length >= 1) {
      res.send(match[0])
    } else {
      res.sendStatus(400)
    }
  })
})

app.patch('/users/:name', (req, res)=> {
  fs.readFile('storage.json', 'utf8', (err, data)=> {
    let parsed = JSON.parse(data);
    let updatedUser = {
      name: req.body.name,
      email: req.body.email,
      state: req.body.state
    };
    parsed.forEach((item, i)=> {
      if (item.name == req.params.name) {
        parsed[i] = updatedUser;
      }

    })
    fs.writeFileSync('storage.json', JSON.stringify(parsed))
    res.json(updatedUser)
  })
})


app.delete('/users/:name', (req, res)=> {
  fs.readFile('storage.json', 'utf8', (err, data)=> {
    let parsed = JSON.parse(data);
    parsed.forEach((item, i)=> {
      if (item.name == req.params.name) {
        parsed.splice(i, 1);
      }

    })
    fs.writeFileSync('storage.json', JSON.stringify(parsed))
    res.json(updatedUser)
  })
})


app.use(function(req, res) {
  res.sendStatus(404);
});

app.listen(port, function() {
  console.log('Listening on port', port);
});
