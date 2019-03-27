package cz.zcu.kiv.imiger.plugin.dot;

import cz.zcu.kiv.imiger.spi.IModule;

public class DOT implements IModule {
    @Override
    public String getModuleName() {
        return "DOT file";
    }

    @Override
    public String getRawJson(String stringToConvert) {
        return null;
    }
}
