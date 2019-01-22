package cz.zcu.kiv.offscreen.servlets.api;

import com.google.common.base.Strings;
import com.google.gson.JsonObject;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.User;
import cz.zcu.kiv.offscreen.vo.UserVO;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
public class Login extends BaseServlet {
    private static final Logger logger = LogManager.getLogger();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        logger.debug("Processing request");
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        JsonObject errors = new JsonObject();

        if (Strings.isNullOrEmpty(username)) {
            errors.addProperty("username", "Please enter username.");
            logger.debug("Empty user name");
        }

        if (Strings.isNullOrEmpty(password)) {
            errors.addProperty("password", "Please enter password.");
            logger.debug("Empty password");
        }

        if (errors.size() == 0) {
            DB db = new DB(getServletContext());
            User user = new User(db);

            if (user.login(username, password)) {
                UserVO userVO = new UserVO();
                userVO.setId(user.getId());
                userVO.setUsername(user.getNick());

                request.getSession().setAttribute("isLoggedIn", true);
                request.getSession().setAttribute("userId", userVO.getId());
                request.getSession().setAttribute("user", userVO);

                JsonObject json = new JsonObject();
                json.addProperty("id", user.getId());
                json.addProperty("username", user.getNick());


                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.setStatus(HttpServletResponse.SC_ACCEPTED);
                response.getWriter().write(json.toString());
                response.getWriter().flush();
                logger.debug("Response ACCEPTED");

            } else {
                request.getSession().setAttribute("isLoggedIn", false);
                request.getSession().setAttribute("userId", null);
                request.getSession().setAttribute("user", null);

                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                logger.debug("Response UNAUTHORIZED");
            }

        } else {
            JsonObject json = new JsonObject();
            json.add("error", errors);

            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json");
            response.getWriter().write(json.toString());
            response.getWriter().flush();
            logger.debug("Response BAD REQUEST");
        }
    }
}
