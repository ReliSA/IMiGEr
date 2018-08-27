package cz.zcu.kiv.offscreen.user;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

/**
 * Class is used for saving and loading diagram params from database.
 *
 * @author Daniel Bureš
 * @author Tomáš Šimandl
 */
public class Diagram {
    private DB db = null;
    private int id = -1;


    public Diagram(DB db) {
        this(db, -1);
    }

    public Diagram(DB db, int id) {
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

    public int getUserId(){
        if(this.id < 0) return -1;

        String qy = "SELECT user_id FROM diagram WHERE id = '" + this.id + "'";
        ResultSet rs = db.exQuery(qy);

        try{
            if (rs != null && rs.next()) {
                return rs.getInt("user_id");
            }
        }  catch (SQLException e){
            e.printStackTrace();
        }
        return -1;
    }

    public boolean isPublic(){
        if(this.id < 0) return false;

        String qy = "SELECT public FROM diagram WHERE id = '" + this.id + "'";
        ResultSet rs = db.exQuery(qy);

        try{
            if (rs != null && rs.next()) {
                return rs.getString("public").equals("1");
            }
        }  catch (SQLException e){
            e.printStackTrace();
        }
        return false;
    }

    public String getJsonDiagram(){
        if(this.id < 0) return "";

        String qy = "SELECT graph_json FROM diagram WHERE id = '" + this.id + "'";
        ResultSet rs = db.exQuery(qy);

        try{
            if (rs != null && rs.next()) {
                return rs.getString("graph_json");
            }
        }  catch (SQLException e){
            e.printStackTrace();
        }
        return "";
    }

    /**
     * Method return map of values of actual diagram or empty map if id of diagram is invalid.
     *
     * @return created map.
     */
    public Map<String, String> getDiagram() {
        if (this.id < 0) return Collections.emptyMap();

        String qy = "SELECT * FROM diagram WHERE id = '" + this.id + "'";

        try {

            ResultSet rs = db.exQuery(qy);
            if (rs != null && rs.next()) {
                return createMap(rs);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return Collections.emptyMap();
    }

    /**
     * Method saves new diagram into database or update existing diagram.
     *
     * @param param - diagram parameters
     */
    public void update(Map<String, String> param) {
        try {
            if (this.id < 0) {
                // crating new diagram

                String name = param.get("name");
                String userId = param.get("user_id");
                String isPublic = param.get("public");
                String graphJson = param.get("graph_json");


                String qy = "INSERT INTO diagram (name, created, last_update, user_id, public, graph_json ) " +
                        "VALUES (?, NOW(), NOW(), ?, ?, ?) ";

                PreparedStatement pst = db.getConn().prepareStatement(qy);
                pst.setString(1, name);
                pst.setString(2, userId);
                pst.setString(3, isPublic);
                pst.setString(4, graphJson);
                pst.executeUpdate();

                ResultSet rs = pst.getGeneratedKeys();

                if (rs.next()) {
                    this.id = rs.getInt(1);
                }
            } else {
                String name = param.get("name");
                String isPublic = param.get("public");
                String graphJson = param.get("graph_json");

                String qy = "UPDATE diagram SET name = ?, public = ?, graph_json = ?, last_update = NOW() WHERE id= ?";

                PreparedStatement pst = db.getConn().prepareStatement(qy);
                pst.setString(1, name);
                pst.setString(2, isPublic);
                pst.setString(3, graphJson);
                pst.setInt(4, this.id);
                pst.executeUpdate();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    /**
     * Method deletes diagram from database.
     */
    public void delete() {
        if (id < 0) return;

        String qy = "DELETE FROM diagram WHERE id = '" + this.id + "' LIMIT 1";
        db.exStatement(qy);
    }

    /**
     * Method change graph_json in diagram and return number of affected rows in database.
     *
     * @param graphJson json of diagram
     * @return number of affected rows in database
     */
    public int updateGraphJson(String graphJson){
        if(this.id < 0) return 0;

        String qy = "UPDATE diagram SET graph_json = ? WHERE id = ?";

        try {
            PreparedStatement pst = db.getConn().prepareStatement(qy);
            pst.setString(1, graphJson);
            pst.setInt(2, this.id);
            pst.executeUpdate();
            return pst.getUpdateCount();

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    /**
     * Method returns list of diagrams, which are uploaded by given user.
     *
     * @param user_id id of user
     * @return created list of diagram params.
     */
    public ArrayList<Map<String, String>> getDiagramListByUserId(int user_id) {
        String qy = "SELECT * FROM diagram WHERE user_id = '" + user_id + "' ORDER BY created DESC ";

        return createListOfMap(db.exQuery(qy));
    }


    /**
     * Method returns list of all public diagrams.
     *
     * @return created list of diagram params
     */
    public ArrayList<Map<String, String>> getDiagramPublicList() {

        String qy = "SELECT * FROM diagram WHERE public = 1 ORDER BY name ASC ";

        return createListOfMap(db.exQuery(qy));
    }

    /**
     * Iterate over all items in input ResultSet and return list of all founded diagrams (map of diagram parameters).
     *
     * @param rs result set which contains diagram rows.
     * @return created list of diagrams.
     */
    private ArrayList<Map<String,String>> createListOfMap(ResultSet rs) {
        ArrayList<Map<String, String>> diagram_list = new ArrayList<>();

        try {
            while (rs != null && rs.next()) {
                diagram_list.add(createMap(rs));
            }
            return diagram_list;

        } catch (SQLException e){
            e.printStackTrace();
        }

        return new ArrayList<>();
    }

    /**
     * Method take from input ResultSet all parameters of diagram. Result set must point to some row and can not be null.
     *
     * @param rs not null result set
     * @return map of all parameters.
     * @throws SQLException
     */
    private Map<String,String> createMap(ResultSet rs) throws SQLException {
        HashMap<String, String> item_map = new HashMap<>();

        item_map.put("id", String.valueOf(rs.getInt("id")));
        item_map.put("name", rs.getString("name"));
        item_map.put("created", Util.formatDate(rs.getString("created")));
        item_map.put("last_update", Util.formatDate(rs.getString("last_update")));
        item_map.put("user_id", String.valueOf(rs.getInt("user_id")));
        item_map.put("public", String.valueOf(rs.getInt("public")));
        item_map.put("graph_json", String.valueOf(rs.getString("graph_json")));

        return item_map;
    }
}
