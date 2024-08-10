import InputBox from "@/components/InputBox";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Result from "./components/Results";

function App() {
	const [file, setFile] = useState<File | null>(null);

	const [errorMsg, setErrorMsg] = useState("");
	const [loading, setLoading] = useState(false);

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		setErrorMsg("");
		setFile(null);

		const formData = new FormData(event.currentTarget);
		const file = formData.get("file") as File | null;

		if (!file || file.size == 0) {
			setErrorMsg("File not uploaded");
			return;
		}

		setFile(file);
		setLoading(false);
	};

	return (
		<main className="mx-auto prose prose-slate dark:prose-invert bg-background text-foreground flex flex-col gap-2">
			<h1>Details Extraction</h1>
			<form onSubmit={onSubmit} className="flex flex-col gap-4">
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
				<Button className="text-md font-medium">Submit</Button>
			</form>

			<Result />
		</main>
	);
}

export default App;
