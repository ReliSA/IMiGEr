package cz.zcu.kiv.offscreen.servlets.actions;

import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;
import cz.zcu.kiv.offscreen.user.Log;
import cz.zcu.kiv.offscreen.user.User;
import net.sf.json.JSONObject;
import org.apache.log4j.Logger;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import net.sf.json.JSONArray;

public class LoadLog extends HttpServlet {

    private Logger logger = Logger.getLogger(LoadLog.class);
    
    /**
     * Handles the HTTP
     * <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        throw new UnsupportedOperationException();
    }
    
    /**
     * Handles the HTTP
     * <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        logger.info("Servlet - LoadLog \t\t method - doGet \t\t Start");
        Object userIdStr = request.getSession().getAttribute("logged_user_id");
        String diagramIDStr = request.getParameter("id_diagram");

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        if(diagramIDStr != null && userIdStr!=null) {
                int diagramID = Integer.parseInt(diagramIDStr);
                int userId = Integer.parseInt(userIdStr.toString());
                DB dbConn = new DB(getServletContext());
                String output = "";
                Log log= new Log(dbConn);
                List<Map<String,String>> listLogs = log.readLogs(diagramID);
                JSONArray o = JSONArray.fromObject(listLogs);
                output += o;
                out.write(output);
                logger.info("Servlet - LoadLog \t\t method - doGet \t\t return: " +o.toString());
            }else {
                logger.info("Servlet - LoadLog \t\t method - doGet \t\t diagramId or userId is null");
            }
        out.close();
        logger.info("Servlet - LoadLog \t\t method - doGet \t\t end");
    }
}
