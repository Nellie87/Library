const crypto = require("crypto");
const fs = require("fs");

const content = crypto.randomBytes(8).toString("hex");
const value = JSON.stringify(content);
// we have to write a valid javascript
fs.writeFile("src/test.js", `export const a=${value}`, (err) => {
    if (err) {
        console.error(err);
    }
});