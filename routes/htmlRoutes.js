var db = require("../models");
var cheerio = require("cheerio");
var axios = require("axios");

module.exports = function (app) {

    app.get("/", function (req, res) {

        axios.get("https://www.npr.org/sections/news/").then(function (response) {

            var $ = cheerio.load(response.data);

            $("article").each(function (i, element) {

                var result = {};

                result.title = $(this)
                    .children(".item-info-wrap")
                    .children(".item-info")
                    .children(".title")
                    .children("a")
                    .text()

                result.summary = $(this)
                    .children(".item-info-wrap")
                    .children(".item-info")
                    .children(".teaser")
                    .children("a")
                    .text()

                result.link = $(this)
                    .children(".item-info-wrap")
                    .children(".item-info")
                    .children(".title")
                    .children("a")
                    .attr("href")

                result.image = $(this)
                    .children(".item-image")
                    .children(".imagewrap")
                    .children("a")
                    .children("img")
                    .attr("src")
                if (result.title === undefined | result.title === '') {
                    result.title = "This Article Has no Title"
                }
                if (result.summary === undefined | result.summary === '') {
                    result.summary = "This Article Has no Summary"
                }
                if (result.image === undefined | result.image === '') {
                    result.image = "https://img.purch.com/rc/300x200/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA2NS8xNDkvb3JpZ2luYWwvYmFuYW5hcy5qcGc="
                }


                db.Article.find({ link: result.link }).populate('comment', 'body')
                    .then(function (dbres) {
                        if (dbres.length === 0) {
                            db.Article
                                .create(result)
                                .then()
                                .catch(function (err) {

                                    console.log(err)

                                });
                        }
                    })



            })

            db.Article
                .find({})
                .then(function (dbExamples) {

                    res.render("index", {

                        articles: dbExamples

                    });

                });
        })
    })

}