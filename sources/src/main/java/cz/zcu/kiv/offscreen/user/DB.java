package cz.zcu.kiv.offscreen.user;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;


import javax.servlet.ServletContext;

/**
 * Class Db is useful for comunication with mysql database.
 * 
 * @author Daniel Bureš
 *
 */

public class DB {
	private Connection conn = null;
	
	/**
	 * Constructor opens connection do database. Access data must be save in ServletContext as InitParameter( DbUrl, DbName, DbUser, DbPsw ).
	 * 
	 * 
	 */
	public DB(ServletContext context){	
		    
			try {
				Class.forName("com.mysql.jdbc.Driver");
				
				conn = (Connection) DriverManager.getConnection(context.getInitParameter("DbUrl") + context.getInitParameter("DbName")+"?user="+ context.getInitParameter("DbUser") +"&password="+ context.getInitParameter("DbPsw") + "&useUnicode=true&characterEncoding=UTF-8");				
				open();
			} catch (ClassNotFoundException e) {
				System.out.println("classnotfound exception");
				e.printStackTrace();
			} catch (SQLException e) {
				
				System.out.println("sql exception");
				e.printStackTrace();
			}
	}
	
	/**
	 * Method creates sql tables in database. And insert users: admin, user1, user2, user3
	 */
	public void open() throws SQLException{
		//conn = (Connection) DriverManager.getConnection(serverName +"?user="+ userName +"&password="+ password + "&useUnicode=true&characterEncoding=UTF-8");
		conn.setAutoCommit(true);
		Statement stat = conn.createStatement();
						
	}
	
	/**
	 * Method returns actual connection to database.
	 * 
	 * @return actual connection to database.
	 */
	public Connection getConn(){
		return conn;		
	}
	
	/**
	 * Method execute sql query. Sql query can be INSERT, DELETE, UPDATE
	 * @return count of affected rows
	 * */
	public int exStatement(String sql) {	
		Statement stat;
		
		try{
			stat = conn.createStatement();
			return stat.executeUpdate(sql);
		}catch(SQLException e){
			e.printStackTrace();
			return -1;
		}catch (NullPointerException e){
			e.printStackTrace();
			return -2;
		}	
		
	}
	
	/**
	 * Method execute sql query like SELECT and returns affected rows as resultSet or Null. 
	 * 
	 * @throws SQLException 
	 * @return ResultSet - data from database 
	 */
	public ResultSet exQuery(String sql){
		Statement stat;
		
		try{
			stat = conn.createStatement();
			stat.execute(sql);
			return stat.getResultSet();
		}catch(SQLException e){
			e.printStackTrace();
			return null;
		}catch (NullPointerException e){
			e.printStackTrace();
			return null;
		}			 
		
		
	}

}
