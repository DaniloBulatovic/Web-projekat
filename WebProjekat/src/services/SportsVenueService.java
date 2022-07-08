package services;

import java.util.Collection;

import beans.Comment;
import beans.Comments;
import beans.SportsVenue;
import beans.SportsVenues;

public class SportsVenueService {
	
	private SportsVenues sportsVenues = new SportsVenues();
	
	public Collection<SportsVenue> getSportsVenues() {
		Collection<SportsVenue> allVenues = sportsVenues.getValues();
		Comments comments = new Comments();
		for(SportsVenue venue : allVenues) {
			double totalGrades = 0;
			double numberOfComments = 0;
			for (Comment comment : comments.getValues()) {
				if (comment.getSportsVenue().getId().equals(venue.getId()) && comment.isApproved()) {
					totalGrades += comment.getGrade();
					numberOfComments++;
				}
			}
			if (numberOfComments == 0)
				venue.setAverageGrade(numberOfComments);
			else
				venue.setAverageGrade(totalGrades / numberOfComments);
			
			try {
				sportsVenues.writeSportVenues();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return allVenues;
	}
	
	public SportsVenue getSportsVenue(String id) {
		SportsVenue venue = sportsVenues.getSportsVenue(id);
		Comments comments = new Comments();
		double totalGrades = 0;
		double numberOfComments = 0;
		for (Comment comment : comments.getValues()) {
			if (comment.getSportsVenue().getId().equals(venue.getId()) && comment.isApproved()) {
				totalGrades += comment.getGrade();
				numberOfComments++;
			}
		}
		if (numberOfComments == 0)
			venue.setAverageGrade(numberOfComments);
		else
			venue.setAverageGrade(totalGrades / numberOfComments);
		
		try {
			sportsVenues.writeSportVenues();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return venue;
	}
	
	public SportsVenue addSportsVenue(SportsVenue venue) {
		return sportsVenues.addSportsVenue(venue);
	}

	public void editSportsVenue(String id, SportsVenue venue) {
		sportsVenues.edit(id, venue);
	}

	public void deleteSportsVenue(String id) {
		sportsVenues.delete(id);
	}
}
