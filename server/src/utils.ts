import fs from "fs";
import pdf from "pdf-parse";
import Tesseract from "tesseract.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY as string;

console.log(GEMINI_API_KEY);

export async function getDetails(invoiceText: string) {
	try {
		const genai = new GoogleGenerativeAI(GEMINI_API_KEY);
		const model = genai.getGenerativeModel({ model: "gemini-1.5-flash" });

		// 		const prompt = `
		// Extract customer details, products, and total amount from the following invoice text:
		//
		// ${invoiceText}
		//
		// Organize the extracted information into a JSON object with the following structure:
		// JSON
		//
		// {
		//   "customer": {
		//     "name": "Customer Name",
		//     "address": "Customer Address",
		//     "contact": "Customer Contact"
		//   },
		//   "products": [
		//     {
		//       "description": "Product Description",
		//       "quantity": "Product Quantity",
		//       "price": "Product Price"
		//     },
		//     // ... more products
		//   ],
		//   "total_amount": "Total Amount"
		// }
		//
		// If any of the requested information is missing or ambiguous, include it in the JSON as an empty string or null.
		//         `;

		const prompt = `
Given the following invoice text, extract the customer details, product details, and total amount, and structure the information into a JSON format. Allow for nullable fields where data might be missing. Return only the JSON data and nothing else.
Invoice Text:
${invoiceText}

{
  "invoice_no": "123456",
  "date": "08/08/2024",
  "customer_details": {
    "name": "John Doe",
    "address": "1234 Elm Street, Springfield, IL 62704",
    "phone": "(555) 123-4567",
    "email": "johndoe@example.com"
  },
  "products": [
    {
      "name": "Widget A",
      "quantity": 2,
      "price": 10.00
    },
    {
      "name": "Widget B",
      "quantity": 1,
      "price": 15.00
    }
  ],
  "subtotal": 35.00,
  "tax": 3.50,
  "total_amount": 38.50
}
`;

		const result = await model.generateContent(prompt);
		let extractedText = result.response.text();

		extractedText.trim().replace("`", "");

		return extractedText;
	} catch (error) {
		console.log(error);
		throw new Error("Error in extracting the data");
	}
}

export const extractTextFromPDF = async (pdfPath: string) => {
	const dataBuffer = fs.readFileSync(pdfPath);
	const data = await pdf(dataBuffer);
	return data.text;
};

export const extractTextFromImage = async (imagePath: string) => {
	const {
		data: { text },
	} = await Tesseract.recognize(imagePath, "eng");
	return text;
};
