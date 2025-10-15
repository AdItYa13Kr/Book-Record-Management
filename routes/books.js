const express = require("express");
const {books} = require("../data/books.json");
const {users} = require("../data/users.json");
const router = express.Router();


// get all books
router.get("/",(req,res)=>{
    res.status(200).json({
        success: true,
        message: "Got all the books",
        data: books,
    });
});

// get all issued books
router.get("/issued",(req,res)=>{
    const usersWithIssuedBook = users.filter((each)=>{
        if(each.issuedBook) return each
    });
    const issuedBooks= [];
    usersWithIssuedBook.forEach((each)=>{
        const book = books.find((book)=> (book.id === each.issuedBook));
        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);
    });
    if(issuedBooks.length === 0){
        return res.status(404).json({
            success: false,
            message: "No books issued yet",
        });
    }
    return res.status(200).json({
        success: true,
        message: "Users with the issued books found",
        data: issuedBooks,
    });
});

// get book by id
router.get("/:id",(req,res)=>{
    const {id} = req.params;
    const book = books.find((each)=>each.id===id);
    if(!book){
        return res.status(404).json({
            success: false,
            message: "Book not found",
        });
    }
    return res.status(200).json({
        success: true,
        message: "Book found",
        data: book,
    });
});

// create an new book
router.post("/",(req,res)=>{
    const {data} = req.body;
    if(!data){
        return res.status(400).json({
            success: false,
            message: "No data to add book",
        });
    }
    const book = books.find((each)=>each.id===data.id);
    if(book){
        return res.status(404).json({
            success: false,
            message: "Book with the ID exists",
          });
    }
    const allBooks = {...books,data};
    return res.status(201).json({
        success: true,
        message: "Added Successfully",
        data: allBooks,
    });
});

// book updation by id
 router.put("/update/:id",(req,res)=>{
    const { id }  =req.params;
    const  {data}  = req.body;
    const book = books.find((each)=>each.id === id);
    if(!book){
      return res.status(400).json({
        success: false,
        message: "Book not found with the id",
      });
    }
    const updateBookData = books.map((each)=>{
      if(each.id === id){
        return{
          ...each,
          ...data,
        };
  
      }
      return each;
    });
    return res.status(200).json({
      succes: true,
      message: "Book updated",
      data: updateBookData,
    });
  });

    


module.exports = router;