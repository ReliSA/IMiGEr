package cz.zcu.kiv.offscreen.efp.utils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.zip.GZIPInputStream;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

import net.sf.json.JSONObject;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import cz.zcu.kiv.efps.types.datatypes.EfpValueType;
import cz.zcu.kiv.efps.types.serialisation.json.EfpValueTypeAdapter;
import cz.zcu.kiv.offscreen.api.GraphInterface;
import cz.zcu.kiv.offscreen.data.efpportal.CocaexWrapper;
import cz.zcu.kiv.offscreen.graph.GraphExport;
import cz.zcu.kiv.offscreen.graph.creator.EfpGraphTransfomer;

/**
 * 
 * Transofma and decompress tools for incoming JSON.
 * 
 * @author Jiri Loudil
 *
 */
public class JsonTransformer {
	private Logger logger = Logger.getLogger(JsonTransformer.class);

	/**
	 * 
	 * Deserialize input JSON and transform to graph JSON.
	 * 
	 * @param inputJSON
	 * @param request
	 * @return
	 * @throws IOException
	 */
	public String transformInputJSONToGraphJSON(String inputJSON,
			HttpServletRequest request) throws IOException {
		CocaexWrapper efpResults;

		GsonBuilder gsonBuilder = new GsonBuilder();
		// JSON deserializing adapter provided for EFP type classes
		gsonBuilder.registerTypeAdapter(EfpValueType.class,
				new EfpValueTypeAdapter());
		// JSON deserializing adapter for the Wrapper class
		gsonBuilder.registerTypeAdapter(CocaexWrapper.class,
				new WrapperDeserializer());
		Gson gson = gsonBuilder.create();

		// decode + unzip received data
		String data = decompress(inputJSON);

		// deserialize using deserializer adapters
		efpResults = gson.fromJson(data, CocaexWrapper.class);

		request.setAttribute("efpPortalEfpNames", efpResults.getEfpMappings());

		// transform received data to readable graph form
		EfpGraphTransfomer transformer = new EfpGraphTransfomer(efpResults);
		GraphInterface graph = transformer.transform();
		GraphExport export = new GraphExport(graph);

		// transform graph to JSON
		JSONObject o = JSONObject.fromObject(export);

		return o.toString();
	}

	/**
	 * Decode and unzip a Base64 encoded GZIPed string.
	 * 
	 * @param input
	 * @return
	 * @throws IOException
	 */
	private String decompress(String input) throws IOException {
		logger.trace("ENTRY");
		String result = null;

		byte[] bytes = Base64.decodeBase64(input);
		GZIPInputStream zi = null;
		try {
			zi = new GZIPInputStream(new ByteArrayInputStream(bytes));
			result = IOUtils.toString(zi);
		} finally {
			IOUtils.closeQuietly(zi);
		}
		logger.trace("EXIT");

		return result;
	}

}
