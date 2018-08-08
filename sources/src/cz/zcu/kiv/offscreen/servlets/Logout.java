package cz.zcu.kiv.offscreen.servlets;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Logout extends HttpServlet {
	
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.getSession().setAttribute("logged_user", null);
        request.getSession().setAttribute("logged_user_id", null);
        request.getSession().setAttribute("logged_user_nick", null);

        // redirect
        response.sendRedirect(getServletContext().getInitParameter("HOME_URL"));
    }
}
