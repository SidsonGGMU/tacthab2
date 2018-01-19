import * as path    from "path";
import * as express from "express";

export function RegisterTest(app: express.Application) {
// Static files
    const staticPathTS = path.join(__dirname, "../../app/test");
    const staticPathJS = path.join(__dirname, ".");
    console.log("staticPathTS", staticPathTS);
    console.log("staticPathJS", staticPathJS);
    app.use("/test", express.static(staticPathTS));
    app.use("/test", express.static(staticPathJS));
}
