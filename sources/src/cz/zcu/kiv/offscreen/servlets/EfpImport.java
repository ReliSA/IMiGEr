package cz.zcu.kiv.offscreen.servlets;

import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import cz.zcu.kiv.offscreen.efp.utils.JsonTransformer;

/**
 * Servlet used for serving JSON data incoming from efpPortal app.
 * 
 * @author Jiri Loudil
 */
public class EfpImport extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private Logger logger = Logger.getLogger(LoadGraphData.class);

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String data = request.getParameter("data");

		// invalid data set
		if (data == null || data.isEmpty()) {
			logger.error("Data in message are null.");
			return;
		}

		JsonTransformer transformer = new JsonTransformer();
		
		request.setAttribute("graph_json",true);

		// set the referrer for 'Back' graph button functionality
		request.setAttribute("efpPortalRefererUrl", request.getHeader("referer"));
		
		request.getSession().setAttribute("graph_json_data", transformer.transformInputJSONToGraphJSON(data, request));

		// render
		RequestDispatcher rd = getServletContext().getRequestDispatcher("/showGraph.jsp");
		rd.forward(request, response);
	}

}
