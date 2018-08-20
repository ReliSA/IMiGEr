package cz.zcu.kiv.offscreen.user;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.ServletContext;

/**
 * Class is usefull for saving and loading diagram params from database.
 * 
 * @author Daniel Bureš
 *
 */
public class Diagram {
	private DB db = null;
	private int id = 0;
	private ResultSet rs;
	 
	
	public Diagram(DB db) {			
		this(db,0);
	}
	
	
	public Diagram(DB db,int id) {
		this.db = db;	
		this.id = id;
	}
	
	/**
	 * Method returns object id.
	 * 
	 * @return id
	 */
	public int getId(){
		return this.id;
	}
	
	/**
	 * Method returns id of object as string.
	 * 
	 * @return
	 */
	public String getIdStr(){
		return Integer.toString(this.id);		
	}
	
	/**
	 * Method saves new diagram into database.
	 * 
	 * @param param - diagram parameters
	 */
	public void update(Map<String, String> param){
		try {
			if ( this.id  == 0 ) {
				  
				    String diagram_name = param.get("diagram_name")  ;
				    String hash = param.get("hash")  ;  
				    String component_count = param.get("component_count")  ;
				    String user_id = param.get("user_id")  ;
				    String public_diag = param.get("public")  ;
				
					String qy = "INSERT INTO diagram (id, created, user_id,component_count, name, session_id, hash,public ) " +
										"VALUES ('0', NOW(), '"+user_id+"', '"+component_count+"', '"+diagram_name+"', '', '" + hash + "' , '" + public_diag + "' ) ";
					Statement st = db.getConn().createStatement();
					st.executeUpdate(qy, Statement.RETURN_GENERATED_KEYS);
					ResultSet rs = st.getGeneratedKeys();
					
					if(rs.next()){							
						this.id = rs.getInt(1);						
					}					
					
				
			}else{
				    String diagram_name = param.get("diagram_name")  ;
				    String component_count = param.get("component_count")  ;
				    String public_diag = param.get("public")  ;  
				
					String qy = "UPDATE diagram SET component_count = '" + component_count + "', name = '"+diagram_name+"', public = '"+public_diag+"' " + 
										" WHERE id= '" + this.id + "'";
					Statement st = db.getConn().createStatement();
					st.executeUpdate(qy, Statement.RETURN_GENERATED_KEYS);
					ResultSet rs = st.getGeneratedKeys();

			}
					  
			
		
		} catch (SQLException e) {
			e.printStackTrace();
		}		
	}
	
	/**
	 * Method deletes diagram from database.
	 */
	public void delete(){
		String qy = "DELETE FROM diagram WHERE id = '"+ this.id+"' LIMIT 1";
		
		db.exStatement(qy);
						
		
	}
	
	/*
	public void updateViewport(String viewport_html){
		String qy = "UPDATE diagram SET viewport_html = '"+ viewport_html+"' WHERE id = '"+ this.id+"' LIMIT 1";
		try {
			db.exStatement(qy);
						
		} catch (SQLException e) {
			
			e.printStackTrace();
		}
	}

	public void updateRightpanel(String rightpanel_html){
		String qy = "UPDATE diagram SET rightpanel_html = '"+ rightpanel_html+"' WHERE id = '"+ this.id+"' LIMIT 1";
		try {
			db.exStatement(qy);
						
		} catch (SQLException e) {
			
			e.printStackTrace();
		}
	}*/
	
	/**
	 * Method updates vertices position in database. Position of vertices are saved in json.
	 * 
	 * @param vertices_position_json
	 */
	public void updateVerticesPosition(String vertices_position_json){
		String qy = "UPDATE diagram SET vertices_position = '"+ vertices_position_json+"' WHERE id = '"+ this.id+"' LIMIT 1";
		
			db.exStatement(qy);
						
		
	}
	
	/**
	 * Method returns parameters of diagram.
	 * @param diagram_id
	 * @return
	 */
	public Map<String,String> getDiagramParam(int diagram_id){
		HashMap<String, String> item_map = new HashMap<String, String>();
		String qy = "SELECT * FROM diagram WHERE id = '"+diagram_id+"' ORDER BY created DESC ";
		try {
			rs = db.exQuery(qy);			
			while ( rs != null && rs.next() ) {
				
				
				item_map.put("id", String.valueOf(rs.getInt("id")) );
				item_map.put("name", rs.getString("name")  );
				item_map.put("hash", rs.getString("hash")  );
				item_map.put("public", String.valueOf(rs.getInt("public")) );
				item_map.put("user_id", String.valueOf(rs.getInt("user_id")) );
				item_map.put("vertices_position", rs.getString("vertices_position")  );
				item_map.put("component_count", String.valueOf(rs.getInt("component_count")) );
				item_map.put("created", Util.formatDate(rs.getString("created") ) );
				item_map.put("session_id", rs.getString("session_id") );
				
				
			}
			
		} catch (SQLException e) {
			
			e.printStackTrace();
		}
		
		return item_map;
		
	}
	
	/**
	 * Method returns list of digrams, which are uploaded by user.
	 * 
	 * @param user_id
	 * @return
	 */
	public ArrayList<Map<String,String>> getDiagramListByUserId(int user_id){		
		ArrayList<Map<String,String>> diagram_list = new ArrayList<Map<String,String>>();
		String qy = "SELECT * FROM diagram WHERE user_id = '"+user_id+"' ORDER BY created DESC ";
		try {
			rs = db.exQuery(qy);			
			while ( rs != null && rs.next() ) {
				HashMap<String, String> item_map = new HashMap<String, String>();
				
				item_map.put("id", String.valueOf(rs.getInt("id")) );
				item_map.put("name", (rs.getString("name").length()==0?"No name":rs.getString("name"))  );
				item_map.put("public", String.valueOf(rs.getInt("public")) );
				item_map.put("component_count", String.valueOf(rs.getInt("component_count")) );
				item_map.put("hash", rs.getString("hash")  );
				item_map.put("created", Util.formatDate(rs.getString("created") ) );
				item_map.put("session_id", rs.getString("session_id") );
				
				diagram_list.add(item_map);
			}
			
		} catch (SQLException e) {
			
			e.printStackTrace();
		}
		
		return diagram_list;
		
	}
	
	
	/**
	 * Method returns list of public diagrams.
	 * @return
	 */
	public ArrayList<Map<String,String>> getDiagramPublicList(){
		
		ArrayList<Map<String,String>> diagram_list = new ArrayList<Map<String,String>>();
		String qy = "SELECT * FROM diagram WHERE public = 1 ORDER BY name ASC ";
		try {
			rs = db.exQuery(qy);			
			while ( rs != null && rs.next() ) {
				HashMap<String, String> item_map = new HashMap<String, String>();
				
				item_map.put("id", String.valueOf(rs.getInt("id")) );
				item_map.put("name", (rs.getString("name").length()==0?"No name":rs.getString("name"))  );
				item_map.put("public", String.valueOf(rs.getInt("public")) );
				item_map.put("component_count", String.valueOf(rs.getInt("component_count")) );
				item_map.put("hash", rs.getString("hash")  );
				item_map.put("created", Util.formatDate(rs.getString("created") ) );
				item_map.put("session_id", rs.getString("session_id") );
				
				diagram_list.add(item_map);
			}
			
		} catch (SQLException e) {
			
			e.printStackTrace();
		}
		
		return diagram_list;
		
	}
	
}
