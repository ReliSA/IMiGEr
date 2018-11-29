package cz.zcu.kiv.offscreen.user;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletContext;
import java.sql.*;

/**
 * Class Db is useful for communication with mysql database.
 * 
 * @author Daniel Bureš
 *
 */

public class DB {

	private static final Logger logger = LogManager.getLogger();
	private Connection connection;
	
	/**
	 * Constructor opens connection do database. Access credentials must be stored in ServletContext as InitParameter.
	 */
	public DB(ServletContext context) {
		String driverClassName = context.getInitParameter("jdbc.driverClassName");
		String url = context.getInitParameter("jdbc.url");
		String username = context.getInitParameter("jdbc.username");
		String password = context.getInitParameter("jdbc.password");

		try {
			Class.forName(driverClassName);
			connection = DriverManager.getConnection(url, username, password);
			connection.setAutoCommit(true);
		} catch (ClassNotFoundException | SQLException e) {
			logger.error("Can not open database connection: ", e);
		}
	}

	/**
	 * Method return prepared statement for inserting of values

	 * @param query query with ? on values.
	 * @param returnGeneratedKeys true - RETURN_GENERATED_KEYS flag is set, false - no flag is set
	 */
	PreparedStatement getPreparedStatement(String query, boolean returnGeneratedKeys) throws SQLException {
		if (returnGeneratedKeys) {
			return connection.prepareStatement(query, PreparedStatement.RETURN_GENERATED_KEYS);
		} else {
			return connection.prepareStatement(query);
		}
	}

	/**
	 * Method execute sql query like SELECT created with prepared statement and returns affected rows as resultSet or null.
	 *
	 * @param preparedStatement prepared statement with query and set all parameters.
	 * @return ResultSet - data from database.
	 */
	ResultSet executeQuery(PreparedStatement preparedStatement) {
		try {
			preparedStatement.execute();
			return preparedStatement.getResultSet();
		} catch (SQLException e) {
			logger.error("Can not execute database query: ", e);
		}
		return null;
	}

	/**
	 * Method execute update or insert sql query created with prepared statement and return resultSet of generated keys or null.
	 * @param preparedStatement prepared statement with query and set all parameters.
	 * @return ResultSet - generated keys or null.
	 */
	ResultSet executeUpdate(PreparedStatement preparedStatement) {
		try {
			preparedStatement.executeUpdate();
			return preparedStatement.getGeneratedKeys();
		} catch (SQLException e) {
			logger.error("Can not execute database query: ", e);
		}
		return null;
	}

	/**
	 * Method execute sql query like SELECT and returns affected rows as resultSet or null.
	 * @param sql - completed sql query
	 * @return ResultSet - data from database
	 */
	ResultSet executeQuery(String sql) {
		try {
			Statement stat = connection.createStatement();
			stat.execute(sql);
			return stat.getResultSet();

		} catch(SQLException | NullPointerException e) {
			logger.error("Can not execute database query: ", e);
		}
		return null;
	}

	/**
	 * Method execute prepared sql query. Sql query can be INSERT, DELETE, UPDATE
	 *
	 * @return count of affected rows or -1 on SQLException and -2 on NullPointerException
	 * */
	int executeStatement(PreparedStatement preparedStatement) {
		try {
			return preparedStatement.executeUpdate();
		} catch(SQLException e) {
			logger.error("Can not execute database query: ", e);
			return -1;
		} catch (NullPointerException e) {
			logger.error("Can not execute database query: ", e);
			return -2;
		}
	}

}
