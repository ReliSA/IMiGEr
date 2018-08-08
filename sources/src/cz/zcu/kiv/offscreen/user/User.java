package cz.zcu.kiv.offscreen.user;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;

/**
 * Class CUser is used for creating, updating or loading user from database.
 *
 * @author Daniel Bureš
 *
 */
public class User {
	private DB db = null;
	private int id = 0;
	private ResultSet rs;
	private Map<String,String> paramStr = new HashMap<String,String>(10);


	/**
	 * Constructs object, where is saved db connection.
	 */
	public User(DB db) {
		this(db,0);
	}

	/**
	 * Constructs object, where is saved db connection and user id. User, who has this id is loaded from database.
	 */
	public User(DB db, int id){
		this.db = db;
		this.id = id;

		if(id > 0){
			load();
		}

	}

	/**
	 * Method loads user from database. User is loaded by his id, which must be saved in object of this class.
	 */
	public void load(){
		String qy = "SELECT * FROM user WHERE id = '"+this.id+"' ";
		try {
			rs = db.exQuery(qy);
			if ( rs != null && rs.next() ) {
				this.id = rs.getInt("id");


				paramStr.put("nick", rs.getString("nick")  );

			}else{
				this.id = 0;
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}

	}


	/**
	 * Method sets session for current user and save session to database.
	 *
	 * @param session
	 */
	public void setSession(String session){
		if(id > 0){
			String qy = "UPDATE user SET session='"+session+"' WHERE id='"+ this.id +"'";
			db.exStatement(qy);
		}
	}

	/**
	 * Method try to login user by his nick name and password. If login is OK then returns true else  returns false;
	 *
	 * @param nick
	 * @param psw
	 * @return true - login ok
	 * 		   false - login failed
	 */
	public boolean login(String nick, String psw){
		String qy = "SELECT * FROM user WHERE nick LIKE '"+nick+"' AND psw LIKE '"+Util.MD5(psw)+"' AND active = '1' LIMIT 1";
		try {
			rs = db.exQuery(qy);
			if ( rs.next() ) {
				if(rs.getInt("id") > 0){
					this.id = rs.getInt("id");
					load();
					return true;
				}
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}


		return false;
	}



	public void register(Map<String, String> param){
		try {
				if ( this.id  == 0 ) {

					String qy = "INSERT INTO user (id,created,active, nick,name, psw,session,email) " +
										"VALUES (	'0', " +
										"			NOW(), " +
										"			'1', " +
										"			'" + param.get("nick") + "',"+
										"			'" + param.get("name") + "',"+
										"			'" + Util.MD5(param.get("password")) + "'," +
										" 			'" + param.get("session") + "',"+
										" 			'" + param.get("email") + "' ) ";
					Statement st = db.getConn().createStatement();
					st.executeUpdate(qy, Statement.RETURN_GENERATED_KEYS);
					ResultSet rs = st.getGeneratedKeys();

					if(rs.next()){
						this.id = rs.getInt(1);
					}
				}

			} catch (SQLException e) {
				e.printStackTrace();
			}

	}

	/**
	 * Method saves parameters into database. if is not loaded user then is created new User.
	 *
	 * @param param - parameters to save
	 * @param cx
	 */
	public void update(Map<String, String> param,ServletContext cx){
		try {
			if ( this.id  == 0 ) {

					String qy = "INSERT INTO user (id,created,active) " +
										"VALUES ('0', NOW(), '1' ) ";
					Statement st = db.getConn().createStatement();
					st.executeUpdate(qy, Statement.RETURN_GENERATED_KEYS);
					ResultSet rs = st.getGeneratedKeys();

					if(rs.next()){
						this.id = rs.getInt(1);
					}


			}

			String tmp_info = param.get("info");
			tmp_info = tmp_info.replaceAll("\\<","&lt;");
			tmp_info = tmp_info.replaceAll("\\>","&gt;");
			tmp_info = tmp_info.replaceAll("\\n","<br \\/>");
			param.put("info",tmp_info);


			db.exStatement(	"UPDATE user " +
							"SET  email = '"+param.get("email")+"',"+
								  "nick = '"+param.get("nick")+"',"+
								  (param.get("noSavePsw")!=null?"":",psw = '"+param.get("psw")+"' " )+
								  (param.get("active")!= null && Integer.valueOf(param.get("active")) >= 0 ? ",active = '" + param.get("active") + "'": "" )+
								  " WHERE id = '" + this.id +"'");





		} catch (SQLException e) {
			cx.setAttribute("DEBUG", "e " + e.getMessage() + " state: "+e.getSQLState() + " sqlerrcode" + e.getErrorCode());

			e.printStackTrace();
		}

	}


	/**
	 * Returns id of loaded user.
	 *
	 * @return int
	 */
	public int getId(){
		return id;
	}

	/**
	 * Returns loaded parameters, which are saved in Map<String,String>.
	 * @return Map<String,String> loaded parameters, which are saved in Map<String,String>.
	 */
	public Map<String,String> getParam(){
		return paramStr;
	}

	/**
	 * Method returns nick of loaded user.
	 * @return
	 */
	public String getNick(){
		return paramStr.get("nick");
	}

	/**
	 * Method checks if exists user with nick.
	 * @param testNick
	 * @return
	 */
	public boolean existsNick(String testNick){
		boolean exists = false;

		String qy = "SELECT * FROM user WHERE LOWER(nick) LIKE '"+testNick.toLowerCase()+"' LIMIT 1";
		try {
			rs = db.exQuery(qy);

			if ( rs.next() ) {
				if(rs.getInt("id") > 0){
					return true;
				}
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return exists;

	}


	/**
	 * Method checks if user exists by him e-mail.
	 *
	 * @param testEmail
	 * @return
	 */
	public boolean existsEmail(String testEmail){
		boolean exists = false;

		String qy = "SELECT * FROM user WHERE LOWER(email) LIKE '"+testEmail.toLowerCase()+"' LIMIT 1";
		try {
			rs = db.exQuery(qy);

			if ( rs.next() ) {
				if ( rs.getInt("id") > 0 ) {
					return true;
				}
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}

		return exists;

	}



}
