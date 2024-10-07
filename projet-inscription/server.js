const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// CSV Writer configuration
const csvWriter = createObjectCsvWriter({
    path: 'users.csv',
    header: [
        { id: 'name', title: 'Nom' },
        { id: 'surname', title: 'Prénom' },
        { id: 'nationalId', title: 'Numéro d\'Identité' },
        { id: 'phone', title: 'Numéro de Téléphone' },
        { id: 'email', title: 'Email' }
    ],
    append: true
});

// Route principale - Formulaire d'inscription
app.get('/', (req, res) => {
    res.render('index');
});

// Soumettre le formulaire et écrire les données dans le fichier CSV
app.post('/register', (req, res) => {
    const user = req.body;

    // Écriture dans le fichier CSV
    csvWriter.writeRecords([user])
        .then(() => {
            res.render('success', { user });
        })
        .catch(err => {
            console.error('Erreur lors de l\'écriture dans le fichier CSV:', err);
            res.status(500).send('Erreur lors de l\'inscription.');
        });
});

// Route pour afficher les utilisateurs
app.get('/users', (req, res) => {
    const users = [];
    fs.createReadStream('users.csv')
        .pipe(csv(['name', 'surname', 'nationalId', 'phone', 'email']))
        .on('data', (row) => {
            users.push(row);
        })
        .on('end', () => {
            //console.log(users); // Vérifiez si les données sont bien lues
            res.render('users', { users: users });
        });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
