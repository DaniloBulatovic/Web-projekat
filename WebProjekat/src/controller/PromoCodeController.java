package controller;

import static spark.Spark.delete;
import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.put;

import java.lang.reflect.Type;
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

import beans.PromoCode;
import services.PromoCodeService;

public class PromoCodeController {
	
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
	private static PromoCodeService promoCodeService = new PromoCodeService();
	
	public static void initializeController() {
		getPromoCodes();
		getPromoCode();
		getPromoCodeByCode();
		addPromoCode();
		editPromoCode();
		deletePromoCode();
	}
	
	public static void getPromoCodes() {
		get("rest/promoCodes/", (req, res) -> {
			res.type("application/json");
			return g.toJson(promoCodeService.getPromoCodes());
		});
	}
	
	public static void getPromoCode() {
		get("rest/promoCodes/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			return g.toJson(promoCodeService.getPromoCode(id));
		});
	}
	
	public static void getPromoCodeByCode() {
		get("rest/promoCodes/code/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			return g.toJson(promoCodeService.getPromoCodeByCode(id));
		});
	}
	
	public static void addPromoCode() {
		post("rest/promoCodes/add", (req, res) -> {
			res.type("application/json");
			PromoCode promoCode = g.fromJson(req.body(), PromoCode.class);
			promoCodeService.addPromoCode(promoCode);
			return "SUCCESS";
		});
	}
	
	public static void editPromoCode() {
		put("rest/promoCodes/edit/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			PromoCode promoCode = g.fromJson(req.body(), PromoCode.class);
			promoCodeService.editPromoCode(id, promoCode);
			return "SUCCESS";
		});
	}
	
	public static void deletePromoCode() {
		delete("rest/promoCodes/delete/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			promoCodeService.deletePromoCode(id);
			return "SUCCESS";
		});
	}
}
