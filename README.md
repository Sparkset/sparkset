# Sparkset CRM

[Sparkset](https://www.hellosparkset.com/) helps business owners build experiences that aim to impress customers and promote growth. To better understand the clients and make the best decisions for them, it collects all sorts of data from the clients and continuously analyzes them. This app serves as a CRM where Sparkset employees can take notes when interviewing clients and easily look them up in the future.

## Current Abilities

1. The user can create clients and the system will automatically add the predefined one-time events and recurring events for the client. The system will also suggest events that can be scheduled.
2. The system will automatically create a company page when a new client with a new company is created. There can be multiple clients associated with the same company.
3. The user can upload files that are associated with a client.
4. The user can add notes with relative clients and tags associated with them. The user can filter notes by selecting a certain tag.
5. An admin can create new users that are able to log in to the system. When creating a new user, the admin can specify if this user is also an admin.
6. A global search bar allows the user to find any information on the entire system with a few keywords.

## Dependencies

1. [LeanCloud](https://leancloud.app/) for [object storage](https://docs.leancloud.app/leanstorage_guide-js.html), [web hosting](https://docs.leancloud.app/leanengine_webhosting_guide-node.html), and [cloud functions](https://docs.leancloud.app/leanengine_cloudfunction_guide-node.html). Note that while we’re using the [Developer Plan](https://leancloud.app/pricing/) of LeanCloud (which is free), the cloud can only handle 30,000 requests per day. However, this is totally sufficient for the purpose of this app.
2. [Vue.js](https://vuejs.org/) as the front-end framework.
3. [Vue Router](https://router.vuejs.org/) for crunching multiple views into a single-page app.
4. [Vuex](https://vuex.vuejs.org/) for managing global states.
5. [vue-js-toggle-button](http://vue-js-toggle-button.yev.io/) for switch button.
6. [vue-multiselect](https://vue-multiselect.js.org/) for picking clients and tags for notes.
7. [Font Awesome](https://fontawesome.com/) for icons.

## Setting up Development Environment

### Installing Dependencies

```sh
npm install
```

The app will automatically compile after dependencies are installed.

### Running Locally

```sh
npm run serve
```

Note that this app doesn’t need LeanCloud’s command line interface to run locally.

## Deploying the App

The project is set up so that any commit made to this repository will automatically trigger the latest version on the `master` branch to be deployed to LeanEngine (so it’s safe to do experiments on other branches). See [LeanEngine Web Hosting documentation](https://docs.leancloud.app/leanengine_webhosting_guide-node.html#hash224173211) for how the mechanism is set up, as well as how you can manually deploy the app.
