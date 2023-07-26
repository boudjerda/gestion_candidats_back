    
    module.exports = app => {
     const candidats = require("../controllers/candidat.controller.js");
     var router = require("express").Router();
     const multer = require('multer');
     const upload = multer({ dest: 'uploads/' })
     const authorization = require("../middleware/authorization");
  
    // Create a new candidats
    router.post("/",authorization,upload.array('file', 12), candidats.create);

    // Retrieve all candidats
    router.get("/", authorization,candidats.findAll);
  
    // Retrieve a single candidats with id
    router.get("/:id",authorization,candidats.findOne);
  
    // Update a candidats with id
    
    router.put("/:id",authorization,upload.array('file', 12), candidats.update);
    // Delete a candidats with id
    router.delete("/:id",authorization,candidats.delete);
  
    // Delete all candidats
    router.delete("/",authorization,candidats.deleteAll);
  
    app.use("/api/candidats", router);
    }