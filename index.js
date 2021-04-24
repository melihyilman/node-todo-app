const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const app = express();
const toDo=require('./models/Task');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi= require('swagger-ui-express');
const dbUri=require('dotenv').config();

const port =process.env.port|| 4000;

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())
 
mongoose.connect(dbUri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

//swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Todo API',
    version: '1.0.0',
  },
  host: `https://localhost:${port}`, // Host (optional)
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./index.js"],
};
const swaggerSpec = swaggerJsdoc(options);

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the todo
 *         name:
 *           type: string
 *           description: The todo name
 *         status:
 *           type: int
 *           description: The todo status
 *       example:
 *         name: Ekmek al
 *         status: 0
 */

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

app.use("/", router);


app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /newtodo:
 *   post:
 *     summary: Create a new todo
 *     tags: [newtodo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: The todo was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       500:
 *         description: Some server error
 */
router.route("/newtodo").post(function(req, res) {
    const {name}= req.body;
    console.log(name);
    var newtodo= new toDo({name,status:0});
    newtodo.save(function (err, todo) {
        if (err) return console.error(err);
        console.log(todo.name + " saved to bookstore collection.");
        return res.status(200).send(todo);
      });
});
/**
 * @swagger
 * /getalltodos:
 *   get:
 *     summary: Returns the list of all the todos
 *     tags: [getalltodos]
 *     responses:
 *       200:
 *         description: The list of the todos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.route("/getalltodos").get(function(req, res) {
    toDo.find({}, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  });

  /**
 * @swagger
 * /updatetodo/{name}:
 *  post:
 *    summary: Update the todo by the name
 *    tags: [updatetodo]
 *    parameters:
 *      - in: path
 *        name: name
 *        schema:
 *          type: string
 *        required: true
 *        description: The todo name
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Task'
 *    responses:
 *      200:
 *        description: The Task was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Task'
 *      404:
 *        description: The task was not found
 *      500:
 *        description: Some error happened
 */
router.route("/updatetodo").post(function(req, res) {
    const {name,status}=req.body;
    toDo.updateOne({ name }, { status }, function(
      err,
      result
    ) {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
});


app.listen(port, function() {
  console.log("Server is running on Port: " + port);
});