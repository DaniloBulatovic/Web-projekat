package beans.enums;

import com.google.gson.annotations.SerializedName;

public enum Role {
	@SerializedName("Administrator")
	Administrator,
	@SerializedName("Menadžer")
	Manager,
	@SerializedName("Trener")
	Trainer,
	@SerializedName("Kupac")
	Customer
}
