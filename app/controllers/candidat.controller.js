const db = require("../models");
const Candidat = db.candidats;
const Op = db.Sequelize.Op;
const fs = require('fs');
const jwt = require("jsonwebtoken")

// Create and Save a new Candidat
exports.create = (req, res) => {
  const files = req.files;
  const promises = [];
  let existCV = false;
  let existpass = false
  const jwtToken = req.header("Authorization")
  const decodedToken = jwt.verify(jwtToken,process.env.jwtSecret);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if(file.originalname.startsWith("cv")){
      existCV = true
    }else if (file.originalname.startsWith("passeport")){
      existpass = true
    }
    // Créer une promesse pour lire le fichier et récupérer le buffer
    const promise = new Promise((resolve, reject) => {
      fs.readFile(file.path, (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    promises.push(promise);
  }

  // Attendre que toutes les promesses soient résolues
  Promise.all(promises)
    .then(datafiles => {
      console.log(datafiles[0])
      const candidat = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        sexe: req.body.sexe, 
        email: req.body.email,
        profil: req.body.profil,
        linkedin:req.body.linkedin,
        NombreAnexp: req.body.NombreAnexp,
        dateEntretien: req.body.dateEntretien,
        cv:existCV ? datafiles[0]:undefined, // Accéder au buffer du fichier CV
        passeport:(existCV && existpass ) ? datafiles[1] :((!existCV && existpass )? datafiles[0]:undefined),
        idUser:decodedToken.user
      };
      console.log("candidat",candidat)
      // Save candidat in the database
      Candidat.create(candidat)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message: "Some error occurred while creating the candidat.",
            error: err.message
          });
        });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error reading files.",
        error: err.message
      });
    });
};


// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const jwtToken = req.header("Authorization")
  const decodedToken = jwt.verify(jwtToken,process.env.jwtSecret); // Replace "YOUR_SECRET_KEY" with the secret/key used to sign the token
  console.log("decoded token",decodedToken);
    Candidat.findAll({
      attributes: { exclude: ['cv', 'passeport', 'NombreAnexp', 'email', 'dateEntretien' ] },
      where: {
        idUser:decodedToken.user,
      },
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Candidats."
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Candidat.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Candidat with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Candidat with id=" + id
      });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const files = req.files;
  const promises = [];
  let existCV = false;
  let existpass = false
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if(file.originalname.startsWith("cv")){
      existCV = true
    }else if (file.originalname.startsWith("passeport")){
      existpass = true
    }
    // Créer une promesse pour lire le fichier et récupérer le buffer
    const promise = new Promise((resolve, reject) => {
      fs.readFile(file.path, (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    promises.push(promise);
  }
  Promise.all(promises)
    .then(datafiles => {
      const id = req.params.id;
      const candidat = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        sexe :req.body.sexe,
        email: req.body.email,
        profil: req.body.profil,
        linkedin: req.body.linkedin,
        NombreAnexp: req.body.NombreAnexp,
        dateEntretien: req.body.dateEntretien,
        cv:existCV ? datafiles[0]:undefined, // Accéder au buffer du fichier CV
        passeport:(existCV && existpass ) ? datafiles[1] :((!existCV && existpass )? datafiles[0]:undefined)
      };
      // Save candidat in the database
      Candidat.update(candidat, {
        where: { id: id }
      })
        .then(num => {
          if (num[0] === 1) { // Utiliser num[0] pour vérifier le nombre de lignes mises à jour
            res.send({
              message: "Candidat was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update Candidat with id=${id}. Maybe Candidat was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating Candidat with id=" + id
          });
        });
    });

};


// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Candidat.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Candidat was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Candidat with id=${id}. Maybe Candidat was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Candidat with id=" + id
      });
    });
};

// Delete all Candidat from the database.
exports.deleteAll = (req, res) => {
    Candidat.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Candidat were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Candidat."
      });
    });
};

// find all published Candidat
exports.findAllPublished = (req, res) => {
    Candidat.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Candidats."
      });
    });
};
exports.create1 = (req, res) => {
  // Validate request
  if (!req.body.nom) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a candidat
  const candidat = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    email: req.body.email,
    profil: req.body.profil,
    NombreAnexp: req.body.NombreAnexp,
    dateEntretien: req.body.dateEntretien,
    cv: req.files['file'][0].buffer, // Accéder au buffer du fichier CV
    passeport: req.files['file1'][0].buffer 
  };
  // Save candidat in the database
  Candidat.create(candidat)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the candidat."
      });
    });
};