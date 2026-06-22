//#region src/lib/format.ts
function formatCurrency(value) {
	if (!value) return "—";
	const num = parseFloat(value);
	if (isNaN(num)) return "—";
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(num);
}
function formatDate(dateString) {
	if (!dateString) return "—";
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
}
//#endregion
export { formatDate as n, formatCurrency as t };
