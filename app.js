const express = require('express'),
    app = express(),
    parser = require('rss-parser'),
    rssUrl = 'http://feeds.soundcloud.com/users/soundcloud:users:264614350/sounds.rss';

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/podcasts/', function (req, res) {
    parser.parseURL(rssUrl, function (err, rss) {
        var items = [],
            list = rss.feed.entries;
        for (var i = 0; i < list.length; i++) {
            items.push({
                title: list[i].title,
                url: list[i].link,
                duration: list[i].itunes.duration,
                image: list[i].itunes.image,
                date: list[i].pubDate,
                description: list[i].content,
            });
        }
        res.json(items);
    });
});

app.get('/podcasts/search', function (req, res) {
    var keyword = req.query.keyword;
    if (!keyword) {
        res.json([]);
        return;
    }

    keyword = keyword.toLowerCase();

    parser.parseURL(rssUrl, function (err, rss) {
        var items = [],
            list = rss.feed.entries;
        var content, title;
        for (var i = 0; i < list.length; i++) {
            content = list[i].content.toLowerCase();
            title = list[i].title.toLowerCase();

            if (content.includes(keyword) || title.includes(keyword)) {
                items.push({
                    title: list[i].title,
                    url: list[i].link,
                    duration: list[i].itunes.duration,
                    image: list[i].itunes.image,
                    date: list[i].pubDate,
                    description: list[i].content,
                });
            }
        }

        res.json(items);
    });
});

module.exports = app;