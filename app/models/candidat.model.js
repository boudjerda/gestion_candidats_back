module.exports = (sequelize, Sequelize) => {
    const Candidat = sequelize.define("candidat", {
      nom: {
        type: Sequelize.STRING
      },
      prenom: {
        type: Sequelize.STRING
      },
      sexe: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      profil: {
        type: Sequelize.STRING
      },
      linkedin: {
        type: Sequelize.STRING
      },
      NombreAnexp: {
        type: Sequelize.STRING 
      },
      dateEntretien: {
        type: Sequelize.DATE
      },
      cv: {
        type: Sequelize.BLOB('long'), // Utilisez le type BLOB pour stocker des données binaires de longueur variable
        allowNull: false,
      },  
      passeport: {
        type: Sequelize.BLOB('long'), // Utilisez le type BLOB pour stocker des données binaires de longueur variable
        allowNull: false,
      }, 
      idUser: {
        type: Sequelize.INTEGER  
      },
     
    });
    
  
    return Candidat;
  };
  