const express = require("express");

const app = express();

const router = require("./routes");

app.use(express.json());

app.use(router);

const server = app.listen(42042);

module.exports = server;

// const users = [
//   {
//     _id: 1,
//     name: "James",
//     age: 10,
//     gender: "male",
//     profile: {
//       displayName: "blacksocks",
//       bio: { facebook: "facebook", twitter: "twitter" },
//     },
//     address: { coordinates: ["lng", "lat"], street: { name: "Mvog-beti" } },
//   },
//   {
//     _id: 2,
//     name: "Mary",
//     age: 11,
//     gender: "female",
//     profile: {
//       displayName: "honney-bee",
//       bio: { facebook: "facebook", twitter: "twitter" },
//     },
//     address: { coordinates: ["lng", "lat"], street: { name: "Mvog-bi" } },
//   },
//   {
//     _id: 3,
//     name: "Peter",
//     age: 15,
//     gender: "male",
//     profile: {
//       displayName: "peterRock",
//       bio: { facebook: "facebook", twitter: "twitter" },
//     },
//     address: { coordinates: ["lng", "lat"], street: { name: "Etoudi" } },
//   },
//   {
//     _id: 4,
//     name: "James",
//     age: 15,
//     gender: "male",
//     profile: {
//       displayName: "james_cole",
//       bio: { facebook: "facebook", twitter: "twitter" },
//     },
//     address: { coordinates: ["lng", "lat"], street: { name: "Nkolbisong" } },
//   },
// ];

// console.log(
//   sanitize(users[0], {
//     select: ["_id", "age", "profile.displayName", "profile.bio.facebook"],
//     // select: ["_id", "profile"],
//     replace: {
//       _id: "id",
//       // profile: "profile.displayName",
//       "profile.displayName": "displayName",
//       "profile.bio.facebook": "facebook",
//     },
//     remove: ["a"],
//   })
// );
