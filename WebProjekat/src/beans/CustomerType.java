package beans;

import javaxt.utils.string;

public class CustomerType {

	private string typeName;
	private double discount;
	private int requiredPoints;
	
	public CustomerType() {
	
	}

	public string getTypeName() {
		return typeName;
	}

	public void setTypeName(string typeName) {
		this.typeName = typeName;
	}

	public double getDiscount() {
		return discount;
	}

	public void setDiscount(double discount) {
		this.discount = discount;
	}

	public int getRequiredPoints() {
		return requiredPoints;
	}

	public void setRequiredPoints(int requiredPoints) {
		this.requiredPoints = requiredPoints;
	}
}
