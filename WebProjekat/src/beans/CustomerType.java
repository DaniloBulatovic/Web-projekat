package beans;

public class CustomerType {

	private String typeName;
	private double discount;
	private int requiredPoints;
	
	public CustomerType() {
	
	}
	
	public CustomerType(String typeName, double discount, int requiredPoints) {
		super();
		this.typeName = typeName;
		this.discount = discount;
		this.requiredPoints = requiredPoints;
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
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
	
	public CustomerType upgradeType(String currentType) {
		if (currentType.equals("Bronzani"))
			return new CustomerType("Srebrni", 3, 4000);
		return new CustomerType("Zlatni", 5, 0);
	}
	public CustomerType downgradeType(String currentType) {
		if (currentType.equals("Zlatni"))
			return new CustomerType("Srebrni", 3, 4000);
		return new CustomerType("Bronzani", 0, 3000);
	}
}
