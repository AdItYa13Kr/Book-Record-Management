const express = require("express");
const bodyParser = require("body-parser");

const userRoute = require('./routes/users');
const booksRoute = require('./routes/books');



const app = express();

const port =8081;

app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is up and running",
   });
});

app.use("/users",userRoute);
app.use("/books", booksRoute);


// catch-all route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
