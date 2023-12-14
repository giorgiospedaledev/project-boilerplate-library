/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Book = require("../models/book.js");
const Comment = require("../models/comment.js");

//Set up default mongoose connection

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      //response will be array of book objects
      const books = await Book.find().populate("comments").exec();

      res.json(
        books.map((x) => ({
          _id: x._id,
          title: x.title,
          commentcount: x.comments.length,
        }))
      );

      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      let title = req.body.title;

      if (!title) {
        res.json("missing required field title");
        return;
      }

      const book = new Book({
        title,
      });
      await book.save();

      res.json({
        title: book.title,
        _id: book._id,
      });
      //response will contain new book object including atleast _id and title
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      await Book.deleteMany();

      res.json("complete delete successful");
    });
  const findBookId = async (req, res, next) => {
    let bookid = req.params.id;

    const book = await Book.findById(bookid).populate("comments");
    if (!book) 
      return res.json("no book exists");
      
    req.book = book;
    next()
    

  };

  app
    .route("/api/books/:id")
    .get(findBookId, async function (req, res) {
      const book = req.book;

      res.json({
        _id: book._id,
        title: book.title,
        comments: book.comments.map((x) => x.comment),
      });

      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(findBookId, async function (req, res) {
      const book = req.book;
      let comment = req.body.comment;

      if (!comment) 
        return res.json("missing required field comment");

      const newComment = new Comment({bookId: book._id, comment: comment});
      await newComment.save();

      book.comments.push(newComment);
      await book.save();

      res.json({
        _id: book._id,
        title: book.title,
        comments: book.comments.map((x) => x.comment),
      });
      //json res format same as .get
    })

    .delete(findBookId, async function (req, res) {
      let book = req.book;

      const {deletedCount} = await Book.deleteOne({_id: book._id});
      if (deletedCount == 0) 
        return res.json("no book exists");
      res.json("delete successful")


      //if successful response will be 'delete successful'
    });
};
