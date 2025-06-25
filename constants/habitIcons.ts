
export const habitIcons: Record<string, any> = {
  
	gym: require("@/assets/icons/gymlogo.png"),
	art: require("@/assets/icons/artlogo.png"),
	healthy: require("@/assets/icons/healthylogo.png"),
	meditate: require("@/assets/icons/meditatelogo.png"),
	read: require("@/assets/icons/reedlogo.png"),
	sleep: require("@/assets/icons/sleeplogo.png"),
	walk: require("@/assets/icons/walklogo.png"),
	water: require("@/assets/icons/waterlogo.png"),

};

export const getHabitIcon = (habitKey: string): any => {
  return habitIcons[habitKey] ?? require('@/assets/icons/gymlogo.png'); // fallback por defecto
};
