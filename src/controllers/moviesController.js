const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");

const Movie = db.Movie;
const Genre = db.Genre;
const Actor = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', { movies })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', { movie });
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', { movies });
            });

    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        res.render('moviesAdd')
    },
    create: function (req, res, next) {
        const { title, rating, awards, release_date, length } = req.body;

        db.Movie.create({ title, rating, awards, release_date, length })
            .then(() => { res.redirect('/movies') })
    },
    edit: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then(Movie => {
                res.render('moviesEdit', { Movie });
            });
    },
    update: function (req, res) {
        const { title, rating, awards, release_date, length } = req.body;
        const { id } = req.params;

        db.Movie.update({ title, rating, awards, release_date, length }, {
            where: {
                id: id,
            },
        })
            .then((item) => { res.redirect('/movies') })
    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then(Movie => {
                res.render('moviesDelete', { Movie });
            });
    },
    destroy: function (req, res) {
        const { id } = req.params;
        db.Movie.destroy({ where: { id: id } })
            .then((item) => { res.redirect('/movies') })
    }
}

module.exports = moviesController;