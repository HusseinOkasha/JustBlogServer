const Blogger = require("../models/blogger");
const Post = require("../models/post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async function ({ userInput }) {
    // Extracting data
    const email = userInput.email;
    const password = userInput.password;
    const firstName = userInput.firstName;
    const lastName = userInput.lastName;

    // Detecting if there is existing user with same email
    const existingBlogger = await Blogger.findOne({ email: email });

    if (existingBlogger) {
      const error = new Error("Account with this email already exists");
      error.status = 403; // Forbidden
      throw error;
    }

    // Hashing password before inserting it in the database.
    const hashedPassword = await bcrypt.hash(password, 12);

    // Creating a database blogger object.
    const blogger = new Blogger({
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hashedPassword,
    });

    // saving the blogger object to the databse.
    createdBlogger = await blogger.save();

    return {
      email: createdBlogger.email,
      password: createdBlogger.password,
      firstName: createdBlogger.firstName,
      lastName: createdBlogger.lastName,
      id: createdBlogger.id.toString(),
    };
  },

  login: async function ({ email, password }) {
    // check if there is a blogger with this email.
    blogger = await Blogger.findOne({ email: email });

    if (!blogger) {
      // there isn't blogger with this email
      const error = new Error("There is no blogger with this email.");
      error.code = 401;
      throw error;
    }

    // Is the password correct?
    const isEqual = await bcrypt.compare(password, blogger.password);

    if (!isEqual) {
      // Password is incorrect.
      const error = new Error("Password Incorrect.");
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: blogger.id.toString(),
        email: blogger.email,
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );
    return { token: token, userId: blogger.id.toString() };
  },

  createPost: async function ({ body }, req) {
    if (!req.isAuth) {
      const error = new Error("Not Authorized");
      error.code = 401;
      throw error;
    }
    post = new Post({ body: body });

    createdPost = await post.save();

    return { body: createdPost.body, id: createdPost.id.toString() };
  },

  posts: async function (_, req) {
    if (!req.isAuth) {
      const error = new Error("Unauthorized");
      error.code = 401;
      throw error;
    }

    posts = await Post.find({}).sort({ _id: -1 });

    return {
      posts: posts.map((p) => {
        return { body: p.body, id: p.id.toString() };
      }),
    };
  },
};
