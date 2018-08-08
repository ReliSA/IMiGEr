<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="cz.zcu.kiv.offscreen.graph.efp.EfpGraphicSettings"%>
<%@page import="org.apache.jasper.tagplugins.jstl.core.ForEach"%>
<%@page import="cz.zcu.kiv.comav.loaders.osgi.service.RequiredService"%>
<%@page import="sun.reflect.ReflectionFactory.GetReflectionFactoryAction"%>
<%@page import="java.util.Map"%>
<%@page import="com.google.gson.Gson"%>
<%@page import="com.google.gson.GsonBuilder"%>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">

		<link rel="stylesheet" href="css/main.css">
		<link rel="stylesheet" href="css/jstree/themes/default/style.min.css">

		<script id="htmlTags" type="application/json"><%@ include file="node_modules/html-tags/html-tags.json" %></script>
		<script id="svgTags" type="application/json"><%@ include file="node_modules/svg-tags/lib/svg-tags.json" %></script>

		<script src="js/libs/jquery-1.8.3.js"></script>
		<script src="js/libs/spin.js"></script>
		<script src="js/libs/saveSvgAsPng.js"></script>
		<script src="js/libs/jstree.min.js"></script>

		<script src="js/components/edge.js"></script>
		<script src="js/components/edgePopover.js"></script>
		<script src="js/components/floatingPoint.js"></script>
		<script src="js/components/group.js"></script>
		<script src="js/components/groupVertexList.js"></script>
		<script src="js/components/change.js"></script>
		<script src="js/components/changeModalWindow.js"></script>
		<script src="js/components/changeVertexList.js"></script>
		<script src="js/components/sidebar.js"></script>
		<script src="js/components/sidebarExcludedNodeList.js"></script>
		<script src="js/components/sidebarMissingComponentList.js"></script>
		<script src="js/components/sidebarPostponedChangeList.js"></script>
		<script src="js/components/sidebarUnconnectedNodeList.js"></script>
		<script src="js/components/statusBar.js"></script>
		<script src="js/components/vertex.js"></script>
		<script src="js/components/vertexContextMenuList.js"></script>
		<script src="js/components/vertexLight.js"></script>
		<script src="js/components/vertexPopover.js"></script>
		<script src="js/components/vertexSymbolList.js"></script>
		<script src="js/components/viewport.js"></script>

		<script src="js/exceptions/invalidArgumentException.js"></script>

		<script src="js/constants.js"></script>
		<script src="js/coordinates.js"></script>
		<script src="js/forceDirected.js"></script>
		<script src="js/graphLoader.js"></script>
		<script src="js/graphExporter.js"></script>
		<script src="js/graphHistory.js"></script>
		<script src="js/javaComponentChanger.js"></script>
		<script src="js/loader.js"></script>
		<script src="js/markSymbol.js"></script>
		<script src="js/utils/cookies.js"></script>
		<script src="js/utils/dom.js"></script>
		<script src="js/utils/utils.js"></script>
		<script src="js/zoom.js"></script>
		<script src="js/app.js"></script>

		<title>Visualization of large component diagrams</title>
	</head>

	<body>
		<%
		//String path = request.getContextPath();
		String getProtocol = request.getScheme();
		String getDomain = request.getServerName();
		String getPort = Integer.toString(request.getServerPort());
		String getPath = getProtocol+"://"+getDomain+":"+getPort+"/";
		String getURI = request.getRequestURI();

		// set graphic settings for EFP graph
		ServletContext context = this.getServletContext();
		EfpGraphicSettings efpSettings = new EfpGraphicSettings();

		efpSettings.setMinInterfaceDiameter(Integer.valueOf(context.getInitParameter("minInterfaceDiameter")));
		efpSettings.setMaxInterfaceDiameter(Integer.valueOf(context.getInitParameter("maxInterfaceDiameter")));

		// JSONize graph settings
		GsonBuilder gsonBuilder = new GsonBuilder();
		Gson gson = gsonBuilder.create();

		String efpSettingsJson = gson.toJson(efpSettings);

		// logged-in user
		boolean logged_user = false;
		boolean diagram_id_hash_set = false;
		if (request.getSession().getAttribute("logged_user") == "1"){
			logged_user = true;
		}

		if (request.getParameter("diagram_id")!= null && request.getParameter("diagram_hash") != null) {
			diagram_id_hash_set = true;
		}

		String diagram_url = "";
		boolean show_icon_save = true;
		if (logged_user && diagram_id_hash_set) {
			diagram_url = "?diagram_id="+ request.getParameter("diagram_id")+"&diagram_hash=" + request.getParameter("diagram_hash");
			show_icon_save = true;
		}

		boolean is_efp_diagram = false;
		if (request.getAttribute("efpPortalRefererUrl") != null) {
			is_efp_diagram = true;
		}
		%>

		<div class="wrapper">
			<header class="header" id="header">
				<img src="images/logo.png" class="header-logo" alt="logo of University of West Bohemia" title="University of West Bohemia">

				<h2 class="header-title">Visualization of large component diagrams</h2>

				<% if (!is_efp_diagram) { %>
					<jsp:include page="logged_user.jsp" />
				<% } %>

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
							<% if (!is_efp_diagram) { %>
								<a href="<%=getServletContext().getInitParameter("HOME_URL")%>upload-files<%=diagram_url%>" class="btn btn-block back-to-upload" id="view_back_to_upload" title="Back to upload"></a>
							<% } else { %>
								<a href="<%=request.getAttribute("efpPortalRefererUrl")%>" class="btn btn-block back-to-upload" id="view_back_to_upload" title="Back"></a>
							<% } %>
						</li>
						<li>
							<hr class="navbar-separator">
						</li>
						<li>
							<button class="btn" id="applyLayout" title="Apply layout to current graph.">
								<img src="images/layout_off.png" id="applyLayoutImg" alt="Apply layout to current graph.">
							</button>
						</li>
						<%
						if (request.getAttribute("efpPortalEfpNames") != null) {
							final Map<String, String> efpMappings = (Map<String, String>)request.getAttribute("efpPortalEfpNames");
							if (!efpMappings.isEmpty()) {
						%>
						<li><hr class="navbar-separator"></li>
						<li>
							<select name="EFPselector" class="EFP-selector" id="EFPselector">
								<option value="" selected="selected" class="option_default">none</option>
								<% for (Map.Entry<String, String> entry : efpMappings.entrySet()) { %>
									<option value="<%=entry.getValue()%>"><%=entry.getValue()%></option>
								<% } %>
							</select>
						</li>
						<%
							}
						}
						%>

						<% if (show_icon_save) { %>
						<li>
							<hr class="navbar-separator">
						</li>
						<li>
							<button class="btn save-diagram" id="btnSaveDiagram" title="Save diagram as PNG.">
								<img src="images/png_save.png" id="applyLayoutImg" alt="Save diagram as PNG.">
							</button>
						</li>
						<li>
							<hr class="navbar-separator">
						</li>
						<li>
							<a href="<%=getServletContext().getInitParameter("HOME_URL")%>graph?diagram_id=<%=request.getParameter("diagram_id")%>&diagram_hash=<%=request.getParameter("diagram_hash")%>" class="btn btn-block view-refresh-diagram" id="view_refresh_diagram" title="Refresh diagram"></a>
						</li>
						<li>
							<hr class="navbar-separator">
						</li>
						<li>
							<a href="<%=getServletContext().getInitParameter("HOME_URL")%>graph?diagram_id=<%=request.getParameter("diagram_id")%>&diagram_hash=<%=request.getParameter("diagram_hash")%>" class="btn btn-block view-refresh-reset-diagram" id="view_refresh_reset_diagram" onclick="reset_diagram(<%=request.getParameter("diagram_id")%>,'<%=request.getParameter("diagram_hash")%>'); return false;" title="Refresh diagram - reset position"></a>
						</li>
						<% } %>
					</ul>
				</nav>
			</header>
			
			<main class="graph-content" id="content"></main>
		</div>

		<div class="loader" id="loader">
			<div class="loader-content" id="spinLoader">
				<p>Loading graph...</p>
			</div>
		</div>

		<script>
		var app = new App;
		app.HOME_URL = '<%=getPath%>cocaex-compatibility/';

		$(document).ready(function() {
			var loaderFn;
			<% if (request.getAttribute("graph_json") != null) { %>
				loaderFn = app.efpLoader('<%=request.getAttribute("graph_json")%>', '<%=efpSettingsJson%>');
			<% } else { %>
				loaderFn = app.diagramLoader('<%=request.getParameter("diagram_id")%>', '<%=request.getParameter("diagram_hash")%>');
			<% } %>

			app.run(loaderFn);
		});
		</script>
	</body>
</html>
