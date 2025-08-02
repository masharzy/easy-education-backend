const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gmv6h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "UnAuthorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
};

const run = async () => {
  try {
    await client.connect();

    //collections
    const coursesCollection = client
      .db("mahdyabrarsharzy")
      .collection("courses");
    const classesCollection = client
      .db("mahdyabrarsharzy")
      .collection("classes");
    const topicCollection = client.db("mahdyabrarsharzy").collection("topics");
    const userCollection = client.db("mahdyabrarsharzy").collection("users");
    const enrolledUsersCollection = client
      .db("mahdyabrarsharzy")
      .collection("enrolledUsersCollection");
    const pendingEnrolledCourseCollection = client
      .db("mahdyabrarsharzy")
      .collection("pendingEnrolledCourse");

    // apis
    // get all courses
    app.get("/courses", async (req, res) => {
      const courses = await coursesCollection.find({}).toArray();
      res.send(courses);
    });
    // get one course
    app.get("/course/:slug", async (req, res) => {
      const course = await coursesCollection.findOne({
        slug: req.params.slug,
      });
      res.send(course);
    });
    app.get("/course-by-id/:id", async (req, res) => {
      const course = await coursesCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(course);
    });
    app.get("/courses/:batch", async (req, res) => {
      const courses = await coursesCollection
        .find({
          batch: req.params.batch,
        })
        .toArray();
      res.send(courses);
    });
    app.get("/courses/platform/:platform", async (req, res) => {
      const courses = await coursesCollection
        .find({
          platform: req.params.platform,
        })
        .toArray();
      res.send(courses);
    });
    // update course
    app.put("/course/:id", async (req, res) => {
      const course = req.body;
      const filter = { _id: new ObjectId(req.params.id) };
      const updatedDoc = {
        $set: course,
      };
      const options = { upsert: true };
      const result = await coursesCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    // add course
    app.post("/course", async (req, res) => {
      const course = req.body;
      const result = await coursesCollection.insertOne(course);
      res.send(result);
    });

    //delete course
    app.delete("/delete-course/:id", async (req, res) => {
      const id = req.params.id;
      const result = await coursesCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    app.get("/classes", async (req, res) => {
      const classes = await classesCollection.find({}).toArray();
      res.send(classes);
    });
    app.get("/classes/:id", async (req, res) => {
      const classes = await classesCollection
        .find({
          courseId: req.params.id,
        })
        .toArray();
      res.send(classes);
    });
    app.get("/classes/slug/:slug", async (req, res) => {
      const classes = await classesCollection
        .find({
          slug: req.params.slug,
        })
        .toArray();
      res.send(classes);
    });
    app.post("/class", async (req, res) => {
      const courseClass = req.body;
      const result = await classesCollection.insertOne(courseClass);
      res.send(result);
    });
    app.delete("/delete-class/:id", async (req, res) => {
      const id = req.params.id;
      const result = await classesCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    app.get("/class/:id", async (req, res) => {
      const course = await classesCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(course);
    });
    app.post("/topic", async (req, res) => {
      const topic = req.body;
      const result = await topicCollection.insertOne(topic);
      res.send(result);
    });
    app.delete("/delete-topic/:id", async (req, res) => {
      const id = req.params.id;
      const result = await topicCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });
    app.get("/topic/:id", async (req, res) => {
      const topic = await topicCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(topic);
    });
    app.get("/topics", async (req, res) => {
      const topics = await topicCollection.find({}).toArray();
      res.send(topics);
    });
    app.get("/topics/:id", async (req, res) => {
      const topics = await topicCollection
        .find({
          courseId: req.params.id,
        })
        .toArray();
      res.send(topics);
    });
    app.put("/topic-update/:id", async (req, res) => {
      const topic = req.body;
      const filter = { _id: new ObjectId(req.params.id) };
      const updatedDoc = {
        $set: topic,
      };
      const options = { upsert: true };
      const result = await topicCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    app.put("/class-update/:id", async (req, res) => {
      const topic = req.body;
      const filter = { _id: new ObjectId(req.params.id) };
      const updatedDoc = {
        $set: topic,
      };
      const options = { upsert: true };
      const result = await classesCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    app.get("/topics/slug/:slug", async (req, res) => {
      const classes = await topicCollection
        .find({
          slug: req.params.slug,
        })
        .toArray();
      res.send(classes);
    });
    //update or add a user
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updatedDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      const token = jwt.sign(
        { email: email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      res.send({ result, token });
    });
    //check admin
    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      const isAdmin = user.role === "admin";
      res.send({ admin: isAdmin });
    });
    //make a user to admin
    app.put("/admin/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const updatedDoc = {
        $set: { role: "admin" },
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
      return res.send(result);
    });
    // get all users
    app.get("/users", verifyJWT, async (req, res) => {
      const users = await userCollection.find({}).toArray();
      res.send(users);
    });
    //delete a user
    app.delete("/user/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const user = await userCollection.deleteOne(filter);
      res.send(user);
    });

    //make a user to admin
    app.put("/make-user/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const updatedDoc = {
        $set: { role: "user" },
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
      return res.send(result);
    });

    // post pending Enrolled Course
    app.post("/pendingEnrolledCourse", verifyJWT, async (req, res) => {
      const pendingEnrolledCourse = req.body;
      const result = await pendingEnrolledCourseCollection.insertOne(
        pendingEnrolledCourse
      );
      res.send(result);
    });
    // get all pending Enrolled Courses
    app.get("/pendingEnrolledCourses", verifyJWT, async (req, res) => {
      const pendingEnrolledCourses = await pendingEnrolledCourseCollection
        .find({})
        .sort({ _id: -1 })
        .toArray();
      res.send(pendingEnrolledCourses);
    });
    // check if enrolled already
    app.get("/pendingEnrolledCourse/:email/:courseId", async (req, res) => {
      const userEmail = req.params.email;
      const requestedCourseId = req.params.courseId;
      const pendingEnrolledCourseUser =
        await pendingEnrolledCourseCollection.findOne({
          userEmail: userEmail,
          requestedCourseId: requestedCourseId,
        });
      const isFound = pendingEnrolledCourseUser ? "Found" : "Not Found";
      res.send(isFound);
    });
    //delete a user
    app.delete(
      "/pendingEnrolledCourse/delete/:id",
      verifyJWT,
      async (req, res) => {
        const id = req.params.id;
        const result = await pendingEnrolledCourseCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      }
    );
    // add enrolled users
    app.post("/enrolled-user", async (req, res) => {
      const user = req.body;
      const result = await enrolledUsersCollection.insertOne(user);
      res.send(result);
    });
    // get enrolled users
    app.get("/enrolled-users", async (req, res) => {
      const users = await enrolledUsersCollection.find({}).toArray();
      res.send(users)
    });
    app.get("/enrolled-users-by-slug-and-email/:slug/:email", async (req, res) => {
      const course = await enrolledUsersCollection.findOne({
        courseSlug: req.params.slug,
        email: req.params.email,
      });
      const isFound = course ? "Found" : "Not Found";
      res.send(isFound);
    });
    app.get("/enrolled-users-by-email/:email", async (req, res) => {
      const course = await enrolledUsersCollection.find({
        email: req.params.email,
      }).toArray();
      res.send(course);
    });

    console.log("Connected");
  } finally {
  }
};

run().catch(console.dir);
app.listen(port, () => console.log(`Listening on port ${port}`));

