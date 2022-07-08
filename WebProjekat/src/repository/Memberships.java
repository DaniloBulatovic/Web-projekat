package repository;

import java.io.FileWriter;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.SecureRandom;
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

import beans.Membership;

public class Memberships {
	
	private HashMap<String, Membership> memberships = new HashMap<String, Membership>();
	
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
	
	public Memberships(){
		try {
			readMemberships();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void readMemberships() throws Exception
    {
		String json = new String(Files.readAllBytes(Paths.get("./static/data/memberships.json")));
		Type type = new TypeToken<HashMap<String, Membership>>(){}.getType();
		memberships = g.fromJson(json, type);
    }
	
	public void writeMemberships(HashMap<String, Membership> memberships) throws Exception
    {
		FileWriter writer = new FileWriter("./static/data/memberships.json");
		g.toJson(memberships, writer);
		writer.flush();
		writer.close();
    }

	public Collection<Membership> getValues() {
		HashMap<String, Membership> filtered = new HashMap<String, Membership>(memberships);
		filtered.keySet().removeAll(memberships.entrySet().stream().filter(a->a.getValue().isDeleted()).map(e -> e.getKey()).collect(Collectors.toList()));
		return filtered.values();
	}

	public Membership getMembership(String id) {
		return memberships.get(id);
	}

	public void addMembership(Membership membership) {
		membership.setId(generateRandomString(10));
		memberships.put(membership.getId(), membership);
		try {
			writeMemberships(memberships);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void edit(String id, Membership membership) {
		memberships.put(id, membership);
		try {
			writeMemberships(memberships);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void delete(String id) {
		memberships.get(id).setDeleted(true);
		try {
			writeMemberships(memberships);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public static String generateRandomString(int length) {
        String CHAR_LOWER = "abcdefghijklmnopqrstuvwxyz";
        String CHAR_UPPER = CHAR_LOWER.toUpperCase();
        String NUMBER = "0123456789";

        String DATA_FOR_RANDOM_STRING = CHAR_LOWER + CHAR_UPPER + NUMBER;
        SecureRandom random = new SecureRandom();
    
        if (length < 1) throw new IllegalArgumentException();

        StringBuilder sb = new StringBuilder(length);
        
        for (int i = 0; i < length; i++) {
            int rndCharAt = random.nextInt(DATA_FOR_RANDOM_STRING.length());
            char rndChar = DATA_FOR_RANDOM_STRING.charAt(rndCharAt);

            sb.append(rndChar);
        }
        return sb.toString();
    }
}
