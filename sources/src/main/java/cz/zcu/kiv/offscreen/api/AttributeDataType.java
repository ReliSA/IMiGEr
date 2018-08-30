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
    }
}
