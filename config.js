module.exports = {
    msalConfig: {
        auth: {
        clientId: 'bbe68f28-08fb-4b1c-8043-c1dc402550de', //changed to sparkset
        redirectUri: 'https://admin.hellosparkset.com/settings',               //remember to change this on live site
        postLogoutRedirectUri: 'https://admin.hellosparkset.com/settings' //fix redirect
        }
    },
    msalRequest: {
        scopes: [
            'user.read',
            'mailboxsettings.read',
            'calendars.readwrite'
        ]
    }
};