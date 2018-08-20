//package cz.zcu.kiv.offscreen.efp.utils;
//
//import java.lang.reflect.Type;
//import java.util.HashMap;
//import java.util.Map;
//
//import org.apache.log4j.Logger;
//
//import com.google.gson.Gson;
//import com.google.gson.GsonBuilder;
//import com.google.gson.JsonDeserializationContext;
//import com.google.gson.JsonDeserializer;
//import com.google.gson.JsonElement;
//import com.google.gson.JsonObject;
//
//import cz.zcu.kiv.efps.types.datatypes.EfpValueType;
//import cz.zcu.kiv.efps.types.serialisation.json.EfpValueTypeAdapter;
//import cz.zcu.kiv.offscreen.data.efpportal.CocaexData;
//import cz.zcu.kiv.offscreen.data.efpportal.CocaexWrapper;
//
///**
// *
// * CocaexWrapper class deserializer.
// *
// * @author Jiri Loudil
// *
// */
//public class WrapperDeserializer implements JsonDeserializer<CocaexWrapper> {
//	private Logger logger = Logger.getLogger(WrapperDeserializer.class);
//
//	@Override
//	public CocaexWrapper deserialize(JsonElement json, Type typeOfT,
//			JsonDeserializationContext context) {
//		logger.trace("ENTRY");
//
//		GsonBuilder gsonBuilder = new GsonBuilder();
//		// JSON deserializing adapter provided for EFP type classes
//		gsonBuilder.registerTypeAdapter(EfpValueType.class,
//				new EfpValueTypeAdapter());
//		Gson gson = gsonBuilder.create();
//
//		CocaexWrapper wrapper = gson.fromJson(json, CocaexWrapper.class);
//		JsonObject jo = json.getAsJsonObject();
//
//		Map<String, String> featureMappings = new HashMap<String, String>();
//		Map<String, String> efpMappings = new HashMap<String, String>();
//		Map<String, CocaexData> data = new HashMap<String, CocaexData>();
//
//		// parse feature mappings
//		JsonObject featuresObject = jo.getAsJsonObject("featureMappings");
//		for (Map.Entry<String, JsonElement> entry : featuresObject.entrySet()) {
//			featureMappings.put(entry.getKey(), entry.getValue().getAsString());
//		}
//
//		// parse efps mappings
//		JsonObject efpsObject = jo.getAsJsonObject("efpMappings");
//		for (Map.Entry<String, JsonElement> entry : efpsObject.entrySet()) {
//			efpMappings.put(entry.getKey(), entry.getValue().getAsString());
//		}
//
//		// parse data
//		JsonObject dataObject = jo.getAsJsonObject("data");
//		for (Map.Entry<String, JsonElement> entry : dataObject.entrySet()) {
//			data.put(entry.getKey(), (CocaexData) context.deserialize(
//					entry.getValue(), CocaexData.class));
//		}
//
//		// fill output structure
//		wrapper.setFeatureMappings(featureMappings);
//		wrapper.setEfpMappings(efpMappings);
//		wrapper.setData(data);
//		logger.trace("EXIT");
//
//		return wrapper;
//	}
//}
