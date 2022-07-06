package beans;

public class Comment {
	
	private String id;
	private User customer;
	private SportsVenue sportsVenue;
	private String text;
	private int grade;
	private boolean isApproved;
	private boolean isDeleted;
	
	public Comment() {
	
	}
	
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
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

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public int getGrade() {
		return grade;
	}

	public void setGrade(int grade) {
		if (grade >= 1 && grade <= 5)
			this.grade = grade;
	}

	public boolean isApproved() {
		return isApproved;
	}

	public void setApproved(boolean isApproved) {
		this.isApproved = isApproved;
	}

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}
}
