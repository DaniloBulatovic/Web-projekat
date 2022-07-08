package repository;

import java.io.FileWriter;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.HashMap;
import java.util.stream.Collectors;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;
import com.google.gson.reflect.TypeToken;

import beans.PromoCode;

public class PromoCodes {
	
	private HashMap<String, PromoCode> promoCodes = new HashMap<String, PromoCode>();
	
	private static Gson g = new GsonBuilder().registerTypeAdapter(LocalDateTime.class, new JsonDeserializer<LocalDateTime>() {
        @Override
        public LocalDateTime deserialize(JsonElement json, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
            return LocalDateTime.parse(json.getAsJsonPrimitive().getAsString());
        }
    }).registerTypeAdapter(LocalDateTime.class, new JsonSerializer<LocalDateTime>() {
    	@Override
    	public JsonElement serialize(LocalDateTime date, Type typeOfSrc, JsonSerializationContext context) {
	        return new JsonPrimitive(date.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
	    }
    }).setPrettyPrinting().create();
	
	public PromoCodes(){
		try {
			readPromoCodes();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void readPromoCodes() throws Exception
    {
		String json = new String(Files.readAllBytes(Paths.get("./static/data/promoCodes.json")));
		Type type = new TypeToken<HashMap<String, PromoCode>>(){}.getType();
		promoCodes = g.fromJson(json, type);
    }
	
	public void writePromoCodes(HashMap<String, PromoCode> promoCodes) throws Exception
    {
		FileWriter writer = new FileWriter("./static/data/promoCodes.json");
		g.toJson(promoCodes, writer);
		writer.flush();
		writer.close();
    }

	public Collection<PromoCode> getValues() {
		HashMap<String, PromoCode> filtered = new HashMap<String, PromoCode>(promoCodes);
		filtered.keySet().removeAll(promoCodes.entrySet().stream().filter(a->a.getValue().isDeleted()).map(e -> e.getKey()).collect(Collectors.toList()));
		return filtered.values();
	}

	public PromoCode getPromoCode(String id) {
		return promoCodes.get(id);
	}

	public void addPromoCode(PromoCode promoCode) {
		Integer maxId = -1;
		for (String id : promoCodes.keySet()) {
			int idNum = Integer.parseInt(id);
			if (idNum > maxId) {
				maxId = idNum;
			}
		}
		maxId++;
		promoCode.setId(maxId.toString());
		promoCodes.put(promoCode.getId(), promoCode);
		try {
			writePromoCodes(promoCodes);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void edit(String id, PromoCode promoCode) {
		promoCodes.put(id, promoCode);
		try {
			writePromoCodes(promoCodes);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void delete(String id) {
		promoCodes.get(id).setDeleted(true);
		try {
			writePromoCodes(promoCodes);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
