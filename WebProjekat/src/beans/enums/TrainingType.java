package beans.enums;

import com.google.gson.annotations.SerializedName;

public enum TrainingType {
	@SerializedName("Grupni")
	Group,
	@SerializedName("Personalni")
	Personal,
	@SerializedName("Teretana")
	Gym
}
