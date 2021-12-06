package cz.zcu.kiv.offscreen.user.dao;

import cz.zcu.kiv.offscreen.user.DataAccessException;
import cz.zcu.kiv.offscreen.user.MyBatisUtil;
import cz.zcu.kiv.offscreen.user.mapper.IDiagramMapper;
import org.apache.ibatis.session.SqlSession;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DiagramDAO {

    public Map<String, Object> getDiagram(int userId){

        try (SqlSession session = MyBatisUtil.getSqlSessionFactory().openSession()) {

            IDiagramMapper mapper = session.getMapper(IDiagramMapper.class);
            return mapper.getDiagram(userId);

        } catch (Exception e) {
            throw new DataAccessException(e);
        }
    }

    public List<Map<String, Object>> getDiagramsByUserId(int userId){
        try (SqlSession session = MyBatisUtil.getSqlSessionFactory().openSession()) {
            IDiagramMapper mapper = session.getMapper(IDiagramMapper.class);

            return mapper.getDiagramsByUserId(userId);

        } catch (Exception e) {
            throw new DataAccessException(e);
        }
    }


    public List<Map<String, Object>> getPublicDiagrams(){
        try (SqlSession session = MyBatisUtil.getSqlSessionFactory().openSession()) {
            IDiagramMapper mapper = session.getMapper(IDiagramMapper.class);

            return mapper.getPublicDiagrams();

        } catch (Exception e) {
            throw new DataAccessException(e);
        }
    }

    public void deleteDiagram(int diagramId){
        try (SqlSession session = MyBatisUtil.getSqlSessionFactory().openSession()) {
            IDiagramMapper mapper = session.getMapper(IDiagramMapper.class);

            mapper.deleteDiagram(diagramId);
            session.commit();

        } catch (Exception e) {
            throw new DataAccessException(e);
        }
    }

    public int getDiagramUserId(int diagramId){
        try (SqlSession session = MyBatisUtil.getSqlSessionFactory().openSession()) {
            IDiagramMapper mapper = session.getMapper(IDiagramMapper.class);

            return mapper.getDiagramUserId(diagramId);

        } catch (Exception e) {
            throw new DataAccessException(e);
        }
    }

    public int createDiagram(String name, String userId, String isPublic, String graphJson) {
        try (SqlSession session = MyBatisUtil.getSqlSessionFactory().openSession()) {
            IDiagramMapper mapper = session.getMapper(IDiagramMapper.class);

            Map<String, Object> id = new HashMap<>();
            id.put("id", 0);

            mapper.createDiagram(id, name, userId, isPublic, graphJson);
            session.commit();

            return (int)id.get("id");

        } catch (Exception e) {
            throw new DataAccessException(e);
        }
    }

    public void updateDiagram(int diagramId, String name, String isPublic, String graphJson){
        try (SqlSession session = MyBatisUtil.getSqlSessionFactory().openSession()) {
            IDiagramMapper mapper = session.getMapper(IDiagramMapper.class);

            mapper.updateDiagram(diagramId, name, isPublic, graphJson);
            session.commit();

        } catch (Exception e) {
            throw new DataAccessException(e);
        }
    }

}
