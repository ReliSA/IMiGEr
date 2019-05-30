<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<c:set var="APP_NAME" value="${initParam.APP_NAME}"/>
<c:set var="APP_HOME_URL" value="${initParam.APP_HOME_URL}"/>
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

			<h1 class="header-title">Interactive Multimodal Graph Explorer</h1>

			<div class="user-menu loggedInOnly">
				<span class="username" id="usernameLabel">${user.username}</span>
				<button class="button" id="logoutButton">Log out</button>
			</div>

			<div class="user-menu loggedOutOnly">
				<button class="button" id="toggleLoginPopupButton">Log in</button>
				<button class="button" id="toggleRegisterPopupButton">Register</button>
			</div>
		</header>

		<main class="content">
			<section class="section">
				<h2>New diagram</h2>

				<c:if test="${not empty errorMessage}">
					<p class="alert">${errorMessage}</p>
				</c:if>

				<form method="post" enctype="multipart/form-data" class="diagram-form">
					<div class="form-field">
						<label for="file">Select data file:</label><br>
						<input type="file" name="file" id="file">
					</div>

					<div class="form-field">
						Select type of data file:<br>
						<label for="raw"><input type="radio" name="fileFormat" value="raw" id="raw" checked> Raw JSON</label><br>
						<c:forEach items="${processingModules}" var="module">
							<label for="${module.key}"><input type="radio" name="fileFormat" value="${module.key}" id="${module.key}"> ${module.value.moduleName}</label><br>
						</c:forEach>
					</div>

					<div class="form-field">
						Chose additional visualisation:<br>
						<label for="timeline"><input type="radio" name="visualisation" value="timeline" id="timeline">Timeline</label><br>
					</div>

					<button id="btnLoad" type="submit">Start visualization</button>
				</form>
			</section>

			<section class="section loggedInOnly">
				<h2>My diagrams</h2>

				<ul class="diagram-list" id="privateDiagramList">
					<c:forEach items="${diagramsPrivate}" var="diagram">
						<li class="diagram-list-item">
							<a href="${APP_HOME_URL}graph?diagramId=${diagram.id}">${diagram.name}</a>

							<dl class="diagram-details">
								<dt>created:</dt>
								<dd><time>${diagram.created}</time></dd>

								<dt>updated:</dt>
								<dd><time>${diagram.last_update}</time></dd>
							</dl>

							<ul class="diagram-button-group">
								<li>
									<a href="${APP_HOME_URL}api/get-diagram-data?id=${diagram.id}" download="${diagram.name}.json" title="download diagram as raw JSON" class="button download-diagram-button">
										<img src="images/icomoon/download3.svg" alt="download diagram icon">
									</a>
								</li>
								<li>
									<button class="button delete-diagram-button" title="delete diagram" data-id="${diagram.id}" data-name="${diagram.name}">
										<img src="images/icomoon/cross.svg" alt="delete diagram icon">
									</button>
								</li>
							</ul>
						</li>
					</c:forEach>
				</ul>
			</section>

			<section class="section">
				<h2>Public diagrams</h2>

				<ul class="diagram-list" id="publicDiagramList">
					<c:forEach items="${diagramsPublic}" var="diagram">
						<li class="diagram-list-item">
							<a href="${APP_HOME_URL}graph?diagramId=${diagram.id}">${diagram.name}</a>

							<dl class="diagram-details">
								<dt>created:</dt>
								<dd><time>${diagram.created}</time></dd>

								<dt>updated:</dt>
								<dd><time>${diagram.last_update}</time></dd>
							</dl>

							<ul class="diagram-button-group">
								<li>
									<a href="${APP_HOME_URL}api/get-diagram-data?id=${diagram.id}" download="${diagram.name}.json" title="download diagram as raw JSON" class="button download-diagram-button">
										<img src="images/icomoon/download3.svg" alt="download diagram icon">
									</a>
								</li>
							</ul>
						</li>
					</c:forEach>
				</ul>
			</section>
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
