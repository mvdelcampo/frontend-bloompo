
const habitIcons: Record<string, any> = {
  'gymlogo.png': require('../assets/icons/gymlogo.png'),
  'meditatelogo.png': require('../assets/icons/meditatelogo.png') 
};

export const getHabitIcon = (filename: string): any => {
  return habitIcons[filename] ?? require('../assets/icons/gymlogo.png'); // fallback por defecto
};
