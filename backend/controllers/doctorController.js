import doctorModel from "../models/doctorModel.js";

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email']);
        res.json({ success: true, doctors });
    } catch (error) {
        console.error("Error fetching doctor list:", error);
        res.json({ success: false, message: error.message });
    }
};

export { doctorList };