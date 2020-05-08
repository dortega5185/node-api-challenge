const express = require("express");

const router = express.Router();

const Actions = require("./actionModel");

router.get("/", (req, res) => {
  Actions.get()
    .then((allActions) => {
      res.status(200).json(allActions);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "All the actions could not be retrieved.",
      });
    });
});

router.get("/:id", validateActionId, (req, res) => {
  Actions.get(req.params.id)
    .then((soloIdActions) => {
      res.status(200).json(soloIdActions);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The actions information could not be retrieved.",
      });
    });
});

router.post("/", validateAction, (req, res) => {
  const newAction = req.body;

  Actions.insert(newAction)
    .then((action) => {
      res.status(201).json(action);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the new action.",
      });
    });
});

router.delete("/:id", validateActionId, (req, res) => {
  const id = req.params.id;
  Actions.remove(id)
    .then((theAction) => {
      if (theAction) {
        res.status(200).json(theAction);
      } else {
        res.status(404).json({
          message: "The action with the specified ID does not exist.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The action could not be removed.",
      });
    });
});

router.put("/:id", validateActionId, (req, res) => {
  const id = req.params.id;
  const newAction = req.body;

  Actions.update(id, newAction)
    .then((theAction) => {
      res.status(200).json(theAction);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "Please provide the description and notes for the update",
      });
    });
});

// custom middleware

function validateActionId(req, res, next) {
  const id = req.params.id;
  Actions.get(id)
    .then((actionId) => {
      console.log(actionId);
      if (actionId === undefined || actionId === null) {
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

function validateAction(req, res, next) {
  const action = req.body;

  if (Object.keys(action).length === 0) {
    res.status(400).json({ message: "missing action data" });
  } else if (
    action.description === undefined ||
    action.description === "" ||
    action.notes === undefined ||
    action.notes === "" ||
    action.project_id === undefined ||
    action.project_id === ""
  ) {
    res.status(400).json({
      message: "missing required description, notes and/or project_id  field",
    });
  } else {
    next();
  }
}

module.exports = router;
