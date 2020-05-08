const express = require("express");

const router = express.Router();

const Actions = require("./actionModel");

router.get("/", (req, res) => {
  Actions.get()
    .then((allProjects) => {
      res.status(200).json(allProjects);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "All the projects could not be retrieved.",
      });
    });
});

router.get("/:id", (req, res) => {
  // do your magic!
});

router.delete("/:id", (req, res) => {
  // do your magic!
});

router.put("/:id", (req, res) => {
  // do your magic!
});

// custom middleware

function validateActionId(req, res, next) {
  const id = req.params.id;
  Actions.get(id)
    .then((actionId) => {
      console.log(actionId);
      if (actionId === undefined) {
        res.status(400).json({ message: "invalid action id" });
      } else {
        next();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        message: "Failed to receive action",
      });
    });
}

module.exports = router;
