package cz.zcu.kiv.offscreen.api;

public enum AttributeDataType {
    NUMBER {
        @Override
        public String toString() {
            return "number";
        }
    },
    DATE {
        @Override
        public String toString() {
            return "date";
        }
    },
    ENUM {
        @Override
        public String toString() {
            return "enum";
        }
    },
    STRING {
        @Override
        public String toString() {
            return "string";
        }
    };

    public static AttributeDataType getEnum(String value){
        switch (value) {
            case "number": return AttributeDataType.NUMBER;
            case "date": return AttributeDataType.DATE;
            case "enum": return AttributeDataType.ENUM;
            default: return AttributeDataType.STRING;
        }
    }
}
