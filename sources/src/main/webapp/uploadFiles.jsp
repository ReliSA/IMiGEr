<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">

		<link rel="stylesheet" href="css/main.css">

		<script src="js/libs/jquery-1.8.3.js"></script>
		<script src="js/userMenu.js"></script>

		<title>IMiGEr</title>
	</head>

	<body>
		<c:set var="HOME_URL" value="${initParam.HOME_URL}"/>
		<c:set var="isLoggedIn" value="${sessionScope.isLoggedIn}"/>
		<c:set var="user" value="${sessionScope.user}"/>

		<header class="header" id="header">
			<img src="images/logo.png" class="header-logo" alt="logo of University of West Bohemia" title="University of West Bohemia">

			<h2 class="header-title">Interactive Multimodal Graph Explorer</h2>

			<%@ include file="userMenu.jsp" %>
		</header>

		<main class="upload-content">
			<div class="upload-forms">
				<c:if test="${not empty errorMessage}">
					<p class="alert">${errorMessage}</p>
				</c:if>

				<strong>Upload SPADe data:</strong>

				<form method="post" enctype="multipart/form-data">
					<div class="form-field">
						<input type="file" name="file">
					</div>

					<input type="submit" value="Start visualization">
				</form>
			</div>

			<c:if test="${isLoggedIn}">
				<div class="diagrams-menu">
					<h3>My diagrams</h3>

					<ul>
						<c:forEach items="${diagramsPrivate}" var="diagram">
							<li>
								<a href="${HOME_URL}graph?diagramId=${diagram.id}">${diagram.name}</a>
								<button onclick="return deleteDiagram(${diagram.id});"><img src="images/button_cancel.png" alt="odstranit"></a>
							</li>
						</c:forEach>
					</ul>
				</div>
			</c:if>

			<div class="diagrams-menu">
				<h3>Public diagrams</h3>

				<ul>
					<c:forEach items="${diagramsPublic}" var="diagram">
						<li>
							<a href="${HOME_URL}graph?diagramId=${diagram.id}">${diagram.name}</a>
						</li>
					</c:forEach>
				</ul>
			</div>
		</main>
	</body>
</html>
