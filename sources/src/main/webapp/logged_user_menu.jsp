<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<div id="logged_user_menu">
<% if (request.getSession().getAttribute("logged_user") == "1") { %>
	<h3 style="margin-top: 25px;">My diagrams</h3>
	
	<ul>	
		<c:forEach items="${diagramNames}" var="diagramName">
			<li id="diagram_id_${diagramName.id}">
				<a href="/graph?diagramId=${diagramName.id}">${diagramName.name}</a><a href="#" onclick="return deleteDiagram(${diagramName.id});"><img src="images/button_cancel.png" alt="odstranit" class="imgDelete"/></a>
			</li>
		</c:forEach>
		<li id="diagram_id_new">
			<a href="<%= getServletContext().getInitParameter("HOME_URL") %>">New diagram</a>
		</li>
	</ul>
<% } %>

	<h3 style="margin-top: 25px;">Public diagrams</h3>
	
	<ul>	
		<c:forEach items="${diagramPublic}" var="diagramPublic">
			<li id="public_diagram_id_${diagramPublic.id}">
				<a href="/graph?diagramId=${diagramPublic.id}">${diagramPublic.name}</a>
			</li>
		</c:forEach>
	</ul>
</div>
