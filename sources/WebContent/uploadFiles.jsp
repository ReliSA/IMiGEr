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

		<title>Visualization of large component diagrams</title>
	</head>

	<body>
		<div class="wrapper">
			<header class="header" id="header">
				<img src="images/logo.png" class="header-logo" alt="logo of University of West Bohemia" title="University of West Bohemia">

				<h2 class="header-title">Visualization of large component diagrams</h2>

				<jsp:include page="logged_user.jsp" />

				<nav class="navbar" id="navigation"></nav>
			</header>

			<main class="upload-content">
				<jsp:include page="logged_user_menu.jsp" />

				<div class="upload-forms">
					<c:if test="${not empty errorMessage}">
						<p class="errorMessage">${errorMessage}</p>
					</c:if>

					<h3>Upload components:</h3>

					<form name="uploadForm" action="upload-files" method="post" enctype="multipart/form-data">
						<div class="form-field">
							<input type="file" name="uploads[]" class="hidden" id="fileUpload" multiple>

							<button type="button">
								<label for="fileUpload">Browse files</label>
							</button>

							<label for="fileUpload" id="fileCounter"></label>
						</div>

						<input type="submit" value="Upload">
					</form>

					<hr class="verticalSeparator">

					<% if (request.getParameter("diagram_id") != null) { %>
						<form name="diagramForm" action="graph?diagram_id=<%= request.getParameter("diagram_id") %>&diagram_hash=<%= request.getParameter("diagram_hash") %>" method="post">
							<input type="hidden" name="diagram_id" value="<%= request.getParameter("diagram_id") %>">

							<%
							if (request.getSession().getAttribute("logged_user_id") != null &&
									request.getAttribute("diagram_user_id") != null && 
									request.getAttribute("diagram_user_id").toString().compareTo(request.getSession().getAttribute("logged_user_id").toString()) == 0 ) { %>

								<div class="form-field">
									<label for="diagramName">Edit diagram name:</label><br>
									<input type="text" name="diagram_name" id="diagramName" value="${diagram_name}">
								</div>

								<div class="form-field">
									<label for="publicDiagram">Public diagram:</label><br>
									<input type="checkbox" name="public_diagram" id="publicDiagram" value="1" ${diagram_public_checked}>
								</div>

							<% } else if (request.getSession().getAttribute("logged_user_id") != null) { %>
								<div class="form-field">
									<label for="diagramName">Edit diagram name:</label><br>
									<input type="text" name="diagram_name" id="diagramName" value="${diagram_name}">
								</div>

								<div class="form-field">
									<label for="copyDiagram">Copy diagram:</label><br>
									<input type="checkbox" name="copy_diag" id="copyDiagram" value="1">
								</div>
							<% } %>

					<% } else { %>
						<form name="diagramForm" action="graph" method="post">
							<% if (request.getSession().getAttribute("logged_user") == "1" ) { %>
								<div class="form-field">
									<label for="diagramName">Diagram name:</label><br>
									<input type="text" name="diagram_name" id="diagramName">
								</div>

								<div class="form-field">
									<label for="publicDiagram">Public diagram:</label><br>
									<input type="checkbox" name="public_diagram" id="publicDiagram" value="1" ${diagram_public_checked}>
								</div>
							<% } %>
					<% } %>

						<!--
						<div class="form-field">
							<label for="framework">Choose framework:</label><br>
							<select name="framework" id="framework">
								<option value="osgi">OSGi</option>
								<option value="ejb3">EJB3</option>
								<option value="sofa2">SOFA2</option>
							</select>
						</div>
						-->

						<input type="submit" value="Start visualization" ${not empty componentNames ? "" : "disabled='disabled'"}>
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
				</div>
			</main>
		</div>

		<script>
			var fileUploadField = document.getElementById('fileUpload');
			var fileCounter = document.getElementById('fileCounter');

			fileUploadField.addEventListener('change', function() {
				var message = this.files.length === 1 ? '1 file selected.' : (this.files.length + ' files selected.');
				fileCounter.innerText = message;
			});
		</script>
	</body>
</html>
