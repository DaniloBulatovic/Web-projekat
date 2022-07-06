package controller;

import static spark.Spark.delete;
import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.put;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.LocalDateTime;
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

import beans.Membership;
import services.MembershipService;

public class MembershipController {
	
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
	private static MembershipService membershipService = new MembershipService();
	
	public static void initializeController() {
		getMemberships();
		getMembership();
		addMembership();
		editMembership();
		deleteMembership();
	}
	
	public static void getMemberships() {
		get("rest/memberships/", (req, res) -> {
			res.type("application/json");
			return g.toJson(membershipService.getMemberships());
		});
	}
	
	public static void getMembership() {
		get("rest/memberships/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			return g.toJson(membershipService.getMembership(id));
		});
	}
	
	public static void addMembership() {
		post("rest/memberships/add", (req, res) -> {
			res.type("application/json");
			Membership membership = g.fromJson(req.body(), Membership.class);
			membershipService.addMembership(membership);
			return "SUCCESS";
		});
	}
	
	public static void editMembership() {
		put("rest/memberships/edit/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			Membership membership = g.fromJson(req.body(), Membership.class);
			membershipService.editMembership(id, membership);
			return "SUCCESS";
		});
	}
	
	public static void deleteMembership() {
		delete("rest/memberships/delete/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			membershipService.deleteMembership(id);
			return "SUCCESS";
		});
	}
}
