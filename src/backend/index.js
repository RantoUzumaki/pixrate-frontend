const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();

const mongoose = require("mongoose");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// model schema for user
const user = mongoose.model(
	"User",
	new mongoose.Schema(
		{
			firstname: String,
			lastname: String,
			email: String,
			password: String,
		},
		{ timestamps: { createdAt: "created_at" } }
	)
);

// model schema for Category
const category = mongoose.model(
	"Category",
	new mongoose.Schema({
		name: String,
	})
);

// Model schema for Images
const image = mongoose.model(
	"Image",
	new mongoose.Schema(
		{
			image_name: String,
			price: Number,
			user: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
			],
			category: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Category",
				},
			],
		},
		{ timestamps: { createdAt: "created_at" } }
	)
);

// Model schema for purchase
const purchase = mongoose.model(
	"Purchase",
	new mongoose.Schema(
		{
			user: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
			],
			image: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Image",
				},
			],
		},
		{ timestamps: { createdAt: "created_at" } }
	)
);

// DB connection
const url = "mongodb://localhost:27017/pixrate_backend";
mongoose
	.connect(url)
	.then(() => {
		console.log("connected");
		// initial();
	})
	.catch(() => console.log("error"));

// Adding categories to the database
let Cats = [
	"Landscape",
	"Wildlife",
	"portrait",
	"Nature",
	"Sports / Actions",
	"Archiechtural",
	"Fashion",
	"Macro",
	"Abstract",
];

function initial() {
	category.estimatedDocumentCount((err, count) => {
		if (!err && count === 0) {
			Cats.map((e) => {
				new category({
					name: e,
				}).save((err) => {
					if (err) {
						console.log("error", err);
					}

					console.log(`added ${e} to roles collection`);
				});
			});
		}
	});
}

// Register Route
app.post("/Register", (req, res) => {
	const data = new user({
		firstname: req.body.firstName,
		lastname: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
	});

	user.findOne({
		email: req.body.email,
	}).exec((err, mail) => {
		if (mail)
			return res.status(400).send({ message: "Mail already exist" });
	});

	data.save((error, user) => {
		if (error) {
			res.status(500).send({ message: "Error" });
			return;
		}

		res.status(200).send({ message: "Success" });
		return;
	});
});

// Login route
app.post("/Login", (req, res) => {
	user.findOne({ email: req.body.email }).exec((err, user) => {
		if (err) return res.status(500).send({ message: err });
		if (!user) return res.status(404).send({ message: "user not found" });
		if (req.body.password === user.password) {
			return res.status(200).send({ user, message: "login success" });
		}
	});
});

// Get categories route
app.get("/Categories", (req, res) => {
	category.find().then((cats) => {
		res.status(200).send(cats);
	});
});

// Image Upload Section and Route
app.use(express.static("public"));

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname);
	},
});

const upload = multer({ storage });

app.post("/upload", upload.array("file"), (req, res) => {
	try {
		const imgFile = new image({
			image_name: req.files[0].filename,
			price: req.body.price,
		});

		imgFile.save((err, img) => {
			if (err) return res.status(500).send({ message: err });
			user.find(
				{
					_id: { $in: req.body.userId },
				},
				(err, user) => {
					if (err) return res.status(500).send({ message: err });

					img.user = user.map((user) => user._id);
					category.find(
						{
							name: { $in: req.body.category },
						},
						(err, category) => {
							if (err)
								return res.status(500).send({ message: err });

							img.category = category.map(
								(category) => category._id
							);
							img.save((err) => {
								if (err)
									return res
										.status(500)
										.send({ message: err });

								res.status(200).send({
									message: "Image Uploaded!",
								});
							});
						}
					);
				}
			);
		});
	} catch (error) {
		res.json({
			error,
		});
	}
});

// get images route
app.use("/public", express.static("public"));

app.get("/get-images", (req, res) => {
	image
		.find()
		.populate("user")
		.populate("category")
		.then((img) => {
			res.status(200).send(img);
		});
});

// buy image route
app.post("/buy-image", (req, res) => {
	const imgFile = new purchase();

	imgFile.save((err, buy) => {
		if (err) return res.status(500).send({ message: err });
		user.find(
			{
				_id: { $in: req.body.userId },
			},
			(err, user) => {
				if (err) return res.status(500).send({ message: err });

				buy.user = user.map((user) => user._id);
				image.find(
					{
						_id: { $in: req.body.imageId },
					},
					(err, img) => {
						if (err) return res.status(500).send({ message: err });

						buy.image = img.map((imgid) => imgid._id);
						buy.save((err) => {
							if (err)
								return res.status(500).send({ message: err });

							res.status(200).send({
								message: "Image Uploaded!",
							});
						});
					}
				);
			}
		);
	});
});

// get buyers list with id
app.get("/get-buyers", (req, res) => {
	purchase.find(
		{
			user: { $in: req.query.userId },
		},
		(err, user) => {
			return res.status(200).send(user);
		}
	);
});

// edit image details
app.post("/edit-image", (req, res) => {
	let imageId = req.body.imageid;
	let price = req.body.price;
	image
		.findOneAndUpdate(
			{
				_id: imageId,
			},
			{ price: price }
		)
		.then((img) => {
			return res.status(200).send({ message: "Price updated" });
		})
		.catch((err) => {
			return res.status(400).send(err);
		});
});

// delete image
app.delete("/delete-image", (req, res) => {
	image
		.findOneAndDelete({ _id: req.body.imageid })
		.then((img) => {
			return res
				.status(200)
				.send({ message: "Image Deleted Successfully" });
		})
		.catch((err) => {
			return res.status(400).send(err);
		});
});

// get all users
app.get("/get-users", (req, res) => {
	user.find()
		.then((usr) => {
			return res.status(200).send(usr);
		})
		.catch((err) => {
			return res.status(400).send(err);
		});
});

// get buyers list
app.get("/get-all-buyers", (req, res) => {
	purchase
		.find()
		.populate("user")
		.populate("image")
		.then((pur) => {
			return res.status(200).send(pur);
		})
		.catch((err) => {
			return res.status(400).send({ err });
		});
});

app.listen(8080);
