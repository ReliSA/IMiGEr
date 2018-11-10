package cz.zcu.kiv.offscreen.servlets.api;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.common.base.Strings;
import cz.zcu.kiv.offscreen.servlets.BaseServlet;
import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.User;
import cz.zcu.kiv.offscreen.vo.UserVO;
import org.json.JSONObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class Login extends BaseServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        Map<String, String> errors = new HashMap<>();

        if (Strings.isNullOrEmpty(username)) {
            errors.put("username", "Please enter username.");
        }

        if (Strings.isNullOrEmpty(password)) {
            errors.put("password", "Please enter password.");
        }

        if (errors.isEmpty()) {
            DB db = new DB(getServletContext());
            User user = new User(db);

            if (user.login(username, password)) {
                UserVO userVO = new UserVO();
                userVO.setId(user.getId());
                userVO.setUsername(user.getNick());

                request.getSession().setAttribute("isLoggedIn", true);
                request.getSession().setAttribute("userId", userVO.getId());
                request.getSession().setAttribute("user", userVO);

                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("username", user.getNick());

                JSONObject json = new JSONObject(userMap);

                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                response.setStatus(HttpServletResponse.SC_ACCEPTED);
                response.getWriter().write(json.toString());
                response.getWriter().flush();

            } else {
                request.getSession().setAttribute("isLoggedIn", false);
                request.getSession().setAttribute("userId", null);
                request.getSession().setAttribute("user", null);

                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }

        } else {
            JSONObject json = new JSONObject();
            json.put("error", new JSONObject(errors));

            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json");
            response.getWriter().write(json.toString());
            response.getWriter().flush();
        }
    }
}
