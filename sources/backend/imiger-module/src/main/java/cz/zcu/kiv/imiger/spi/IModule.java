package cz.zcu.kiv.imiger.spi;

import java.util.regex.Pattern;

/**
 * Service Provider Interface (SPI) that must be implemented by all modules.
 */
public interface IModule {
    /**
     * @return Display name of the module.
     */
    String getModuleName();

    /**
     * Returns diagram file name pattern.
     *
     * @return pattern
     */
    Pattern getFileNamePattern();

    /**
     * Converts input string in any format to raw JSON processable by IMiGEr.
     *
     * @param stringToConvert String to be converted to raw JSON.
     * @return Raw JSON.
     */
    String getRawJson(String stringToConvert);
}