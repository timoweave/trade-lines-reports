const fs = require("fs");
const {promisify} = require("util");

// | code | subcode | type    |
// |------|---------|---------|
// | 10   | 12      | mortage |
// | 10   | 15      | mortage |
// | 5    |         | student |
// | 12   |         | other   |

const is_student_loan = ({code, subcode}) => code === 5;
const is_mortage_loan = ({code, subcode}) =>
  code === 10 && (subcode === 12 || subcode === 15);

const trade_type = trade_line => {
  if (is_mortage_loan(trade_line)) {
    return "mortage";
  }
  if (is_student_loan(trade_line)) {
    return "education";
  }
  return "other";
};

const read_tradelines = async filename => {
  try {
    const existFile = promisify(fs.exists);
    const ok = await existFile(filename);
    const readFile = promisify(fs.readFile);
    const data = await readFile(filename, "utf8");
    const parseDollar = dollar => parseInt(dollar.replace(/[\$\.]/g, ""));
    const items = data
      .split("\n")
      .filter(c => c.length > 0)
      .map(c => c.split(" "))
      .map(([due_date, code, subcode, monthly_payment, current_balance]) => ({
        type: trade_type({code: parseInt(code), subcode: parseInt(subcode)}),
        monthly_payment: parseDollar(monthly_payment),
        current_balance: parseDollar(current_balance),
      }));
    return items;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const non_housing_expenses = trade_lines =>
  trade_lines.reduce((sum, {type, monthly_payment}) => {
    if (type !== "education" && type !== "mortage") {
      sum += monthly_payment;
    }
    return sum;
  }, 0);

const housing_expenses = trade_lines =>
  trade_lines.reduce((sum, {type, monthly_payment}) => {
    if (type === "mortage") {
      sum += monthly_payment;
    }
    return sum;
  }, 0) || trade_lines.length
    ? 106100
    : 0;

const before_education_expenses = trade_lines => {
  // fixed expenses before education = non housing + housing
  const non_housing = non_housing_expenses(trade_lines);
  const housing = housing_expenses(trade_lines);
  return non_housing + housing;
};

const fixed_expenses_before_education = async filename => {
  try {
    const tradelines = await read_tradelines(filename);
    const data = {
      fixed_expenses_before_education: before_education_expenses(tradelines),
      tradelines,
    };
    console.log("filename:", filename);
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  read_tradelines,
  fixed_expenses_before_education,
};
