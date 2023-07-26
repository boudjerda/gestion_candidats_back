const { update } = require('../controllers/candidat.controller'); // Remplacez 'votre-fichier' par le nom de votre fichier contenant la fonction 'update'
// Remplacez './Candidat' par le chemin vers le fichier contenant la définition de la classe Candidat
const db = require("../models");
const Candidat = db.candidats;

describe('Test de la fonction update', () => {
  test('Devrait renvoyer un message de succès si la mise à jour est effectuée', async () => {
    // Mise en place des données de test
    const req = {
      params: {
        id: 1
      },
      body: {
        nom: 'Nom',
        prenom: 'Prénom',
        email: 'email@example.com',
        profil: 'Profil',
        NombreAnexp: 2,
        dateEntretien: '2023-07-09'
      },
      file: {
        buffer: Buffer.from('contenu du fichier')
      }
    };
    const res = {
      send: jest.fn()
    };

    // Mock de la fonction Candidat.update
    Candidat.update = jest.fn().mockResolvedValue([1]);

    // Exécution de la fonction à tester
    await update(req, res);

    // Vérification des résultats
    expect(Candidat.update).toHaveBeenCalledWith(
      {
        nom: 'Nom',
        prenom: 'Prénom',
        email: 'email@example.com',
        profil: 'Profil',
        NombreAnexp: 2,
        dateEntretien: '2023-07-09',
        cv: Buffer.from('contenu du fichier')
      },
      { where: { id: 1 } }
    );
    expect(res.send).toHaveBeenCalledWith({
      message: 'Candidat was updated successfully.'
    });
  });

  test('Devrait renvoyer un message d\'erreur si la mise à jour échoue', async () => {
    // Mise en place des données de test
    const req = {
      params: {
        id: 1
      },
      body: {
        nom: 'Nom',
        prenom: 'Prénom',
        email: 'email@example.com',
        profil: 'Profil',
        NombreAnexp: 2,
        dateEntretien: '2023-07-09'
      },
      file: {
        buffer: Buffer.from('contenu du fichier')
      }
    };
    const res = {
      status: jest.fn(() => res),
      send: jest.fn()
    };

    // Mock de la fonction Candidat.update
    Candidat.update = jest.fn().mockResolvedValue([0]);

    // Exécution de la fonction à tester
    await update(req, res);

    // Vérification des résultats
    expect(Candidat.update).toHaveBeenCalledWith(
      {
        nom: 'Nom',
        prenom: 'Prénom',
        email: 'email@example.com',
        profil: 'Profil',
        NombreAnexp: 2,
        dateEntretien: '2023-07-09',
        cv: Buffer.from('contenu du fichier')
      },
      { where: { id: 1 } }
    );
    expect(res.send).toHaveBeenCalledWith({
      message: `Cannot update Candidat with id=1. Maybe Candidat was not found or req.body is empty!`
    });
  });
});
