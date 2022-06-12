package beans;

import javaxt.utils.string;

public class Comment {
	
	private User customer;
	private SportsVenue sportsVenue;
	private string text;
	private int grade;
	
	public Comment() {
	
	}

	public User getCustomer() {
		return customer;
	}

	public void setCustomer(User customer) {
		this.customer = customer;
	}

	public SportsVenue getSportsVenue() {
		return sportsVenue;
	}

	public void setSportsVenue(SportsVenue sportsVenue) {
		this.sportsVenue = sportsVenue;
	}

	public string getText() {
		return text;
	}

	public void setText(string text) {
		this.text = text;
	}

	public int getGrade() {
		return grade;
	}

	public void setGrade(int grade) {
		if (grade >= 1 && grade <= 5)
			this.grade = grade;
	}
}
