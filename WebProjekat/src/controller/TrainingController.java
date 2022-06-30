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

import beans.Training;
import services.TrainingService;

public class TrainingController {
	
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
	private static TrainingService trainingService = new TrainingService();
	
	public static void initializeController() {
		getTrainings();
		getTraining();
		getTrainingsByVenue();
		addTraining();
		editTraining();
		deleteTraining();
	}
	
	public static void getTrainings() {
		get("rest/trainings/", (req, res) -> {
			res.type("application/json");
			return g.toJson(trainingService.getTrainings());
		});
	}
	
	public static void getTraining() {
		get("rest/trainings/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			return g.toJson(trainingService.getTraining(id));
		});
	}
	
	public static void getTrainingsByVenue() {
		get("rest/trainings/venue/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			return g.toJson(trainingService.getTrainingsByVenue(id));
		});
	}
	
	public static void addTraining() {
		post("rest/trainings/add", (req, res) -> {
			res.type("application/json");
			Training training = g.fromJson(req.body(), Training.class);
			trainingService.addTraining(training);
			return "SUCCESS";
		});
	}
	
	public static void editTraining() {
		put("rest/trainings/edit/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			Training training = g.fromJson(req.body(), Training.class);
			trainingService.editTraining(id, training);
			return "SUCCESS";
		});
	}
	
	public static void deleteTraining() {
		delete("rest/trainings/delete/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			trainingService.deleteTraining(id);
			return "SUCCESS";
		});
	}
}
