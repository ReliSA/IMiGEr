package cz.zcu.kiv.offscreen.user.dao;

import cz.zcu.kiv.offscreen.user.DataAccessException;
import cz.zcu.kiv.offscreen.user.MyBatisUtil;
import cz.zcu.kiv.offscreen.user.mapper.IUserMapper;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.springframework.security.crypto.bcrypt.BCrypt;

import java.util.Map;

public class UserDAO {

    public Map<String, Object> login(String nick, String psw){
        try (SqlSession session = MyBatisUtil.getSqlSessionFactory().openSession()) {
            IUserMapper mapper = session.getMapper(IUserMapper.class);
            Map<String, Object> user = mapper.getUserByNick(nick);

            if(user != null &&
                    !user.isEmpty() &&
                    (Integer)user.get("id") > 0 &&
                    StringUtils.isNotBlank((String)user.get("psw")) &&
                    BCrypt.checkpw(psw, (String)user.get("psw"))) {
                return user;
            }

            return null;

        } catch (Exception e) {
            throw new DataAccessException(e);
        }
    }

    public void register(String nick, String name, String password, String session, String email){
        try (SqlSession sqlSession = MyBatisUtil.getSqlSessionFactory().openSession()) {
            IUserMapper mapper = sqlSession.getMapper(IUserMapper.class);

            String hashPassword = BCrypt.hashpw(password, BCrypt.gensalt());
            mapper.createUser(nick, name, hashPassword, session, email);
            sqlSession.commit();

        } catch (Exception e) {
            throw new DataAccessException(e);
        }
    }

    public boolean isEmailExists(String email){
        try (SqlSession session = MyBatisUtil.getSqlSessionFactory().openSession()) {
            IUserMapper mapper = session.getMapper(IUserMapper.class);
            Map<String, Object> user = mapper.getUserByEmail(email);

            return user != null && !user.isEmpty();

        } catch (Exception e) {
            throw new DataAccessException(e);
        }
    }

    public boolean isNickExists(String nick){
        try (SqlSession session = MyBatisUtil.getSqlSessionFactory().openSession()) {
            IUserMapper mapper = session.getMapper(IUserMapper.class);
            Map<String, Object> user = mapper.getUserByNick(nick);

            return user != null && !user.isEmpty();

        } catch (Exception e) {
            throw new DataAccessException(e);
        }
    }
}
