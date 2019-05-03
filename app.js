const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/nodekb', { useNewUrlParser: true });
let db = mongoose.connection;

// Check connection
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', (err) => {
  console.log(err);
});

// Init app
const app = express();

// Bring in Models
let Article = require('./models/article');

// Set public folder.
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

// Home route
app.get('/', (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        title: 'Articles',
        articles: articles
      });
    }
  });
});

// Get single article
app.get('/article/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render('article', {
      article: article
    });
  });
});

// Add route
app.get('/articles/add', (req, res) => {
  res.render('add', {
    title: 'Add article'
  });
});


// Add submit POST Route
app.post('/articles/add', (req, res) => {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save((err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
  return;
});

// Load Edit form
app.get('/article/edit/:id', (req, res) => {
  Article.findById(req.params.id, (err, article) => {
    res.render('edit', {
      title: 'Edit Article',
      article: article
    });
  });
});

// Update submit POST Route
app.post('/articles/edit/:id', (req, res) => {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = { _id: req.params.id };
  Article.update(query, article, (err) => {
    if (err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
  return;
});

// Delete Article
app.delete('/article/:id', (req, res) => {
  let query = { _id: req.params.id };
  Article.remove(query, (err) => {
    if (err) {
      console.log(err);
    }
    res.send('Success');
  });
});

// Start server
app.listen(3000, (req, res) => {
  console.log('Server started on port 3000');
});
