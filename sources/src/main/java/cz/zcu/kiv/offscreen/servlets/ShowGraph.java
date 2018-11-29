package cz.zcu.kiv.offscreen.servlets;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 *
 * @author Jindra PavlĂ­kovĂˇ <jindra.pav2@seznam.cz>
 */
public class ShowGraph extends BaseServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // render
        RequestDispatcher rd = getServletContext().getRequestDispatcher("/showGraph.jsp");
        rd.forward(request, response);
    }

}
