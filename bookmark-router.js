const express = require('express');
const { bookmarks } = require('./datastore');
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const uuid = require('uuid/v4');
const logger = require('./logger');


// Bookmark router for the /bookmarks path
bookmarkRouter
    .route('/')
    .get((_, res) => {
        res.json(bookmarksa);
    })
    .post(bodyParser, (req, res) => {
        const {title, url, description = '', rating} = req.body;
        
        if(!title){
            logger.error(`POST failed as Title was missing`);
            return res
                .status(401)
                .send(`Title is required`);
        }

        if(!url){
            logger.error(`POST failed as URL was missing`);
            return res
                .status(401)
                .send(`URL is required`);
        }

        if(rating !== 0 && !rating){
            logger.error(`POST failed as Rating is missing`)
            return res
                .status(401)
                .send(`Rating is required`);
        }

        // Create the new bookmark
        const bookmark = {
            id: uuid(),
            title,
            url,
            description,
            rating
        }

        // Push is to the datastore
        bookmarks.push(bookmark);
        
        logger.info(`POST successful: Boookmark with id: ${bookmark.id} was added`);
        res.status(201).json(bookmark);
    });


// Bookmark Router for bookmarks/:id Path
bookmarkRouter
    .route('/:id')
    .get((req, res) => {
        const {id} = req.params;

        const bookmark = bookmarks.find((bookmark) => bookmark.id === id);

        if(!bookmark){
            logger.error(`GET with id failed, Could not find Bookmark`);
            return res
                .status(404)
                .send(`Bookmark Not Found`);
        }

        res.json(bookmark);
    })
    .delete((req, res) => {
        const {id} = req.params;
        
        // Get the index for the item to be removed
        const bookmarkIndex = bookmarks.findIndex((bookmark) => bookmark.id === id);

        // if not found return 404
        if(bookmarkIndex === -1){
            logger.error(`DELETE failed, Could not find Bookmark`);
            return res
                .status(404)
                .send(`Bookmark Not Found, Could Not Be Removed`);
        }

        // If found Remove the found item from the datastore
        bookmarks.splice(bookmarkIndex, 1);

        logger.info(`Bookmark with id:${id} has been removed`);
        return res
            .status(204)
            .end();

    });

module.exports = bookmarkRouter;