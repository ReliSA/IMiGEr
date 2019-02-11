package cz.zcu.kiv.offscreen.user;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.security.crypto.bcrypt.BCrypt;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Class User is used for creating, updating or loading user from database.
 *
 * @author Daniel Bureš
 *
 */
public class User {

	private static final Logger logger = LogManager.getLogger();

	private DB db = null;
	private int id = 0;

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
	}

	/**
	 * Method try to login user by his nick name and password. If login is OK then returns true else  returns false;
	 *
	 * @param nick users login name
	 * @param psw users password
	 * @return true - login ok
	 * 		   false - login failed
	 */
	public boolean login(String nick, String psw){
		String qy = "SELECT * FROM user WHERE nick LIKE ? AND active = '1' LIMIT 1";

		try{
			PreparedStatement pst = db.getPreparedStatement(qy, false);
			pst.setString(1, nick);
			ResultSet rs = db.executeQuery(pst);

			if ( rs != null && rs.next() ) {
				if(rs.getInt("id") > 0 && BCrypt.checkpw(psw, rs.getString("psw"))){
					this.id = rs.getInt("id");
					return true;
				}
			}
		} catch (SQLException | IllegalArgumentException e) {
			logger.error("Can not login user: ", e);
			throw new DataAccessException(e);
		}

		return false;
	}

	/**
	 * Method register new user to database. Id of user (variable id) must not be set.
	 * When register is success variable id is set.
	 *
	 * @param param Parameters which describing user. Keys must be: nick, name, password, session, email.
	 */
	public void register(Map<String, String> param){
		try {
			if ( this.id  == 0 ) {

				String qy = "INSERT INTO user (id, created, active, nick, name, psw, session, email) " +
						"VALUES ( ?, NOW(), ?, ?, ?, ?, ?, ?)";

				PreparedStatement pst = db.getPreparedStatement(qy, true);
				pst.setInt(1, 0);
				pst.setInt(2, 1);
				pst.setString(3, param.get("nick"));
				pst.setString(4, param.get("name"));
				pst.setString(5, BCrypt.hashpw(param.get("password"), BCrypt.gensalt()));
				pst.setString(6, param.get("session"));
				pst.setString(7, param.get("email"));

				ResultSet rs = db.executeUpdate(pst);

				if(rs != null && rs.next()){
					this.id = rs.getInt(1);
				}
			}

		} catch (SQLException e) {
			logger.error("Can not register user: ", e);
			throw new DataAccessException(e);
		}
	}

	/**
	 * Return all information about user from database stored in map. Keys of map are: id, nick, name, psw, session,
	 * active, created, email.
	 *
	 * @return created map or empty map.
	 */
	public Map<String, String> getUser(){
		String qy = "SELECT * FROM user WHERE id = '" + this.id + "'";
		try {
			ResultSet rs = db.executeQuery(qy);

			if ( rs != null && rs.next() ) {
				Map<String, String> params = new HashMap<>(8);
				params.put("id", rs.getString("id"));
				params.put("nick", rs.getString("nick"));
				params.put("name", rs.getString("name"));
				params.put("psw", rs.getString("psw"));
				params.put("session", rs.getString("session"));
				params.put("active", rs.getString("active"));
				params.put("created", rs.getString("created"));
				params.put("email", rs.getString("email"));

				return params;

			} else {
				this.id = 0;
			}
		} catch (SQLException e) {
			logger.error("Can not get user: ", e);
			throw new DataAccessException(e);
		}

		return Collections.emptyMap();
	}

	/**
	 * Returns id of user. Value 0 indicates not existing user.
	 *
	 * @return int with user id or 0.
	 */
	public int getId(){
		return id;
	}

	/**
	 * Method sets session for current user and save session to database.
	 */
	public void setSession(String session){
		if(id > 0){
			String qy = "UPDATE user SET session= ? WHERE id='" + this.id + "'";

			try {

				PreparedStatement pst = db.getPreparedStatement(qy, false);
				pst.setString(1, session);
				db.executeStatement(pst);

			} catch (SQLException e) {
				logger.error("Can not get user session: ", e);
				throw new DataAccessException(e);
			}
		}
	}

	/**
	 * Method saves parameters into database. Method can change only email, nick and active parameters.
	 * @param param - parameters to save
	 */
	public void update(Map<String, String> param) {
		if ( this.id  != 0 ) {
			try {
				String qy = "UPDATE user SET  email = ?, nick = ?, active = ? WHERE id = ?";

				PreparedStatement pst = db.getPreparedStatement(qy, false);
				pst.setString(1, param.get("email"));
				pst.setString(2, param.get("nick"));
				pst.setString(3, param.get("active"));
				pst.setInt(4, this.id);

				db.executeStatement(pst);
			} catch (SQLException e) {
				logger.error("Can not update user: ", e);
				throw new DataAccessException(e);
			}
		}
	}

	/**
	 * Returns nick of user or empty string when no user is loaded.
	 */
	public String getNick(){
		if (this.id != 0) {
			String qy = "SELECT nick FROM user WHERE id = '" + this.id + "'";
			ResultSet rs = db.executeQuery(qy);

			try{
				if (rs != null && rs.next()) {
					return rs.getString("nick");
				}
			}  catch (SQLException e){
				logger.error("Can not get users nick name: ", e);
				throw new DataAccessException(e);
			}
		}

		return "";
	}

	/**
	 * Method checks if exists user with input nick.
	 *
	 * @return true - nick already exists, false - otherwise
	 */
	public boolean isNickExists(String testNick){
		return isExists("nick", testNick);
	}

	/**
	 * Method checks if exists user with input e-mail.
	 *
	 * @return true - e-mail already exists, false otherwise
	 */
	public boolean isEmailExists(String testEmail){
		return isExists("email", testEmail);
	}

	/**
	 * Method checks if exists user whose attribute given by name exists with given value
	 *
	 * @return true - minimal one user exists, false - otherwise
	 */
	private boolean isExists(String name, String value){
		String qy = "SELECT * FROM user WHERE LOWER(" + name + ") LIKE ? LIMIT 1";

		try {
			PreparedStatement pst = db.getPreparedStatement(qy, false);
			pst.setString(1, value.toLowerCase());
			ResultSet rs = db.executeQuery(pst);

			if ( rs != null && rs.next() && rs.getInt("id") > 0) {
				return true;
			}
		} catch (SQLException e) {
			logger.error("Can not check if user exits: ", e);
			throw new DataAccessException(e);
		}

		return false;
	}
}
