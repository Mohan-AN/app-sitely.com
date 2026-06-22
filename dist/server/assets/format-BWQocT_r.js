//#region src/lib/format.ts
function formatDate(dateString) {
	if (!dateString) return "—";
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
//#endregion
export { formatDate as t };
