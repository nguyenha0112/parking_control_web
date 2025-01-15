import User from "../models/user.model.js";

const userController = {
    // GET ALL USERS
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // DELETE USER
    deleteUser: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json( {message: "Delete successfully"});
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export default userController;
