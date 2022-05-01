//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent =
	"This is a blog posting web application. You can publish you blog by going to /compose route in the address bar. Happy blogging !";

const aboutContent =
	"This is a web development project made by Mayank Virole and Gourav Sharma as the minor project . It uses a mongdoDB database to store the content of the blogs. ";
const contactContent = "You can contact us at mayankvirole@gmail.com";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://mankavilla:password1221@cluster0.ekon0.mongodb.net/blogDB", { useNewUrlParser: true });

const postSchema = {
	title: String,
	content: String,
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
	Post.find({}, function (err, posts) {
		res.render("home", {
			startingContent: homeStartingContent,
			posts: posts,
		});
	});
});

app.get("/about", function (req, res) {
	res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
	res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
	res.render("compose");
});

app.post("/compose", function (req, res) {
	const post = new Post({
		title: req.body.postTitle,
		content: req.body.postBody,
	});

	post.save(function (err) {
		if (!err) res.redirect("/");
	});
});

app.get("/posts/:postId", function (req, res) {
	const requestedPostId = req.params.postId;

	Post.findOne({ _id: requestedPostId }, function (err, post) {
		if (!err) {
			res.render("post", {
				title: post.title,
				content: post.content,
			});
		}
	});
});

let port = process.env.PORT;
if (port == null || port == "") {
	port = 3000;
}

app.listen(port, function () {
	console.log("Server started on port 3000");
});
