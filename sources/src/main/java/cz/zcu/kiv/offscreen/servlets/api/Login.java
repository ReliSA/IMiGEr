package cz.zcu.kiv.offscreen.servlets.api;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.User;
import cz.zcu.kiv.offscreen.vo.UserVO;

public class Login extends BaseServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) {
        DB db = new DB(getServletContext());
        User user = new User(db);

        String username = request.getParameter("username");
        String password = request.getParameter("password");

        if (user.login(username, password)) {
            UserVO userVO = new UserVO();
            userVO.setId(user.getId());
            userVO.setUsername(user.getNick());

            request.getSession().setAttribute("isLoggedIn", true);
            request.getSession().setAttribute("userId", userVO.getId());
            request.getSession().setAttribute("user", userVO);

            response.setStatus(HttpServletResponse.SC_ACCEPTED);

        } else {
            request.getSession().setAttribute("isLoggedIn", false);
            request.getSession().setAttribute("userId", null);
            request.getSession().setAttribute("user", null);

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}
