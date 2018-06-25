const {fixed_expenses_before_education} = require("./utils.js");

if (require.main === module) {
  while (process.argv.length > 2) {
    fixed_expenses_before_education(process.argv.pop());
  }
}
