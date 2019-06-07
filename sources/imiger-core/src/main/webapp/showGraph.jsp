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
		<link href="css/auxiliary/bootstrap/bootstrap.min.css" type="text/css" rel="stylesheet" />
		<link href="css/auxiliary/bootstrap/bootstrap-theme.min.css" type="text/css" rel="stylesheet" />
		<link href="css/auxiliary/bootstrap-dialog/bootstrap-dialog.min.css" type="text/css" rel="stylesheet" />
		<link rel="stylesheet" href="node_modules/spin.js/spin.css">

		<link rel="stylesheet" href="css/common.css">
		<link rel="stylesheet" href="css/show-graph.css">

		<link rel="stylesheet" href="css/components/context-menu.css">
		<link rel="stylesheet" href="css/components/header.css">
		<link rel="stylesheet" href="css/components/minimap.css">
		<link rel="stylesheet" href="css/components/modal-window.css">
		<link rel="stylesheet" href="css/components/navbar.css">
		<link rel="stylesheet" href="css/components/popover.css">
		<link rel="stylesheet" href="css/components/popup.css">
		<link rel="stylesheet" href="css/components/sidebar.css">
		<link rel="stylesheet" href="css/components/spinloader.css">
		<link rel="stylesheet" href="css/components/status-bar.css">
		<link rel="stylesheet" href="css/components/tooltip.css">
		<link rel="stylesheet" href="css/components/viewport.css">
		<link rel="stylesheet" href="css/components/nouislider.min.css">

		<script id="htmlTags" type="application/json"><%@ include file="node_modules/html-tags/html-tags.json" %></script>
		<script id="svgTags" type="application/json"><%@ include file="node_modules/svg-tags/lib/svg-tags.json" %></script>
		<script id="imigerRawInputSchema" type="application/json"><%@ include file="imiger-raw-input-schema.json" %></script>

		<script src="node_modules/ajv/dist/ajv.min.js"></script>
		<script src="node_modules/save-svg-as-png/lib/saveSvgAsPng.js"></script>

		<script src="js/components/generic/modalWindow.js"></script>
		<script src="js/components/generic/popover.js"></script>
		<script src="js/components/generic/popup.js"></script>
		<script src="js/components/node.js"></script>
		<script src="js/components/nodeProxy.js"></script>
		<script src="js/components/attribute.js"></script>
		<script src="js/components/edge.js"></script>
		<script src="js/components/edgePopover.js"></script>
		<script src="js/components/filterModalWindow.js"></script>
		<script src="js/components/group.js"></script>
		<script src="js/components/groupVertexList.js"></script>
		<script src="js/components/header.js"></script>
		<script src="js/components/HelpModalWindow.js"></script>
		<script src="js/components/loginPopup.js"></script>
		<script src="js/components/minimap.js"></script>
		<script src="js/components/navbar.js"></script>
		<script src="js/components/nodeRelatedArchetypeList.js"></script>
		<script src="js/components/nodeSymbolList.js"></script>
		<script src="js/components/registerPopup.js"></script>
		<script src="js/components/saveDiagramModalWindow.js"></script>
		<script src="js/components/sidebar.js"></script>
		<script src="js/components/sidebarNodeList.js"></script>
		<script src="js/components/sidebarExcludedNodeList.js"></script>
		<script src="js/components/sidebarUnconnectedNodeList.js"></script>
		<script src="js/components/spinLoader.js" type="module"></script>
		<script src="js/components/statusBar.js"></script>
		<script src="js/components/vertex.js"></script>
		<script src="js/components/vertexContextMenuList.js"></script>
		<script src="js/components/vertexPopover.js"></script>
		<script src="js/components/viewport.js"></script>

		<script src="js/errors/ajvValidationError.js"></script>
		<script src="js/errors/httpError.js"></script>
		<script src="js/errors/invalidArgumentError.js"></script>

		<script src="js/events/diagramUpdatedEvent.js"></script>
		<script src="js/events/loggedInEvent.js"></script>
		<script src="js/events/loggedOutEvent.js"></script>
		<script src="js/events/registeredEvent.js"></script>

		<script src="js/services/filters/AbstractFilter.js"></script>
		<script src="js/services/filters/DateFilterOperation.js"></script>
		<script src="js/services/filters/EnumFilterOperation.js"></script>
		<script src="js/services/filters/FilterDataType.js"></script>
		<script src="js/services/filters/NodeTypeFilter.js"></script>
		<script src="js/services/filters/NumberFilterOperation.js"></script>
		<script src="js/services/filters/StringFilterOperation.js"></script>
		<script src="js/services/filters/VertexArchetypeFilter.js"></script>
		<script src="js/services/filters/VertexAttributeFilter.js"></script>
		<script src="js/services/forceDirected.js"></script>
		<script src="js/services/initialElimination.js"></script>
		<script src="js/services/graphLoader.js"></script>
		<script src="js/services/graphExporter.js"></script>
		<script src="js/services/markSymbol.js"></script>
		<script src="js/services/zoom.js"></script>

		<script src="js/utils/ajax.js"></script>
		<script src="js/utils/Auth.js"></script>
		<script src="js/utils/cookies.js"></script>
		<script src="js/utils/dom.js"></script>
		<script src="js/utils/utils.js"></script>

		<script src="js/valueObjects/coordinates.js"></script>
		<script src="js/valueObjects/diagram.js"></script>
		<script src="js/valueObjects/dimensions.js"></script>
		<script src="js/valueObjects/nodeSymbol.js"></script>

		<script src="js/constants.js"></script>
		<link href="css/customStyles.css" type="text/css" rel="stylesheet" />

		<c:if test = "${sessionScope.showTimeline eq true}">
			<link href="css/cz.kajda.timeline.css" type="text/css" rel="stylesheet" />
			<link href="css/styles.css" type="text/css" rel="stylesheet" />
			<script src="js/timeline/oop.js"></script>
			<script data-main="js/timeline/main" src="js/timeline/lib/require/require.js"></script>
		</c:if>
		<!--<script src="js/components/slider/nouislider.min.js"></script>-->
		<script src="js/components/slider/wNumb.js"></script>

		<title>${APP_NAME}</title>
	</head>

	<body class="${isLoggedIn ? 'loggedIn' : 'loggedOut'}">
		<div class="container full-width no-margin">
			<div id="header" class="header"></div>
			<div id="navbar" class="navbar"></div>
            <div class="container full-width no-margin">
                <div class="row">
                    <div class="col-xs-10 no-margin" style="margin-righ:30px">
                        <c:if test = "${sessionScope.showTimeline eq true}">
                            <div class="row container-fluid timeline-container" style="">
                                <div class="timeline-pane">
                                    <div id="timeline" tabindex="0"></div>
                                </div>
                            </div>
                        </c:if>
                        <div id="app" class="row"></div>
                    </div>

                    <div class="col-xs-2 no-margin" id="sidebar-container">


                    </div>
                </div>

		    </div>
        </div>

		<script type="module">
			import ShowGraphApp from './js/showGraphApp.js';

			window.app = new ShowGraphApp('${APP_NAME}', '${APP_HOME_URL}');

			document.addEventListener('DOMContentLoaded', () => {
				app.run('${param.diagramId}');

				// user is logged in
				if ('${isLoggedIn}' === 'true') {
					document.dispatchEvent(new LoggedInEvent({
						id: '${user.id}',
						username: '${user.username}',
					}));
				}
			});
		</script>
	</body>
</html>
