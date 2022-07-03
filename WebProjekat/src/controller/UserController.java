package controller;

import static spark.Spark.delete;
import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.put;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import beans.User;
import services.UserService;
import spark.Session;

public class UserController {
	
	private static Gson g = new GsonBuilder().registerTypeAdapter(LocalDate.class, new JsonDeserializer<LocalDate>() {
        @Override
        public LocalDate deserialize(JsonElement json, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
            return LocalDate.parse(json.getAsJsonPrimitive().getAsString());
        }
    }).registerTypeAdapter(LocalDate.class, new JsonSerializer<LocalDate>() {
    	@Override
    	public JsonElement serialize(LocalDate date, Type typeOfSrc, JsonSerializationContext context) {
	        return new JsonPrimitive(date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
	    }
    }).create();
	private static UserService userService = new UserService();
	
	public static void initializeController() {
		getUsers();
		getUser();
		getAvailableManagers();
		addUser();
		editUser();
		deleteUser();
		loginUser();
		getLoggedUser();
		logoutUser();
	}
	
	public static void getUsers() {
		get("rest/users/", (req, res) -> {
			res.type("application/json");
			return g.toJson(userService.getUsers());
		});
	}
	
	public static void getUser() {
		get("rest/users/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			return g.toJson(userService.getUser(id));
		});
	}
	
	public static void getAvailableManagers() {
		get("rest/managers/", (req, res) -> {
			res.type("application/json");
			return g.toJson(userService.getAvailableManagers());
		});
	}
	
	public static void addUser() {
		post("rest/users/add", (req, res) -> {
			res.type("application/json");
			User user = g.fromJson(req.body(), User.class);
			
			for (User u : userService.getUsers()) {
				if (u.getUsername().equals(user.getUsername())) {
					return "ERROR";
				}
			}
			userService.addUser(user);
			return g.toJson(user);
		});
	}
	
	public static void editUser() {
		put("rest/users/edit/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			User user = g.fromJson(req.body(), User.class);
			userService.editUser(id, user);
			return "SUCCESS";
		});
	}
	
	public static void deleteUser() {
		delete("rest/users/delete/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			userService.deleteUser(id);
			return "SUCCESS";
		});
	}
	
	public static void loginUser() {
		post("rest/users/login", (req, res) -> {
			res.type("application/json");
			User user = g.fromJson(req.body(), User.class);
			Session ss = req.session(true);
			User sessionUser = ss.attribute("user");
			if (sessionUser == null) {
				for (User u : userService.getUsers()) {
					if (u.getUsername().equals(user.getUsername()) && u.getPassword().equals(user.getPassword())) {
						ss.attribute("user", u);
						return g.toJson(u);
					}
				}
			}
			else if (sessionUser != null){
				return g.toJson(sessionUser);
			}
			return "ERROR";
		});
	}
	
	public static void getLoggedUser() {
		post("rest/users/getlogged", (req, res) -> {
			res.type("application/json");
			Session ss = req.session();
			User sessionUser = ss.attribute("user");
			if (sessionUser != null) {
				return g.toJson(sessionUser);
			}
			return "ERROR";
		});
	}
	
	public static void logoutUser() {
		post("rest/users/logout", (req, res) -> {
			res.type("application/json");
			Session ss = req.session();
			User user = ss.attribute("user");
			if (user != null) {
				ss.invalidate();
			}
			return true;
		});
	}
}
