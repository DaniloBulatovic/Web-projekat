package rest;

import static spark.Spark.port;
import static spark.Spark.staticFiles;

import java.io.File;

import controller.SportsVenueController;
import controller.UserController;

public class SparkAppMain {
	
	public static void main(String[] args) throws Exception {
		port(8080);

		staticFiles.externalLocation(new File("./static").getCanonicalPath());
		InitializeSportsVenueController();
		InitializeUserController();
	}
	
	public static void InitializeSportsVenueController() {
		SportsVenueController.getSportsVenues();
		SportsVenueController.getSportsVenue();
		SportsVenueController.addSportsVenue();
		SportsVenueController.editSportsVenue();
		SportsVenueController.deleteSportsVenue();
	}
	
	public static void InitializeUserController() {
		UserController.getUsers();
		UserController.getUser();
		UserController.addUser();
		UserController.editUser();
		UserController.deleteUser();
		UserController.loginUser();
		UserController.logoutUser();
	}
}
