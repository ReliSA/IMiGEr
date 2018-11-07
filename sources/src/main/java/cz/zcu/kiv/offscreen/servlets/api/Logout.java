package cz.zcu.kiv.offscreen.servlets.api;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cz.zcu.kiv.offscreen.servlets.BaseServlet;

public class Logout extends BaseServlet {
	
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) {
        request.getSession().setAttribute("isLoggedIn", false);
        request.getSession().setAttribute("userId", null);
        request.getSession().setAttribute("user", null);

        response.setStatus(HttpServletResponse.SC_RESET_CONTENT);
    }
}
