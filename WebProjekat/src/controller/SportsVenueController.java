package controller;

import static spark.Spark.delete;
import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.put;

import com.google.gson.Gson;

import beans.SportsVenue;
import services.SportsVenueService;

public class SportsVenueController {
	
	private static Gson g = new Gson();
	private static SportsVenueService sportsVenueService = new SportsVenueService();
	
	public static void getSportsVenues() {
		get("rest/venues/", (req, res) -> {
			res.type("application/json");
			return g.toJson(sportsVenueService.getSportsVenues());
		});
	}
	
	public static void getSportsVenue() {
		get("rest/venues/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			return g.toJson(sportsVenueService.getSportsVenue(id));
		});
	}
	
	public static void addSportsVenue() {
		post("rest/venues/add", (req, res) -> {
			res.type("application/json");
			SportsVenue sv = g.fromJson(req.body(), SportsVenue.class);
			sportsVenueService.addSportsVenue(sv);
			return "SUCCESS";
		});
	}
	
	public static void editSportsVenue() {
		put("rest/venues/edit/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			SportsVenue sv = g.fromJson(req.body(), SportsVenue.class);
			sportsVenueService.editSportsVenue(id, sv);
			return "SUCCESS";
		});
	}
	
	public static void deleteSportsVenue() {
		delete("rest/venues/delete/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params("id");
			sportsVenueService.deleteSportsVenue(id);
			return "SUCCESS";
		});
	}
}
