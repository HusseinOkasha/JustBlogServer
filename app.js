const express = require("express");
const path = require("path");
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const auth = require("./middleware/auth");
const mongoose = require("mongoose");

const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(auth);
app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
  })
);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

mongoose
  .connect(
    process.env.DB_URL ||
      "mongodb+srv://HusseinOkasha:root@cluster0.xeerb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then((result) => {
    console.log("Database connected");
    app.listen(process.env.PORT || 8000);
  })
  .catch((err) => {
    console.log("Database didn't connect");
    console.log(err);
  });
