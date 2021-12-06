package cz.zcu.kiv.offscreen.vo;

import java.io.Serializable;

public class UserVO implements Serializable {
    private int id;
    private String username;

    public UserVO() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
