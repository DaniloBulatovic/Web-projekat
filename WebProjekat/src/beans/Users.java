package beans;

import java.io.FileWriter;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.HashMap;

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
	
	private Gson g = new GsonBuilder().registerTypeAdapter(LocalDate.class, new JsonDeserializer<LocalDate>() {
		@Override
        public LocalDate deserialize(JsonElement json, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
            return LocalDate.parse(json.getAsJsonPrimitive().getAsString());
        }
    }).registerTypeAdapter(LocalDate.class, new JsonSerializer<LocalDate>() {
    	@Override
    	public JsonElement serialize(LocalDate date, Type typeOfSrc, JsonSerializationContext context) {
	        return new JsonPrimitive(date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
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
		return users.values();
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
		users.remove(id);
		try {
			writeUsers(users);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
