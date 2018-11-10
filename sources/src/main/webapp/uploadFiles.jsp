<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<c:set var="APP_NAME" value="IMiGEr"/>
<c:set var="APP_HOME_URL" value="${initParam.HOME_URL}"/>
<c:set var="isLoggedIn" value="${sessionScope.isLoggedIn}"/>
<c:set var="user" value="${sessionScope.user}"/>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">

		<link rel="stylesheet" href="css/common.css">
		<link rel="stylesheet" href="css/upload-files.css">

		<link rel="stylesheet" href="css/components/header.css">
		<link rel="stylesheet" href="css/components/popup.css">

		<script id="htmlTags" type="application/json"><%@ include file="node_modules/html-tags/html-tags.json" %></script>
		<script id="svgTags" type="application/json"><%@ include file="node_modules/svg-tags/lib/svg-tags.json" %></script>

		<script src="js/components/generic/popup.js"></script>
		<script src="js/components/loginPopup.js"></script>
		<script src="js/components/registerPopup.js"></script>

		<script src="js/errors/abstractMethodError.js"></script>
		<script src="js/errors/httpError.js"></script>

		<script src="js/events/loggedInEvent.js"></script>
		<script src="js/events/loggedOutEvent.js"></script>
		<script src="js/events/registeredEvent.js"></script>

		<script src="js/utils/ajax.js"></script>
		<script src="js/utils/dom.js"></script>

		<script src="js/constants.js"></script>

		<title>${APP_NAME}</title>
	</head>

	<body class="${isLoggedIn ? 'loggedIn' : 'loggedOut'}">
		<header class="header" id="header">
			<img src="images/logo_cs.svg" class="header-logo" alt="logo of University of West Bohemia" title="University of West Bohemia">

			<h2 class="header-title">Interactive Multimodal Graph Explorer</h2>

			<div class="user-menu loggedInOnly">
				<span class="username" id="usernameLabel">${user.username}</span>
				<button class="button" id="logoutButton">Log out</button>
			</div>

			<div class="user-menu loggedOutOnly">
				<button class="button" id="toggleLoginPopupButton">Log in</button>
				<button class="button" id="toggleRegisterPopupButton">Register</button>
			</div>
		</header>

		<main>
			<div class="upload-form">
				<h3>New diagram</h3>

				<c:if test="${not empty errorMessage}">
					<p class="alert">${errorMessage}</p>
				</c:if>

				<form method="post" enctype="multipart/form-data">
					<div class="form-field">
						<label for="file">Select JSON data file:</label><br>
						<input type="file" name="file" id="file">
					</div>

					<div class="form-field">
						Select type of data file:<br>
						<label for="spade"><input type="radio" name="jsonFileFormat" value="spade" id="spade" checked> Spade JSON</label><br>
						<label for="raw"><input type="radio" name="jsonFileFormat" value="raw" id="raw"> Raw JSON</label><br>
					</div>

					<button id="btnLoad" type="submit">Start visualization</button>
				</form>
			</div>

			<div class="diagrams-menu loggedInOnly">
				<h3>My diagrams</h3>

				<ul id="privateDiagramList">
					<c:forEach items="${diagramsPrivate}" var="diagram">
						<li>
							<a href="${HOME_URL}graph?diagramId=${diagram.id}">${diagram.name}</a>

							<button class="button remove-diagram-button" data-id="${diagram.id}" data-name="${diagram.name}">
								<img src="images/button_cancel.png" alt="odstranit">
							</button>
						</li>
					</c:forEach>
				</ul>
			</div>

			<div class="diagrams-menu">
				<h3>Public diagrams</h3>

				<ul id="publicDiagramList">
					<c:forEach items="${diagramsPublic}" var="diagram">
						<li>
							<a href="${HOME_URL}graph?diagramId=${diagram.id}">${diagram.name}</a>
						</li>
					</c:forEach>
				</ul>
			</div>
		</main>

		<script type="module">
			import UploadFilesApp from './js/uploadFilesApp.js';

			window.app = new UploadFilesApp('${APP_NAME}', '${APP_HOME_URL}');

			document.addEventListener('DOMContentLoaded', () => {
				app.run();
			});
		</script>
	</body>
</html>
