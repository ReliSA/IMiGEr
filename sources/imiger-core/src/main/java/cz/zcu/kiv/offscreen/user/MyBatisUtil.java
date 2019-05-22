package cz.zcu.kiv.offscreen.user;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Properties;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.jdbc.ScriptRunner;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

public class MyBatisUtil {
    private static final String CONFIGURATION = "mybatis-config.xml";
    private static final String DB_INIT_SCRIPT = "create_table.sql";

    private static final String PROPERTY_INIT_DB = "INIT_DB";
    private static final String PROPERTY_JDBC_DATABASE_URL = "JDBC_DATABASE_URL";
    private static final String PROPERTY_JDBC_DATABASE_USERNAME = "JDBC_DATABASE_USERNAME";
    private static final String PROPERTY_JDBC_DATABASE_PASSWORD = "JDBC_DATABASE_PASSWORD";

    private static SqlSessionFactory sqlSessionFactory;

    public static SqlSessionFactory getSqlSessionFactory() {
        if (sqlSessionFactory == null) {
            try {
                sqlSessionFactory = createFactory();
                if (Boolean.parseBoolean(System.getenv(PROPERTY_INIT_DB))) {
                    initDatabase(sqlSessionFactory);
                }
            } catch (Exception e) {
                throw new DataAccessException(e);
            }
        }
        return sqlSessionFactory;
    }

    private static SqlSessionFactory createFactory() throws IOException {
        Properties properties = new Properties();
        properties.setProperty(PROPERTY_JDBC_DATABASE_URL, System.getenv(PROPERTY_JDBC_DATABASE_URL));
        properties.setProperty(PROPERTY_JDBC_DATABASE_USERNAME, System.getenv(PROPERTY_JDBC_DATABASE_USERNAME));
        properties.setProperty(PROPERTY_JDBC_DATABASE_PASSWORD, System.getenv(PROPERTY_JDBC_DATABASE_PASSWORD));

        InputStream inputStream = Resources.getResourceAsStream(CONFIGURATION);
        return new SqlSessionFactoryBuilder().build(inputStream, properties);
    }

    private static void initDatabase(SqlSessionFactory sqlSessionFactory) {
        try (SqlSession session = sqlSessionFactory.openSession()) {
            InputStream inputStream = Resources.getResourceAsStream(DB_INIT_SCRIPT);
            InputStreamReader reader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);

            ScriptRunner sr = new ScriptRunner(session.getConnection());
            sr.runScript(reader);

            session.commit();
        } catch (Exception e) {
            throw new DataAccessException(e);
        }
    }
}