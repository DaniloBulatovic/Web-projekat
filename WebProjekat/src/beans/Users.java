package beans;

import java.io.FileWriter;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.HashMap;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

public class Users {
	
	private HashMap<String, User> users = new HashMap<String, User>();
	
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
		users = new Gson().fromJson(json, type);
    }
	
	public void writeUsers(HashMap<String, User> users) throws Exception
    {
		Gson g = new GsonBuilder().setPrettyPrinting().create();
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
