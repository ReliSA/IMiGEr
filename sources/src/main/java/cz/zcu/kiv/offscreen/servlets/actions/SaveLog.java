package cz.zcu.kiv.offscreen.servlets.actions;

import cz.zcu.kiv.offscreen.user.DB;
import cz.zcu.kiv.offscreen.user.Diagram;
import cz.zcu.kiv.offscreen.user.Log;
import org.apache.log4j.Logger;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

/**
 * Class for save log
 * 
 * @author Marek Rasocha
 *
 */
public class SaveLog extends HttpServlet{
    private Logger logger = Logger.getLogger(SaveLog.class);
  
    
    /**
     * Method saves position of component, which are send by parameter in post method.
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
 logger.info("Servlet - SaveLog \t\t method - doPost \t\t start");
        //id of diagram, which will be updated
        String diagramIdStr  = request.getParameter("id_diagram");
        Object userIdStr = request.getSession().getAttribute("logged_user_id");
        DB db = new DB(getServletContext());
        PrintWriter out = response.getWriter();
        try{
            if(diagramIdStr != null && userIdStr!=null) {
                if (checkUserId(Integer.parseInt(diagramIdStr),Integer.parseInt(userIdStr.toString()),db)){
                    HashMap<String, String> log = new HashMap<String, String>();
                    log.put("user_name", request.getSession().getAttribute("logged_user_nick").toString());
                    log.put("user_id", userIdStr.toString());
                    log.put("id_diagram", diagramIdStr);
                    String event = request.getParameter("log_event");
                    log.put("log_event", event );
                    log.put("log_date_delay", request.getParameter("log_date_delay"));
                    log.put("change_jar", request.getParameter("change_jar"));
                    log.put("new_version", request.getParameter("new_version"));
                    if(event==null){
                        out.write("{\"err\":\""+ "event is null" +"\"}");
                    }else{
                        Log logDao = new Log(db);
                        if(logDao.createLog(log)>0){
                            out.write("{\"ok\":\"ok\"}");
                            logger.info("Servlet - SaveLog \t\t method - doPost \t\t Log created");
                        }else{
                            out.write("{\"err\":\""+ "database error " +"\"}");
                            logger.info("Servlet - SaveLog \t\t method - doPost \t\t error database");
                        }
                        
                    }
                    
                }else{
                    logger.info("Servlet - SaveLog \t\t method - doPost \t\t This user dont have a permisson");
                    out.write("{\"err\":\""+ "This user has not permission for showing the log " +"\"}");
                }
            }else{
                logger.info("Servlet - SaveLog \t\t method - doPost \t\t diagramId or userId is null");
                out.write("{\"err\":\""+ "diagramId or userId is null" +"\"}");
            }

        	
        }catch(NumberFormatException e){
        	e.printStackTrace();
        }catch(Exception e){
        	e.printStackTrace();
        }
        out.close();
        logger.info("Servlet - SaveLog \t\t method - doPost \t\t end");
    }

    private boolean checkUserId(int diagramID, int userId, DB db) {

        Diagram diag = new Diagram(db, diagramID);
        HashMap<String,String> param = (HashMap<String, String>) diag.getDiagram();
        String idStr = param.get("user_id");
        int id = Integer.parseInt(idStr);
        if (userId==0){
            return false;
        }
        return  id==userId ? true : false;
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        logger.info("Servlet - SaveLog \t\t method - doPost \t\t start");
        //id of diagram, which will be updated
        String diagramIdStr  = request.getParameter("id_diagram");
        Object userIdStr = request.getSession().getAttribute("logged_user_id");
        DB db = new DB(getServletContext());
        PrintWriter out = response.getWriter();
        try{
            if(diagramIdStr != null && userIdStr!=null) {
                if (checkUserId(Integer.parseInt(diagramIdStr),Integer.parseInt(userIdStr.toString()),db)){
                    HashMap<String, String> log = new HashMap<String, String>();
                    log.put("user_name", request.getSession().getAttribute("logged_user_nick").toString());
                    log.put("user_id", userIdStr.toString());
                    log.put("id_diagram", diagramIdStr);
                    String event = request.getParameter("log_event");
                    log.put("log_event", event );
                    log.put("log_date_delay", request.getParameter("log_date_delay"));
                    log.put("change_jar", request.getParameter("change_jar"));
                    log.put("new_version", request.getParameter("new_version"));
                    if(event==null){
                        out.write("{\"err\":\""+ "event is null" +"\"}");
                    }else{
                        Log logDao = new Log(db);
                        if(logDao.createLog(log)>0){
                            out.write("{\"ok\":\"ok\"}");
                            logger.info("Servlet - SaveLog \t\t method - doPost \t\t Log created");
                        }else{
                            out.write("{\"err\":\""+ "database error " +"\"}");
                            logger.info("Servlet - SaveLog \t\t method - doPost \t\t error database");
                        }
                        
                    }
                    
                }else{
                    logger.info("Servlet - SaveLog \t\t method - doPost \t\t This user dont have a permisson");
                    out.write("{\"err\":\""+ "This user has not permission for showing the log " +"\"}");
                }
            }else{
                logger.info("Servlet - SaveLog \t\t method - doPost \t\t diagramId or userId is null");
                out.write("{\"err\":\""+ "diagramId or userId is null" +"\"}");
            }

        	
        }catch(NumberFormatException e){
        	e.printStackTrace();
        }catch(Exception e){
        	e.printStackTrace();
        }
        out.close();
        logger.info("Servlet - SaveLog \t\t method - doPost \t\t end");
    }
}
