package cz.zcu.kiv.offscreen.user;

import java.sql.*;


import javax.servlet.ServletContext;

/**
 * Class Db is useful for communication with mysql database.
 * 
 * @author Daniel Bureš
 *
 */

public class DB {
	private Connection conn = null;
	
	/**
	 * Constructor opens connection do database. Access data must be save in ServletContext as InitParameter( DbUrl, DbName, DbUser, DbPsw ).
	 */
	public DB(ServletContext context){	
		    
			try {
				Class.forName("com.mysql.jdbc.Driver");

				String dbUrl = context.getInitParameter("DbUrl");
				String dbName = context.getInitParameter("DbName");
				String dbUser = context.getInitParameter("DbUser");
				String dbPsw = context.getInitParameter("DbPsw");

				conn = DriverManager.getConnection(dbUrl + dbName + "?user=" + dbUser + "&password=" + dbPsw + "&useUnicode=true&characterEncoding=UTF-8");
				conn.setAutoCommit(true);
			} catch (ClassNotFoundException | SQLException e) {
				e.printStackTrace();
			}
	}

	/**
	 * Method return prepared statement for inserting of values

	 * @param query query with ? on values.
	 * @param returnGeneratedKeys true - RETURN_GENERATED_KEYS flag is set, false - no flag is set
	 */
	PreparedStatement getPreparedStatement(String query, boolean returnGeneratedKeys) throws SQLException {
		if(returnGeneratedKeys)
			return conn.prepareStatement(query, PreparedStatement.RETURN_GENERATED_KEYS);
		else
			return conn.prepareStatement(query);
	}

	/**
	 * Method execute sql query like SELECT created with prepared statement and returns affected rows as resultSet or null.
	 *
	 * @param preparedStatement prepared statement with query and set all parameters.
	 * @return ResultSet - data from database.
	 */
	ResultSet executeQuery(PreparedStatement preparedStatement){
		try {
			preparedStatement.execute();
			return preparedStatement.getResultSet();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * Method execute update or insert sql query created with prepared statement and return resultSet of generated keys or null.
	 * @param preparedStatement prepared statement with query and set all parameters.
	 * @return ResultSet - generated keys or null.
	 */
	ResultSet executeUpdate(PreparedStatement preparedStatement){
		try {
			preparedStatement.executeUpdate();
			return preparedStatement.getGeneratedKeys();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * Method execute sql query like SELECT and returns affected rows as resultSet or null.
	 * @param sql - completed sql query
	 * @return ResultSet - data from database
	 */
	ResultSet executeQuery(String sql){
		try{
			Statement stat = conn.createStatement();
			stat.execute(sql);
			return stat.getResultSet();

		}catch(SQLException | NullPointerException e){
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * Method execute prepared sql query. Sql query can be INSERT, DELETE, UPDATE
	 *
	 * @return count of affected rows or -1 on SQLException and -2 on NullPointerException
	 * */
	int executeStatement(PreparedStatement preparedStatement) {

		try{
			return preparedStatement.executeUpdate();
		}catch(SQLException e){
			e.printStackTrace();
			return -1;
		}catch (NullPointerException e){
			e.printStackTrace();
			return -2;
		}
	}


	/**
	 * Method execute sql query. Sql query can be INSERT, DELETE, UPDATE
	 *
	 * @return count of affected rows or -1 on SQLException and -2 on NullPointerException
	 * */
	int executeStatement(String sql) {

		try{
			Statement stat = conn.createStatement();
			return stat.executeUpdate(sql);
		}catch(SQLException e){
			e.printStackTrace();
			return -1;
		}catch (NullPointerException e){
			e.printStackTrace();
			return -2;
		}
	}

}
