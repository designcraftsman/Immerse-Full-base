const {Session} = require('../models/session');

exports.addSession = async (req, res) => {
    try {
        const { idTeacher, sessionName, description, course , group , code } = req.body;
        console.log(idTeacher, sessionName, description, course , group , code);
        const response = await Session.addSession(idTeacher, sessionName, description, course , group , code);
        res.status(201).json({ message: "Session added successfully" , response : response , success: true});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};


exports.getSessionsByTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const sessions = await Session.getSessionsByTeacher(id);
        res.status(201).json({ message: "Sessions found successfully", sessions });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};

exports.getSessionsByStudent = async (req, res) => {
    try {
      const { username } = req.params;
      const sessions = await Session.getSessionsByStudent(username);
      res.status(200).json({message:"Sessions found successfully !", sessions: sessions ,success:true});
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "An error occurred" });
    }
  };

exports.deleteAnnotation = async (req, res) => {
    try {
        const { id } = req.params;
        await Annotation.deleteAnnotation(id);
        res.status(200).json({ message: "Annotation deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};

exports.updateAnnotation = async (req, res) => {
    try {
        const { id } = req.params;
        const { idModel, name, description, position } = req.body;
        const annotation = new Annotation(idModel, name, description, position);
        const response = await annotation.updateAnnotation(id);
        res.status(200).json({ message: "Annotation updated successfully", response });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "An error occurred" });
    }
};
