const express = require("express");

const router = express.Router();

const Projects = require("./projectModel");

const Actions = require("../actions/actionModel");

router.get("/", (req, res) => {
  Projects.get()
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

router.get("/:id", validateProjectId, (req, res) => {
  Projects.get(req.params.id)
    .then((project) => {
      res.status(200).json(project);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The project information could not be retrieved.",
      });
    });
});

router.get("/:id/actions", validateProjectId, (req, res) => {
  const id = req.project.id;
  Projects.getProjectActions(id)
    .then((allActions) => {
      if (allActions === undefined || allActions.length === 0) {
        res.status(404).json({
          message: "The project with the specified ID does not exist.",
        });
      } else {
        res.status(200).json(allActions);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The actions could not be retrieved.",
      });
    });
});

router.post("/", validateProject, (req, res) => {
  const newProject = req.body;

  Projects.insert(newProject)
    .then((project) => {
      res.status(201).json(project);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the new project.",
      });
    });
});

router.post("/:id/actions", validateProjectId, validateAction, (req, res) => {
  let text = req.body;
  text.project_id = req.project.id;

  Actions.insert(text)
    .then((action) => {
      res.status(200).json(action);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the action to the database",
      });
    });
});

router.delete("/:id", validateProjectId, (req, res) => {
  const id = req.params.id;
  Projects.remove(id)
    .then((project) => {
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({
          message: "The project with the specified ID does not exist.",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The project could not be removed.",
      });
    });
});

router.put("/:id", validateProjectId, validateProject, (req, res) => {
  const id = req.params.id;
  const newProject = req.body;

  Projects.update(id, newProject)
    .then((project) => {
      res.status(200).json(project);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "Please provide name and description for the update",
      });
    });
});

// middleware
function validateProjectId(req, res, next) {
  const id = req.params.id;
  Projects.get(id)
    .then((projectId) => {
      if (projectId === undefined || projectId === null) {
        res.status(400).json({ message: "invalid project id" });
      } else {
        req.project = projectId;
        next();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({
        message: "invalid project id",
      });
    });
}

function validateProject(req, res, next) {
  const project = req.body;

  if (Object.keys(project).length === 0) {
    res.status(400).json({ message: "missing project data" });
  } else if (
    project.name === "" ||
    project.name === undefined ||
    project.description === "" ||
    project.description === undefined
  ) {
    res
      .status(400)
      .json({ message: "missing required name and/or description field" });
  } else {
    next();
  }
}

function validateAction(req, res, next) {
  const action = req.body;
  console.log(action);
  if (Object.keys(action).length === 0) {
    res.status(400).json({ message: "missing action data" });
  } else if (
    action.description === undefined ||
    action.description === "" ||
    action.notes === undefined ||
    action.notes === ""
  ) {
    res
      .status(400)
      .json({ message: "missing required description and/or notes field" });
  } else {
    next();
  }
}

module.exports = router;
