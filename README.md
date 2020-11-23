This repository is a companion to the published article entitled **"How to Use Lightning Web Components to Build a PWA with (!) Push Notifications"**.

There are 2 separate pieces to this project - a **client** and a **server** - and both pieces are included in this Github repository.

# The LWC Client

The **client** project was built using [Lightning Web Components](https://lwc.dev/) (in particular, [lwc-create-app](https://github.com/muenzpraeger/lwc-create-app)), but also takes its cues from the [Service Worker Cookbook](https://serviceworke.rs/).

The client is meant to be deployed to Heroku (hence the `Procfile` with the commaned `yarn serve`).

## Configurations

Before deploying the client, make sure to:

1. Set the `SERVER_ENDPOINT` in line 2 of `client/src/modules/my/app/app.js`, using your Heroku server app URL.

## Deploy to Heroku

Because this single Github repository contains _two_ projects which need to be deployed to Heroku, deployment will not follow the standard Heroku CLI deployment instructions. Instead, you will need to manually set up a Heroku remote specifically for the client, and you will need to push to Heroku using `git subtree`.

1. Create a git remote:

```
[PROJECT ROOT]$ git remote add heroku-client https://git.heroku.com/[HEROKU CLIENT APP NAME].git
```

2. Push to Heroku (from project root, _not_ client, folder)
```
[PROJECT ROOT]$ git subtree push --prefix client heroku-client master
```


# The Subscriptions/Notifications Server

A separate **server** project was built using [Express](https://www.expressjs.com). This server receives requests from the client for a user to subscribe to and unsubscribe from push notifications, and it also sends the push notifications at fixed time intervals.

Ths server is meant to be deployed to Heroku (hence the `Procfile` with the command `node index.js`).

## Configurations

Before deploying the client, make sure to:

1. Replace the first argument to `setVapidDetails` with your own email address, in line 43 of `server/index.js`.
2. Add your Heroku client app URL to the list of CORS origins in line 91 of `server/index.js`, thereby allowing your server to receive requests from the client deployed to Heroku.
3. Generate a set of VAPID public/private keys, and then use `heroku config:set -a HEROKU-SERVER-APP-NAME` to set `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` environment variables, which `server/index.js` will reference.

## Deploy to Heroku

Similar to the `client` project described above, deploying the `server` to Heroku will also mean adding a remote and using `git subtree`.

Create a git remote:

```
[PROJECT ROOT]$ git remote add heroku-server https://git.heroku.com/[HEROKU SERVER APP NAME].git
```

2. Push to Heroku (from project root, _not_ server, folder)
```
[PROJECT ROOT]$ git subtree push --prefix server heroku-server master
```


