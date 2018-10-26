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

		<link rel="stylesheet" href="css/main.css">
		<link rel="stylesheet" href="css/jstree/themes/default/style.min.css">

		<script id="htmlTags" type="application/json"><%@ include file="node_modules/html-tags/html-tags.json" %></script>
		<script id="svgTags" type="application/json"><%@ include file="node_modules/svg-tags/lib/svg-tags.json" %></script>

		<script src="js/libs/jquery-3.3.1.min.js"></script>
		<script src="js/libs/spin.js"></script>
		<script src="js/libs/saveSvgAsPng.js"></script>
		<script src="js/libs/jstree.min.js"></script>

		<script src="js/components/generic/modalWindow.js"></script>
		<script src="js/components/generic/popover.js"></script>
		<script src="js/components/generic/popup.js"></script>
		<script src="js/components/attribute.js"></script>
		<script src="js/components/edge.js"></script>
		<script src="js/components/edgePopover.js"></script>
		<script src="js/components/floatingPoint.js"></script>
		<script src="js/components/group.js"></script>
		<script src="js/components/groupVertexList.js"></script>
		<script src="js/components/header.js"></script>
		<script src="js/components/loginPopup.js"></script>
		<script src="js/components/minimap.js"></script>
		<script src="js/components/navbar.js"></script>
		<script src="js/components/registerPopup.js"></script>
		<script src="js/components/saveDiagramModalWindow.js"></script>
		<script src="js/components/sidebar.js"></script>
		<script src="js/components/sidebarExcludedNodeList.js"></script>
		<script src="js/components/sidebarUnconnectedNodeList.js"></script>
		<script src="js/components/statusBar.js"></script>
		<script src="js/components/vertex.js"></script>
		<script src="js/components/vertexContextMenuList.js"></script>
		<script src="js/components/vertexPopover.js"></script>
		<script src="js/components/vertexSymbolList.js"></script>
		<script src="js/components/viewport.js"></script>

		<script src="js/errors/httpError.js"></script>
		<script src="js/errors/invalidArgumentError.js"></script>

		<script src="js/events/diagramUpdatedEvent.js"></script>
		<script src="js/events/loggedInEvent.js"></script>
		<script src="js/events/loggedOutEvent.js"></script>
		<script src="js/events/registeredEvent.js"></script>

		<script src="js/services/forceDirected.js"></script>
		<script src="js/services/graphLoader.js"></script>
		<script src="js/services/graphExporter.js"></script>
		<script src="js/services/loader.js"></script>
		<script src="js/services/markSymbol.js"></script>
		<script src="js/services/zoom.js"></script>

		<script src="js/utils/ajax.js"></script>
		<script src="js/utils/cookies.js"></script>
		<script src="js/utils/dom.js"></script>
		<script src="js/utils/utils.js"></script>

		<script src="js/valueObjects/coordinates.js"></script>
		<script src="js/valueObjects/diagram.js"></script>
		<script src="js/valueObjects/dimensions.js"></script>

		<script src="js/constants.js"></script>

		<script src="js/app.js"></script>
		<script src="js/showGraphApp.js"></script>

		<title>IMiGEr</title>
	</head>

	<body class="${isLoggedIn ? 'loggedIn' : 'loggedOut'}">
		<div id="app"></div>

		<div class="loader" id="loader">
			<div class="loader-content" id="spinLoader">
				<p>Loading graph...</p>
			</div>
		</div>

		<script>
			const app = new ShowGraphApp('${APP_NAME}', '${APP_HOME_URL}');

			document.addEventListener('DOMContentLoaded', () => {
				app.run('${param.diagramId}');

				// user is logged in
				if ('${user}' !== '') {
					document.dispatchEvent(new LoggedInEvent({
						id: '${user.id}',
						username: '${user.username}',
					}));
				}
			});
		</script>
	</body>
</html>
