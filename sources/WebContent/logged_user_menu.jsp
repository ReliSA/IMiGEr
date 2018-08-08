<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<div id="logged_user_menu">
	<h3>Demo diagrams</h3>
	
	<ul>
		<li>
			<form action="graph" method="post" name="demoDiagramForm1">
				<input type="hidden" name="demo_id" value="1_parkoviste_osgi" />
				<input type="hidden" name="framework" value="osgi" />
				<a href="javascript:document.demoDiagramForm1.submit()">Parkoviste OSGi</a>
			</form>
		</li>
		<li>
			<form action="graph" method="post" name="demoDiagramForm2">
				<input type="hidden" name="demo_id" value="2_parkoviste_bundles" />
				<input type="hidden" name="framework" value="osgi" />
				<a href="javascript:document.demoDiagramForm2.submit()">parkoviste_bundles</a>
			</form>
		</li>
		<li>
			<form action="graph" method="post" name="demoDiagramForm3">
				<input type="hidden" name="demo_id" value="3_short_openwms" />
				<input type="hidden" name="framework" value="" />
				<a href="javascript:document.demoDiagramForm3.submit()">short_openwms</a>
			</form>
		</li>
		<li>
			<form action="graph" method="post" name="demoDiagramForm4">
				<input type="hidden" name="demo_id" value="4_test-jar" />
				<input type="hidden" name="framework" value="" />
				<a href="javascript:document.demoDiagramForm4.submit()">test-jar</a>
			</form>
		</li>
		<li>
			<form action="graph" method="post" name="demoDiagramForm5">
				<input type="hidden" name="demo_id" value="5_test-jar-not-found" />
				<input type="hidden" name="framework" value="" />
				<a href="javascript:document.demoDiagramForm5.submit()">test-jar-not-found</a>
			</form>
		</li>
		<li>
			<form action="graph" method="post" name="demoDiagramForm6">
				<input type="hidden" name="demo_id" value="6_obcc-parking-example" />
				<input type="hidden" name="framework" value="" />
				<a href="javascript:document.demoDiagramForm6.submit()">obcc-parking-example</a>
			</form>
		</li>
	</ul>
		
<% if (request.getSession().getAttribute("logged_user") == "1") { %>
	<h3 style="margin-top: 25px;">My diagrams</h3>
	
	<ul>	
		<c:forEach items="${diagramNames}" var="diagramName">
			<li id="diagram_id_${diagramName.id}">
				<a href="<%= getServletContext().getInitParameter("HOME_URL") %>upload-files?diagram_id=${diagramName.id}&diagram_hash=${diagramName.hash}">${diagramName.name}</a><a href="#" onclick="return deleteDiagram(${diagramName.id});"><img src="images/button_cancel.png" alt="odstranit" class="imgDelete"/></a>
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
				<a href="<%= getServletContext().getInitParameter("HOME_URL") %>upload-files?diagram_id=${diagramPublic.id}&diagram_hash=${diagramPublic.hash}">${diagramPublic.name}</a>
			</li>
		</c:forEach>
	</ul>
</div>
