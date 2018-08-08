<%@page import="cz.zcu.kiv.offscreen.graph.efp.EfpGraphicSettings"%>
<%--<%@page import="org.eclipse.jdt.internal.compiler.ast.ForeachStatement"%>--%>
<%@page import="org.apache.jasper.tagplugins.jstl.core.ForEach"%>
<%@page import="cz.zcu.kiv.comav.loaders.osgi.service.RequiredService"%>
<%@page import="sun.reflect.ReflectionFactory.GetReflectionFactoryAction"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="java.util.Map"%>
<%@page import="com.google.gson.Gson"%>
<%@page import="com.google.gson.GsonBuilder"%>

<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

		<link rel="stylesheet" href="styles/libs/jquery-ui/smoothness/jquery-ui-1.10.3.custom.css" media="screen">
		<link rel="stylesheet" href="styles/libs/jquery.contextMenu.css" media="screen">
		<link rel="stylesheet" href="styles/libs/jquery.qtip.css" media="screen">
		<link rel="stylesheet" href="styles/basic.css" media="screen">
		<link rel="stylesheet" href="styles/tooltip.css" media="screen">
		<link rel="stylesheet" href="styles/tree.css" media="screen">
		<link rel="stylesheet" href="styles/dialog.css" media="screen">

		<script src="js/libs/jquery-1.8.3.js"></script>
		<script src="js/libs/jquery-ui-1.10.3.custom.js"></script>
		<script src="js/libs/jquery.contextMenu.js"></script>
		<script src="js/libs/jquery.qtip.js"></script>
		<script src="js/libs/jquery.jstree.js"></script>
		<script src="js/libs/saveSvgAsPng.js"></script>
		<script src="js/libs/spin.js"></script>

		<script src="js/app.js"></script>
		<script src="js/util.js"></script>
		<script src="js/svgFactory.js"></script>
		<script src="js/graphManager.js"></script>
		<script src="js/hash.js"></script>
		<script src="js/mark.js"></script>
		<script src="js/markSymbol.js"></script>
		<script src="js/gridMark.js"></script>
		<script src="js/group.js"></script>
		<script src="js/groupManager.js"></script>
		<script src="js/offScreenKiv.js"></script>
		<script src="js/zoom.js"></script>
		<script src="js/efps.js"></script>
		<script src="js/viewportManager.js"></script>
		<script src="js/dialog.js"></script>
		<script src="js/tooltips.js"></script>
		<script src="js/loader.js"></script>
		<script src="js/diagram.js"></script>
		<script src="js/user.js"></script>

		<title>Visualization of large component diagrams</title>
	</head>

	<body>
		<%
		//String path = request.getContextPath();
		String getProtocol=request.getScheme();
		String getDomain=request.getServerName();
		String getPort=Integer.toString(request.getServerPort());
		String getPath = getProtocol+"://"+getDomain+":"+getPort+"/";
		String getURI=request.getRequestURI();

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
		boolean show_icon_save = false;
		if (logged_user && diagram_id_hash_set) {
			diagram_url = "?diagram_id="+ request.getParameter("diagram_id")+"&diagram_hash=" + request.getParameter("diagram_hash");
			show_icon_save = true;
		}

		boolean is_efp_diagram = false;
		if (request.getAttribute("efpPortalRefererUrl") != null) {
			is_efp_diagram = true;
		}
		%>

		<div class="loader" id="loader">
			<div class="loader-content" id="spinLoader">
				<p>Loading graph...</p>
			</div>
		</div>

		<div class="dialog" id="dialog" title="Group rename">
			<p>Enter new group name:</p>

			<input type="text" name="name" id="groupNameTextarea" />
			<br>

			<button type="button" name="button" id="clearNameButton" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" value="Clear">
				<span class="ui-button-text">Clear</span>
			</button>
		</div>

		<div class="wrapper" id="envelope">
			<header class="header" id="header">
				<img src="images/logo.png" class="header-logo" alt="logo of University of West Bohemia" title="University of West Bohemia">

				<h2 class="header-title color-blue">Visualization of large component diagrams </h2>

				<% if (!is_efp_diagram) { %>
					<jsp:include page="logged_user.jsp" />
				<% } %>
			</header>

			<nav class="navbar" id="navigation">
				<ul>
					<li>
						<button class="btn zoom" id="zoomOut" title="zoom-"><img src="images/zoom_out.png" alt="zoom-"/></button>
						<span class="zoom-value" id="zoomValue">100%</span>
						<button class="btn zoom" id="zoomIn" title="zoom+"><img src="images/zoom_in.png" alt="zoom+"/></button>
					</li>

					<li><hr class="navbar-separator"></li>
					<li>
						<input class="search-text" id="searchText" type="text" value="Search components..."/>
						<button class="btn search" id="search"><img src="images/search.png" title="search" alt="search"></button>
						<span class="search-count" id="countOfFinded" title="Count of components found">0</span>
					</li>

					<li><hr class="navbar-separator"></li>
					<li>
						<form>
							<input type="radio" name="actionMove" value="move" id="move" checked><label for="move">move<img class="navbar-image" src="images/move.png" alt="move"></label>
							<input type="radio" name="actionMove" value="exclude" id="remove"><label for="remove">exclude<img class="navbar-image" src="images/remove2.png" alt="remove"></label>
						</form>
					</li>

					<li><hr class="navbar-separator"></li>
					<li><button id="mostEdge" class="btn exclude-separately" title="Exclude components with the most count of edges separately."><img src="images/excludeSeparately.png" alt="excludeSeparately"/></button></li>

					<li><hr class="navbar-separator"></li>
					<li><button id="vertexToGroup" class="btn exclude-to-group" title="Exclude components with the most count of edges to group."><img src="images/package.png" alt="Exclude components to group"/></button></li>

					<li><hr class="navbar-separator"></li>
					<li>
						<% if (!is_efp_diagram) { %>
							<a href="<%=getServletContext().getInitParameter("HOME_URL")%><%= diagram_url %>" class="btn btn-block back-to-upload" id="view_back_to_upload" title="Back to upload"></a>
						<% } else { %>
							<a href="<%=request.getAttribute("efpPortalRefererUrl")%>" class="btn btn-block back-to-upload" id="view_back_to_upload" title="Back"></a>
						<% } %>
					</li>

					<li><hr class="navbar-separator"></li>
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
						<li><hr class="navbar-separator"></li>
						<li><a href="#" class="btn btn-block view-save-diagram" id="view_save_diagram" onClick="saveDiagram(<%=request.getParameter("diagram_id")%>); return false;" title="Save diagram"></a></li>

						<li><hr class="navbar-separator"></li>
						<li><a href="<%=getServletContext().getInitParameter("HOME_URL")%>ShowGraph?diagram_id=<%=request.getParameter("diagram_id")%>&diagram_hash=<%=request.getParameter("diagram_hash")%>" class="btn btn-block view-refresh-diagram" id="view_refresh_diagram" title="Refresh diagram"></a></li>

						<li><hr class="navbar-separator"></li>
						<li><a href="<%=getServletContext().getInitParameter("HOME_URL")%>ShowGraph?diagram_id=<%=request.getParameter("diagram_id")%>&diagram_hash=<%=request.getParameter("diagram_hash")%>" class="btn btn-block view-refresh-reset-diagram" id="view_refresh_reset_diagram" onclick="return reset_diagram(<%=request.getParameter("diagram_id")%>,'<%=request.getParameter("diagram_hash")%>');" title="Refresh diagram - reset position"></a></li>
					<% } %>

					<li><hr class="navbar-separator"></li>
					<li>
						<button class="btn save-diagram" id="btnSaveDiagram" title="Save diagram as PNG." onclick="saveSvgAsPng(document.getElementById('svg1'), 'diagram.png', {scale: 1})">
							<img src="images/png_save.png" id="applyLayoutImg" alt="Save diagram as PNG.">
						</button>
					</li>
				</ul>
			</nav>

			<div class="content" id="content" >
				<div class="viewport" id="viewport" contextmenu="contextMenu">
					<img src="./images/zoom_help.png" class="zoom-help" id="zoom_help">

					<ul class="contextMenu" id="myMenu"></ul>

					<svg id="svg1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
						<g class="graph" id="graph" transform="scale(1)">
							<g class="edges" id="edges"></g>
							<g class="vertices" id="vertices"></g>
						</g>
					</svg>
				</div>

				<div class="sidebar" id="rightPanel">
					<div class="sidebar-navbar" id="uploadMenu">
						<a class="button buttonClassic" id="postponed">Postponed</a>
						<a class="button buttonClassic" id="toChange">To Change</a>
						<a class="button buttonClassic" id="unconnected">Unconnected</a>
						<a class="button buttonClassic" id="incompatible" style="display: none;">Incompatible</a>
					</div>

					<div class="components-count" id="allComps"></div>

					<div class="components-box postponed-components" id="postponedComps">
						<h5>Postponed components</h5>
					</div>

					<div class="components-box to-change-components" id="toChangeComps">
						<h5>To Change components</h5>
						<button type="button" id="proposeChanges">
							<img class="buttonImage" src="images/tochange/crce-call-trans.gif" alt="Propose changes" title="Propose changes">
						</button>

						<!--
						<h5>Proposed components</h5>
						<div class="control-buttons">
							<div class="button buttonClassic" id="accept-proposed">
								<img class="buttonImage" src="images/tochange/accept-trans.gif" alt="Accept" title="Accept component change">
							</div>
							<div class="button buttonClassic" id="reject-proposed">
								<img class="buttonImage" src="images/button_cancel.png" alt="Reject" title="Reject component change">
							</div>
						</div>
						-->
					</div>

					<div class="components-box unconnected-components" id="unconComps">
						<h5>Unconnected components</h5>
						<div class="control-buttons">
							<div class="button buttonClassic" id="showUnconnected">
								<img src="images/unconnected/uncon_left.png" alt="<-" title="Show unconnected components">
							</div>
							<div class="button buttonClassic" id="hideUnconnected">
								<img src="images/unconnected/uncon_right.png" alt="->" title="Hide unconnected components">
							</div>
						</div>

						<ul id="unconCmpList"></ul>
					</div>

					<div class="components-box incompatible-components" id="allIncomps">
						<h5 class="notCompatible">Incompatible components</h5>

						<ul id="incomCmpList"></ul>
					</div>

					<div class="components-box excluded-components" id="excludedComponents">
						<h5>Excluded components</h5>

						<div class="btn-group">
							<button type="button" class="sort-button" id="sortComponents_name_asc">
								<span class="sort-icon">▲</span> Name
							</button>
							<button type="button" class="sort-button" id="sortComponents_name_desc">
								<span class="sort-icon">▼</span> Name
							</button>
							<button type="button" class="sort-button" id="sortComponents_count_asc">
								<span class="sort-icon">▲</span> #component
							</button>
							<button type="button" class="sort-button" id="sortComponents_count_desc">
								<span class="sort-icon">▼</span> #component
							</button>

							<button type="button" class="include-components-button" id="includeAllComponents">
								<img src="images/button_cancel.png" title="Include all components to graph">
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<script>
		var app = new App;
		app.HOME_URL = '<%=getPath%>cocaex-compatibility/';

		$(document).ready(function() {
			// set theme path for jsTree lib
			$.jstree._themes = "styles/libs/jstree/themes/";

			var loaderFn;
			<% if (request.getAttribute("graph_json") != null) { %>
				loaderFn = app.efpLoader(<%= request.getAttribute("graph_json") %>, <%= efpSettingsJson %>);
			<% } else { %>
				loaderFn = app.diagramLoader(<%= request.getParameter("diagram_id") %>, <%= request.getParameter("diagram_hash") %>);
			<% } %>

			app.run(loaderFn);
		});
		</script>
	</body>
</html>
