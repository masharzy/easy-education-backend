const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;
require("dotenv").config();
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

    console.log("Connected");
  } finally {
  }
};

run().catch(console.dir);
app.listen(port, () => console.log(`Listening on port ${port}`));
