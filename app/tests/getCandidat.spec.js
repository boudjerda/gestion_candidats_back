const { findOne } = require('../controllers/candidat.controller'); // Remplacez 'votre-fichier' par le nom de votre fichier contenant la fonction 'update'
const db = require("../models");
const Candidat = db.candidats;
describe('Test de la fonction findOne', () => {
  test('Devrait renvoyer un candidat existant si l\'ID est valide', async () => {
    // Mise en place des données de test
    const req = {
      params: {
        id: 1
      }
    };
    const res = {
      send: jest.fn(),
      status: jest.fn(() => res)
    };

    // Mock de la fonction Candidat.findByPk
    const candidatMock = { id: 1, nom: 'Nom', prenom: 'Prénom' };
    Candidat.findByPk = jest.fn().mockResolvedValue(candidatMock);

    // Exécution de la fonction à tester
    await findOne(req, res);

    // Vérification des résultats
    expect(Candidat.findByPk).toHaveBeenCalledWith(1);
    expect(res.send).toHaveBeenCalledWith(candidatMock);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('Devrait renvoyer une erreur 404 si aucun candidat n\'est trouvé', async () => {
    // Mise en place des données de test
    const req = {
      params: {
        id: 1
      }
    };
    const res = {
      send: jest.fn(),
      status: jest.fn(() => res)
    };

    // Mock de la fonction Candidat.findByPk
    Candidat.findByPk = jest.fn().mockResolvedValue(null);

    // Exécution de la fonction à tester
    await findOne(req, res);

    // Vérification des résultats
    expect(Candidat.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Cannot find Candidat with id=1.'
    });
    expect(res.send).toHaveBeenCalledTimes(1);
  });

  test('Devrait renvoyer une erreur 500 en cas d\'erreur de récupération du candidat', async () => {
    // Mise en place des données de test
    const req = {
      params: {
        id: 1
      }
    };
    const res = {
      send: jest.fn(),
      status: jest.fn(() => res)
    };

    // Mock de la fonction Candidat.findByPk pour simuler une erreur
    const errorMessage = 'Erreur de récupération du candidat';
    Candidat.findByPk = jest.fn().mockRejectedValue(new Error(errorMessage));

    // Exécution de la fonction à tester
    await findOne(req, res);

    // Vérification des résultats
    expect(Candidat.findByPk).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Error retrieving Candidat with id=1'
    });
    expect(res.send).toHaveBeenCalledTimes(1);
  });
});
