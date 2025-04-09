export function formatDate(dateString: string | undefined) {
	try {
		if (dateString) return new Date(dateString).toLocaleDateString("en-GB");
		return "-";
	} catch (e) {
		return "Invalid Date";
	}
}
