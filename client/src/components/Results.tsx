type Props = {
	result: string | null;
};
export default function Result({ result }: Props) {
	return result == null ? (
		<></>
	) : (
		<pre className="overfloy-y-scroll mb-4">
			<code>{result.replace(/`/g, "").slice(4).trim()}</code>
		</pre>
	);
}
