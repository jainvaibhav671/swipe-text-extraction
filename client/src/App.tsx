import InputBox from "@/components/InputBox";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Result from "./components/Results";
import axios from "axios";
import { Loader } from "lucide-react";

function App() {
	const [file, setFile] = useState<File | null>(null);

	const [errorMsg, setErrorMsg] = useState("");
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<string | null>(null);

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		setErrorMsg("");
		setResult(null);

		if (!file || file.size == 0) {
			setErrorMsg("File not uploaded");
			return;
		}

		const formData = new FormData();
		formData.append("file", file as File, file.name);

		console.log("URL", import.meta.env.VITE_API_UPLOAD_URL)
		axios
			.post(`${import.meta.env.VITE_API_UPLOAD_URL}`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})
			.then((res) => {
				console.log(res.data.result)
				if (typeof res.data.result !== "undefined")
					setResult(res.data.result as string);
			})
			.finally(() => {
				setFile(null);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<main className="mx-auto prose prose-slate dark:prose-invert bg-background text-foreground flex flex-col gap-2">
			<h1>Details Extraction</h1>
			<form
				onSubmit={onSubmit}
				className="flex flex-col"
				encType="multipart/form-data"
			>
				<Tabs defaultValue={"pdf-upload"} className="w-full">
					<TabsList className="w-full">
						<TabsTrigger value="pdf-upload" className="w-full">
							PDF
						</TabsTrigger>
						<TabsTrigger value="image-upload" className="w-full">
							Image
						</TabsTrigger>
					</TabsList>
					<TabsContent value="pdf-upload">
						<InputBox
							uploadType="file"
							name="file"
							setFile={setFile}
							file={file}
						/>
					</TabsContent>
					<TabsContent value="image-upload">
						<InputBox
							uploadType="image"
							name="image"
							setFile={setFile}
							file={file}
						/>
					</TabsContent>
					<p className="text-red-500 font-bold text-lg">{errorMsg}</p>
				</Tabs>
				<Button disabled={loading} className="text-md font-medium flex gap-1">
					{loading && <Loader className="animate-spin" />}
					<span>Submit</span>
				</Button>
			</form>

			<Result result={result} />
		</main>
	);
}

export default App;
