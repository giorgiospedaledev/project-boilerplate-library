/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';


var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true});

const Book = require('../models/book.js');
const Comment = require('../models/comment.js');

//Set up default mongoose connection



module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      const books = await Book.find().populate('comments').exec();

      res.json(books.map(x=> ({_id: x._id, title: x.title, commentcount: x.comments.length})));

      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      
      if (!title) {
         res.json('missing required field title');
         return ;
      }

      const book = new Book({
        title,
      });
      await book.save();

      res.json({
        title: book.title,
        _id: book._id
      });
      //response will contain new book object including atleast _id and title
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      await Book.deleteMany();

      res.json("complete delete successful")
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
