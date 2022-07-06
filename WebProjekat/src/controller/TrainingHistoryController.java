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

import beans.TrainingHistory;
import services.TrainingHistoryService;

public class TrainingHistoryController {
	
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
    }).registerTypeAdapter(LocalDate.class, new JsonDeserializer<LocalDate>() {
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
	private static TrainingHistoryService trainingHistoryService = new TrainingHistoryService();
	
	public static void initializeController() {
		getTrainingsHistory();
		getTrainingHistory();
		getTrainingsHistoryByCustomer();
		getTrainingsHistoryByTrainer();
		getTrainingsHistoryByVenue();
		addTrainingHistory();
		editTrainingHistory();
		deleteTrainingHistory();
	}
	
	public static void getTrainingsHistory() {
		get("rest/trainingsHistory/", (req, res) -> {
			res.type("application/json");
			return g.toJson(trainingHistoryService.getTrainingsHistory());
		});
	}
	
	public static void getTrainingHistory() {
		get("rest/trainingsHistory/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			return g.toJson(trainingHistoryService.getTrainingHistory(id));
		});
	}
	
	public static void getTrainingsHistoryByCustomer() {
		get("rest/trainingsHistory/customer/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			return g.toJson(trainingHistoryService.getTrainingsHistoryByCustomer(id));
		});
	}
	
	public static void getTrainingsHistoryByTrainer() {
		get("rest/trainingsHistory/trainer/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			return g.toJson(trainingHistoryService.getTrainingsHistoryByTrainer(id));
		});
	}
	
	public static void getTrainingsHistoryByVenue() {
		get("rest/trainingsHistory/venue/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			return g.toJson(trainingHistoryService.getTrainingsHistoryByVenue(id));
		});
	}
	
	public static void addTrainingHistory() {
		post("rest/trainingsHistory/add", (req, res) -> {
			res.type("application/json");
			TrainingHistory trainingHistory = g.fromJson(req.body(), TrainingHistory.class);
			trainingHistoryService.addTrainingHistory(trainingHistory);
			return "SUCCESS";
		});
	}
	
	public static void editTrainingHistory() {
		put("rest/trainingsHistory/edit/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			TrainingHistory trainingHistory = g.fromJson(req.body(), TrainingHistory.class);
			trainingHistoryService.editTrainingHistory(id, trainingHistory);
			return "SUCCESS";
		});
	}
	
	public static void deleteTrainingHistory() {
		delete("rest/trainingsHistory/delete/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			trainingHistoryService.deleteTrainingHistory(id);
			return "SUCCESS";
		});
	}
}
