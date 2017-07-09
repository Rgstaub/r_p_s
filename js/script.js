function submit() {
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var keywords = $("#keyword").val();

	getArticle(keyword, startDate, endDate);
}

$("#submit").on("click", submit);