const dotenv = require("dotenv");
const app = require(`./app`);

dotenv.config({ path: `${__dirname}/config.env` }); // Important: Note: This two lines should be on top because we need to set the environment variable at first before starting the app!

// console.log(app.get("env"));
// console.log(process.env);
console.log(process.env.NODE_ENV);

const port = process.env.port || 8080;

app.listen(port, () => {
    console.log(`App listening on port ${port}.`);
});
