import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
	name: {
		type: "string",
		required: true,
	},
	addressLine1: {
		type: "string",
		required: true,
	},

	addressLine2: {
		type: "string",
		required: false,
	},

	city: {
		type: "string",
		required: true,
	},
	pincode: {
		type: String,
		required: true,
	},
	specialisedIn: [
		{
			type: "string",
		},
	],
});

const doctorSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		salary: {
			type: String,
			required: true,
		},
		qualifications: {
			type: String,
			required: true,
		},
		experienceInYears: {
			type: Number,
			default: 0,
		},
		worksInHospitals: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Hospital",
			},
		],
	},
	{ timestamps: true }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
