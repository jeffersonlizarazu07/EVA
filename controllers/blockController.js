// const Form = require("../models/blockModel");

// exports.createBlock = async (req, res) => {
//   try {
//     const { name, content } = req.body;
//     if (!name || !content) {
//       return res.status(400).json({ message: "Faltan campos obligatorios" });
//     }

//     const newBlock = await Form.create({ title, content });

//     res
//       .status(201)
//       .json({ message: "Formulario guardado correctamente", data: newBlock });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({
//         message: "Error al guardar el formulario",
//         error: error.message,
//       });
//   }
// };
