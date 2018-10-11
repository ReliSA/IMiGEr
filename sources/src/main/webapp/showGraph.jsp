<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<c:set var="HOME_URL" value="${initParam.HOME_URL}"/>
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

		<script src="js/components/attribute.js"></script>
		<script src="js/components/edge.js"></script>
		<script src="js/components/edgePopover.js"></script>
		<script src="js/components/floatingPoint.js"></script>
		<script src="js/components/group.js"></script>
		<script src="js/components/groupVertexList.js"></script>
		<script src="js/components/minimap.js"></script>
		<script src="js/components/sidebar.js"></script>
		<script src="js/components/sidebarExcludedNodeList.js"></script>
		<script src="js/components/sidebarUnconnectedNodeList.js"></script>
		<script src="js/components/statusBar.js"></script>
		<script src="js/components/vertex.js"></script>
		<script src="js/components/vertexContextMenuList.js"></script>
		<script src="js/components/vertexPopover.js"></script>
		<script src="js/components/vertexSymbolList.js"></script>
		<script src="js/components/viewport.js"></script>

		<script src="js/exceptions/invalidArgumentException.js"></script>

		<script src="js/constants.js"></script>
		<script src="js/coordinates.js"></script>
		<script src="js/diagram.js"></script>
		<script src="js/filter.js"></script>
		<script src="js/forceDirected.js"></script>
		<script src="js/graphLoader.js"></script>
		<script src="js/graphExporter.js"></script>
		<script src="js/graphHistory.js"></script>
		<script src="js/loader.js"></script>
		<script src="js/markSymbol.js"></script>
		<script src="js/utils/cookies.js"></script>
		<script src="js/utils/dom.js"></script>
		<script src="js/utils/utils.js"></script>
		<script src="js/zoom.js"></script>
		<script src="js/app.js"></script>
		<script src="js/userMenu.js"></script>

		<title>IMiGEr</title>
	</head>

	<body class="${isLoggedIn ? 'loggedIn' : 'loggedOut'}">
		<div class="wrapper">
			<header class="header" id="header">
				<img src="images/logo.png" class="header-logo" alt="logo of University of West Bohemia" title="University of West Bohemia">

				<h2 class="header-title">Interactive Multimodal Graph Explorer</h2>

				<%@ include file="userMenu.jsp" %>

				<nav class="navbar" id="navigation">
					<ul>
						<li>
							<button class="btn zoom" id="zoomOut" title="zoom-"><img src="images/zoom_out.png" alt="zoom-"></button>
							<span class="zoom-value" id="zoomValue"></span>
							<button class="btn zoom" id="zoomIn" title="zoom+"><img src="images/zoom_in.png" alt="zoom+"></button>
						</li>
						<li>
							<hr class="navbar-separator">
						</li>
						<li>
							<button class="btn toggle-filters" id="toggleFilters">Filters</button>
						</li>
						<li>
							<hr class="navbar-separator">
						</li>
						<li>
							<input class="search-text" id="searchText" type="text" placeholder="Search components...">
							<button class="btn search" id="search"><img src="images/search.png" title="search" alt="search"></button>
							<span class="search-count" id="countOfFound" title="Count of components found">0</span>
						</li>
						<li>
							<hr class="navbar-separator">
						</li>
						<li>
							<form name="actionForm">
								<label for="move">
									<input type="radio" name="actionMove" value="move" id="move" checked>
									move
									<img class="navbar-image" src="images/move.png" alt="move">
								</label>
								<label for="remove">
									<input type="radio" name="actionMove" value="exclude" id="remove">
									exclude
									<img class="navbar-image" src="images/remove2.png" alt="remove">
								</label>
							</form>
						</li>
						<li>
							<hr class="navbar-separator">
						</li>
						<li>
							<button id="mostEdge" class="btn exclude-separately" title="Exclude components with the most count of edges separately.">
								<img src="images/excludeSeparately.png" alt="excludeSeparately">
							</button>
						</li>
						<li>
							<hr class="navbar-separator">
						</li>
						<li>
							<button id="vertexToGroup" class="btn exclude-to-group" title="Exclude components with the most count of edges to group.">
								<img src="images/package.png" alt="Exclude components to group">
							</button>
						</li>
						<li>
							<hr class="navbar-separator">
						</li>
						<li>
							<a href="${HOME_URL}" class="btn btn-block back-to-upload" id="view_back_to_upload" title="Back to upload"></a>
						</li>
						<li>
							<hr class="navbar-separator">
						</li>
						<li>
							<button class="btn" id="applyLayout" title="Apply layout to current graph">
								<img src="images/layout_off.png" id="applyLayoutImg" alt="Apply layout to current graph.">
							</button>
						</li>
						<li>
							<hr class="navbar-separator">
						</li>
						<li>
							<button class="btn save-diagram" id="btnSaveDiagram" title="Save diagram as PNG">
								<img src="images/png_save.png" id="applyLayoutImg" alt="Save diagram as PNG.">
							</button>
						</li>
						<li class="loggedInOnly">
							<hr class="navbar-separator">
						</li>
						<li class="loggedInOnly">
							<button class="btn save-diagram" id="btnSaveDiagramToDatabase" title="Save diagram">
								<img src="images/icon_save.png" id="applyLayoutImg" alt="Save diagram">
							</button>
						</li>
						<li>
							<hr class="navbar-separator">
						</li>
						<li>
							<a href="${HOME_URL}graph?diagramId=${param.diagramId}" class="btn btn-block view-refresh-diagram" id="view_refresh_diagram" title="Refresh diagram"></a>
						</li>
						<li>
							<hr class="navbar-separator">
						</li>
						<li>
							<button class="btn btn-block view-refresh-reset-diagram" id="view_refresh_reset_diagram" title="Refresh diagram - reset position"></button>
						</li>
					</ul>
				</nav>
			</header>

			<div class="filterBar hidden" id="filters">
				<div class="filterbar-nav">
					<button class="button buttonClassic" id="addFilter">Add filter</button>
					<button class="button buttonClassic" id="deleteFilter">Delete filter</button>
					<select id="filterTypeSelection">
						<option value="Archetype"> Archetype </option>
						<option value="Attribute"> Attribute </option>
						<option value="Logical"> Logical </option>
					</select>
					<select id="vertexArchetypeSelection"></select>
					<select class="hidden" id="attributeTypeSelection">
						<option value="Enum"> Enum </option>
						<option value="String"> String </option>
						<option value="Number"> Number </option>
						<option value="Date"> Date </option>
					</select>
					<select class="hidden" id="logicOperationSelection">
						<option value="And"> And </option>
						<option value="Or"> Or </option>
						<option value="Xor"> Xor </option>
					</select>
					<select id="matchTypeSelection">
						<option value="Match"> Match </option>
						<option value="NotMatch"> Not Match </option>
					</select>
				</div>

				<div class="vertex-tree" id="vertexTree">
					<ul class="vertexTreeList">
						<li class="vertexTreeItem" id="1">
							<span>
								Vertex Filters
							</span>
						</li>
					</ul>
				</div>
			</div>

			<main class="graph-content" id="content"></main>
		</div>

		<div class="loader" id="loader">
			<div class="loader-content" id="spinLoader">
				<p>Loading graph...</p>
			</div>
		</div>

		<script>
		var app = new App;
		app.HOME_URL = '${HOME_URL}';

		$(document).ready(function() {
			var loaderFn = app.diagramLoader('${param.diagramId}');

			app.run(loaderFn);
		});
		</script>
	</body>
</html>
