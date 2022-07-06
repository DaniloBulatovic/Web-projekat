package beans;

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

public class Users {
	
	private HashMap<String, User> users = new HashMap<String, User>();
	
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
	
	public Users(){
		try {
			readUsers();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void readUsers() throws Exception
    {
		String json = new String(Files.readAllBytes(Paths.get("./static/data/users.json")));
		Type type = new TypeToken<HashMap<String, User>>(){}.getType();
		users = g.fromJson(json, type);
    }
	
	public void writeUsers(HashMap<String, User> users) throws Exception
    {
		FileWriter writer = new FileWriter("./static/data/users.json");
		g.toJson(users, writer);
		writer.flush();
		writer.close();
    }

	public Collection<User> getValues() {
		HashMap<String, User> filtered = new HashMap<String, User>(users);
		filtered.keySet().removeAll(users.entrySet().stream().filter(a->a.getValue().isDeleted()).map(e -> e.getKey()).collect(Collectors.toList()));
		return filtered.values();
	}

	public User getUser(String id) {
		return users.get(id);
	}

	public void addUser(User user) {
		Integer maxId = -1;
		for (String id : users.keySet()) {
			int idNum = Integer.parseInt(id);
			if (idNum > maxId) {
				maxId = idNum;
			}
		}
		maxId++;
		user.setId(maxId.toString());
		users.put(user.getId(), user);
		try {
			writeUsers(users);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void edit(String id, User user) {
		users.put(id, user);
		try {
			writeUsers(users);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void delete(String id) {
		users.get(id).setDeleted(true);
		try {
			writeUsers(users);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
