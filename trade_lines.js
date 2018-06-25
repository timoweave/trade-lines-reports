const fs = require("fs");

const read_tradelines = filename => {
  return [
    {
      date: "2015-10-10",
      code: 10,
      subcode: 12,
      monthly_payment: 147031,
      current_balance: 65921800,
    },
    {
      date: "2015-10-10",
      code: 5,
      subcode: 1,
      monthly_payment: 43198,
      current_balance: 5102800,
    },
    {
      date: "2015-10-09",
      code: 8,
      subcode: 15,
      monthly_payment: 34012,
      current_balance: 2122320,
    },
    {
      date: "2015-10-10",
      code: 10,
      subcode: 15,
      monthly_payment: 93012,
      current_balance: 12041300,
    },
    {
      date: "2015-10-09",
      code: 12,
      subcode: 5,
      monthly_payment: 15050,
      current_balance: 642121,
    },
  ].map(({code, subcode, monthly_payment, current_balance}) => ({
    type: trade_type({code, subcode}),
    monthly_payment,
    current_balance,
  }));
};

module.exports = read_tradelines;
