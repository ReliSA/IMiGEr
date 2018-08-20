package cz.zcu.kiv.offscreen.servlets;

import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.User;

public class Login  extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Cookie cookie = new Cookie("framework", request.getParameter("framework"));
        response.addCookie(cookie);
        
        DB db = new DB(getServletContext());
        User logged_user_c = new User(db);

        if (logged_user_c.login(request.getParameter("login_name"), request.getParameter("password"))) {
            request.getSession().setAttribute("logged_user", "1");
            request.getSession().setAttribute("logged_user_id", logged_user_c.getId() );
            request.getSession().setAttribute("logged_user_nick", logged_user_c.getNick());
        } else {
            request.getSession().setAttribute("logged_user", "0");
            request.getSession().setAttribute("logged_user_nick", "");
            request.getSession().setAttribute("logged_user_err", "1");
            request.getSession().setAttribute("logged_user_err_name", request.getParameter("login_name"));
        }

        // redirect
        response.sendRedirect(getServletContext().getInitParameter("HOME_URL"));
    }
}
