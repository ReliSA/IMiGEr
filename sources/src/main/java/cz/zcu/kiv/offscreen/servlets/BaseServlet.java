package cz.zcu.kiv.offscreen.servlets;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;

import cz.zcu.kiv.offscreen.vo.UserVO;

public abstract class BaseServlet extends HttpServlet {
    /**
     * @param request HTTP request
     * @return true if the user is logged in to current session, otherwise false
     */
    protected boolean isLoggedIn(HttpServletRequest request) {
        Object isLoggedIn = request.getSession().getAttribute("isLoggedIn");

        return isLoggedIn != null && (boolean) isLoggedIn;
    }

    /**
     * @param request HTTP request
     * @return identifier of user if logged in, otherwise null
     */
    protected int getUserId(HttpServletRequest request) {
        return (int) request.getSession().getAttribute("userId");
    }

    /**
     * @param request HTTP request
     * @return instance of {@link UserVO} if logged in, otherwise null
     */
    protected UserVO getUserVO(HttpServletRequest request) {
        return (UserVO) request.getSession().getAttribute("user");
    }

    /**
     * @param request HTTP request
     * @return true if the request was made using AJAX, otherwise false
     */
    protected boolean isAjax(HttpServletRequest request) {
        String requestedWith = request.getHeader("X-Requested-With");

        return requestedWith != null && requestedWith.equals("XMLHttpRequest");
    }

}
