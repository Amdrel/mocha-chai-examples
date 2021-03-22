const express = require("express");

const app = require("./app");

const port = parseInt(process.env.PORT || "3000");
app.set("port", port);

app.listen(app.get("port"), () => {
  console.log(`Listening on port ${port}`);
});
