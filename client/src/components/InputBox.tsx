import { Input } from "@/components/ui/input";
import { toTitleCase } from "@/lib/utils";
import { FileText, Image, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";

type Props = {
	uploadType: "file" | "image";
	name: string;
	file: File | null;
	setFile: (file: File | null) => void;
};

export default function InputBox({ file, uploadType, ...props }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);

	const fileAccept = ".pdf";
	const imageAccept = ".jpg, .jpeg, .png";

	const removeFile = () => props.setFile(null);
	const setFile = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.currentTarget.files?.item(0);
		props.setFile(file!);
	};

	useEffect(() => {
		props.setFile(null);
	}, []);

	return file === null ? (
		<>
			<div
				onClick={() => inputRef.current?.click()}
				className="cursor-pointer border-4 rounded-xl border-border border-dashed mt-3 p-16 flex flex-col items-center justify-center"
			>
				<div className="flex items-center flex-row gap-4">
					{uploadType === "file" && <FileText className="h-10 w-10" />}
					{uploadType === "image" && <Image className="h-10 w-10" />}
				</div>
				<h3 className="mt-3">Upload {toTitleCase(uploadType)} </h3>
			</div>
			<Input
				onChange={setFile}
				name={props.name}
				ref={inputRef}
				type="file"
				className="hidden"
				accept={uploadType === "file" ? fileAccept : imageAccept}
			/>
		</>
	) : (
		<div className="relative cursor-pointer border-4 rounded-xl border-border border-dashed mt-3 p-16 flex flex-row gap-4 items-center justify-center">
			<Button
				onClick={removeFile}
				variant={"destructive"}
				className="rounded-3xl p-2 h-8 w-8 absolute right-6 top-6"
				type="button"
			>
				<X />
			</Button>
			<div>
				{uploadType === "file" && <FileText className="h-12 w-12" />}
				{uploadType === "image" && <Image className="h-12 w-12" />}
			</div>
			<div className="flex flex-col">
				<h3 className="m-0">{file.name}</h3>
				<p className="m-0">{file.type}</p>
			</div>
		</div>
	);
}
