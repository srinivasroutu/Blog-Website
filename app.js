//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Welcome to our wonderful website! 🌟 Here, you'll discover a captivating world of creativity and expression. From inspiring articles to thought-provoking posts, our platform is designed to ignite your imagination and engage your mind.Immerse yourself in a diverse range of topics, from the latest trends to timeless classics. Explore captivating stories that will transport you to new realms of knowledge and understanding. Our user-friendly interface ensures a seamless and enjoyable browsing experience, allowing you to effortlessly navigate through a plethora of intriguing content.Whether you're seeking a moment of relaxation, a spark of inspiration, or a deep dive into the realms of knowledge, our website is your gateway to a world of endless possibilities. Join us on this exciting journey and let your curiosity thrive. Your adventure starts here, and the wonders of our website await your exploration. 🚀✨";
const aboutContent = "Welcome to Daily Journal, your daily source of inspiration, creativity, and knowledge. We believe that every day is an opportunity to learn, grow, and explore, and we're here to accompany you on that journey.Our StoryFounded with a passion for sharing stories and ideas, Daily Journal has evolved into a vibrant community of thinkers, creators, and dreamers. Since our inception, we've been dedicated to providing a platform where voices from all walks of life can come together to express themselves and connect with others.What We OfferDaily Journal is your hub for thought-provoking articles, insightful stories, and valuable information across a wide range of topics. Whether you're seeking practical advice, seeking inspiration, or simply looking to immerse yourself in captivating narratives, our diverse collection has something for everyone.Our VisionWe envision a world where curiosity is celebrated, where learning never stops, and where individuals are empowered to make a positive impact. Through Daily Journal, we aim to foster a sense of curiosity, wonder, and connection that enriches your daily life and fuels your personal and professional growth.Join Our Community We invite you to be a part of our dynamic community. Engage in meaningful discussions, share your perspectives, and contribute your unique insights. Together, we can create a space that encourages lifelong learning, sparks creativity, and encourages meaningful connections.Thank you for being a part of the Daily Journal family. We're excited to have you join us on this incredible journey of discovery and exploration. Your voice matters, and together, we'll continue to make every day extraordinary.Welcome to Daily Journal, where every day is a new chapter waiting to be written.";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", async function(req, res) {
  try {
    const posts = await Post.find({});
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  } catch (err) {
    console.log(err);
  }
});


app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", async function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  try {
    await post.save();
    const posts = await Post.find({});
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete/:postId", async function(req, res) {
  const postId = req.params.postId;

  try {
    await Post.findByIdAndDelete(postId);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});


app.get("/posts/:postId", async function(req, res) {
  try {
    const requestedPostId = req.params.postId;
    const post = await Post.findOne({ _id: requestedPostId });
    res.render("post", { post: post }); // Pass the "post" object to the template
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});



app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact");
});
app.post("/contact", function(req, res) {
  res.redirect("/contact");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
