package cz.zcu.kiv.offscreen.user.mapper;

import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

public interface IDiagramMapper {

    @Select("SELECT * FROM diagram WHERE id = #{id}")
    Map<String, Object> getDiagram(int id);

    @Select("SELECT id, name, created, last_update, user_id, public FROM diagram " +
            "WHERE user_id = #{userId} ORDER BY created DESC")
    List<Map<String, Object>> getDiagramsByUserId(int userId);

    @Select("SELECT id, name, created, last_update, user_id, public FROM diagram " +
            "WHERE public = 1 ORDER BY name ASC")
    List<Map<String, Object>> getPublicDiagrams();

    @Select("SELECT user_id FROM diagram WHERE id = #{id}")
    int getDiagramUserId(int id);

    @Delete("DELETE FROM diagram WHERE id = #{id}")
    void deleteDiagram(int id);

    @Insert("INSERT INTO diagram (name, created, last_update, user_id, public, graph_json) " +
            "VALUES (#{name}, NOW(), NOW(), #{userId}, #{isPublic}, #{graphJson}) ")
    @Options(useGeneratedKeys=true, keyColumn = "id", keyProperty="map.id")
    void createDiagram(
            @Param("map") Map<String, Object> map,
            @Param("name") String name,
            @Param("userId") String userId,
            @Param("isPublic") String isPublic,
            @Param("graphJson") String graphJson);

    @Update("UPDATE diagram SET name=#{name}, public=#{isPublic}, graph_json=#{graphJson}, last_update=NOW() " +
            "WHERE id=#{diagramId}")
    void updateDiagram(
            @Param("diagramId") int diagramId,
            @Param("name") String name,
            @Param("isPublic") String isPublic,
            @Param("graphJson") String graphJson);
}
