package cz.zcu.kiv.offscreen.user.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.Map;

public interface IUserMapper {

    @Select("SELECT * FROM user WHERE nick LIKE #{nick} AND active = '1' LIMIT 1")
    Map<String, Object> getUserByNick(String nick);

    @Select("SELECT * FROM user WHERE email LIKE #{email} AND active = '1' LIMIT 1")
    Map<String, Object> getUserByEmail(String email);

    @Insert("INSERT INTO user (id, created, active, nick, name, psw, session, email) " +
            "VALUES ( 0, NOW(), 1, #{nick}, #{name}, #{password}, #{session}, #{email})")
    void createUser(
            @Param("nick") String nick,
            @Param("name") String name,
            @Param("password") String password,
            @Param("session") String session,
            @Param("email") String email);
}
