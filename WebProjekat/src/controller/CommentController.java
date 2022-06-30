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

import beans.Comment;
import services.CommentService;

public class CommentController {
	
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
	private static CommentService commentService = new CommentService();
	
	public static void initializeController() {
		getComments();
		getComment();
		getCommentsByVenue();
		addComment();
		editComment();
		deleteComment();
	}
	
	public static void getComments() {
		get("rest/comments/", (req, res) -> {
			res.type("application/json");
			return g.toJson(commentService.getComments());
		});
	}
	
	public static void getComment() {
		get("rest/comments/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			return g.toJson(commentService.getComment(id));
		});
	}
	
	public static void getCommentsByVenue() {
		get("rest/comments/venue/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			return g.toJson(commentService.getCommentsByVenue(id));
		});
	}
	
	public static void addComment() {
		post("rest/comments/add", (req, res) -> {
			res.type("application/json");
			Comment comment = g.fromJson(req.body(), Comment.class);
			commentService.addComment(comment);
			return "SUCCESS";
		});
	}
	
	public static void editComment() {
		put("rest/comments/edit/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			Comment comment = g.fromJson(req.body(), Comment.class);
			commentService.editComment(id, comment);
			return "SUCCESS";
		});
	}
	
	public static void deleteComment() {
		delete("rest/comments/delete/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			commentService.deleteComment(id);
			return "SUCCESS";
		});
	}
}
