const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set("views","./public/views");
app.set("view engine", "pug");
app.use(express.static('./public'));

const port = 3000;
const {connectionMongoDb, mongoose}= require("./connectionDb");
connectionMongoDb().catch(err => console.log(err));
/*modelo */
const Todo = mongoose.model("todo", {
    "text": String,
    "completed": Boolean
})

/* */
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.get('/', (req, res)=>{
    res.render('index')
})
app.post("/add", (req, res)=>{
    const todo = new Todo({text: req.body.text, completed: false});
    todo.save().then(doc=>{
        console.log("dato insertado", doc);
        //res.redirect("/");
        res.json({response: "success"});
    }).catch(err=>{
        console.log("Error: ",err.message)
        res.status(400).json({response: "failed"});
    });
});
app.get("/getall", (req, res)=>{
    Todo.find({}, 'text completed').then(doc=>{
        res.json(doc);
    }).catch(err=>{
        console.log("error al consultar: ",err.message);
        res.status(400).json({response: "failed"});
    })
});
app.get("/complete/:id/:status",(req, res)=>{
    const id = req.params.id;
    const status = req.params.status === "true" ? true : false;
    Todo.findByIdAndUpdate({_id: id}, {$set: {completed: status}})
    .then(doc=>{res.json({response: "success"});})
    .catch(err=>{
        console.log("Error al actualizar:",err.message);
        res.status(400).json({response: "failed"});
    })
});
app.get("/delete/:id", (req, res)=>{
    const id = req.params.id;
    Todo.findByIdAndDelete({_id:id})
    .then(data=>{
        console.log("eliminado")
        //res.json({response: "success"});
        res.redirect("/");
    }).catch(err=>{
        console.log("Erro eliminar", err.message);
        res.status(400).json({response: false});
    })
})
app.listen(port,()=>{
    console.log("server on port: ", port);
})