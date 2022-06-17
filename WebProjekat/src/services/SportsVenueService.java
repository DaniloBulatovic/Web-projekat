package services;

import java.util.Collection;

import beans.SportsVenue;
import beans.SportsVenues;

public class SportsVenueService {
	
	private SportsVenues sportsVenues = new SportsVenues();
	
	public Collection<SportsVenue> getSportsVenues() {
		return sportsVenues.getValues();
	}
	
	public SportsVenue getSportsVenue(String id) {
		return sportsVenues.getSportsVenue(id);
	}
	
	public void addSportsVenue(SportsVenue product) {
		sportsVenues.addSportsVenue(product);
	}

	public void editSportsVenue(String id, SportsVenue venue) {
		sportsVenues.edit(id, venue);
	}

	public void deleteSportsVenue(String id) {
		sportsVenues.delete(id);
	}
}
