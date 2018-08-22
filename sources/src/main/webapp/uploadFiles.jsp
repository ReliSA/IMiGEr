<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">

		<link rel="stylesheet" href="css/main.css">

		<script src="js/libs/jquery-1.8.3.js"></script>
		<script src="old/js/diagram.js"></script>
		<script src="old/js/user.js"></script>

		<title>IMiGEr</title>
	</head>

	<body>
		<div class="wrapper">
			<header class="header" id="header">
				<img src="images/logo.png" class="header-logo" alt="logo of University of West Bohemia" title="University of West Bohemia">

				<h2 class="header-title">Interactive Multimodal Graph Explorer</h2>

				<jsp:include page="logged_user.jsp" />

				<nav class="navbar" id="navigation"></nav>
			</header>

			<main class="upload-content">
				<jsp:include page="logged_user_menu.jsp" />

				<div class="upload-forms">
					<c:if test="${not empty errorMessage}">
						<p class="errorMessage">${errorMessage}</p>
					</c:if>

					<h3>Upload SPADe data:</h5>

					<form name="uploadForm" method="post" enctype="multipart/form-data">
						<div class="form-field">
							<input type="file" name="file">
						</div>

						<input type="submit" value="Upload">
					</form>

					<c:if test="${not empty componentNames}">
						<hr class="verticalSeparator">

						<h3>Uploaded components:</h3>

						<ul id="uploadedComponent">
							<%
							if (request.getParameter("diagram_id") == null) {
								request.setAttribute("url_diagram_id", "");
							%>
								<li id="deleteAll">Delete all <a href="delete-components"><img src="images/button_cancel.png" alt="delete" class="imgDelete"/></a></li>
							<%
							} else {
								request.setAttribute("url_diagram_id", "&diagram_id="+ request.getParameter("diagram_id") +  "&diagram_hash="+ request.getParameter("diagram_hash"));
							}
							%>
							<c:forEach items="${componentNames}" var="componentName">
								<li id="${componentName}">${componentName}                                
								<% if (request.getParameter("diagram_id") == null || ( request.getSession().getAttribute("logged_user_id") != null &&
										request.getAttribute("diagram_user_id") != null && 
										request.getAttribute("diagram_user_id").toString().compareTo(request.getSession().getAttribute("logged_user_id").toString()) == 0  )) { %>
									<a href="delete-component?name=${componentName}<%= request.getAttribute("url_diagram_id") %>"><img src="images/button_cancel.png" alt="delete" class="imgDelete"/></a></li>
								<% } %>
							</c:forEach>
						</ul>
					</c:if>

					<hr class="verticalSeparator">

					<form name="diagramForm" action="graph" method="post">
						<input type="submit" value="Start visualization" ${not empty componentNames ? "" : "disabled='disabled'"}>
					</form>
				</div>
			</main>
		</div>
	</body>
</html>
