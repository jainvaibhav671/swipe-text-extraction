import express, { Request, Response } from "express";
import multer from "multer";
import dotenv from "dotenv";
import { extractTextFromImage, extractTextFromPDF, getDetails } from "./utils";

dotenv.config();

const upload = multer({ dest: "uploads/" });

const app = express();
const port = typeof process.env.PORT === "undefined" ? 3000 : parseInt(process.env.PORT)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (_: Request, res: Response) => {
	res.send("Hello, TypeScript Express!");
});

app.post("/upload", upload.fields([{ name: "file" }]), async (req, res) => {
	try {
		if (typeof req.files === "undefined") throw new Error("No files uploaded");

		const files = req.files as { [fieldname: string]: Express.Multer.File[] };

		if (!files["file"])
			throw new Error("Error occurred when uploading the file");

		const file = files["file"][0];
		console.log(file);

		let text = "";
		if (file.mimetype === "application/pdf")
			text = await extractTextFromPDF(file.path);
		else if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
			text = await extractTextFromImage(file.path);

		console.log("Extracted Text: ", text);

		if (text.length == 0)
			res.send({ status: 201, message: "Couldn't extract data" });

		const result = await getDetails(text);

		console.log("Generated Result: ", result);

		res.send({ status: 200, result: result });
	} catch (error) {
		console.log(error);

		res.send({ status: 500, message: "Error Occurred" });
	}
});

app.listen(port, "0.0.0.0", () => {
	console.log(`Server running at http://localhost:${port}`);
});
