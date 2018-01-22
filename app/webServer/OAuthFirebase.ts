import * as passport from "passport";
// import {OAuth2Strategy as GoogleStrategy} from "passport-google-oauth";
import {Router} from "express";
import {PassportUser} from "./PassportUser";
import * as firebase from "firebase";
import * as passportFirebase from "passport-firebase-auth";

const firebaseApp: firebase.app.App = firebase.initializeApp({
    apiKey: "AIzaSyCpLVxdScnO4hHGntRAHFRSh19dkpIavZE",
    authDomain: "tacthab2.firebaseapp.com",
    databaseURL: "https://tacthab2.firebaseio.com",
    projectId: "tacthab2",
    storageBucket: "tacthab2.appspot.com",
    messagingSenderId: "32713477095"
});

console.log(firebaseApp ? "Firebase application initialized" : "Problem with firebase initialisation");

export function initOAuthFirebase(config: {urlPrefix: string}): Router {
    const routerFirebasePassport: Router = Router();
    const {urlPrefix} = config;

    passport.use(new passportFirebase.Strategy({
            firebaseProjectId: "tacthab2",
            authorizationURL: `${urlPrefix}/auth`, // /firebase`,
            callbackURL: `${urlPrefix}/auth/google/callback`
        },
        (accessToken, refreshToken, profile, done) => {
            console.log("passportFirebase profile", profile);
            const emails = profile.emails || [];
            const photos = profile.photos || [];
            const user: PassportUser = {
                name: profile.displayName,
                id: profile.id,
                token: accessToken,
                emails: emails.map(val => val.value),
                photos: photos.map(val => val.value),
                provider: "firebase",
                gender: profile.gender
            };
            // getOrCreateUser(user);
            // console.log("getOrCreateUser", user);
            done(null, user);
        }
    ));
    routerFirebasePassport.get("/auth/firebase",
        (request, response, next) => {
            console.log("Apply firebaseauth");
            passport.authenticate("firebaseauth", {/*scope: ["profile", "email"]*/})(request, response, next);
        }
    );

    routerFirebasePassport.get(
        "/auth/firebase/callback",
        (request, response, next) => {
            passport.authenticate("firebaseauth", {
                    failureRedirect: "/login",
                    successRedirect: "/"
                }
            )(request, response, next);
        }
    );

    return routerFirebasePassport;
}
