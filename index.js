import express from 'express';
import graphQLHTTP from 'express-graphql';
import DataLoader from 'dataloader';

import schema from './schema';
import fetch from "node-fetch";

const app = express();

const BASE_URL = 'https://jsonplaceholder.typicode.com';

function getByRelative(relativeURL) {
    return fetch(`${BASE_URL}${relativeURL}`).then(response => response.json())
}

function getUsers() {
    return fetch(`${BASE_URL}/users`).then(response => response.json())
}

function getPosts() {
    return fetch(`${BASE_URL}/posts`).then(response => response.json())
}

app.use(graphQLHTTP(res => {
    const relativeLoader = new DataLoader(
        keys => Promise.all(keys.map(getByRelative))
    );

    const usersLoader = new DataLoader(
        keys => Promise.all(keys.map(getUsers))
    );

    const postsLoader = new DataLoader(
        keys => Promise.all(keys.map(getPosts))
    );

    relativeLoader.allUsers = postsLoader.load.bind(postsLoader, '__all__');
    relativeLoader.allPosts = usersLoader.load.bind(usersLoader, '__all__');

    const loaders = {
        user: relativeLoader,
        post: relativeLoader
    };
    return {
        context: {loaders},
        schema,
        graphiql: true
    }
}));

app.listen(5000);