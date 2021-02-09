# Sparkset CRM

[Sparkset](https://www.hellosparkset.com/) is a digital marketing and customer experience agency that helps business owners build valuable relationships with clients in order to promote company growth and success. To better understand the clients and make the best decisions for them, the application we have created collects all sorts of data from their clients and continuously analyzes them. This app serves as a CRM where Sparkset employees can take notes when interviewing clients and easily look them up in the future.

## Current Abilities

1. The user can create clients and the system will automatically add the predefined one-time events and recurring events for the client. The system will also suggest events that can be scheduled. Of course, The user may also create custom events and set a recurrence if needed.
2. The system will automatically create a company page when a new client with a new company is created. There can be multiple clients associated with the same company. Events will also be synchronized between clients and their companies.
3. The user can create and edit notes for the client underneath the ClientNotes tab. These notes contain a title and content in regards to the client. These notes are stored in the backend database as well so all users may have access to them. They can help transition a client from one team member to another and simply store important information.
4. The user can upload files that are associated with a client. These can be images, documents, etc.
5. The user can add preferences for a client in order to improve the relationship with the client and make sure their needs are satisfied.
6. The user can add personal memos with relative clients and tags associated with them. The user can filter memos by selecting a certain tag. These memos allow the user to keep track of which changes they made, clients/companies they were last working on, and simply notes to their own portal.
7. An admin can create new users that are able to log in to the system. When creating a new user, the admin can specify if this user is also an admin.
8. A global search bar allows the user to find any information on the entire system (Client, Company, Files, Preferences, Notes) with a few keywords.
9. All data can be sorted by time, name, and other categories. 

## Dependencies

1. [Font Awesome](https://fontawesome.com/) for icons.
2. [jspdf](https://parall.ax/products/jspdf) for exporting client tables as PDF.
3. [LeanCloud](https://leancloud.app/) for [object storage](https://docs.leancloud.app/leanstorage_guide-js.html), [web hosting](https://docs.leancloud.app/leanengine_webhosting_guide-node.html), and [cloud functions](https://docs.leancloud.app/leanengine_cloudfunction_guide-node.html). Note that while we’re using the [Developer Plan](https://leancloud.app/pricing/) of LeanCloud (which is free), the cloud can only handle 30,000 requests per day. However, this is totally sufficient for the purpose of this app.
4. [Vue.js](https://vuejs.org/) as the front-end framework.
5. [vue-js-toggle-button](http://vue-js-toggle-button.yev.io/) for switch button.
6. [vue-markdown](https://github.com/miaolz123/vue-markdown) for parsing notes written in Markdown.
7. [vue-multiselect](https://vue-multiselect.js.org/) for picking clients and tags for notes.
8. [Vue Router](https://router.vuejs.org/) for crunching multiple views into a single-page app.
9. [Vuex](https://vuex.vuejs.org/) for managing global states.

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

The project is set up so that whenever a commit is made to the `master` branch, this commit will be deployed to LeanEngine automatically (so it’s safe to do experiments on other branches). See [LeanEngine Web Hosting documentation](https://docs.leancloud.app/leanengine_webhosting_guide-node.html#hash224173211) for how the mechanism is set up, as well as how you can manually deploy the app.
