const axios = require('axios');

const razorpayAuth = {
  username: process.env.RAZORPAY_KEY_ID,
  password: process.env.RAZORPAY_KEY_SECRET
};

async function createInvoice(customerEmail, customerContact, itemName, itemAmount) {
  const invoiceData = {
    type: "invoice",
    customer: {
      email: customerEmail,
      contact: customerContact
    },
    line_items: [
      {
        name: itemName,
        amount: itemAmount * 100,
        currency: "INR",
        quantity: 1
      }
    ]
  };

  try {
    const response = await axios.post('https://api.razorpay.com/v1/invoices', invoiceData, {
      auth: razorpayAuth
    });
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error.response.data);
    return null;
  }
}

module.exports = { createInvoice };
