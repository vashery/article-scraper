var db = require("../models");


module.exports = function (app) {

    app.get("/api/articles/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id })
            .populate("comment")
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.delete("/api/comments/:id", function (req, res) {
        db.Comment.deleteOne({ _id: req.params.id })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.post("/api/comments/:id", function (req, res) {
        db.Comment.create(req.body)
            .then(function (dbNote) {
                db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comment: dbNote._id } }, { new: true }).then(function (ress) {
                    res.json(ress);
                })
            })
            .catch(function (err) {
                t
                res.json(err);
            });
    });
}