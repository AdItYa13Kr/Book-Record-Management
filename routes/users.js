const express = require("express");
const {users} = require("../data/users.json");

const router = express.Router();
// getting users
router.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      data: users,
     });
  });
  
  
  // get user by id
  router.get("/:id",(req,res)=>{
    const {id} = req.params;
    const user = users.find((each)=>each.id === id);
    if(!user){
      return res.status(404).json({
        success:false,
        message: "User doesn't exist",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User found",
      data: user,
    });
  });
  // creating a new user
  router.post("/",(req,res)=>{
    const {id, name, surname, email, suscriptionType, subscriptionDate} = req.body
    const user = users.find((each)=>each.id === id);
    if(user){
      return res.status(404).json({
        success: false,
        message: "User with the ID exists",
      });
    }
    users.push({
      id,
      name,
      surname,
      email,
      suscriptionType,
      subscriptionDate
    });
    return res.status(201).json({
      success:true,
      message: "User Added Successfully",
      data: users,
    });
  });
  // Updating a user by id
  router.put("/:id",(req,res)=>{
    const { id }  =req.params;
    const  {data}  = req.body;
    const user = users.find((each)=>each.id === id);
    if(!user){
      return res.status(400).json({
        success: false,
        message: "User not found with the id",
      });
    }
    const updateUserData = users.map((each)=>{
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
      message: "User updated",
      data: updateUserData,
    });
  });
  // delete a user by id
  router.delete("/:id",(req,res)=>{
    const {id} = req.params;
    const user = users.find((each)=>each.id === id);
    if(!user){
      return res.status(404).json({
        success:false,
        message: "User doesn't exist",
      });
    }
    const index = users.indexOf(user);
    users.splice(index,1);
    return res.status(200).json({
      success: true,
      message: "User deleted",
      data: users,
    });
  });

  //  subscription details
  router.get("/subscription-details/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "User with the id doesn't exist",
        });
    }

    // Helper to convert "DD/MM/YYYY" to Date object safely
    const parseDate = (str) => {
        const [day, month, year] = str.split("/");
        return new Date(`${year}-${month}-${day}`);
    };

    // Helper to get date in days since epoch
    const getDateInDays = (data = "") => {
        let date = data === "" ? new Date() : parseDate(data);
        return Math.floor(date.getTime() / (1000 * 60 * 60 * 24));
    };

    // Add days to subscription start based on type
    const subscriptionType = (date) => {
        if (user.subscriptionType === "Basic") return date + 90;
        if (user.subscriptionType === "Standard") return date + 180;
        if (user.subscriptionType === "Premium") return date + 365;
        return date;
    };

    // Calculate all needed dates
    const returnDate = getDateInDays(user.returnDate);
    const currentDate = getDateInDays();
    const subscriptionStart = getDateInDays(user.subscriptionDate);
    const subscriptionExpiration = subscriptionType(subscriptionStart);

    const isSubscriptionExpired = subscriptionExpiration <= currentDate;
    const daysLeftForExpiration = isSubscriptionExpired
        ? 0
        : subscriptionExpiration - currentDate;

    // 🟨 Fine Logic:
    let fine = 0;
    if (returnDate < currentDate && isSubscriptionExpired) {
        fine = 100;
    } else if (returnDate < currentDate) {
        fine = 50;
    }

    const data = {
        ...user,
        isSubscriptionExpired,
        daysLeftForExpiration,
        fine,
    };

    return res.status(200).json({
        success: true,
        message: "Subscription detail for the user is: ",
        data,
    });
});


module.exports   = router;