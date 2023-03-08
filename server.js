const app = require("./app");

app.listen(5678, () => {
  console.log(" app listening on port: ", process.env.PORT);
});