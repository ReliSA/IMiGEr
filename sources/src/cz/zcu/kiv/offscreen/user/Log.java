package cz.zcu.kiv.offscreen.user;

import com.mysql.jdbc.PreparedStatement;
import java.sql.Connection;
import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletContext;

/**
 * Class is usefull for saving and loading diagram params from database.
 *
 * @author Daniel Bureš
 *
 */
public class Log {
    private DB db = null;
    private int id = 0;
    private ResultSet rs;


    public Log(DB db) {
        this(db, 0);
    }


    public Log(DB db, int id) {
        this.db = db;
        this.id = id;
    }

    /**
     * Method returns object id.
     *
     * @return id
     */
    public int getId() {
        return this.id;
    }

    /**
     * Method returns id of object as string.
     *
     * @return
     */
    public String getIdStr() {
        return Integer.toString(this.id);
    }


    public int createLog(Map<String, String> param) {
        String idUser = param.get("user_id");
        String idDiagram = param.get("id_diagram");
        String event = param.get("log_event");
        String delay = param.get("log_date_delay");
        String jar = param.get("change_jar");
        String userName = param.get("user_name");
        String newVersion = param.get("new_version");
        Connection con = db.getConn();
        PreparedStatement pstmt;
        try {
            pstmt = (PreparedStatement) con.prepareStatement("INSERT INTO log(id_user,user_name,id_diagram,event,date,date_delay,change_jar,new_version) VALUES "+
                    "(?,?,?,?,?,?,?,?)");
            pstmt.setInt(1,Integer.parseInt(idUser));
            pstmt.setString(2,userName);
            pstmt.setInt(3,Integer.parseInt(idDiagram));
            pstmt.setString(4,event);
            Date date2 = new Date(System.currentTimeMillis());
            pstmt.setDate(5,date2);
            Date date=null;
            if(delay!=null){
               date = new Date(Integer.parseInt(delay));
            }
            pstmt.setDate(6,date);
            pstmt.setString(7,jar);
            pstmt.setString(8,newVersion);
            return pstmt.executeUpdate();
        } catch (SQLException ex) {
            Logger.getLogger(Log.class.getName()).log(Level.SEVERE, null, ex);
            return -1;
        }

            
//        return db.exStatement(qy);
    }
    public List<Map<String,String>> readLogs(int idDiagram){
        List<Map<String,String>> diagram_list = new ArrayList<Map<String,String>>();
        String qy = "SELECT * FROM log WHERE id_diagram = '"+idDiagram+"' ORDER BY date ASC ";
        try {
            rs = db.exQuery(qy);
            while ( rs != null && rs.next() ) {
                HashMap<String, String> item_map = new HashMap<String, String>();
                item_map.put("id", String.valueOf(rs.getInt("id")));
                item_map.put("user_id", String.valueOf(rs.getInt("id_user")));
                item_map.put("user_name", String.valueOf(rs.getString("user_name")) );
                item_map.put("diagram_id", String.valueOf(rs.getInt("id_diagram")) );
                item_map.put("log_date", Util.formatDate(rs.getString("date")) );
                item_map.put("log_event", String.valueOf(rs.getString("event")) );
                String str = String.valueOf(rs.getString("date_delay"));
                if(str!=null) str = Util.formatDate(str);
                item_map.put("log_date_delay", str);
                item_map.put("change_jar", rs.getString("change_jar"));
                item_map.put("new_version", String.valueOf(rs.getString("new_version") ) );
                diagram_list.add(item_map);
            }

        } catch (SQLException e) {

            e.printStackTrace();
        }

        return diagram_list;

    }
}
