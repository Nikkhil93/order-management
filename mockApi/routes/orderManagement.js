// orderManagement.js - orderManagement route module

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(
  bodyParser.urlencoded({
    extended: false
  })
);
router.use(bodyParser.json());

//getAllOrderDetails API
router.all('/getAllOrderDetails', function(req, res) {
  res.send({
    statusCode: 200,
    statusMsg: 'OK',
    data: [
      {
        orderNumber : 1,
        orderDueDate : "2020-1-31",
        buyerName : "Nikhil Kumar",
        customerAddress : "TCS",
        customerPhone : "7878454542",
        orderTotal : "5420"
      },
      {
        orderNumber : 2,
        orderDueDate : "2020-4-3",
        buyerName : "steven Smith",
        customerAddress : "TCS",
        customerPhone : "7878454542",
        orderTotal : "1420"
      },
      {
        orderNumber : 3,
        orderDueDate : "2020-2-25",
        buyerName : "John Doe",
        customerAddress : "TCS",
        customerPhone : "7878454542",
        orderTotal : "5455"
      },
    ]
  });
});

module.exports = router;
